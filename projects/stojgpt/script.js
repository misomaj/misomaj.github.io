const chatMessages = document.getElementById("chatMessages");
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");

function addMessage(text, sender) {
  const message = document.createElement("div");
  message.classList.add("message", sender);

  const bubble = document.createElement("div");
  bubble.classList.add("bubble");
  bubble.textContent = text;

  message.appendChild(bubble);
  chatMessages.appendChild(message);

  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function fakeAIResponse(userText) {
  const responses = [
    "Interesting...",
    "Tell me more!",
    "k.. if u say so",
    "Mmm idk about that one chief",
    "Israel is collecting your data for larger than life purposes.",
    "I'm  tired of chit chatting come slide over to my crib rn 😈",
    "Good boy!",
    "Explain why tho"
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}

function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;

  addMessage(text, "user");
  chatInput.value = "";

  setTimeout(() => {
    addMessage(fakeAIResponse(text), "bot");
  }, 600);
}

sendBtn.addEventListener("click", sendMessage);

chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});
sendBtn.disabled = true;

chatInput.addEventListener("input", () => {
  sendBtn.disabled = !chatInput.value.trim();
});

function showTyping() {
  addMessage("Typing...", "bot");
}

