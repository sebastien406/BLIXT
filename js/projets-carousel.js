document.addEventListener('DOMContentLoaded', () => {
    const carousels = document.querySelectorAll('.project-carousel');

    carousels.forEach(carousel => {
        const images = carousel.querySelectorAll('img');
        let currentIndex = 0;

        const slide = () => {
            currentIndex = (currentIndex + 1) % images.length;
            const offset = -currentIndex * 100;
            carousel.style.transform = `translateX(${offset}%)`;
        };

        setInterval(slide, 5000);
    });
});