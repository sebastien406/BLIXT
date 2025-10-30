// document.addEventListener('DOMContentLoaded', function() {
//     const menuBouton = document.querySelector('.menu-burger-bouton');
//     const navMenu = document.querySelector('.nav-menu');

//     if (menuBouton && navMenu) {
//         menuBouton.addEventListener('click', () => {
//             navMenu.classList.toggle('actif');
//             menuBouton.classList.toggle('actif');
//         });
//     }

//     // Gère le défilement automatique des logos
//     const logosSlide = document.querySelector('.logos-slide');
//     if (logosSlide) {
//         const copy = logosSlide.cloneNode(true);
//         logosSlide.parentNode.appendChild(copy);
//     }
// });

// La fonction DOIT être globale pour être appelée par include-elements.js
function setupBurgerMenuAndCarrousel() {
    
    // --- Logique du Menu Burger ---
    const menuBouton = document.querySelector('.menu-burger-bouton');
    const navMenu = document.querySelector('.nav-menu');

    if (menuBouton && navMenu) {
        menuBouton.addEventListener('click', () => {
            navMenu.classList.toggle('actif'); 
            menuBouton.classList.toggle('actif'); 

            
            // Mise à jour de l'accessibilité
            const isExpanded = navMenu.classList.contains('is-open');
            menuBouton.setAttribute('aria-expanded', isExpanded);
        });
    }
    
    // --- Logique du Carrousel (car elle était dans votre burger.js) ---
    // Note: Le carrousel se trouve dans index.html, donc il est déjà dans le DOM.
    // L'appel de cette fonction dans le script d'inclusion n'est pas idéal 
    // pour le carrousel s'il est hors du header/footer, mais on le laisse là 
    // pour que vous ayez tout au même endroit.

    const conteneurCarrousel = document.querySelector('.bandeau-clients'); 
    const logosSlide = conteneurCarrousel ? conteneurCarrousel.querySelector('.diapo-logos') : null;

    if (logosSlide) {
        // Cette logique (cloner) permet de créer un carrousel infini
        const copy = logosSlide.cloneNode(true);
        logosSlide.parentNode.appendChild(copy);
    }
}