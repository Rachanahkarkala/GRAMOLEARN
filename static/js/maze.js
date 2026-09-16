// ================================
// ANIMAL MAZE - ROUND 5
// ================================

let mazeScore =
    parseInt(
        localStorage.getItem("mazeScore") || "0"
    );


const canvas =
    document.getElementById("mazeCanvas");

const ctx =
    canvas.getContext("2d");


const mazeNumber =
    document.getElementById("mazeNumber");

const mazeQuestion =
    document.getElementById("mazeQuestion");

const mazeMessage =
    document.getElementById("mazeMessage");

const nextBtn =
    document.getElementById("nextMaze");


// ================================
// 5 MAZES
// ================================

const mazes = [

    {
        question:
            "🐘 Help the elephant reach the watering hole!",
        animal: "🐘"
    },

    {
        question:
            "🐇 Help the rabbit reach its burrow!",
        animal: "🐇"
    },

    {
        question:
            "🐧 Help the penguin reach the ice!",
        animal: "🐧"
    },

    {
        question:
            "🐢 Help the turtle reach the ocean!",
        animal: "🐢"
    },

    {
        question:
            "🦁 Help the lion reach its den!",
        animal: "🦁"
    }

];


// ================================
// SETTINGS
// ================================

const SIZE = 10;

const CELL =
    canvas.width / SIZE;


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
// MAZE LAYOUTS
// ================================

const layouts = [

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
        "X........."
    ],

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
        "X........."
    ],

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
        "X........."
    ],

    [
        "..........",
        "XXXXXXX..X",
        "X.......XX",
        "X.XXXXX..X",
        "X.X...X..X",
        "X.X.X....X",
        "X.X.XXXXX.",
        "X.X.......",
        "X.XXXXXXX.",
        "X........."
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


    mazeNumber.innerText =
        currentMaze + 1;


    mazeQuestion.innerText =
        mazes[currentMaze].question;


    mazeMessage.innerText = "";


    nextBtn.style.display =
        "none";


    drawMaze();

}


// ================================
// DRAW
// ================================

function drawMaze() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    const layout =
        layouts[currentMaze];


    ctx.fillStyle =
        "#f7fff8";


    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    for (
        let row = 0;
        row < SIZE;
        row++
    ) {

        for (
            let col = 0;
            col < SIZE;
            col++
        ) {

            const x =
                col * CELL;

            const y =
                row * CELL;


            if (
                layout[row][col] === "X"
            ) {

                ctx.fillStyle =
                    "#164c2c";


                ctx.fillRect(
                    x,
                    y,
                    CELL,
                    CELL
                );

            }

            else {

                ctx.strokeStyle =
                    "#d5e8d8";


                ctx.strokeRect(
                    x,
                    y,
                    CELL,
                    CELL
                );

            }

        }

    }


    // HOME

    ctx.fillStyle =
        "#72df49";


    ctx.beginPath();


    ctx.arc(
        finish.col * CELL + CELL / 2,
        finish.row * CELL + CELL / 2,
        CELL * 0.3,
        0,
        Math.PI * 2
    );


    ctx.fill();


    ctx.font =
        `${CELL * 0.5}px Arial`;


    ctx.textAlign =
        "center";


    ctx.textBaseline =
        "middle";


    ctx.fillText(
        "🏠",
        finish.col * CELL + CELL / 2,
        finish.row * CELL + CELL / 2
    );


    // PLAYER

    ctx.font =
        `${CELL * 0.55}px Arial`;


    ctx.fillText(
        mazes[currentMaze].animal,
        player.col * CELL + CELL / 2,
        player.row * CELL + CELL / 2
    );

}


// ================================
// MOVEMENT
// ================================

document.addEventListener(
    "keydown",
    function(event) {

        let newRow =
            player.row;

        let newCol =
            player.col;


        if (
            event.key === "ArrowUp" ||
            event.key.toLowerCase() === "w"
        ) {

            newRow--;

        }

        else if (
            event.key === "ArrowDown" ||
            event.key.toLowerCase() === "s"
        ) {

            newRow++;

        }

        else if (
            event.key === "ArrowLeft" ||
            event.key.toLowerCase() === "a"
        ) {

            newCol--;

        }

        else if (
            event.key === "ArrowRight" ||
            event.key.toLowerCase() === "d"
        ) {

            newCol++;

        }

        else {

            return;

        }


        event.preventDefault();


        if (
            newRow < 0 ||
            newRow >= SIZE ||
            newCol < 0 ||
            newCol >= SIZE
        ) {

            return;

        }


        if (
            layouts[currentMaze][newRow][newCol] === "X"
        ) {

            mazeMessage.innerText =
                "🧱 Oops! That's a wall!";

            return;

        }


        player.row =
            newRow;

        player.col =
            newCol;


        mazeMessage.innerText =
            "";


        drawMaze();


        if (
            player.row === finish.row &&
            player.col === finish.col
        ) {

            mazeCompleted();

        }

    }
);


// ================================
// MAZE COMPLETED
// ================================

function mazeCompleted() {

    mazeScore++;


    localStorage.setItem(
        "mazeScore",
        mazeScore
    );


    mazeMessage.innerText =
        "🎉 Amazing! You found the way home!";


    nextBtn.style.display =
        "inline-block";

}


// ================================
// NEXT MAZE
// ================================

nextBtn.onclick = function () {

    currentMaze++;

    if (currentMaze >= mazes.length) {

        mazeMessage.innerText =
            "🏆 Maze Round Completed!";

        nextBtn.innerText =
            "View Final Results →";

        nextBtn.onclick = function () {

            submitFinalQuiz();

        };

        return;
    }

    loadMaze();

};


// ================================
// FINAL QUIZ SUBMISSION
// ================================

function submitFinalQuiz() {

    mazeMessage.innerText =
        "⏳ Calculating your final score...";

    nextBtn.disabled = true;


    const quizAnswers =
        JSON.parse(
            localStorage.getItem("quizAnswers") || "[]"
        );


    const scratchScore =
        parseInt(
            localStorage.getItem("scratchScore") || "0"
        );


    const finalMazeScore =
        parseInt(
            localStorage.getItem("mazeScore") || mazeScore
        );


    console.log("FINAL QUIZ DATA:");

    console.log("Main answers:", quizAnswers);

    console.log("Scratch score:", scratchScore);

    console.log("Maze score:", finalMazeScore);


    fetch("/quiz/submit", {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            answers: quizAnswers,

            scratch_score: scratchScore,

            maze_score: finalMazeScore,

            final_submission: true

        })

    })

    .then(async response => {

        const text = await response.text();

        console.log(
            "Server response:",
            text
        );


        if (!response.ok) {

            throw new Error(
                "Server returned " +
                response.status +
                ": " +
                text
            );

        }


        try {

            return JSON.parse(text);

        }

        catch {

            throw new Error(
                "Server did not return JSON."
            );

        }

    })

    .then(data => {

        console.log(
            "FINAL SCORE:",
            data
        );


        // Save final score locally too
        localStorage.setItem(
            "finalScore",
            data.score
        );


        // Clean quiz data
        localStorage.removeItem(
            "quizAnswers"
        );

        localStorage.removeItem(
            "scratchScore"
        );

        localStorage.removeItem(
            "mazeScore"
        );

        clearQuizTimer();


        // GO TO RESULT PAGE
        window.location.href =
            "/quiz/result";

    })

    .catch(error => {

        console.error(
            "FINAL QUIZ SUBMISSION FAILED:",
            error
        );


        mazeMessage.innerHTML =
            "❌ Something went wrong while saving your score.<br>" +
            "<small>" +
            error.message +
            "</small>";


        nextBtn.disabled = false;

    });

}