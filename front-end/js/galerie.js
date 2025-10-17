document.addEventListener('DOMContentLoaded', () => {
    // 1. Cibler les éléments
    const grilleGalerie = document.getElementById('galerie-grille-mobile');
    const conteneurPoints = document.querySelector('.galerie-points');

    // Vérification : s'arrête si l'on est en vue bureau ou si les éléments n'existent pas
    if (!grilleGalerie || !conteneurPoints || window.innerWidth > 767) {
        return; 
    }
    
    const images = grilleGalerie.querySelectorAll('.galerie-image');
    
    // Si la galerie est vide, on s'arrête.
    if (images.length === 0) {
        return;
    }

    // --- Calcule la largeur de défilement par 'slide' ---
    // On utilise la largeur de la première image (90vw) plus le 'gap' (20px) 
    // qui existe entre les images.
    // getBoundingClientRect().width est très fiable.
    const largeurSlide = images[0].getBoundingClientRect().width + 20; 
    
    // --- 2. Créer les indicateurs (points) dynamiquement ---
    images.forEach((_, index) => {
        const point = document.createElement('span');
        point.classList.add('point');
        
        if (index === 0) {
            point.classList.add('actif');
        }

        // Gestion du clic pour naviguer vers l'image
        point.addEventListener('click', () => {
            grilleGalerie.scrollTo({
                // La position cible est l'index multiplié par la largeur du 'slide'
                left: index * largeurSlide, 
                behavior: 'smooth'
            });
        });
        
        conteneurPoints.appendChild(point);
    });

    const points = conteneurPoints.querySelectorAll('.point');
    
    // --- 3. Gérer le changement de point lors du défilement ---
    grilleGalerie.addEventListener('scroll', () => {
        
        const scrollX = grilleGalerie.scrollLeft;

        // Calcul de l'index : on divise la position de défilement par la largeur de défilement.
        // Math.round permet de s'assurer qu'on change d'index au bon moment.
        const indexActuel = Math.round(scrollX / largeurSlide);

        // Mise à jour de la classe 'actif'
        points.forEach(point => point.classList.remove('actif'));
        
        if (points[indexActuel]) {
            points[indexActuel].classList.add('actif');
        }
    });
});