<script src="../assets/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
    <script>
        // 1. Typewriter Effect
        const words = ["WooCommerce", "E-commerce", "Professional"];
        let wordIdx = 0;
        let charIdx = 0;
        let isDeleting = false;
        const target = document.getElementById('typewriter');

        function type() {
            const currentWord = words[wordIdx];
            if (isDeleting) {
                target.textContent = currentWord.substring(0, charIdx - 1);
                charIdx--;
            } else {
                target.textContent = currentWord.substring(0, charIdx + 1);
                charIdx++;
            }

            let speed = isDeleting ? 100 : 200;
            if (!isDeleting && charIdx === currentWord.length) {
                speed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIdx === 0) {
                isDeleting = false;
                wordIdx = (wordIdx + 1) % words.length;
                speed = 500;
            }
            setTimeout(type, speed);
        }
        type();

        // 2. 3D Shuffle Logic
        let positions = ['pos-1', 'pos-2', 'pos-3'];
        const cards = [
            document.getElementById('card-1'),
            document.getElementById('card-2'),
            document.getElementById('card-3')
        ];

        setInterval(() => {
            const frontCard = cards.find(c => c.classList.contains('pos-1'));
            
            // Step 1: Sink and Fade the front card
            frontCard.classList.add('sinking');

            setTimeout(() => {
                // Step 2: Rotate classes for all cards
                cards.forEach(card => {
                    if (card.classList.contains('pos-1')) {
                        card.classList.remove('pos-1', 'sinking');
                        card.style.transition = 'none'; // Instant move to back
                        card.classList.add('pos-3');
                        void card.offsetWidth; // Reflow
                        card.style.transition = ''; // Restore transition
                    } else if (card.classList.contains('pos-2')) {
                        card.classList.replace('pos-2', 'pos-1');
                    } else if (card.classList.contains('pos-3')) {
                        card.classList.replace('pos-3', 'pos-2');
                    }
                });
            }, 400); // Matches CSS transition speed
        }, 1200);
    </script>
</body>
</html>