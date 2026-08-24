const cards = document.querySelectorAll(".category-card");

cards.forEach(card=>{

    card.addEventListener("click",()=>{

        const category = card.dataset.category;

        window.location.href="/colouring/"+category;

    });

});