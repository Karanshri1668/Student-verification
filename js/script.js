/*====================================

EVENT CONTROL PANEL

====================================*/

const eventCards = document.querySelectorAll(".card");

eventCards.forEach(card => {

    card.addEventListener("click", () => {

        const event = card.dataset.event;

        window.location.href = `${event}.html`;

    });

});