function handleScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    if (window.scrollY > 50) {
        navbar.classList.add('navbar-scrolled');
    } else {
        navbar.classList.remove('navbar-scrolled');
    }
}

function handleMenuAutoClose(event) {
    const navMenu = document.getElementById('navbarNav');
    if (!navMenu || !navMenu.classList.contains('show')) {
        return;
    }

    const isNavLinkClick = event.target.closest('.nav-link');
    const isClickInsideNavbar = event.target.closest('.navbar');

    if (isNavLinkClick || !isClickInsideNavbar) {
        const navbarToggler = document.querySelector('.navbar-toggler');
        if (navbarToggler) {
            navbarToggler.click();
        }
    }
}

export function initialize() {
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('click', handleMenuAutoClose);
    handleScroll(); // Run on startup

    // Return an object with a dispose method
    return {
        dispose: () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('click', handleMenuAutoClose);
        }
    };
}
