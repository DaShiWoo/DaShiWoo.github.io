// 1. Language Switching Logic
const langToggle = document.getElementById('lang-toggle');
const body = document.body;

// Load saved language or default to Ukrainian
const savedLang = localStorage.getItem('lang') || 'uk';
body.className = `lang-${savedLang}`;

langToggle.addEventListener('click', () => {
    const isUk = body.classList.contains('lang-uk');
    const newLang = isUk ? 'en' : 'uk';
    body.className = `lang-${newLang}`;
    localStorage.setItem('lang', newLang);
});

// 2. Hero Screenshot Carousel
const screenshots = document.querySelectorAll('.gallery-img');
const dots = document.querySelectorAll('.gallery-dots .dot');
let currentSlide = 0;
let slideInterval;

function showSlide(index) {
    screenshots.forEach(img => img.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    screenshots[index].classList.add('active');
    dots[index].classList.add('active');
    currentSlide = index;
}

function nextSlide() {
    let next = (currentSlide + 1) % screenshots.length;
    showSlide(next);
}

function startCarousel() {
    slideInterval = setInterval(nextSlide, 4000);
}

function stopCarousel() {
    clearInterval(slideInterval);
}

dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
        stopCarousel();
        const index = parseInt(e.target.getAttribute('data-index'));
        showSlide(index);
        startCarousel();
    });
});

startCarousel();

// 3. Web Audio API Melody Synthesizer & Interactive Demo Game
let audioCtx = null;
let activeOscillators = [];
let melodyTimeout = null;

// Song databases
const demoSongs = [
    {
        // Carol of the Bells (Shchedryk)
        options: {
            en: ["Carol of the Bells (Shchedryk)", "Yesterday", "In The End", "Sweet Child O' Mine"],
            uk: ["Щедрик (Carol of the Bells)", "Yesterday", "In The End", "Sweet Child O' Mine"]
        },
        correctIdx: 0,
        // Pitch (Hz) and Duration (ms) pairs
        notes: [
            [466.16, 250], [440.00, 250], [466.16, 250], [392.00, 250], // Bb4, A4, Bb4, G4
            [466.16, 250], [440.00, 250], [466.16, 250], [392.00, 250],
            [466.16, 250], [440.00, 250], [466.16, 250], [392.00, 250],
            [466.16, 250], [440.00, 250], [466.16, 250], [392.00, 250]
        ]
    },
    {
        // Smoke on the Water
        options: {
            en: ["Hotel California", "Smoke on the Water", "Zombie", "Back in Black"],
            uk: ["Hotel California", "Smoke on the Water", "Zombie", "Back in Black"]
        },
        correctIdx: 1,
        notes: [
            [196.00, 400], [233.08, 400], [261.63, 600], [0, 100],
            [196.00, 400], [233.08, 400], [277.18, 250], [261.63, 600], [0, 100],
            [196.00, 400], [233.08, 400], [261.63, 600],
            [233.08, 400], [196.00, 800]
        ]
    },
    {
        // Smells Like Teen Spirit
        options: {
            en: ["Enter Sandman", "Numb", "Smells Like Teen Spirit", "Highway to Hell"],
            uk: ["Enter Sandman", "Numb", "Smells Like Teen Spirit", "Highway to Hell"]
        },
        correctIdx: 2,
        notes: [
            [130.81, 200], [130.81, 200], [0, 50], [130.81, 200],
            [174.61, 200], [174.61, 200], [0, 50], [174.61, 200],
            [155.56, 200], [155.56, 200], [0, 50], [155.56, 200],
            [207.65, 200], [207.65, 200], [0, 50], [207.65, 200]
        ]
    }
];

let currentRound = 0;
let score = 0;
let gameTimer = null;
let timerWidth = 100;
let isAnswered = false;

const startView = document.getElementById('demo-start-view');
const gameView = document.getElementById('demo-game-view');
const endView = document.getElementById('demo-end-view');
const btnStartDemo = document.getElementById('btn-start-demo');
const btnRestartDemo = document.getElementById('btn-restart-demo');
const optionButtons = document.querySelectorAll('.btn-option');
const scoreLabel = document.getElementById('demo-score');
const scoreLabelUk = document.getElementById('demo-score-uk');
const timerProgress = document.getElementById('demo-timer-progress');
const finalScoreVal = document.getElementById('final-score-val');
const finalScoreValUk = document.getElementById('final-score-val-uk');

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

function playNote(frequency, duration) {
    if (frequency === 0 || !audioCtx) return;
    
    try {
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
        
        gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + (duration / 1000) - 0.02);
        
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        osc.start();
        osc.stop(audioCtx.currentTime + (duration / 1000));
        
        activeOscillators.push(osc);
    } catch (e) {
        console.error(e);
    }
}

function stopPlayback() {
    clearTimeout(melodyTimeout);
    activeOscillators.forEach(osc => {
        try { osc.stop(); } catch(e) {}
    });
    activeOscillators = [];
}

function playSongSequence(song, noteIndex = 0) {
    if (isAnswered) return;
    const sequence = song.notes;
    if (noteIndex >= sequence.length) {
        noteIndex = 0; // Loop melody
    }
    
    const [freq, dur] = sequence[noteIndex];
    playNote(freq, dur);
    
    melodyTimeout = setTimeout(() => {
        playSongSequence(song, noteIndex + 1);
    }, dur);
}

function playFeedBackSound(isCorrect) {
    if (!audioCtx) return;
    try {
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.type = 'sine';
        
        if (isCorrect) {
            osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
            osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1); // E5
            gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
            gainNode.gain.stop(audioCtx.currentTime + 0.25);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.25);
        } else {
            osc.frequency.setValueAtTime(150, audioCtx.currentTime);
            osc.frequency.linearRampToValueAtTime(80, audioCtx.currentTime + 0.3);
            gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.3);
        }
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
    } catch(e) {}
}

function startTimer() {
    clearInterval(gameTimer);
    timerWidth = 100;
    timerProgress.style.width = '100%';
    
    const step = 1; // tick speed
    gameTimer = setInterval(() => {
        timerWidth -= 1;
        timerProgress.style.width = `${timerWidth}%`;
        
        if (timerWidth <= 0) {
            clearInterval(gameTimer);
            handleAnswer(-1); // Timeout
        }
    }, 100); // 100 * 100 = 10 seconds round time
}

function loadRound(roundIdx) {
    isAnswered = false;
    currentRound = roundIdx;
    
    if (roundIdx >= demoSongs.length) {
        endGame();
        return;
    }
    
    const currentLang = body.classList.contains('lang-uk') ? 'uk' : 'en';
    const song = demoSongs[roundIdx];
    
    optionButtons.forEach((btn, idx) => {
        btn.textContent = song.options[currentLang][idx];
        btn.className = 'btn-option';
        btn.disabled = false;
    });
    
    initAudio();
    playSongSequence(song);
    startTimer();
}

function handleAnswer(selectedIdx) {
    if (isAnswered) return;
    isAnswered = true;
    clearInterval(gameTimer);
    stopPlayback();
    
    const song = demoSongs[currentRound];
    const correctIdx = song.correctIdx;
    
    optionButtons.forEach((btn, idx) => {
        btn.disabled = true;
        if (idx === correctIdx) {
            btn.classList.add('correct');
        } else if (idx === selectedIdx) {
            btn.classList.add('incorrect');
        }
    });
    
    const isCorrect = (selectedIdx === correctIdx);
    if (isCorrect) {
        score++;
        scoreLabel.textContent = score;
        scoreLabelUk.textContent = score;
    }
    
    playFeedBackSound(isCorrect);
    
    // Auto load next round after 2 seconds
    setTimeout(() => {
        loadRound(currentRound + 1);
    }, 2000);
}

function startGame() {
    score = 0;
    scoreLabel.textContent = score;
    scoreLabelUk.textContent = score;
    
    startView.classList.remove('active');
    endView.classList.remove('active');
    gameView.classList.add('active');
    
    loadRound(0);
}

function endGame() {
    stopPlayback();
    clearInterval(gameTimer);
    
    gameView.classList.remove('active');
    endView.classList.add('active');
    
    finalScoreVal.textContent = score;
    finalScoreValUk.textContent = score;
}

btnStartDemo.addEventListener('click', () => {
    initAudio();
    startGame();
});

btnRestartDemo.addEventListener('click', () => {
    startGame();
});

optionButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const idx = parseInt(e.target.getAttribute('data-idx'));
        handleAnswer(idx);
    });
});

// 4. Metadata JSON Generator Builder
const metaForm = document.getElementById('meta-form');
const btnAddSong = document.getElementById('btn-add-song');
const songsContainer = document.getElementById('songs-container');
const jsonOutput = document.getElementById('json-output');
const btnCopyJson = document.getElementById('btn-copy-json');

btnAddSong.addEventListener('click', () => {
    const row = document.createElement('div');
    row.className = 'song-row';
    row.innerHTML = `
        <input type="text" placeholder="Title / Назва" class="song-title" required>
        <input type="text" placeholder="Artist / Виконавець" class="song-artist" required>
        <input type="text" placeholder="File / Файл" class="song-file" required>
    `;
    songsContainer.appendChild(row);
});

metaForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const packName = document.getElementById('pack-name').value;
    const author = document.getElementById('pack-author').value;
    const difficulty = document.getElementById('pack-difficulty').value;
    const version = parseInt(document.getElementById('pack-ver').value);
    
    const songRows = document.querySelectorAll('.song-row');
    const songs = [];
    
    songRows.forEach(row => {
        const title = row.querySelector('.song-title').value;
        const artist = row.querySelector('.song-artist').value;
        const file = row.querySelector('.song-file').value;
        songs.push({
            title: title,
            artist: artist,
            file: file
        });
    });
    
    const metadata = {
        name: packName,
        author: author,
        difficulty: difficulty,
        version: version,
        songs: songs
    };
    
    jsonOutput.textContent = JSON.stringify(metadata, null, 4);
});

btnCopyJson.addEventListener('click', () => {
    const text = jsonOutput.textContent;
    if (!text || text.startsWith('/*')) return;
    
    navigator.clipboard.writeText(text).then(() => {
        const originalText = btnCopyJson.textContent;
        btnCopyJson.textContent = body.classList.contains('lang-uk') ? 'Скопійовано!' : 'Copied!';
        btnCopyJson.style.background = 'var(--neon-green)';
        btnCopyJson.style.color = '#000';
        
        setTimeout(() => {
            btnCopyJson.textContent = originalText;
            btnCopyJson.style.background = '';
            btnCopyJson.style.color = '';
        }, 2000);
    });
});
