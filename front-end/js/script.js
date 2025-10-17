document.addEventListener('DOMContentLoaded', function() {

    let slideIndex = 1; 
    const slides = document.querySelectorAll('.diapo'); 
    function showSlides(n) {
        let i;
        // Si on a dépassé la dernière diapo, revenir à la première
        if (n > slides.length) {
            slideIndex = 1;
        }
        // Masque toutes les diapositives
        for (i = 0; i < slides.length; i++) {
            slides[i].classList.remove('actif');
        }
        // On utilise (slideIndex - 1) car les tableaux commencent à l'index 0
        slides[slideIndex - 1].classList.add('actif');
    }

    /**
     * Gère le passage automatique toutes les 5 secondes
     */
    function autoSlide() {
        slideIndex++; // Incrémente pour passer à la diapo suivante
        showSlides(slideIndex); // Affiche la nouvelle diapo
        setTimeout(autoSlide, 5000); 
    }
    showSlides(slideIndex); 
    setTimeout(autoSlide, 5000); 
});