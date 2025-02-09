const socketToken = document.cookie.split("=")[1];
console.log(socketToken);

const socket = io("", {
    auth: {
        token: socketToken,
    },
});
const chatWIndow = document.getElementById("chat-window");
const sendBox = document.getElementById("send-box");

function getGroups() {
    socket.emit("group-list", "");

    socket.on("groups", (groups) => {
        const roomList = document.getElementById("room-list");

        groups.forEach((group) => {
            const groupElement = document.createElement("li");

            groupElement.classList.add("list-group-item");
            groupElement.setAttribute("data-room", group._id);

            groupElement.addEventListener("click", () => {
                sendBox.hidden = false;
                socket.emit("get-group-messages", group._id);
            });

            groupElement.innerText = group.name;
            roomList.appendChild(groupElement);
        });
    });
}
getGroups();

function getGroupMessages() {
    //     socket.on("group-messages", (messages) => {
    //         const chatWindow = document.getElementById("chat-window");
    //         chatWIndow.innerHTML = "";
    //         messages.forEach((element) => {
    //             const newMessage = document.createElement("div");
    //             newMessage.classList.add("message", "sent");
    //             newMessage.innerHTML = element.content;
    //             // if(element.sender)
    //             chatWindow.appendChild(newMessage);
    //             //    input.value = "";
    //             chatWindow.scrollTop = chatWindow.scrollHeight;
    //         });
    //     });
    // document
    //     .getElementById("chat-form")
    //     ?.addEventListener("submit", function (event) {
    //         event.preventDefault();
    //         const input = document.getElementById("chat-input");
    //         const message = input.value.trim();
    //         console.log("message: ", message);
    //         if (message) {
    //             const groupId = chatWIndow.getAttribute("group-id");
    //             socket.emit("create-group-message", { groupId, message });
    //         }
    //     });
    // Handle message submission
    // document
    //     .getElementById("chat-form")
    //     .addEventListener("submit", function (event) {
    //         event.preventDefault();
    //         const input = document.getElementById("chat-input");
    //         const message = input.value.trim();
    //         if (message) {
    //             socket.emit("send-message", message);
    //             input.value = "";
    //         }
    //     });
    // Handle incoming messages
    // socket.on("receive-message", (message) => {
    //     const messagesContainer = document.getElementById("messages");
    //     const messageElement = document.createElement("div");
    //     messageElement.classList.add("message", "received");
    //     messageElement.innerHTML =
    //         "<strong>" + message.sender + ":</strong> " + message.text;
    //     messagesContainer.appendChild(messageElement);
    //     messagesContainer.scrollTop = messagesContainer.scrollHeight;
    // });
}
getGroupMessages();

// Fetch and display group list
// socket.emit("group-list", "");
// socket.on("groups", (groups) => {
//     console.log(groups);
//     const roomList = document.getElementById("room-list");
//     roomList.innerHTML = groups
//         .map(
//             (group) =>
//                 '<li class="list-group-item" data-room="' +
//                 group._id +
//                 '">' +
//                 group.name +
//                 "</li>"
//         )
//         .join("");

//     // Add click event to group items
//     roomList.querySelectorAll("li").forEach((item) => {
//         item.addEventListener("click", () => {
//             const groupId = item.getAttribute("data-room");
//             console.log(groupId);
//             chatWIndow.setAttribute("group-id", groupId);
//             sendBox.hidden = false;
//             // socket.emit("join-room", groupId); // Join the selected group
//             socket.emit("get-group-messages", groupId);
//         });
//     });
// });

// socket.on("group-messages", (messages) => {
//     console.log(messages);
//     const chatWindow = document.getElementById("chat-window");
//     chatWIndow.innerHTML = "";

//     messages.forEach((element) => {
//         const newMessage = document.createElement("div");
//         newMessage.classList.add("message", "sent");
//         newMessage.innerHTML = element.content;
//         // if(element.sender)
//         chatWindow.appendChild(newMessage);
//         //    input.value = "";
//         chatWindow.scrollTop = chatWindow.scrollHeight;
//     });
// });
// document
//     .getElementById("chat-form")
//     ?.addEventListener("submit", function (event) {
//         event.preventDefault();
//         const input = document.getElementById("chat-input");
//         const message = input.value.trim();
//         console.log("message: ", message);
//         if (message) {
//             const groupId = chatWIndow.getAttribute("group-id");
//             socket.emit("create-group-message", { groupId, message });
//         }
//     });

// Fetch and display messages for a group
// socket.on("room-messages", (messages) => {
//     const messagesContainer = document.getElementById("messages");
//     messagesContainer.innerHTML = messages.map(msg =>
//         '<div class="message ' + (msg.sender === "You" ? "sent" : "received") + '">' +
//             '<strong>' + msg.sender + ':</strong> ' + msg.text +
//         '</div>'
//     ).join("");
//     messagesContainer.scrollTop = messagesContainer.scrollHeight;
// });

// // Handle message submission
// document
//     .getElementById("chat-form")
//     .addEventListener("submit", function (event) {
//         event.preventDefault();
//         const input = document.getElementById("chat-input");
//         const message = input.value.trim();

//         if (message) {
//             socket.emit("send-message", message);
//             input.value = "";
//         }
//     });

// // Handle incoming messages
// socket.on("receive-message", (message) => {
//     const messagesContainer = document.getElementById("messages");
//     const messageElement = document.createElement("div");
//     messageElement.classList.add("message", "received");
//     messageElement.innerHTML =
//         "<strong>" + message.sender + ":</strong> " + message.text;
//     messagesContainer.appendChild(messageElement);
//     messagesContainer.scrollTop = messagesContainer.scrollHeight;
// });

// Handle search functionality
document.getElementById("search-rooms").addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase();
    const roomItems = document.querySelectorAll("#room-list li");

    roomItems.forEach((item) => {
        const roomName = item.textContent.toLowerCase();
        item.style.display = roomName.includes(searchTerm) ? "block" : "none";
    });
});
