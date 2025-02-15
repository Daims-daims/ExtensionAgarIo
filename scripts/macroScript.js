let spamInterval;

document.addEventListener("keydown", function(event) {
    if (event.key.toLowerCase() === "c" && !spamInterval) {
        spamInterval = setInterval(() => {
            // Crée un événement "keydown" normal
            const keydownEvent = new KeyboardEvent("keydown", {
                key: "w",
                code: "KeyW",
                bubbles: true,
                cancelable: true
            });
            
            // On simule un appui sur "w"
            document.dispatchEvent(keydownEvent);
        }, 100); // Spam toutes les 100ms
    }
});

document.addEventListener("keyup", function(event) {
    if (event.key.toLowerCase() === "c") {
        clearInterval(spamInterval);
        spamInterval = null;

        // Simuler la levée de la touche "w"
        const keyupEvent = new KeyboardEvent("keyup", {
            key: "w",
            code: "KeyW",
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(keyupEvent);
    }
});
