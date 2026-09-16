// ==========================================
// GRAMOLEARN - SMOOTH COLORING ENGINE
// ==========================================

const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d", {
    willReadFrequently: true
});

const resetBtn = document.getElementById("resetBtn");
const downloadBtn = document.getElementById("downloadBtn");

const colors = document.querySelectorAll(".color");


// ==========================================
// CURRENT COLOR
// ==========================================

let currentColor = "#ff0000";


// ==========================================
// OUTLINE IMAGE
// ==========================================

const outlineImage = new Image();

outlineImage.src = outlineImagePath;


// ==========================================
// ORIGINAL IMAGE DATA
// ==========================================

let originalImageData = null;


// ==========================================
// LOAD OUTLINE
// ==========================================

outlineImage.onload = function () {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.drawImage(
        outlineImage,
        0,
        0,
        canvas.width,
        canvas.height
    );

    // Save the original outline.
    originalImageData = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
    );

};


outlineImage.onerror = function () {

    console.error(
        "Could not load outline:",
        outlineImage.src
    );

};


// ==========================================
// COLOR PALETTE
// ==========================================

colors.forEach(color => {

    color.addEventListener("click", function () {

        colors.forEach(c => {
            c.classList.remove("active");
        });

        this.classList.add("active");

        currentColor =
            this.dataset.color;

    });

});


// ==========================================
// HEX → RGB
// ==========================================

function hexToRgb(hex) {

    hex = hex.replace("#", "");

    return {

        r: parseInt(hex.substring(0, 2), 16),

        g: parseInt(hex.substring(2, 4), 16),

        b: parseInt(hex.substring(4, 6), 16)

    };

}


// ==========================================
// CHECK IF PIXEL IS A BLACK OUTLINE
// ==========================================

function isOutline(r, g, b, a) {

    if (a < 50) {
        return false;
    }

    // Dark pixels are treated as boundaries.
    return (
        r < 100 &&
        g < 100 &&
        b < 100
    );

}


// ==========================================
// COLOR DISTANCE
// ==========================================

function colorDistance(
    r1, g1, b1,
    r2, g2, b2
) {

    return Math.sqrt(

        Math.pow(r1 - r2, 2) +

        Math.pow(g1 - g2, 2) +

        Math.pow(b1 - b2, 2)

    );

}


// ==========================================
// SMOOTH REGION FILL
// ==========================================

function fillArea(startX, startY) {

    if (!originalImageData) {
        return;
    }


    const width = canvas.width;
    const height = canvas.height;

    const original = originalImageData.data;

    const current = ctx.getImageData(
        0,
        0,
        width,
        height
    );

    const pixels = current.data;


    const startIndex =
        (startY * width + startX) * 4;


    const startR =
        original[startIndex];

    const startG =
        original[startIndex + 1];

    const startB =
        original[startIndex + 2];

    const startA =
        original[startIndex + 3];


    // Don't start inside an outline.
    if (
        isOutline(
            startR,
            startG,
            startB,
            startA
        )
    ) {

        return;

    }


    const rgb =
        hexToRgb(currentColor);


    /*
        Higher tolerance makes the colouring
        much smoother around anti-aliased edges.
    */

    const tolerance = 75;


    const visited =
        new Uint8Array(width * height);


    const stack = [
        [startX, startY]
    ];


    while (stack.length > 0) {

        const point = stack.pop();

        const x = point[0];
        const y = point[1];


        if (
            x < 0 ||
            x >= width ||
            y < 0 ||
            y >= height
        ) {

            continue;

        }


        const pixelPosition =
            y * width + x;


        if (visited[pixelPosition]) {
            continue;
        }


        visited[pixelPosition] = 1;


        const index =
            pixelPosition * 4;


        const r =
            original[index];

        const g =
            original[index + 1];

        const b =
            original[index + 2];

        const a =
            original[index + 3];


        // Never paint the black outline.
        if (
            isOutline(
                r,
                g,
                b,
                a
            )
        ) {

            continue;

        }


        /*
            Only colour pixels that belong
            to the same region.

            This catches white + slightly
            grey anti-aliased pixels.
        */

        const distance =
            colorDistance(
                r,
                g,
                b,
                startR,
                startG,
                startB
            );


        if (distance > tolerance) {

            continue;

        }


        // Paint pixel.
        pixels[index] =
            rgb.r;

        pixels[index + 1] =
            rgb.g;

        pixels[index + 2] =
            rgb.b;

        pixels[index + 3] =
            255;


        // Neighbours

        stack.push([
            x + 1,
            y
        ]);

        stack.push([
            x - 1,
            y
        ]);

        stack.push([
            x,
            y + 1
        ]);

        stack.push([
            x,
            y - 1
        ]);

    }


    ctx.putImageData(
        current,
        0,
        0
    );

}


// ==========================================
// GET CANVAS POSITION
// ==========================================

function getCanvasPosition(event) {

    const rect =
        canvas.getBoundingClientRect();

    let clientX;
    let clientY;


    if (event.touches) {

        clientX =
            event.touches[0].clientX;

        clientY =
            event.touches[0].clientY;

    }

    else {

        clientX =
            event.clientX;

        clientY =
            event.clientY;

    }


    const scaleX =
        canvas.width / rect.width;

    const scaleY =
        canvas.height / rect.height;


    return {

        x: Math.floor(
            (clientX - rect.left)
            * scaleX
        ),

        y: Math.floor(
            (clientY - rect.top)
            * scaleY
        )

    };

}


// ==========================================
// CLICK TO PAINT
// ==========================================

canvas.addEventListener(
    "click",
    function (event) {

        const position =
            getCanvasPosition(event);

        fillArea(
            position.x,
            position.y
        );

    }
);


// ==========================================
// TOUCH TO PAINT
// ==========================================

canvas.addEventListener(
    "touchstart",
    function (event) {

        event.preventDefault();

        const position =
            getCanvasPosition(event);

        fillArea(
            position.x,
            position.y
        );

    },
    { passive: false }
);

// ==========================================
// RESET HOVER TRACKING
// ==========================================

canvas.addEventListener(
    "mouseleave",
    function () {

        lastPaintedX = -1;
        lastPaintedY = -1;

    }
);


// ==========================================
// TOUCH SUPPORT
// ==========================================

canvas.addEventListener(
    "touchstart",
    function (event) {

        event.preventDefault();

        const position =
            getCanvasPosition(event);


        fillArea(
            position.x,
            position.y
        );

    },
    { passive: false }
);


canvas.addEventListener(
    "touchmove",
    function (event) {

        event.preventDefault();

        const position =
            getCanvasPosition(event);


        fillArea(
            position.x,
            position.y
        );

    },
    { passive: false }
);


// ==========================================
// RESET
// ==========================================

resetBtn.addEventListener(
    "click",
    function () {

        if (!outlineImage.complete) {
            return;
        }


        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        ctx.drawImage(
            outlineImage,
            0,
            0,
            canvas.width,
            canvas.height
        );


        lastPaintedX = -1;
        lastPaintedY = -1;

    }
);


// ==========================================
// DOWNLOAD
// ==========================================

downloadBtn.addEventListener(
    "click",
    function () {

        const link =
            document.createElement("a");


        link.download =
            `${animalName}_coloured.png`;


        link.href =
            canvas.toDataURL(
                "image/png"
            );


        link.click();

    }
);