const socketToken = document.cookie.split("=")[1];
console.log(socketToken);

const socket = io("", {
    auth: {
        token: socketToken,
    },
});

const chatWindow = document.getElementById("chat-window");
const sendBox = document.getElementById("send-box");
const roomList = document.getElementById("room-list");
const chatForm = document.getElementById("chat-form");
const messagesContainer = document.getElementById("messages");
const userDetail = document.getElementById("user-detail");

function _user() {
    const userComponent = userDetail.getAttribute("user");
    const user = JSON.parse(userComponent);
    return user;
}

function getUserDetail() {
    socket.on("user-detail", (user) => {
        console.log("user =>", user);
        userDetail.setAttribute("user", JSON.stringify(user));
    });
}

function getGroups() {
    socket.emit("group-list", "");

    socket.on("groups", (groups) => {
        roomList.innerHTML = "";
        groups.forEach((group) => {
            const groupElement = document.createElement("li");

            groupElement.classList.add("list-group-item");
            groupElement.setAttribute("data-room", group._id);

            groupElement.addEventListener("click", () => {
                sendBox.hidden = false;
                chatWindow.setAttribute("group-id", group._id);
                socket.emit("get-group-messages", group._id);
            });

            groupElement.innerText = group.name;
            roomList.appendChild(groupElement);
        });
    });
}

function getGroupMessages() {
    socket.on("group-messages", (messages) => {
        console.log(messages);
        messagesContainer.innerHTML = "";

        messages.forEach((message) => {
            _getMessage(message);
        });
    });
}

function sendMessageToGroup() {
    chatForm?.addEventListener("submit", function (event) {
        event.preventDefault();

        const input = document.getElementById("chat-input");
        const message = input.value.trim();

        if (message) {
            input.value = "";
            socket.emit("send-message-to-group", {
                groupId: chatWindow.getAttribute("group-id"),
                content: message,
            });
            const messageElement = document.createElement("div");
            messageElement.classList.add("message", "sent");
            const user = _user();
            messageElement.innerHTML =
                "<strong>" + user.firstName + ":</strong> " + message;

            messagesContainer.appendChild(messageElement);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    });
}

function getNewMessage() {
    socket.on("new-message", (message) => {
        console.log("new message", message);
        _getMessage(message);
    });
}

function _getMessage(message) {
    const messageElement = document.createElement("div");
    messageElement.classList.add(
        "message",
        message.isYou ? "sent" : "received"
    );
    messageElement.innerHTML =
        "<strong>" + message.sender.firstName + ":</strong> " + message.content;

    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function searchRooms() {
    // Handle search functionality
    const searchInput = document.getElementById("search-rooms");
    const searchResults = document.getElementById("search-results");

    searchInput.addEventListener("input", function () {
        const searchTerm = this.value.trim();

        if (searchTerm) {
            socket.emit("search-rooms", searchTerm); // Send search term to the server
        } else {
            searchResults.style.display = "none"; // Hide search results if the input is empty
        }
    });

    // Handle search results from the server
    socket.on("room-search-results", (results) => {
        console.log("new groups =>", results);
        if (results.length > 0) {
            // searchResults.innerHTML = results.map((room) => {
            searchResults.innerHTML = "";
            results
                .map((room) => {
                    const div = document.createElement("div");
                    div.classList.add(
                        "list-group-item",
                        "d-flex",
                        "justify-content-between",
                        "align-items-center"
                    );
                    div.innerText = room.name;

                    const btn = document.createElement("button");
                    btn.classList.add("btn", "btn-sm", "btn-primary");
                    btn.setAttribute("data-room", room._id);
                    btn.innerText = "Join";
                    div.appendChild(btn);

                    searchResults.appendChild(div);
                })
                .join("");
            searchResults.style.display = "block"; // Show search results

            // Add click event to join buttons
            searchResults.querySelectorAll("button").forEach((button) => {
                button.addEventListener("click", () => {
                    const roomId = button.getAttribute("data-room");
                    socket.emit("join-group", roomId); // Join the selected room
                    searchResults.style.display = "none"; // Hide search results after joining
                    searchInput.value = ""; // Clear the search input
                });
            });
        } else {
            searchResults.innerHTML =
                '<div class="list-group-item">No rooms found.</div>';
            searchResults.style.display = "block"; // Show "No rooms found" message
        }
    });
}
// ==========================================

socket.on("disconnect", (a, b) => {
    console.log("disconnect");
});

socket.on("connect", () => {
    socket.removeAllListeners();
    console.log("connected");
    getUserDetail();
    getGroups();
    getGroupMessages();
    sendMessageToGroup();
    getNewMessage();
    searchRooms();
});
