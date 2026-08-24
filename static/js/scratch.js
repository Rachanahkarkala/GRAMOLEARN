let scratchScore = 0;
let questions = [];

let current = 0;

let scratching = false;

const cards = document.querySelectorAll(".mystery-card");

const questionSection = document.getElementById("questionSection");

const scratchSection = document.getElementById("scratchSection");

const questionText = document.getElementById("questionText");

const answerInput = document.getElementById("answerInput");

const submitBtn = document.getElementById("submitAnswer");

const animalImage = document.getElementById("animalImage");

const nextBtn = document.getElementById("nextQuestion");

fetch("/static/data/quiz/scratch.json")
.then(r=>r.json())
.then(data=>{

    questions=data;

});

cards.forEach(card=>{

    card.onclick=()=>{

        document.getElementById("cardSelection").style.display="none";

        questionSection.style.display="block";

        loadQuestion();

    }

});

function loadQuestion(){

    questionText.innerHTML=questions[current].question;

    answerInput.value="";

}

submitBtn.onclick=function(){

    let ans=answerInput.value.trim().toLowerCase();

    if(ans === questions[current].answer.toLowerCase()){

    scratchScore++;

    questionSection.style.display="none";

    scratchSection.style.display="block";

    animalImage.src =
        "/static/images/scratch/" +
        questions[current].image;

    initialiseScratch();

}


}

function initialiseScratch(){

    const canvas=document.getElementById("scratchCanvas");

    const ctx=canvas.getContext("2d");

    ctx.globalCompositeOperation="source-over";

    ctx.fillStyle="#BDBDBD";

    ctx.fillRect(0,0,canvas.width,canvas.height);

    scratching=false;

    canvas.onmousedown=()=>{

        scratching=true;

    }

    canvas.onmouseup=()=>{

        scratching=false;

    }

    canvas.onmouseleave=()=>{

        scratching=false;

    }

    canvas.onmousemove=(e)=>{

        if(!scratching) return;

        const rect=canvas.getBoundingClientRect();

        const x=e.clientX-rect.left;

        const y=e.clientY-rect.top;

        ctx.globalCompositeOperation="destination-out";

        ctx.beginPath();

        ctx.arc(x,y,30,0,Math.PI*2);

        ctx.fill();

    }

}

nextBtn.onclick=function(){

    current++;

    scratchSection.style.display="none";

    questionSection.style.display="block";

    if(current >= questions.length){

    localStorage.setItem(
        "scratchScore",
        scratchScore
    );

    window.location = "/quiz/maze";

    return;
}

    loadQuestion();

}