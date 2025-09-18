window.clipboardCopy = {
    copyText: function (text) {
        navigator.clipboard.writeText(text).then(function () {
            // Éxito al copiar
        })
            .catch(function (error) {
                console.error('Error al copiar el texto: ', error);
            });
    }
};