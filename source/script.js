document
    .getElementById("chat-form")
    ?.addEventListener("submit", function (event) {
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

// Signup Form Submission
document
    .getElementById("signup-form")
    ?.addEventListener("submit", function (event) {
        event.preventDefault();
        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const confirmPassword =
            document.getElementById("confirm-password").value;

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        // Simulate signup (replace with actual API call)
        console.log("Signing up with:", { username, email, password });
        alert("Signup successful! Redirecting to signin page...");
        window.location.href = "/auth/signin";
    });

// Signin Form Submission
document
    .getElementById("signin-form")
    ?.addEventListener("submit", function (event) {
        event.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        // Simulate signin (replace with actual API call)
        console.log("Signing in with:", { email, password });
        alert("Signin successful! Redirecting to chat page...");
        window.location.href = "/"; // Redirect to chat page
    });
