from flask import Flask, render_template, redirect
from flask import session
import json
import os
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
import wikipediaapi
from flask import request, jsonify
from werkzeug.utils import secure_filename

app = Flask(__name__)
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

app.config["SQLALCHEMY_DATABASE_URI"] = \
    "sqlite:///" + os.path.join(BASE_DIR, "database", "database.db")

db = SQLAlchemy(app)
class User(UserMixin, db.Model):

    id = db.Column(db.Integer, primary_key=True)

    username = db.Column(db.String(100), unique=True, nullable=False)

    email = db.Column(db.String(120), unique=True, nullable=False)

    password = db.Column(db.String(200), nullable=False)

    score = db.Column(db.Integer, default=0)

    profile_pic = db.Column(
        db.String(200),
        default="default.png"
    )
login_manager = LoginManager(app)

login_manager.login_view = "login"
# -------------------------------
# Configuration
# -------------------------------
@login_manager.user_loader
def load_user(user_id):

    return User.query.get(int(user_id))
@app.route("/register",methods=["GET","POST"])
def register():

    if request.method=="POST":

        username=request.form["username"]

        email=request.form["email"]

        password=generate_password_hash(request.form["password"])

        user=User(

            username=username,

            email=email,

            password=password

        )

        db.session.add(user)

        db.session.commit()

        return redirect("/login")

    return render_template("auth/register.html")
UPLOAD_FOLDER = "static/uploads"

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
@app.route("/upload_profile", methods=["POST"])
@login_required
def upload_profile():

    if "profile_pic" not in request.files:
        return redirect("/profile")

    file = request.files["profile_pic"]

    if file.filename == "":
        return redirect("/profile")

    filename = secure_filename(file.filename)

    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

    file.save(os.path.join(app.config["UPLOAD_FOLDER"], filename))

    current_user.profile_pic = filename

    db.session.commit()

    return redirect("/profile")
@app.route("/research")
@login_required
def research():

    return render_template("research/research.html")
@app.route("/research/search", methods=["POST"])
@login_required
def search_animal():
    data = request.get_json()
    animal = data.get("animal")
    
    try:
        wiki_wiki = wikipediaapi.Wikipedia(
            language='en',
            user_agent='GramoLearn/1.0 (educational app)'
        )
        
        # Try exact match first
        page = wiki_wiki.page(animal)
        
        # If not found, try with proper capitalization
        if not page.exists():
            page = wiki_wiki.page(animal.title())
        
        # If still not found, try with animal suffix
        if not page.exists():
            page = wiki_wiki.page(animal + " (animal)")
        
        # If still not found, search for related pages
        if not page.exists():
            # Search using the API
            search_results = wiki_wiki.search(animal, results=5)
            for result in search_results:
                test_page = wiki_wiki.page(result)
                if test_page.exists() and animal.lower() in test_page.title.lower():
                    page = test_page
                    break
        
        if page and page.exists():
            # Get summary (first 6 sentences)
            summary = page.summary.split('. ')[:6]
            summary = '. '.join(summary) + '.'
            
            return jsonify({
                "success": True,
                "title": page.title,
                "summary": summary,
                "url": page.fullurl
            })
        else:
            return jsonify({
                "success": False,
                "message": f"Could not find information about '{animal}'"
            })
            
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({
            "success": False,
            "message": "An error occurred while searching."
        })
@app.route("/login",methods=["GET","POST"])
def login():

    if request.method=="POST":

        email=request.form["email"]

        password=request.form["password"]

        user=User.query.filter_by(email=email).first()

        if user and check_password_hash(user.password,password):

            login_user(user)

            return redirect("/")

    return render_template("auth/login.html")
@app.route("/logout")
@login_required
def logout():

    logout_user()

    return redirect("/login")
app.config["SECRET_KEY"] = "gramolearn_secret_key"
# -------------------------------
# Load Quiz Questions
# -------------------------------

def load_questions():

    with open("data/quiz/quiz.json", "r", encoding="utf-8") as f:

        return json.load(f)

# -------------------------------
# Routes
# -------------------------------

@app.route("/")
def landing():

    if not current_user.is_authenticated:

        return redirect("/login")

    return render_template("landing.html")

@app.route("/colouring")
def colouring():
    return render_template("colouring.html")
@app.route("/colouring/<category>")
def colouring_category(category):

    if category=="animals":
        return render_template("animal_selection.html")

    return "Coming Soon"
@app.route("/paint/<animal>")
def paint(animal):
    return render_template(
        "painting.html",
        animal=animal
    )
@app.route("/didyouknow")
def didyouknow():
    return render_template("didyouknow.html")



@app.route("/quiz")
def quiz():

    return render_template("quiz/quiz_home.html")
@app.route("/quiz/<difficulty>")
def quiz_difficulty(difficulty):

    session.clear()

    session["difficulty"] = difficulty

    if difficulty == "easy":
        session["time"] = 1800

    elif difficulty == "medium":
        session["time"] = 1200

    else:
        session["time"] = 900

    return render_template(
        "quiz/quiz_confirm.html",
        difficulty=difficulty
    )
@app.route("/quiz/start")
def start_quiz():

    questions = load_questions()

    session["score"] = 0

    session["answers"] = []

    return render_template(

        "quiz/quiz_engine.html",

        questions=questions,

        timer=session["time"]

    )
@app.route("/quiz/submit", methods=["POST"])
@login_required
def submit_quiz():

    data = request.get_json()

    user_answers = data.get("answers", [])

    scratch_score = int(data.get("scratch_score", 0))

    maze_score = int(data.get("maze_score", 0))

    questions = load_questions()

    score = 0
    correct = 0
    wrong = 0


    # =========================
    # NORMAL QUIZ
    # =========================

    for i in range(len(questions)):

        user_answer = ""

        if i < len(user_answers):
            user_answer = user_answers[i]

        correct_answer = questions[i]["answer"]

        if str(user_answer).strip().lower() == \
           str(correct_answer).strip().lower():

            score += 10

            correct += 1

        else:

            wrong += 1


    # =========================
    # SCRATCH ROUND
    # =========================

    score += scratch_score * 10

    correct += scratch_score

    wrong += (5 - scratch_score)


    # =========================
    # MAZE ROUND
    # =========================

    score += maze_score * 10

    correct += maze_score

    wrong += (5 - maze_score)


    # =========================
    # TOTAL
    # =========================

    total_questions = len(questions) + 10

    percentage = round(
        (correct / total_questions) * 100
    )


    # =========================
    # SAVE RESULT
    # =========================

    session["result"] = {

        "score": score,

        "correct": correct,

        "wrong": wrong,

        "percentage": percentage,

        "difficulty": session.get(
            "difficulty",
            "easy"
        )

    }


    # =========================
    # UPDATE LEADERBOARD
    # =========================

    if score > current_user.score:

        current_user.score = score

        db.session.commit()


    return jsonify({

        "score": score,

        "correct": correct,

        "wrong": wrong,

        "percentage": percentage

    })
@app.route("/quiz/result")
def quiz_result():

    return render_template(

        "quiz/quiz_result.html",

        result=session.get("result")

    )
@app.route("/leaderboard")
@login_required
def leaderboard():

    users=User.query.order_by(User.score.desc()).all()
    print(users)
    return render_template(

        "leaderboard/leaderboard.html",

        users=users

    )
@app.route("/profile")
@login_required
def profile():

    return render_template(

        "profile/profile.html",

        user=current_user

    )

@app.route("/quiz/scratch")
def scratch():

    return render_template("quiz/scratch.html")

@app.route("/quiz/maze")
def maze():

    return render_template("quiz/maze.html")

@app.route("/update_username",methods=["POST"])
@login_required
def update_username():

    current_user.username=request.form["username"]

    db.session.commit()

    return redirect("/profile")
# -------------------------------
# Run Application
# -------------------------------
with app.app_context():

    db.create_all()
if __name__ == "__main__":
    app.run(debug=True)