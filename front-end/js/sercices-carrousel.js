document.addEventListener('DOMContentLoaded', () => {

    const grilleServices = document.querySelector('.grille-services');
    const cartesServices = document.querySelectorAll('.carte-service');
    
    // Si la grille ou les cartes sont manquantes, on s'arrête.
    if (!grilleServices || cartesServices.length <= 1) return;

    // Création du conteneur de points (placé juste après la grille dans le HTML)
    const pointsContainer = document.createElement('div');
    pointsContainer.classList.add('points-indicateurs-services');
    grilleServices.parentNode.insertBefore(pointsContainer, grilleServices.nextSibling);

    const isMobile = () => window.innerWidth <= 768; // Même valeur que le CSS media query
    let points = [];

    // Fonction pour créer les points et gérer leur affichage/masquage
    const setupPoints = () => {
        pointsContainer.innerHTML = '';
        points = [];

        if (isMobile()) {
            cartesServices.forEach((_, index) => {
                const point = document.createElement('span');
                point.classList.add('point-item-service');
                if (index === 0) {
                    point.classList.add('actif');
                }
                
                // Clic sur le point pour centrer la carte
                point.addEventListener('click', () => {
                    const decalageCarte = cartesServices[index].offsetLeft;
                    const largeurCarte = cartesServices[index].offsetWidth;
                    const largeurVue = grilleServices.offsetWidth;
                    const positionCible = decalageCarte + (largeurCarte / 2) - (largeurVue / 2);

                    grilleServices.scrollTo({
                        left: positionCible, 
                        behavior: 'smooth'
                    });
                });
                pointsContainer.appendChild(point);
                points.push(point);
            });
            pointsContainer.style.display = 'flex'; // Cette ligne gère l'affichage immédiat
            mettreAJourPoints(); 
        } else {
            pointsContainer.style.display = 'none'; 
        }
    };

    // Fonction pour mettre à jour l'état actif des points lors du scroll
    const mettreAJourPoints = () => {
        if (!isMobile() || points.length === 0) return;

        const scrollX = grilleServices.scrollLeft;
        // Le centre du conteneur visible est la référence
        const referenceCenter = scrollX + grilleServices.offsetWidth / 2;
        let indexActuel = 0;

        cartesServices.forEach((carte, index) => {
            const debutCarte = carte.offsetLeft;
            const finCarte = carte.offsetLeft + carte.offsetWidth;
            
            // On vérifie quelle carte est au centre de l'écran
            if (referenceCenter >= debutCarte && referenceCenter <= finCarte) {
                indexActuel = index;
            }
        });

        // Mise à jour de la classe 'actif'
        points.forEach(p => p.classList.remove('actif'));
        if (points[indexActuel]) {
            points[indexActuel].classList.add('actif');
        }
    };

    // Événements
    grilleServices.addEventListener('scroll', mettreAJourPoints);
    window.addEventListener('resize', setupPoints); // Gérer les changements de taille d'écran
    
    // Initialisation
    setupPoints();
});