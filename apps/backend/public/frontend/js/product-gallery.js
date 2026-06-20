document.addEventListener('DOMContentLoaded', function() {
    const mainImage = document.getElementById('mainProductImage');
    const thumbnails = document.querySelectorAll('.product-gallery__thumb-img');

    if (!mainImage || thumbnails.length === 0) return;

    thumbnails.forEach(function(thumb) {
        thumb.addEventListener('click', function() {
            const newSrc = this.getAttribute('data-full-src');
            if (!newSrc) return;

            mainImage.style.opacity = '0.3';

            setTimeout(function() {
                mainImage.src = newSrc;
                mainImage.style.opacity = '1';
            }, 150);

            thumbnails.forEach(function(t) {
                t.classList.remove('active', 'border-primary', 'border-2');
                t.classList.add('opacity-75');
            });

            thumb.classList.add('active', 'border-primary', 'border-2');
            thumb.classList.remove('opacity-75');
        });
    });
});
