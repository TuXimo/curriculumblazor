// Objeto para almacenar las instancias de las animaciones y los intervalos
let activeAnimations = {
    tsParticlesInstance: null,
    animeInstances: [],
    intervals: []
};

// Función para limpiar todas las animaciones y temporizadores activos
export function destroyCodeParticles() {
    // Detener y destruir la instancia de tsParticles
    if (activeAnimations.tsParticlesInstance) {
        activeAnimations.tsParticlesInstance.destroy();
        activeAnimations.tsParticlesInstance = null;
    }

    // Detener las animaciones de Anime.js
    activeAnimations.animeInstances.forEach(anime.remove);
    activeAnimations.animeInstances = [];

    // Limpiar todos los intervalos
    activeAnimations.intervals.forEach(clearInterval);
    activeAnimations.intervals = [];

    // Limpiar los contenedores HTML
    const particlesContainer = document.getElementById("particles-container");
    if (particlesContainer) particlesContainer.innerHTML = '';

    const codeTextContainer = document.getElementById('code-text-container');
    if (codeTextContainer) codeTextContainer.innerHTML = '';
}

// Función para crear las animaciones
export async function createCodeParticles() {
    // Limpiar animaciones previas antes de crear nuevas
    destroyCodeParticles();

    const isDarkMode = document.body.classList.contains('dark-mode');
    const colorVar = isDarkMode
        ? '--bootstrap-primary-button-dark-background'
        : '--bootstrap-primary-button-background';
    const particleColor = getComputedStyle(document.documentElement).getPropertyValue(colorVar).trim();

    const allRandomWords = ["xd", "jamon", "p0lent4", "wach0s", "arg", "Xdd", "zzz"];
    const maxLength = 5; // Límite máximo de caracteres para las palabras
    const randomWords = allRandomWords.filter(word => word.length <= maxLength);

    // --- tsParticles ---
    activeAnimations.tsParticlesInstance = await tsParticles.load("particles-container", {
        particles: {
            number: { value: 80 },
            color: { value: particleColor },
            shape: { type: "circle" },
            opacity: { value: 0.4, random: true },
            size: { value: 3, random: true },
            move: { enable: true, speed: 2, outModes: { default: "out" } },
            links: { enable: true, distance: 120, color: particleColor, opacity: 0.2, width: 1 }
        },
        interactivity: {
            events: {
                onhover: { enable: true, mode: "repulse" },
                onclick: { enable: true, mode: "push" }
            }
        }
    });

    // --- Anime.js: letras flotantes ---
    const container = document.getElementById('code-text-container');
    const totalLetters = 40;

    for (let i = 0; i < totalLetters; i++) {
        const span = document.createElement('span');
        span.textContent = Math.random().toString(36).substring(2, 3);
        span.style.position = 'absolute';
        span.style.left = Math.random() * 100 + '%';
        span.style.top = Math.random() * 100 + '%';
        span.style.color = particleColor;
        span.style.fontFamily = 'monospace';
        span.style.fontSize = (14 + Math.random() * 24) + 'px';
        span.style.userSelect = 'none';
        container.appendChild(span);

        const anim = anime({ targets: span, translateY: [-100, 1000], duration: 8000 + Math.random() * 5000, loop: true, easing: 'linear' });
        activeAnimations.animeInstances.push(anim);

        const intervalId = setInterval(() => {
            if (Math.random() < 0.02) {
                span.textContent = randomWords[Math.floor(Math.random() * randomWords.length)];
            }
        }, 8000 + Math.random() * 5000);
        activeAnimations.intervals.push(intervalId);
    }
}
