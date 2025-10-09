document.addEventListener('DOMContentLoaded', () => {

    // Logique du Carrousel d'Images Interne (Défilement automatique des photos)

    // Cibler toutes les fiches projet
    const fichesProjet = document.querySelectorAll('.projet-fiche');

    fichesProjet.forEach(fiche => {
        const carrousel = fiche.querySelector('.carrousel-images');
        const defilementPhotos = fiche.querySelector('.defilement-photos');
        const images = fiche.querySelectorAll('.defilement-photos img');
        
        // Si le carrousel ou les images n'existent pas, ou s'il y a moins de 2 images, on arrête.
        if (!carrousel || images.length <= 1) return; 

        let indexImageActuelle = 0;

        // Fonction de mise à jour visuelle (déplacement de l'image)
        function mettreAJourCarrousel() {
            // Déplace le conteneur d'images.
            defilementPhotos.style.transform = `translateX(-${indexImageActuelle * 100}%)`;
        }

        // Logique de défilement automatique
        function imageSuivante() {
            // Passe à l'image suivante, en revenant à la première image (index 0) après la dernière.
            indexImageActuelle = (indexImageActuelle + 1) % images.length;
            mettreAJourCarrousel();
        }

        // Intervalle de défilement (toutes les 5 secondes)
        let intervalle = setInterval(imageSuivante, 5000);

        // OPTIONNEL: Pause au survol de la souris
        fiche.addEventListener('mouseenter', () => {
            clearInterval(intervalle);
        });
        fiche.addEventListener('mouseleave', () => {
            intervalle = setInterval(imageSuivante, 5000);
        });

        // Initialisation
        mettreAJourCarrousel();
    });
});