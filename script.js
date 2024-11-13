let sessionId = null;
let currentModel = "gemini-1.5-pro-002";
let isGroundingEnabled = false;

async function startNewChat() {
  const response = await fetch("http://localhost:3000/new-chat", { method: "POST" });
  const data = await response.json();
  sessionId = data.sessionId;
  document.getElementById("chatContainer").innerHTML = "";
}

function openHistory() {
  Swal.fire("기록 기능은 준비 중이예요.");
}

function changeModel() {
  currentModel = document.getElementById("modelSelect").value;
}

function toggleGrounding() {
  isGroundingEnabled = !isGroundingEnabled;
  document.getElementById("groundingToggle").textContent = `Grounding: ${isGroundingEnabled ? "ON" : "OFF"}`;
}

function handleKeyPress(event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
}

async function sendMessage() {
  const userMessage = document.getElementById("userInput").value;
  if (!userMessage) {
    Swal.fire({ icon: "warning", title: "메시지를 입력해주세요" });
    return;
  }

  addMessageBubble(userMessage, "user");

  try {
    const response = await fetch("http://localhost:3000/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, message: userMessage, model: currentModel, grounding: isGroundingEnabled }),
    });

    const data = await response.json();
    if (!data.response || data.response.trim() === "") {
      Swal.fire({ icon: "warning", title: "AI 응답이 없어요." });
      return;
    }

    addMessageBubble(data.response, "ai");
  } catch (error) {
    Swal.fire({ icon: "error", title: "에러 발생", text: "서버와의 통신 중 문제가 발생했어요." });
  }

  document.getElementById("userInput").value = "";
}

function addMessageBubble(message, sender) {
  const chatContainer = document.getElementById("chatContainer");
  const bubble = document.createElement("div");
  bubble.className = sender === "user" ? "user-bubble" : "ai-bubble";
  bubble.textContent = message;
  chatContainer.appendChild(bubble);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}