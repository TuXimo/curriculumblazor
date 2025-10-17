// Objeto para almacenar las instancias de las animaciones y los intervalos
let activeAnimations = {
    tsParticlesInstance: null,
    animeInstances: [],
    intervals: [],
    profileImageTilt: { handler: null, element: null } // Para el nuevo efecto
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

    // Limpiar el efecto de la imagen de perfil
    disposeProfileImageTilt();
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

    const allRandomWords = ["xd", "jamon", "wach0s", "abc", "max", "zzz"];
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
                onclick: { enable: true, mode: "push" },
            },
            modes: {
                repulse: {
                    distance: 120, // Distancia a la que reaccionan las partículas (antes 200 por defecto)
                    speed: 0.5,    // Velocidad de la repulsión (antes 1 por defecto)
                },
            }
        },
        detectRetina: true,
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

// --- Efecto de inclinación (tilt) para la imagen de perfil ---

function handleProfileImageMove(e) {
    const img = e.currentTarget;
    const { left, top, width, height } = img.getBoundingClientRect();

    // Coordenadas del mouse relativas al centro de la imagen
    const x = e.clientX - left - width / 2;
    const y = e.clientY - top - height / 2;

    // Factor de rotación (ajústalo para más o menos efecto)
    const factor = 0.05;

    // Calcular la rotación en los ejes X e Y
    // La rotación en Y depende de la posición X del mouse y viceversa
    const rotateY = x * factor;
    const rotateX = -y * factor;

    // Aplicar la transformación
    img.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
}

function handleProfileImageLeave(e) {
    // Resetear la transformación cuando el mouse sale
    e.currentTarget.style.transform = 'rotateX(0deg) rotateY(0deg)';
}

export function initializeProfileImageTilt() {
    const img = document.querySelector('.profile-image');
    if (img) {
        activeAnimations.profileImageTilt.element = img;
        
        // Guardamos las referencias a las funciones para poder removerlas después
        const moveHandler = (e) => handleProfileImageMove(e);
        const leaveHandler = (e) => handleProfileImageLeave(e);

        activeAnimations.profileImageTilt.handlers = { moveHandler, leaveHandler };

        img.addEventListener('mousemove', moveHandler);
        img.addEventListener('mouseleave', leaveHandler);
    }
}

export function disposeProfileImageTilt() {
    const { element, handlers } = activeAnimations.profileImageTilt;
    if (element && handlers) {
        element.removeEventListener('mousemove', handlers.moveHandler);
        element.removeEventListener('mouseleave', handlers.leaveHandler);
    }
}
