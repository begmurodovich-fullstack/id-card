// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
    sensitivity: 0.5,
    resetEasing: 0.08,
    particles: {
        count: 30,
        minSize: 1,
        maxSize: 3
    }
};

// ============================================
// DOM Elements
// ============================================
const cardContainer = document.getElementById('cardContainer');
const card = document.getElementById('card');
const flipBtn = document.getElementById('flipBtn');
const resetBtn = document.getElementById('resetBtn');
const particlesContainer = document.getElementById('particles');

// ============================================
// State
// ============================================
let state = {
    isDragging: false,
    isFlipped: false,
    targetX: 0,
    targetY: 0,
    velocityX: 0,
    velocityY: 0,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0
};

// ============================================
// Initialize Particles
// ============================================
function createParticles() {
    for (let i = 0; i < CONFIG.particles.count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particle.style.animationDelay = (Math.random() * 10) + 's';
        particle.style.width = (Math.random() * (CONFIG.particles.maxSize - CONFIG.particles.minSize) + CONFIG.particles.minSize) + 'px';
        particle.style.height = particle.style.width;
        particle.style.opacity = Math.random() * 0.4 + 0.1;
        particlesContainer.appendChild(particle);
    }
}

// ============================================
// Rotation Logic
// ============================================
function updateRotation() {
    if (!state.isDragging) {
        state.targetX -= state.velocityY;
        state.targetY += state.velocityX;
        state.velocityX *= 0.95;
        state.velocityY *= 0.95;
        
        if (Math.abs(state.velocityX) < 0.01) state.velocityX = 0;
        if (Math.abs(state.velocityY) < 0.01) state.velocityY = 0;
    }
    
    card.style.transform = `rotateX(${state.targetX}deg) rotateY(${state.targetY}deg)${state.isFlipped ? ' rotateY(180deg)' : ''}`;
    requestAnimationFrame(updateRotation);
}

// ============================================
// Event Handlers
// ============================================
function handleDragStart(e) {
    state.isDragging = true;
    cardContainer.classList.add('dragging');
    
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
    
    state.startX = clientX;
    state.startY = clientY;
    state.lastX = clientX;
    state.lastY = clientY;
    state.velocityX = 0;
    state.velocityY = 0;
}

function handleDragMove(e) {
    if (!state.isDragging) return;

    e.preventDefault();

    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

    const deltaX = (clientX - state.startX) * CONFIG.sensitivity;
    const deltaY = (clientY - state.startY) * CONFIG.sensitivity;

    state.velocityX = (clientX - state.lastX) * CONFIG.sensitivity;
    state.velocityY = (clientY - state.lastY) * CONFIG.sensitivity;

    state.targetY += deltaX;
    state.targetX -= deltaY;

    state.startX = clientX;
    state.startY = clientY;
    state.lastX = clientX;
    state.lastY = clientY;
}

function handleDragEnd() {
    state.isDragging = false;
    cardContainer.classList.remove('dragging');
}

// ============================================
// Flip & Reset
// ============================================
function flipCard() {
    state.isFlipped = !state.isFlipped;
    card.classList.toggle('flipped', state.isFlipped);
}

function resetCard() {
    state.targetX = 0;
    state.targetY = 0;
    state.velocityX = 0;
    state.velocityY = 0;
    
    if (state.isFlipped) {
        state.isFlipped = false;
        card.classList.remove('flipped');
    }
}

// ============================================
// Event Listeners
// ============================================

// Mouse events
cardContainer.addEventListener('mousedown', handleDragStart);
document.addEventListener('mousemove', handleDragMove);
document.addEventListener('mouseup', handleDragEnd);

// Touch events
cardContainer.addEventListener('touchstart', handleDragStart, { passive: true });
document.addEventListener('touchmove', handleDragMove, { passive: false });
document.addEventListener('touchend', handleDragEnd);

// Button events
flipBtn.addEventListener('click', flipCard);
resetBtn.addEventListener('click', resetCard);

// Prevent context menu on long press (mobile)
cardContainer.addEventListener('contextmenu', e => e.preventDefault());

// ============================================
// Initialize
// ============================================
createParticles();
requestAnimationFrame(updateRotation);
