async function getResultAndProcess({ path, body }) {
    try {
        const result = await fetch(path, {
            method: "POST",
            headers: {
                "Content-Type": "application/json", // Set the content type to JSON
            },
            body: JSON.stringify(body), // Stringify the body
        });
        console.log("result => ", result);

        if (result.ok) {
            const data = await result.json(); // Parse the JSON response
            console.log("Server response:", data);
            alert(
                `successful! message: ${data.message} message: ${data.message}... and Redirecting to page: ${data.redirect}`
            );
            if (data.redirect) window.location.href = data.redirect; // Redirect to the exact page
        } else {
            const errorData = await result.json();
            console.error("Server error:", errorData);
            alert("message: " + (errorData.message || "Unknown error"));
            if (errorData.redirect) window.location.href = errorData.redirect; // Redirect to the exact page
        }
    } catch (error) {
        console.log("error => ", error);
        console.error("Fetch error:", error);
        alert(`An error occurred while requesting to: ${path}`);
    }
}

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
    ?.addEventListener("submit", async function (event) {
        event.preventDefault();
        // const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        // const password = document.getElementById("password").value;
        // const confirmPassword =
        //     document.getElementById("confirm-password").value;

        // if (password !== confirmPassword) {
        //     alert("Passwords do not match!");
        //     return;
        // }

        console.log("Signing up with:", { email });
        getResultAndProcess({ path: "/auth/signup", body: { email } });
    });

// Signin Form Submission
document
    .getElementById("signin-form")
    ?.addEventListener("submit", async function (event) {
        event.preventDefault();
        const email = document.getElementById("email").value;

        console.log("Signing in with:", { email });
        getResultAndProcess({ path: "/auth/signin", body: { email } });
    });

// verify-otp Form Submission
document
    .getElementById("otp-code-form")
    ?.addEventListener("submit", async function (event) {
        event.preventDefault();
        const code = document.getElementById("auth-code").value;

        console.log("verify-otp with:", { code });
        getResultAndProcess({ path: "/auth/verify-otp", body: { code } });
    });

// create-account Form Submission
document
    .getElementById("create-account-form")
    ?.addEventListener("submit", async function (event) {
        event.preventDefault();

        const firstName = document.getElementById("firstname").value;
        const lastName = document.getElementById("lastname").value;
        const bio = document.getElementById("bio").value;

        if (!firstName) {
            alert("First name is required");
            return;
        }

        getResultAndProcess({
            path: "/user/create-account",
            body: {
                firstName,
                lastName: lastName,
                bio: bio,
            },
        });
    });
