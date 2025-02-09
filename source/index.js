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

function getGroups() {
    socket.emit("group-list", "");

    socket.on("groups", (groups) => {
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
        }
    });
}

function getNewMessage() {
    socket.on("new-message", (message) => {
        console.log(message);
        _getMessage(message);
    });
}

function _getMessage(message) {
    const messageElement = document.createElement("div");
    messageElement.classList.add(
        "message",
        message.sender === "You" ? "sent" : "received"
    );
    messageElement.innerHTML =
        "<strong>" + message.sender + ":</strong> " + message.content;

    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
// ==========================================

getGroups();
getGroupMessages();
sendMessageToGroup();
getNewMessage();

// Handle search functionality
document.getElementById("search-rooms").addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase();
    const roomItems = document.querySelectorAll("#room-list li");

    roomItems.forEach((item) => {
        const roomName = item.textContent.toLowerCase();
        item.style.display = roomName.includes(searchTerm) ? "block" : "none";
    });
});
