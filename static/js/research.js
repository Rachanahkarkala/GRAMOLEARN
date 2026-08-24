const searchBtn=document.getElementById("searchBtn");

const searchInput=document.getElementById("animalSearch");

const result=document.getElementById("resultCard");

searchBtn.onclick=function(){

    let animal=searchInput.value.trim();

    if(animal==="") return;

    fetch("/research/search",{

        method:"POST",

        headers:{

            "Content-Type":"application/json"

        },

        body:JSON.stringify({

            animal:animal

        })

    })

    .then(res=>res.json())

    .then(data=>{

        if(data.success){

            result.innerHTML=`

            <div class="animalCard">

            <h1>${data.title}</h1>

            <p>${data.summary}</p>

            <br>

            <a href="${data.url}"

            target="_blank">

            Read more on Wikipedia 🌍

            </a>

            </div>

            `;

        }

        else{

            result.innerHTML=`

            <h2>

            Animal not found 🐾

            </h2>

            `;

        }

    });

}