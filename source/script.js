document
    .getElementById("chat-form")
    .addEventListener("submit", function (event) {
        event.preventDefault();
        const input = document.getElementById("chat-input");
        const message = input.value.trim();
        if (message) {
            const chatWindow = document.getElementById("chat-window");
            const newMessage = document.createElement("div");
            newMessage.classList.add("message", "sent");
            newMessage.innerHTML = `<strong>You:</strong> ${message}`;
            chatWindow.appendChild(newMessage);
            input.value = "";
            chatWindow.scrollTop = chatWindow.scrollHeight;
        }
    });
