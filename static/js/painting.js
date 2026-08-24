const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");

let drawing = false;
let selectedColor = "#ff0000";

const img = new Image();

img.src =
"/static/images/colouring/animals/outlines/" +
animal +
".png";

img.onload = function(){

drawImage();

}

function drawImage(){

ctx.clearRect(0,0,canvas.width,canvas.height);

const scale = Math.min(

canvas.width/img.width,

canvas.height/img.height

);

const w = img.width * scale;

const h = img.height * scale;

const x = (canvas.width-w)/2;

const y = (canvas.height-h)/2;

ctx.drawImage(img,x,y,w,h);

}

document.querySelectorAll(".color").forEach(color=>{

color.addEventListener("click",()=>{

document.querySelectorAll(".color").forEach(c=>{

c.classList.remove("active");

});

color.classList.add("active");

selectedColor=color.dataset.color;

});

});

canvas.addEventListener("mousedown",()=>{

drawing=true;

});

canvas.addEventListener("mouseup",()=>{

drawing=false;

ctx.beginPath();

});

canvas.addEventListener("mouseleave",()=>{

drawing=false;

ctx.beginPath();

});

canvas.addEventListener("mousemove",paint);

function paint(e){

if(!drawing) return;

const rect=canvas.getBoundingClientRect();

const x=e.clientX-rect.left;

const y=e.clientY-rect.top;

ctx.lineWidth=8;

ctx.lineCap="round";

ctx.strokeStyle=selectedColor;

ctx.lineTo(x,y);

ctx.stroke();

ctx.beginPath();

ctx.moveTo(x,y);

}

document.getElementById("resetBtn").onclick=function(){

drawImage();

}

document.getElementById("downloadBtn").onclick=function(){

const link=document.createElement("a");

link.download=animal+".png";

link.href=canvas.toDataURL();

link.click();

}