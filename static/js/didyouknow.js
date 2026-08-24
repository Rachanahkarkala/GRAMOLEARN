let current=0;

const img=document.getElementById("animalImage");

const animal=document.getElementById("animalName");

const fact=document.getElementById("animalFact");

const number=document.getElementById("factNumber");

const card=document.getElementById("factCard");

showFact();

function showFact(){

img.src="/static/images/facts/"+facts[current].image;

animal.innerHTML=facts[current].animal;

fact.innerHTML=facts[current].fact;

number.innerHTML=(current+1)+" / "+facts.length;

}

card.addEventListener("click",()=>{

card.style.transform="rotateY(90deg)";

setTimeout(()=>{

current++;

if(current>=facts.length){

current=0;

}

showFact();

card.style.transform="rotateY(0deg)";

},250);

});