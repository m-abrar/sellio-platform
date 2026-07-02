(function () {
    var pages = Array.prototype.slice.call(document.querySelectorAll('.fb-page'));
    var total = pages.length;
    var current = 0;

    var prevBtn = document.querySelector('.fb-prev');
    var nextBtn = document.querySelector('.fb-next');
    var counterEl = document.getElementById('fbCurrent');
    var totalEl = document.getElementById('fbTotal');
    var progressBar = document.querySelector('.fb-progress-bar');

    totalEl.textContent = total;

    pages.forEach(function (page, i) {
        page.style.zIndex = total - i;
    });

    function updateUI() {
        counterEl.textContent = current + 1;
        progressBar.style.width = ((current) / (total - 1)) * 100 + '%';
        prevBtn.disabled = current === 0;
        nextBtn.disabled = current === total - 1;
    }

    function next() {
        if (current >= total - 1) return;
        var page = pages[current];
        page.style.zIndex = total + 10;
        requestAnimationFrame(function () {
            page.classList.add('flipped');
        });
        current++;
        updateUI();
        setTimeout(function () {
            page.style.zIndex = current;
        }, 1000);
    }

    function prev() {
        if (current <= 0) return;
        current--;
        var page = pages[current];
        page.style.zIndex = total + 10;
        requestAnimationFrame(function () {
            page.classList.remove('flipped');
        });
        updateUI();
        setTimeout(function () {
            page.style.zIndex = total - current;
        }, 1000);
    }

    prevBtn.addEventListener('click', prev);
    nextBtn.addEventListener('click', next);

    document.querySelector('.fb-hotzone-next').addEventListener('click', next);
    document.querySelector('.fb-hotzone-prev').addEventListener('click', prev);

    document.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') next();
        if (e.key === 'ArrowLeft') prev();
    });

    updateUI();
})();
