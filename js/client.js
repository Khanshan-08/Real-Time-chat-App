console.log("Client connected");
const socket = io("http://192.168.0.28:8000");

const form = document.getElementById("send-container");
const messageInput = document.getElementById("messageInp");
const messageContainer = document.querySelector(".container");

// Create the audio object for the notification sound
var audio = new Audio("../ping.mp3");

// Function to append messages to the chat container
const append = (message, position) => {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageElement.classList.add("message");
  messageElement.classList.add(position);
  messageContainer.append(messageElement);

  // Play sound when a message is received from someone else (after user interaction)
  if (position === "message-left") {
    audio.play().catch((e) => {
      console.log("Audio play failed:", e);
    });
  }
};

// Handle form submission (sending messages)
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  append(`You: ${message}`, "message-right");
  socket.emit("send", message);
  messageInput.value = "";
});

// Ask for user's name to join the chat
const name = prompt("Enter your name to join:");
socket.emit("new-user-joined", name);

// Notify when a new user joins the chat
socket.on("user-joined", (name) => {
  append(`${name}: joined the chat`, "message-left");
});

// Play sound and append message when a message is received from someone else
socket.on("receive", (data) => {
  append(`${data.name}: ${data.message}`, "message-left");
});

// Handle when someone leaves the chat
socket.on("left", (name) => {
  append(`${name}: left the chat`, "message-left");
});

// Event listener to enable audio play after the first user interaction
document.addEventListener(
  "click",
  () => {
    // Once the user clicks anywhere, the audio will be allowed to play
    audio.play().catch((e) => {
      console.log("Audio will be allowed after interaction", e);
    });
  },
  { once: true }
); // This listener will be triggered only once
