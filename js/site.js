window.toggleDarkMode = function (isDark) {
    if (isDark) {
        document.body.classList.add("dark-mode");
        localStorage.setItem("theme", "dark");
    } else {
        document.body.classList.remove("dark-mode");
        localStorage.setItem("theme", "light");
    }
};

// Al cargar, aplicar el tema guardado
window.applySavedTheme = function () {
    let theme = localStorage.getItem("theme");
    let isDark;

    if (theme) {
        isDark = theme === "dark";
    } else {
        // Si no hay tema guardado, usar la preferencia del sistema
        isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    if (isDark) {
        document.body.classList.add("dark-mode");
    } else {
        document.body.classList.remove("dark-mode");
    }

    return isDark;
};
