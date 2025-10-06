document.addEventListener('DOMContentLoaded', function() {
    // 1. Déclarer les éléments principaux
    const modale = document.getElementById('fenetre-modale');
    const boutonsOuvrir = document.querySelectorAll('.btn-ouvrir-modale');
    const boutonFermer = document.querySelector('.modale-fermer');
    const titreModale = document.getElementById('modale-titre');
    const texteModale = document.getElementById('modale-texte');

    // 2. Fonction pour OUVRIR la modale
    boutonsOuvrir.forEach(bouton => {
        bouton.addEventListener('click', function(e) {
            e.preventDefault(); // Empêche le lien de naviguer
            
            // Récupérer les données de la carte cliquée
            const titre = bouton.getAttribute('data-titre');
            const description = bouton.getAttribute('data-description');
            
            // Injecter le contenu dans la modale
            titreModale.textContent = titre;
            texteModale.textContent = description;
            
            // Afficher la modale en ajoutant la classe 'actif'
            modale.classList.add('actif');
            
            // Bonus : Empêcher de faire défiler le fond
            document.body.style.overflow = 'hidden'; 
        });
    });

    // 3. Fonction pour FERMER la modale (au clic sur le 'X')
    function fermerModale() {
        modale.classList.remove('actif');
        document.body.style.overflow = ''; // Rétablir le défilement
    }

    boutonFermer.addEventListener('click', fermerModale);

    // 4. Fermer la modale si l'utilisateur clique sur l'arrière-plan sombre
    modale.addEventListener('click', function(e) {
        if (e.target === modale) {
            fermerModale();
        }
    });
});