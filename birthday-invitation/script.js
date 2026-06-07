/* ===========================
   Birthday Invitation - JavaScript
   =========================== */

// ---- Configuration ----
const CONFIG = {
    birthdayName: "Shreesha",
    age: 6,
    partyDate: "2026-06-14T18:30:00",
    partyTime: "6:30 PM Onwards",
    venue: "Buntara Bhavan Hall",
    address: "5th Floor, Buntara Bhavan, Pune – 411022",
    mapLink: "https://maps.app.goo.gl/rX647xaG7x9sNbyw9",
};

// ---- Floating Candy Decorations ----
function createFloatingDecorations() {
    const container = document.getElementById('floatingDecorations');
    const candies = ['🍭', '🍬', '🧁', '🍩', '🍪', '🎀', '⭐', '💖', '🍫', '🎈', '🌸', '✨', '🦄', '🎪'];

    for (let i = 0; i < 20; i++) {
        const item = document.createElement('div');
        item.classList.add('floating-item');
        item.textContent = candies[Math.floor(Math.random() * candies.length)];
        item.style.left = Math.random() * 100 + '%';
        item.style.fontSize = (1.2 + Math.random() * 1.8) + 'rem';
        item.style.animationDuration = (12 + Math.random() * 18) + 's';
        item.style.animationDelay = -(Math.random() * 20) + 's';
        container.appendChild(item);
    }
}

// ---- Confetti Effect ----
class ConfettiEffect {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.running = false;
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticle(x, y) {
        const colors = [
            '#ff85c0', '#f759ab', '#eb2f96', '#b37feb', '#9254de',
            '#ffd666', '#ff9c6e', '#87e8de', '#ff7875', '#95de64',
            '#69b1ff', '#ffadd2'
        ];
        return {
            x: x || Math.random() * this.canvas.width,
            y: y || -10,
            size: Math.random() * 8 + 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            speedX: (Math.random() - 0.5) * 6,
            speedY: Math.random() * 3 + 2,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10,
            opacity: 1,
            shape: Math.random() > 0.5 ? 'rect' : 'circle',
        };
    }

    burst(count = 100) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 3;
        for (let i = 0; i < count; i++) {
            const p = this.createParticle(centerX, centerY);
            p.speedX = (Math.random() - 0.5) * 15;
            p.speedY = (Math.random() - 0.5) * 15 - 5;
            this.particles.push(p);
        }
        if (!this.running) {
            this.running = true;
            this.animate();
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((p, index) => {
            p.x += p.speedX;
            p.y += p.speedY;
            p.speedY += 0.12;
            p.rotation += p.rotationSpeed;
            p.opacity -= 0.003;
            p.speedX *= 0.99;

            if (p.opacity <= 0) {
                this.particles.splice(index, 1);
                return;
            }

            this.ctx.save();
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate((p.rotation * Math.PI) / 180);
            this.ctx.globalAlpha = p.opacity;
            this.ctx.fillStyle = p.color;

            if (p.shape === 'rect') {
                this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
            } else {
                this.ctx.beginPath();
                this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                this.ctx.fill();
            }

            this.ctx.restore();
        });

        if (this.particles.length > 0) {
            requestAnimationFrame(() => this.animate());
        } else {
            this.running = false;
        }
    }
}

// ---- Scroll Reveal ----
function initScrollReveal() {
    const elements = document.querySelectorAll('.detail-card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(el => observer.observe(el));
}

// ---- RSVP Form Handler (Google Sheets) ----
// ⚠️ IMPORTANT: Replace this URL with YOUR Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx5hPwf7TqkINP306uzRd5G2e8-6iYw9uYfcCffnlUULHy7IRsik66yEPfKGb1DANQ/exec';

function initRSVP() {
    const form = document.getElementById('rsvpForm');
    const success = document.getElementById('rsvpSuccess');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const button = document.getElementById('rsvpButton');
        button.innerHTML = '<span>Sending... 💫</span>';
        button.disabled = true;

        // Collect form data
        const data = {
            name: document.getElementById('guestName').value.trim(),
            adults: parseInt(document.getElementById('adultCount').value) || 0,
            children: parseInt(document.getElementById('childCount').value) || 0,
            total: parseInt(document.getElementById('totalGuests').textContent) || 0,
            timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        };

        try {
            // Send to Google Sheets
            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            // Show success (no-cors always returns opaque response, so we trust it)
            form.style.display = 'none';
            success.style.display = 'block';

            if (window.confetti) {
                window.confetti.burst(150);
            }
        } catch (error) {
            console.error('RSVP Error:', error);
            // Still show success to the guest (don't ruin their experience)
            form.style.display = 'none';
            success.style.display = 'block';

            if (window.confetti) {
                window.confetti.burst(150);
            }
        }
    });
}

// ---- Guest Counter Controls ----
function initCounters() {
    const counterBtns = document.querySelectorAll('.counter-btn');

    counterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.dataset.target;
            const input = document.getElementById(targetId);
            let value = parseInt(input.value) || 0;

            if (btn.classList.contains('plus')) {
                if (value < 20) value++;
            } else {
                if (value > 0) value--;
            }

            input.value = value;
            updateTotalGuests();
        });
    });
}

function updateTotalGuests() {
    const adults = parseInt(document.getElementById('adultCount').value) || 0;
    const children = parseInt(document.getElementById('childCount').value) || 0;
    document.getElementById('totalGuests').textContent = adults + children;
}

// ---- Populate Dynamic Content ----
function populateContent() {
    // Name
    document.getElementById('birthdayName').textContent = CONFIG.birthdayName;



    // Date & Time
    document.getElementById('partyDate').textContent = 'Sunday, 14th June 2026';
    document.getElementById('partyTime').textContent = CONFIG.partyTime;

    // Venue
    document.getElementById('partyVenue').textContent = CONFIG.venue;
    document.getElementById('partyAddress').textContent = CONFIG.address;

    // Map link
    const mapLinkEl = document.getElementById('mapLink');
    if (mapLinkEl) {
        mapLinkEl.href = CONFIG.mapLink;
    }

    // Guest name personalization
    populateGuestName();
}

// ---- Dynamic Guest Name from URL ----
// Usage: index.html?name=Prathamesh
function populateGuestName() {
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get('name');

    if (guestName && guestName.trim() !== '') {
        const name = decodeURIComponent(guestName.trim());

        const formattedName = name.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');

        // Show the guest greeting
        const greetingEl = document.getElementById('guestGreeting');
        const nameTextEl = document.getElementById('guestNameText');
        greetingEl.style.display = 'block';
        nameTextEl.textContent = `Dear ${formattedName},`;

        // Update page title
        document.title = `🧁 ${formattedName}, You're Invited to ${CONFIG.birthdayName}'s Birthday!`;

        // Pre-fill RSVP name field
        const rsvpNameField = document.getElementById('guestName');
        if (rsvpNameField) {
            rsvpNameField.value = formattedName;
        }
    }
}

// ---- Initialize Everything ----
document.addEventListener('DOMContentLoaded', () => {
    // Setup confetti
    const canvas = document.getElementById('confettiCanvas');
    window.confetti = new ConfettiEffect(canvas);

    // Initial confetti burst on load
    setTimeout(() => {
        window.confetti.burst(80);
    }, 1500);

    // Floating decorations
    createFloatingDecorations();

    // Populate content
    populateContent();

    // Scroll reveal
    initScrollReveal();

    // RSVP form
    initRSVP();

    // Guest counters
    initCounters();

    // Confetti on hero click
    document.getElementById('hero').addEventListener('click', () => {
        window.confetti.burst(60);
    });
});
