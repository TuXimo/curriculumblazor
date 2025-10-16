function handleScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    if (window.scrollY > 50) {
        navbar.classList.add('navbar-scrolled');
    } else {
        navbar.classList.remove('navbar-scrolled');
    }
}

// Exporta una función simple que solo añade el listener.
export function initializeNavbarScroll() {
    window.addEventListener('scroll', handleScroll);
}

// Exporta una función separada para limpiar el listener.
export function disposeNavbarScroll() {
    window.removeEventListener('scroll', handleScroll);
}
