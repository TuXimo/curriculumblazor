window.toggleDarkMode = function (isDark) {
    const root = document.documentElement; // <html>
    if (isDark) {
        root.classList.add("dark-mode");
        localStorage.setItem("theme", "dark");
    } else {
        root.classList.remove("dark-mode");
        localStorage.setItem("theme", "light");
    }
};


// Al cargar, aplicar el tema guardado
window.applySavedTheme = function () {
    const root = document.documentElement;
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        root.classList.add("dark-mode");
        return true;
    }
    return false;
};

