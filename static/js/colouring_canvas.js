const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");

let drawing = false;

let selectedColor = "#ff0000";

const img = new Image();

img.src="/static/images/colouring/animals/outlines/giraffe.png";

img.onload=function(){

ctx.clearRect(0,0,canvas.width,canvas.height);

const scale=Math.min(canvas.width/img.width,canvas.height/img.height);

const w=img.width*scale;

const h=img.height*scale;

const x=(canvas.width-w)/2;

const y=(canvas.height-h)/2;

ctx.drawImage(img,x,y,w,h);

}

document.querySelectorAll(".color").forEach(c=>{

c.addEventListener("click",()=>{

document.querySelectorAll(".color").forEach(x=>x.classList.remove("active"));

c.classList.add("active");

selectedColor=c.dataset.color;

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

canvas.addEventListener("mousemove",draw);

function draw(e){

if(!drawing) return;

const rect=canvas.getBoundingClientRect();

const x=e.clientX-rect.left;

const y=e.clientY-rect.top;

ctx.lineWidth=10;

ctx.lineCap="round";

ctx.strokeStyle=selectedColor;

ctx.lineTo(x,y);

ctx.stroke();

ctx.beginPath();

ctx.moveTo(x,y);

}

document.getElementById("resetBtn").onclick=function(){

img.onload();

}

document.getElementById("downloadBtn").onclick=function(){

const link=document.createElement("a");

link.download="giraffe.png";

link.href=canvas.toDataURL();

link.click();

}