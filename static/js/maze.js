// ================================
// ANIMAL MAZE - ROUND 5
// ================================
let mazeScore = 0;
const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");

const mazeNumber = document.getElementById("mazeNumber");
const mazeQuestion = document.getElementById("mazeQuestion");
const mazeMessage = document.getElementById("mazeMessage");
const nextBtn = document.getElementById("nextMaze");


// ================================
// 5 MAZE QUESTIONS
// ================================

const mazes = [

    {
        question: "🐘 Help the elephant reach the watering hole!",
        animal: "🐘"
    },

    {
        question: "🐇 Help the rabbit reach its burrow!",
        animal: "🐇"
    },

    {
        question: "🐧 Help the penguin reach the ice!",
        animal: "🐧"
    },

    {
        question: "🐢 Help the turtle reach the ocean!",
        animal: "🐢"
    },

    {
        question: "🦁 Help the lion reach its den!",
        animal: "🦁"
    }

];


// ================================
// MAZE SETTINGS
// ================================

const SIZE = 10;

const CELL = canvas.width / SIZE;

let currentMaze = 0;

let player = {
    row: 0,
    col: 0
};

let finish = {
    row: SIZE - 1,
    col: SIZE - 1
};


// ================================
// SIMPLE MAZE LAYOUTS
// ================================

const layouts = [

    // Layout 1 – concentric spiral
    [
        "..........",
        "XXXXXXXXX.",
        "X.......X.",
        "X.XXXXX.X.",
        "X.X...X.X.",
        "X.X.X.X.X.",
        "X.X.X.X.X.",
        "X.X...X.X.",
        "X.XXXXX.X.",
        "X.......X."
    ],

    // Layout 2 – winding corridor with dead ends
    [
        "..........",
        "X.XXXXXXXX",
        "X.X......X",
        "X.X.XXXX.X",
        "X.X.X....X",
        "X.X.X.XX.X",
        "X.X.X....X",
        "X.X.XXXX.X",
        "X.X......X",
        "X.XXXXXXXX"
    ],

    // Layout 3 – diamond wall pattern
    [
        "..........",
        ".XXXXXXXX.",
        "..XXXXXX..",
        "...XXXX...",
        "....XX....",
        "....XX....",
        "...XXXX...",
        "..XXXXXX..",
        ".XXXXXXXX.",
        ".........."
    ],

    // Layout 4 – asymmetric striped maze
    [
        "..........",
        "X.XXXXXXXX",
        "X.X......X",
        "X.XXXXXX.X",
        "X......X.X",
        "X.XXXXXX.X",
        "X.X......X",
        "X.X.XXXXXX",
        "X.X......X",
        "X.XXXXXXXX"
    ],

    // Layout 5 – dense random maze
    [
        "XX.XX.XXX.",
        "X.X.X...X.",
        "X.X.XXX.X.",
        "X.X...X.X.",
        "X.XXXXX.X.",
        "X.......X.",
        "X.XXXXX.X.",
        "X.X...X.X.",
        "X.X.X.X.X.",
        "X...X...X."
    ]

];


// ================================
// START
// ================================

loadMaze();


// ================================
// LOAD MAZE
// ================================

function loadMaze() {

    player.row = 0;
    player.col = 0;

    mazeNumber.innerText = currentMaze + 1;

    mazeQuestion.innerText = mazes[currentMaze].question;

    mazeMessage.innerText = "";

    nextBtn.style.display = "none";

    drawMaze();

}


// ================================
// DRAW MAZE
// ================================

function drawMaze() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    const layout = layouts[currentMaze];


    // Background

    ctx.fillStyle = "#f7fff8";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // Draw cells

    for(let row = 0; row < SIZE; row++) {

        for(let col = 0; col < SIZE; col++) {

            const x = col * CELL;
            const y = row * CELL;

            if(layout[row][col] === "X") {

                ctx.fillStyle = "#164c2c";

                ctx.fillRect(
                    x,
                    y,
                    CELL,
                    CELL
                );

            }

            else {

                ctx.strokeStyle = "#d5e8d8";

                ctx.strokeRect(
                    x,
                    y,
                    CELL,
                    CELL
                );

            }

        }

    }


    // FINISH

    ctx.fillStyle = "#72df49";

    ctx.beginPath();

    ctx.arc(
        finish.col * CELL + CELL / 2,
        finish.row * CELL + CELL / 2,
        CELL * 0.3,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.font = `${CELL * 0.5}px Arial`;

    ctx.textAlign = "center";

    ctx.textBaseline = "middle";

    ctx.fillText(
        "🏠",
        finish.col * CELL + CELL / 2,
        finish.row * CELL + CELL / 2
    );


    // PLAYER

    ctx.font = `${CELL * 0.55}px Arial`;

    ctx.fillText(
        mazes[currentMaze].animal,
        player.col * CELL + CELL / 2,
        player.row * CELL + CELL / 2
    );

}


// ================================
// MOVEMENT
// ================================

document.addEventListener("keydown", function(event) {

    let newRow = player.row;
    let newCol = player.col;

    if(
        event.key === "ArrowUp" ||
        event.key.toLowerCase() === "w"
    ) {

        newRow--;

    }

    else if(
        event.key === "ArrowDown" ||
        event.key.toLowerCase() === "s"
    ) {

        newRow++;

    }

    else if(
        event.key === "ArrowLeft" ||
        event.key.toLowerCase() === "a"
    ) {

        newCol--;

    }

    else if(
        event.key === "ArrowRight" ||
        event.key.toLowerCase() === "d"
    ) {

        newCol++;

    }

    else {

        return;

    }


    event.preventDefault();


    // Outside maze

    if(
        newRow < 0 ||
        newRow >= SIZE ||
        newCol < 0 ||
        newCol >= SIZE
    ) {

        return;

    }


    // Wall

    if(
        layouts[currentMaze][newRow][newCol] === "X"
    ) {

        mazeMessage.innerText = "🧱 Oops! That's a wall!";

        return;

    }


    // Move

    player.row = newRow;

    player.col = newCol;

    mazeMessage.innerText = "";

    drawMaze();


    // Check finish

    if(
        player.row === finish.row &&
        player.col === finish.col
    ) {

        mazeCompleted();

    }

});


// ================================
// MAZE COMPLETED
// ================================

function mazeCompleted() {
    mazeScore++;
    mazeMessage.innerText =
        "🎉 Amazing! You found the way home!";

    nextBtn.style.display = "inline-block";

}


// ================================
// NEXT MAZE
// ================================

nextBtn.onclick = function() {

    currentMaze++;

    if(currentMaze >= mazes.length) {

    mazeMessage.innerText =
        "🏆 Maze Round Completed!";

    nextBtn.innerText =
        "View Final Results →";

    nextBtn.onclick = function() {

        const quizAnswers =
            JSON.parse(
                localStorage.getItem("quizAnswers") || "[]"
            );

        const scratchScore =
            parseInt(
                localStorage.getItem("scratchScore") || "0"
            );

        fetch("/quiz/submit", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                answers: quizAnswers,

                scratch_score: scratchScore,

                maze_score: mazeScore

            })

        })
        .then(response => response.json())
        .then(data => {

            // Clean up
            localStorage.removeItem("quizAnswers");
            localStorage.removeItem("scratchScore");

            // Finally go to result
            window.location.href = "/quiz/result";

        });

    };

    return;
}

    loadMaze();

};