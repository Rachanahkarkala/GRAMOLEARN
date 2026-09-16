// ==========================================
// SCRATCH ROUND
// ==========================================

let scratchScore = 0;

let questions = [];

let current = 0;

let scratching = false;

// ==========================================
// ELEMENTS
// ==========================================

const cards =
    document.querySelectorAll(".mystery-card");

const questionSection =
    document.getElementById("questionSection");

const scratchSection =
    document.getElementById("scratchSection");

const questionText =
    document.getElementById("questionText");

const answerInput =
    document.getElementById("answerInput");

const submitBtn =
    document.getElementById("submitAnswer");

const animalImage =
    document.getElementById("animalImage");

const nextBtn =
    document.getElementById("nextQuestion");


// ==========================================
// LOAD QUESTIONS
// ==========================================

fetch("/static/data/quiz/scratch.json")

    .then(response => {

        if (!response.ok) {
            throw new Error("Scratch questions not found");
        }

        return response.json();

    })

    .then(data => {

        questions = data;

        loadQuestion();

    })

    .catch(error => {

        console.error(error);

    });


// ==========================================
// LOAD QUESTION
// ==========================================

function loadQuestion() {

    if (current >= questions.length) {

        finishScratch();

        return;

    }

    document.getElementById("cardSelection")
        .style.display = "none";

    questionSection.style.display =
        "block";

    scratchSection.style.display =
        "none";


    questionText.innerHTML =
        questions[current].question;

    answerInput.value = "";

}


// ==========================================
// SUBMIT ANSWER
// ==========================================

submitBtn.onclick = function () {

    const ans =
        answerInput.value
            .trim()
            .toLowerCase();


    const correct =
        questions[current].answer
            .trim()
            .toLowerCase();


    if (ans === correct) {

        scratchScore++;

        localStorage.setItem(
            "scratchScore",
            scratchScore
        );

    }


    questionSection.style.display =
        "none";

    scratchSection.style.display =
        "block";


    animalImage.src =
        "/static/images/scratch/" +
        questions[current].image;


    initialiseScratch();

};


// ==========================================
// SCRATCH CANVAS
// ==========================================

function initialiseScratch() {

    const canvas =
        document.getElementById("scratchCanvas");

    const ctx =
        canvas.getContext("2d");


    ctx.globalCompositeOperation =
        "source-over";


    ctx.fillStyle =
        "#BDBDBD";


    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    scratching = false;


    canvas.onmousedown = () => {

        scratching = true;

    };


    canvas.onmouseup = () => {

        scratching = false;

    };


    canvas.onmouseleave = () => {

        scratching = false;

    };


    canvas.onmousemove = (event) => {

        if (!scratching) {
            return;
        }


        const rect =
            canvas.getBoundingClientRect();


        const x =
            event.clientX -
            rect.left;


        const y =
            event.clientY -
            rect.top;


        ctx.globalCompositeOperation =
            "destination-out";


        ctx.beginPath();


        ctx.arc(
            x,
            y,
            30,
            0,
            Math.PI * 2
        );


        ctx.fill();

    };

}


// ==========================================
// NEXT
// ==========================================

nextBtn.onclick = function () {

    current++;


    if (current >= questions.length) {

        finishScratch();

        return;

    }


    loadQuestion();

};


// ==========================================
// SCRATCH COMPLETE
// ==========================================

function finishScratch() {

    localStorage.setItem(
        "scratchScore",
        scratchScore
    );


    window.location.href =
        "/quiz/maze";

}