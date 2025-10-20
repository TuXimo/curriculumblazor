// --- Animaciones activas ---
let activeAnimations = {
    tsParticlesInstance: null,
    animeInstances: [],
    intervals: [],
    profileImageTilt: { handler: null, element: null }
};

// --- Limpieza completa ---
export function destroyCodeParticles() {
    if (activeAnimations.tsParticlesInstance) {
        activeAnimations.tsParticlesInstance.destroy();
        activeAnimations.tsParticlesInstance = null;
    }

    activeAnimations.animeInstances.forEach(anime.remove);
    activeAnimations.animeInstances = [];

    activeAnimations.intervals.forEach(clearInterval);
    activeAnimations.intervals = [];

    disposeProfileImageTilt();

    const particlesContainer = document.getElementById("particles-container");
    const codeTextContainer = document.getElementById("code-text-container");
    if (particlesContainer) particlesContainer.innerHTML = '';
    if (codeTextContainer) codeTextContainer.innerHTML = '';
}

// --- Crear animaciones ---
export async function createCodeParticles() {
    destroyCodeParticles();

    const particlesContainer = document.getElementById("particles-container");
    const codeTextContainer = document.getElementById("code-text-container");
    if (!particlesContainer || !codeTextContainer) return;

    // Fade-in inicial
    particlesContainer.style.opacity = 0;
    codeTextContainer.style.opacity = 0;
    particlesContainer.style.transition = "opacity 1.2s ease";
    codeTextContainer.style.transition = "opacity 1.5s ease";

    const isDarkMode = document.body.classList.contains("dark-mode");
    const colorVar = isDarkMode
        ? "--bootstrap-primary-button-dark-background"
        : "--bootstrap-primary-button-background";
    const particleColor = getComputedStyle(document.documentElement).getPropertyValue(colorVar).trim();

    // Reducir cantidad de partículas en pantallas pequeñas
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 40 : 80;

    // --- tsParticles ---
    activeAnimations.tsParticlesInstance = await tsParticles.load("particles-container", {
        particles: {
            number: { value: particleCount },
            color: { value: particleColor },
            shape: { type: "circle" },
            opacity: { value: 0.4, random: true },
            size: { value: 3, random: true },
            move: { enable: true, speed: 1.8, outModes: { default: "out" } },
            links: { enable: true, distance: 120, color: particleColor, opacity: 0.2, width: 1 }
        },
        interactivity: {
            events: {
                onhover: { enable: true, mode: "repulse" },
                onclick: { enable: true, mode: "push" },
            },
            modes: {
                repulse: { distance: 100, speed: 0.6 }
            }
        },
        detectRetina: true
    });

    // --- Letras flotantes ---
    const allRandomWords = ["xd", "jamon", "wach0s", "abc", "max", "zzz"];
    const maxLength = 5;
    const randomWords = allRandomWords.filter(word => word.length <= maxLength);
    const totalLetters = isMobile ? 20 : 40;

    for (let i = 0; i < totalLetters; i++) {
        const span = document.createElement("span");
        span.textContent = Math.random().toString(36).substring(2, 3);
        span.style.position = "absolute";
        span.style.left = Math.random() * 100 + "%";
        span.style.top = Math.random() * 100 + "%";
        span.style.color = particleColor;
        span.style.fontFamily = "monospace";
        span.style.fontSize = (14 + Math.random() * 20) + "px";
        span.style.userSelect = "none";
        codeTextContainer.appendChild(span);

        const anim = anime({
            targets: span,
            translateY: [-100, 1000],
            duration: 7000 + Math.random() * 4000,
            loop: true,
            easing: "linear"
        });
        activeAnimations.animeInstances.push(anim);

        // Animación de cambio de texto (más eficiente)
        const intervalDuration = 8000 + Math.random() * 4000; // 8–12 s
        const intervalId = setInterval(() => {
            // 10 % de probabilidad de cambiar el texto en cada ciclo
            if (Math.random() < 0.1) {
                span.textContent = randomWords[Math.floor(Math.random() * randomWords.length)];
            } else {
                // letra aleatoria (como antes)
                span.textContent = Math.random().toString(36).substring(2, 3);
            }
        }, intervalDuration);
        activeAnimations.intervals.push(intervalId);

    }

    // Activar fade-in luego de cargar todo
    requestAnimationFrame(() => {
        particlesContainer.style.opacity = 1;
        codeTextContainer.style.opacity = 1;
    });
}

// --- Efecto Tilt (solo PC) ---
function handleProfileImageMove(e) {
    const img = e.currentTarget;
    const { left, top, width, height } = img.getBoundingClientRect();
    const x = e.clientX - left - width / 2;
    const y = e.clientY - top - height / 2;
    const factor = 0.05;
    const rotateY = x * factor;
    const rotateX = -y * factor;
    img.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
}

function handleProfileImageLeave(e) {
    const img = e.currentTarget;
    img.style.transition = "transform 0.4s ease";
    img.style.transform = "rotateX(0deg) rotateY(0deg)";
    setTimeout(() => (img.style.transition = ""), 400);
}

export function initializeProfileImageTilt() {
    if (window.innerWidth < 768) return; // 🔸 Evita tilt en móviles
    const img = document.querySelector(".profile-image");
    if (img) {
        activeAnimations.profileImageTilt.element = img;
        const moveHandler = (e) => handleProfileImageMove(e);
        const leaveHandler = (e) => handleProfileImageLeave(e);
        activeAnimations.profileImageTilt.handlers = { moveHandler, leaveHandler };
        img.addEventListener("mousemove", moveHandler);
        img.addEventListener("mouseleave", leaveHandler);
    }
}

export function disposeProfileImageTilt() {
    const { element, handlers } = activeAnimations.profileImageTilt;
    if (element && handlers) {
        element.removeEventListener("mousemove", handlers.moveHandler);
        element.removeEventListener("mouseleave", handlers.leaveHandler);
    }
}
