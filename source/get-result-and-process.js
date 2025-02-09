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
                `successful! message: ${data.message}... and Redirecting to page: ${data.redirect}`
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
