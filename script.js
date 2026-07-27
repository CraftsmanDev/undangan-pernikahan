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
const EMAILJS_PUBLIC_KEY = 'EnSrB05BR6-WHxRZC';
const EMAILJS_SERVICE_ID = 'service_lql8pp5';
const EMAILJS_TEMPLATE_ID = '_PRVQhhU5VVUn_b03nTLG';
const EMAIL_RECEIVER = ' jihanvadilah260720@gmail.com';

emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

function getRSVPData() {
    return JSON.parse(localStorage.getItem('rsvpData') || '[]');
}

function saveRSVPData(data) {
    localStorage.setItem('rsvpData', JSON.stringify(data));
}

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

    // Simpan ke localStorage
    const rsvpEntry = {
        no: getRSVPData().length + 1,
        nama: name,
        email: email,
        jumlahTamu: parseInt(guest),
        kehadiran: attendLabel[attend] || attend,
        ucapan: message || '-',
        tanggal: new Date().toLocaleDateString('id-ID')
    };
    const allData = getRSVPData();
    allData.push(rsvpEntry);
    saveRSVPData(allData);

    // Kirim via EmailJS
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

// ============ GENERATE EXCEL ============
function generateExcel() {
    const data = getRSVPData();
    if (data.length === 0) {
        showToast('Belum ada data RSVP!');
        return null;
    }

    const wsData = [
        ['No', 'Nama', 'Email', 'Jumlah Tamu', 'Kehadiran', 'Ucapan & Doa', 'Tanggal Konfirmasi']
    ];
    data.forEach(item => {
        wsData.push([item.no, item.nama, item.email, item.jumlahTamu, item.kehadiran, item.ucapan, item.tanggal]);
    });

    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Set column widths
    ws['!cols'] = [
        { wch: 5 },   // No
        { wch: 25 },  // Nama
        { wch: 30 },  // Email
        { wch: 12 },  // Jumlah Tamu
        { wch: 15 },  // Kehadiran
        { wch: 40 },  // Ucapan
        { wch: 20 }   // Tanggal
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Daftar Hadir');
    return wb;
}

function downloadExcel() {
    const wb = generateExcel();
    if (!wb) return;
    XLSX.writeFile(wb, 'Daftar_Hadir_undangan.xlsx');
    showToast('File Excel berhasil didownload!');
}

// ============ H-1 AUTO SEND EMAIL ============
function checkH1AndSend() {
    const weddingDate = new Date('2026-08-02T18:30:00+07:00');
    const now = new Date();
    const diffDays = Math.ceil((weddingDate - now) / (1000 * 60 * 60 * 24));

    const lastSent = localStorage.getItem('h1EmailSent');
    const today = now.toISOString().slice(0, 10);

    if (diffDays <= 1 && diffDays >= 0 && lastSent !== today) {
        const data = getRSVPData();
        if (data.length === 0) return;

        let bodyText = 'Daftar Konfirmasi Kehadiran:\n\n';
        data.forEach(item => {
            bodyText += `${item.no}. ${item.nama} | ${item.email} | Tamu: ${item.jumlahTamu} | ${item.kehadiran} | ${item.ucapan}\n`;
        });

        const hadirCount = data.filter(d => d.kehadiran === 'Hadir').length;
        const tidakCount = data.filter(d => d.kehadiran === 'Tidak Hadir').length;
        const belumCount = data.filter(d => d.kehadiran === 'Belum Pasti').length;
        const totalTamu = data.reduce((sum, d) => sum + d.jumlahTamu, 0);

        bodyText += `\nRingkasan:\nTotal Konfirmasi: ${data.length}\nHadir: ${hadirCount}\nTidak Hadir: ${tidakCount}\nBelum Pasti: ${belumCount}\nTotal Tamu: ${totalTamu}`;

        const templateParams = {
            from_name: 'Sistem Undangan',
            from_email: 'system@wedding.com',
            guest_count: String(data.length),
            attendance: `Ringkasan: ${hadirCount} Hadir, ${tidakCount} Tidak Hadir, ${belumCount} Belum Pasti. Total Tamu: ${totalTamu}`,
            message: bodyText,
            to_email: EMAIL_RECEIVER
        };

        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
            .then(() => {
                localStorage.setItem('h1EmailSent', today);
                console.log('H-1 email terkirim!');
            })
            .catch(err => console.error('H-1 email error:', err));
    }
}

checkH1AndSend();

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
