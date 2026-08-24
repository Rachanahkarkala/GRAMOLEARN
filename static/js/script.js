
const fireflies = document.querySelectorAll(".firefly");

fireflies.forEach(firefly => {

    let x = Math.random() * window.innerWidth;
    let y = Math.random() * window.innerHeight;

    let angle = Math.random() * Math.PI * 2;

    let speed = 0.25 + Math.random() * 0.4;

    function move(){

        // Occasionally change direction
        if(Math.random() < 0.015){

            angle += (Math.random()-0.5)*1.8;

        }

        // Occasionally pause
        if(Math.random() < 0.003){

            setTimeout(move,800);

            return;

        }

        x += Math.cos(angle) * speed;

        y += Math.sin(angle) * speed;

        // Bounce from screen edges

        if(x < 10 || x > window.innerWidth-10){

            angle = Math.PI-angle;

        }

        if(y < 10 || y > window.innerHeight-10){

            angle = -angle;

        }

        firefly.style.left = x+"px";

        firefly.style.top = y+"px";

        requestAnimationFrame(move);

    }

    move();

});