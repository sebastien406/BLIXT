document.addEventListener('DOMContentLoaded', () => {
    // Cibler le conteneur qui défile (la liste des projets)
    const conteneurGalerie = document.querySelector('.galerie-projets .conteneur');
    // Cibler le conteneur unique des points (placé après la galerie)
    const conteneurPoints = document.querySelector('.galerie-projets .points-indicateurs');
    // Cibler tous les projets individuels
    const fichesProjets = document.querySelectorAll('.projet-fiche');

    // S'arrête si l'on est en vue bureau ou si les éléments nécessaires sont manquants
    if (window.innerWidth > 768 || !conteneurGalerie || !fichesProjets.length || !conteneurPoints) {
        return; 
    }
    
    // --- A. Créer les points d'indication (un point par projet) ---
    fichesProjets.forEach((_, index) => {
        const point = document.createElement('span');
        point.classList.add('point-item');
        if (index === 0) {
            point.classList.add('actif');
        }

        // Gérer le clic sur le point
        point.addEventListener('click', () => {
            // Calcule la position de défilement pour afficher le projet ciblé au centre
            // 1. Position du projet dans son parent
            const decalageProjet = fichesProjets[index].offsetLeft;
            // 2. Largeur du projet
            const largeurProjet = fichesProjets[index].offsetWidth;
            // 3. Largeur de la fenêtre visible
            const largeurVue = conteneurGalerie.offsetWidth;
            
            // Calculer la position pour centrer le projet :
            // (Début du projet + Moitié du projet) - Moitié de la fenêtre
            const positionCible = decalageProjet + (largeurProjet / 2) - (largeurVue / 2);

            conteneurGalerie.scrollTo({
                left: positionCible, 
                behavior: 'smooth'
            });
        });

        conteneurPoints.appendChild(point);
    });

    const points = conteneurPoints.querySelectorAll('.point-item');


    // --- B. Gérer l'état actif lors du défilement ---
    conteneurGalerie.addEventListener('scroll', () => {
        const scrollX = conteneurGalerie.scrollLeft;
        
        // La moitié de la largeur du conteneur visible est le point de référence pour le "centre"
        const referenceCenter = scrollX + conteneurGalerie.offsetWidth / 2;
        
        let indexActuel = 0;

        // Trouver le projet qui est le plus proche du centre de la fenêtre
        fichesProjets.forEach((fiche, index) => {
            const debutFiche = fiche.offsetLeft;
            const finFiche = fiche.offsetLeft + fiche.offsetWidth;
            
            // Si le centre de la vue (referenceCenter) tombe entre le début et la fin de la fiche
            if (referenceCenter >= debutFiche && referenceCenter <= finFiche) {
                indexActuel = index;
            }
        });

        // Mise à jour de la classe 'actif'
        points.forEach(p => p.classList.remove('actif'));
        if (points[indexActuel]) {
            points[indexActuel].classList.add('actif');
        }
    });
});
