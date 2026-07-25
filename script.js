// ============ OPENING OVERLAY ============
function openInvitation() {
    const overlay = document.getElementById('openingOverlay');
    overlay.classList.add('hidden');
    document.body.style.overflow = 'auto';

    // Try to play music
    const music = document.getElementById('bgMusic');
    music.play().then(() => {
        document.getElementById('musicBtn').classList.add('playing');
        isMusicPlaying = true;
    }).catch(() => {
        console.log('Autoplay blocked');
    });
}

document.body.style.overflow = 'hidden';

// ============ FLOATING PARTICLES ============
function createParticles() {
    const container = document.getElementById('particles');
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 10 + 8) + 's';
        particle.style.animationDelay = (Math.random() * 10) + 's';
        particle.style.width = (Math.random() * 4 + 2) + 'px';
        particle.style.height = particle.style.width;
        container.appendChild(particle);
    }
}
createParticles();

// ============ MUSIC PLAYER ============
let isMusicPlaying = false;

function toggleMusic() {
    const music = document.getElementById('bgMusic');
    const btn = document.getElementById('musicBtn');

    if (isMusicPlaying) {
        music.pause();
        btn.classList.remove('playing');
    } else {
        music.play().then(() => {
            btn.classList.add('playing');
        }).catch(() => {
            console.log('Music play failed');
        });
    }
    isMusicPlaying = !isMusicPlaying;
}

// ============ SCROLL ANIMATIONS ============
function handleScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll, .animate-left, .animate-right');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(el => observer.observe(el));
}
handleScrollAnimations();

// ============ COUNTDOWN TIMER ============
function updateCountdown() {
    const weddingDate = new Date('2026-08-02T18:30:00+07:00');
    const now = new Date();
    const diff = weddingDate - now;

    if (diff <= 0) {
        document.getElementById('days').textContent = '0';
        document.getElementById('hours').textContent = '0';
        document.getElementById('minutes').textContent = '0';
        document.getElementById('seconds').textContent = '0';
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = days;
    document.getElementById('hours').textContent = hours;
    document.getElementById('minutes').textContent = minutes;
    document.getElementById('seconds').textContent = seconds;
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ============ COPY TEXT ============
function copyText(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Nomor rekening berhasil disalin!');
    }).catch(() => {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('Nomor rekening berhasil disalin!');
    });
}

// ============ TOAST ============
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

// ============ RSVP SUBMIT ============
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
const EMAIL_RECEIVER = 'dayatalmahonk07@gmail.com';

emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

function submitRSVP() {
    const name = document.getElementById('rsvpName').value.trim();
    const email = document.getElementById('rsvpEmail').value.trim();
    const guest = document.getElementById('rsvpGuest').value;
    const attend = document.getElementById('rsvpAttend').value;
    const message = document.getElementById('rsvpMessage').value.trim();

    if (!name) {
        showToast('Mohon isi nama lengkap Anda!');
        return;
    }
    if (!email) {
        showToast('Mohon isi alamat email Anda!');
        return;
    }

    const attendLabel = { hadir: 'Hadir', tidak: 'Tidak Hadir', belum: 'Belum Pasti' };

    const templateParams = {
        from_name: name,
        from_email: email,
        guest_count: guest,
        attendance: attendLabel[attend] || attend,
        message: message || '-',
        to_email: EMAIL_RECEIVER
    };

    const btn = document.querySelector('.submit-btn');
    btn.disabled = true;
    btn.textContent = 'Mengirim...';

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
        .then(() => {
            showToast('Terima kasih atas konfirmasi Anda!');
            document.getElementById('rsvpName').value = '';
            document.getElementById('rsvpEmail').value = '';
            document.getElementById('rsvpMessage').value = '';
        })
        .catch((err) => {
            console.error('EmailJS Error:', err);
            showToast('Gagal mengirim. Silakan coba lagi.');
        })
        .finally(() => {
            btn.disabled = false;
            btn.textContent = 'Kirim Konfirmasi';
        });
}

// ============ SMOOTH SCROLL FOR NAV ============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
