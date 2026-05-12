document.addEventListener('DOMContentLoaded', () => {
    initTypewriter();
    initHighSpeedWheel();
    initDemoFilter();
});

// 1. TYPEWRITER EFFECT
function initTypewriter() {
    const words = ["Marketplace", "Directory", "Classifieds", "Service"];
    const el = document.getElementById('typewriter');
    if (!el) return;
    let i = 0, j = 0, isDeleting = false;

    function type() {
        const current = words[i];
        el.textContent = isDeleting ? current.substring(0, j--) : current.substring(0, j++);
        let speed = isDeleting ? 30 : 100;
        if (!isDeleting && j > current.length) { isDeleting = true; speed = 1500; }
        else if (isDeleting && j === 0) { isDeleting = false; i = (i + 1) % words.length; speed = 400; }
        setTimeout(type, speed);
    }
    type();
}

// 2. HERO WHEEL ROTATION
function initHighSpeedWheel() {
    const container = document.getElementById('stack-container');
    if (!container) return;
    
    function rotate() {
        const p1 = container.querySelector('.pos-1');
        const p2 = container.querySelector('.pos-2');
        const p3 = container.querySelector('.pos-3');
        if (!p1 || !p2 || !p3) return;

        p1.classList.add('sinking');
        p2.classList.replace('pos-2', 'pos-1');
        p3.classList.replace('pos-3', 'pos-2');

        setTimeout(() => {
            p1.classList.remove('pos-1', 'sinking');
            p1.classList.add('preparing');
            requestAnimationFrame(() => {
                void p1.offsetWidth; // Reflow
                p1.classList.remove('preparing');
                p1.classList.add('pos-3');
            });
        }, 100); 
    }
    setInterval(rotate, 1400);
}

// 3. SMOOTH DEMO FILTER
function initDemoFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const demoItems = document.querySelectorAll('.demo-item');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            demoItems.forEach(item => {
                const isMatch = filterValue === 'all' || item.getAttribute('data-category') === filterValue;
                if (isMatch) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.9)';
                    setTimeout(() => { item.style.display = 'none'; }, 350);
                }
            });
        });
    });
}





window.addEventListener('scroll', function() {
    const buyBar = document.querySelector('.floating-buy-bar');
    if (window.scrollY > 600) {
        buyBar.style.display = 'block';
    } else {
        buyBar.style.display = 'none';
    }
});



let popupShown = false;

document.addEventListener("mouseleave", function(e) {
    // Trigger if mouse moves above the top of the viewport
    if (e.clientY < 0 && !popupShown) {
        const popup = document.getElementById('exitIntentPopup');
        const content = popup.querySelector('.exit-popup-content');
        
        popup.style.display = 'flex';
        content.classList.add('animate__zoomIn'); // Uses Animate.css if you have it
        
        popupShown = true;
        // Optional: Save to localStorage so it doesn't show again for 24 hours
        localStorage.setItem('exitPopupShown', 'true');
    }
});

function closeExitPopup() {
    document.getElementById('exitIntentPopup').style.display = 'none';
}

// Check if already shown in this session
if (localStorage.getItem('exitPopupShown')) {
    popupShown = true;
}




window.addEventListener('scroll', function() {
    const bar = document.querySelector('.floating-buy-bar');
    if (window.scrollY > 500) {
        bar.style.display = 'flex';
    } else {
        bar.style.display = 'none';
    }
});