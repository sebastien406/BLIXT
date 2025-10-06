document.addEventListener('DOMContentLoaded', function() {
    const menuBouton = document.querySelector('.menu-burger-bouton');
    const navMenu = document.querySelector('.nav-menu');

    if (menuBouton && navMenu) {
        menuBouton.addEventListener('click', () => {
            navMenu.classList.toggle('actif');
            menuBouton.classList.toggle('actif');
        });
    }

    // Gère le défilement automatique des logos
    const logosSlide = document.querySelector('.logos-slide');
    if (logosSlide) {
        const copy = logosSlide.cloneNode(true);
        logosSlide.parentNode.appendChild(copy);
    }
});