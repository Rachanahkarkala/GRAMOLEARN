const QUIZ_END_TIME_KEY =
    "gramolearn_quiz_end_time";

let quizTimerInterval = null;


// ======================================================
// START
// ======================================================

function startQuizTimer(totalSeconds, reset = false) {

    if (reset) {

        totalSeconds = Number(totalSeconds);

        if (!totalSeconds || totalSeconds <= 0) {

            console.error(
                "Invalid quiz time:",
                totalSeconds
            );

            return;

        }

        const endTime =
            Date.now() +
            totalSeconds * 1000;

        localStorage.setItem(
            QUIZ_END_TIME_KEY,
            endTime.toString()
        );

    }

    else if (!Number(localStorage.getItem(QUIZ_END_TIME_KEY))) {

        console.error(
            "Cannot resume quiz timer without an end time."
        );

        return;

    }


    if (quizTimerInterval) {

        clearInterval(quizTimerInterval);

    }


    updateQuizTimer();

    quizTimerInterval =
        setInterval(updateQuizTimer, 1000);

}


// ======================================================
// UPDATE
// ======================================================

function updateQuizTimer() {

    const timer =
        document.getElementById("timer");

    if (!timer) return;


    const endTime =
        Number(
            localStorage.getItem(
                QUIZ_END_TIME_KEY
            )
        );


    if (!endTime) {

        timer.textContent = "30:00";

        return;

    }


    const remaining =
        Math.max(
            0,
            Math.ceil(
                (endTime - Date.now()) / 1000
            )
        );


    const minutes =
        Math.floor(remaining / 60);

    const seconds =
        remaining % 60;


    timer.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;


    // ==================================================
    // TIME UP
    // ==================================================

    if (remaining <= 0) {

        clearInterval(
            quizTimerInterval
        );

        quizTimerInterval = null;


        /*
         * IMPORTANT:
         *
         * DO NOT automatically submit here.
         *
         * This prevents the timer from unexpectedly
         * throwing the user onto /quiz/result.
         */

        timer.textContent = "00:00";

        timer.classList.add("timer-expired");

        alert(
            "Time's up! Please finish the current round."
        );

    }

}


// ======================================================
// CLEAR
// ======================================================

function clearQuizTimer() {

    if (quizTimerInterval) {

        clearInterval(
            quizTimerInterval
        );

        quizTimerInterval = null;

    }

    localStorage.removeItem(
        QUIZ_END_TIME_KEY
    );

}