let currentQuestion = 0;

let answers = new Array(totalQuestions).fill(null);

let score = 0;

let timer = totalTime;


// =========================
// TIMER
// =========================

const timerText = document.getElementById("timer");

const interval = setInterval(() => {

    if(timer <= 0){

        submitQuiz();

        return;

    }

    timer--;

    let min = Math.floor(timer/60);

    let sec = timer%60;

    timerText.innerHTML =
        `${min}:${sec.toString().padStart(2,"0")}`;

},1000);


// =========================
// LOAD FIRST QUESTION
// =========================

renderQuestion();


// =========================
// RENDER QUESTION
// =========================

function renderQuestion(){

    const q = questions[currentQuestion];

    document.getElementById("questionNumber").innerHTML =
        `Question ${currentQuestion+1} / ${totalQuestions}`;

    document.getElementById("questionText").innerHTML =
        q.question;


    // Progress Bar

    document.getElementById("progressBar").style.width =
        ((currentQuestion+1)/totalQuestions)*100 + "%";


    // ROUND TITLE

    if(q.round==1){

        document.getElementById("roundTitle").innerHTML="Round 1";

        document.getElementById("roundType").innerHTML="MCQs";

    }

    else if(q.round==2){

        document.getElementById("roundTitle").innerHTML="Round 2";

        document.getElementById("roundType").innerHTML="True / False";

    }

    else{

        document.getElementById("roundTitle").innerHTML="Round 3";

        document.getElementById("roundType").innerHTML="Fill in the Blank";

    }


    // Hide everything

    document.getElementById("mcqContainer").style.display="none";

    document.getElementById("tfContainer").style.display="none";

    document.getElementById("fillContainer").style.display="none";



    // ======================
    // MCQ
    // ======================

    if(q.type=="mcq"){

        const box=document.getElementById("mcqContainer");

        box.innerHTML="";

        box.style.display="grid";

        q.options.forEach(option=>{

            const btn=document.createElement("button");

            btn.className="option";

            btn.innerHTML=option;

            if(answers[currentQuestion]==option){

                btn.style.background="#2d8a3b";

                btn.style.color="white";

            }

            btn.onclick=function(){

                answers[currentQuestion]=option;

                renderQuestion();

            }

            box.appendChild(btn);

        });

    }


    // ======================
    // TRUE FALSE
    // ======================

    if(q.type=="tf"){

        document.getElementById("tfContainer").style.display="flex";

        document.querySelectorAll(".tf-btn").forEach(btn=>{

            btn.style.background="#eef5ef";

            btn.style.color="black";

            if(answers[currentQuestion]==btn.dataset.value){

                btn.style.background="#2d8a3b";

                btn.style.color="white";

            }

            btn.onclick=function(){

                answers[currentQuestion]=btn.dataset.value;

                renderQuestion();

            }

        });

    }



    // ======================
    // FILL
    // ======================

    if(q.type=="fill"){

        document.getElementById("fillContainer").style.display="block";

        const input=document.getElementById("fillAnswer");

        input.value=answers[currentQuestion] || "";

        input.oninput=function(){

            answers[currentQuestion]=this.value;

        }

    }

}


// =========================
// NEXT
// =========================

document.getElementById("nextBtn").onclick=function(){

    if(currentQuestion<totalQuestions-1){

        currentQuestion++;

        renderQuestion();

    }

    else {

    // Save the first 15 answers temporarily
    localStorage.setItem(
        "quizAnswers",
        JSON.stringify(answers)
    );

    window.location = "/quiz/scratch";
}

}



// =========================
// PREVIOUS
// =========================

document.getElementById("prevBtn").onclick=function(){

    if(currentQuestion>0){

        currentQuestion--;

        renderQuestion();

    }

}



// =========================
// SUBMIT
// =========================

function submitQuiz(){

    clearInterval(interval);

    fetch("/quiz/submit",{

        method:"POST",

        headers:{

            "Content-Type":"application/json"

        },

        body:JSON.stringify({

            answers:answers

        })

    })

    .then(res=>res.json())

    .then(data=>{

        window.location="/quiz/result";

    });

}