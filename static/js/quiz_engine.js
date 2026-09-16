let currentQuestion = 0;
let answers = new Array(questions.length).fill("");

const questionNumber = document.getElementById("questionNumber");
const questionText = document.getElementById("questionText");

const mcqContainer = document.getElementById("mcqContainer");
const tfContainer = document.getElementById("tfContainer");
const fillContainer = document.getElementById("fillContainer");

const fillAnswer = document.getElementById("fillAnswer");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const scoreDisplay = document.getElementById("score");
const progressBar = document.getElementById("progressBar");

const roundTitle = document.getElementById("roundTitle");
const roundType = document.getElementById("roundType");


// ======================================================
// SHOW QUESTION
// ======================================================

function renderQuestion() {

    const question = questions[currentQuestion];

    if (!question) return;

    questionNumber.textContent =
        `Question ${currentQuestion + 1} of ${questions.length}`;

    questionText.textContent = question.question;


    // Hide everything first
    mcqContainer.style.display = "none";
    tfContainer.style.display = "none";
    fillContainer.style.display = "none";


    // ==================================================
    // ROUND 1 — MCQ
    // ==================================================

    if (currentQuestion < 5) {

        roundTitle.textContent = "Round 1";
        roundType.textContent = "MCQs";

        mcqContainer.style.display = "grid";

        renderMCQ(question);

    }


    // ==================================================
    // ROUND 2 — TRUE / FALSE
    // ==================================================

    else if (currentQuestion < 10) {

        roundTitle.textContent = "Round 2";
        roundType.textContent = "True / False";

        tfContainer.style.display = "flex";

        renderTF();

    }


    // ==================================================
    // ROUND 3 — FILL IN THE BLANK
    // ==================================================

    else {

        roundTitle.textContent = "Round 3";
        roundType.textContent = "Fill in the Blanks";

        fillContainer.style.display = "flex";

        fillAnswer.value =
            answers[currentQuestion] || "";

        setTimeout(() => {
            fillAnswer.focus();
        }, 50);

    }


    // Progress
    const percentage =
        ((currentQuestion + 1) / questions.length) * 100;

    progressBar.style.width =
        `${percentage}%`;


    // Previous
    prevBtn.style.visibility =
        currentQuestion === 0 ? "hidden" : "visible";


    // Next
    nextBtn.textContent =
        currentQuestion === questions.length - 1
            ? "Continue →"
            : "Next →";


    updateScore();

}


// ======================================================
// MCQ
// ======================================================

function renderMCQ(question) {

    mcqContainer.innerHTML = "";

    const options = question.options || [];

    options.forEach(option => {

        const button =
            document.createElement("button");

        button.type = "button";

        button.className = "mcq-option";

        button.textContent = option;


        if (
            answers[currentQuestion] &&
            answers[currentQuestion].toLowerCase() ===
            option.toLowerCase()
        ) {

            button.classList.add("selected");

        }


        button.addEventListener("click", () => {

            document
                .querySelectorAll(".mcq-option")
                .forEach(btn =>
                    btn.classList.remove("selected")
                );

            button.classList.add("selected");

            answers[currentQuestion] =
                option;

            updateScore();

        });


        mcqContainer.appendChild(button);

    });

}


// ======================================================
// TRUE / FALSE
// ======================================================

function renderTF() {

    const buttons =
        tfContainer.querySelectorAll(".tf-btn");

    buttons.forEach(button => {

        button.classList.remove("selected");


        if (
            answers[currentQuestion] &&
            answers[currentQuestion].toLowerCase() ===
            button.dataset.value.toLowerCase()
        ) {

            button.classList.add("selected");

        }


        button.onclick = () => {

            buttons.forEach(btn =>
                btn.classList.remove("selected")
            );

            button.classList.add("selected");

            answers[currentQuestion] =
                button.dataset.value;

            updateScore();

        };

    });

}


// ======================================================
// FILL ANSWER
// ======================================================

fillAnswer.addEventListener("input", () => {

    answers[currentQuestion] =
        fillAnswer.value.trim();

    updateScore();

});


// ======================================================
// SAVE ANSWER
// ======================================================

function saveAnswer() {

    if (currentQuestion >= 10) {

        answers[currentQuestion] =
            fillAnswer.value.trim();

    }

}


// ======================================================
// CALCULATE SCORE
// ======================================================

function calculateScore() {

    let total = 0;

    questions.forEach((question, index) => {

        const userAnswer =
            String(answers[index] || "")
                .trim()
                .toLowerCase();

        const correctAnswer =
            String(question.answer || "")
                .trim()
                .toLowerCase();

        if (
            userAnswer &&
            userAnswer === correctAnswer
        ) {

            total += 10;

        }

    });

    return total;

}


// ======================================================
// UPDATE SCORE
// ======================================================

function updateScore() {

    scoreDisplay.textContent =
        calculateScore();

}


// ======================================================
// NEXT
// ======================================================

nextBtn.addEventListener("click", () => {

    saveAnswer();


    // ==================================================
    // LAST QUESTION OF MAIN QUIZ
    // ==================================================

    if (
        currentQuestion ===
        questions.length - 1
    ) {

        console.log(
            "ROUND 3 COMPLETE → GOING TO ROUND 4"
        );


        // Save answers
        localStorage.setItem(
            "quizAnswers",
            JSON.stringify(answers)
        );


        /*
         * VERY IMPORTANT:
         *
         * DO NOT CALL /quiz/submit HERE.
         *
         * The quiz is NOT finished.
         *
         * Scratch comes next.
         */

        window.location.href =
            "/quiz/scratch";

        return;

    }


    // ==================================================
    // NORMAL NEXT QUESTION
    // ==================================================

    currentQuestion++;

    renderQuestion();

});


// ======================================================
// PREVIOUS
// ======================================================

prevBtn.addEventListener("click", () => {

    saveAnswer();

    if (currentQuestion > 0) {

        currentQuestion--;

        renderQuestion();

    }

});


// ======================================================
// INITIALIZE
// ======================================================

renderQuestion();