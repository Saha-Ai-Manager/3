// Initial model and grounding state
let currentModel = "gemini-1.5-pro-002";
let isGroundingEnabled = false;

// Toggle sidebar visibility
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("-translate-x-full");
}

// Add message bubble with animation
function addMessageBubble(message, sender) {
  const chatContainer = document.getElementById("chatContainer");
  const bubble = document.createElement("div");
  bubble.className = `message-bubble ${sender === "user" ? "user-bubble" : "ai-bubble"}`;
  bubble.textContent = message;
  chatContainer.appendChild(bubble);

  setTimeout(() => {
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }, 50);
}

// Message sending function
async function sendMessage() {
  const userMessage = document.getElementById("userInput").value.trim();

  if (!userMessage) {
    Swal.fire({
      icon: "warning",
      title: "메시지를 입력하세요",
    });
    return;
  }

  addMessageBubble(userMessage, "user");

  try {
    const response = await fetch("http://localhost:3000/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        message: userMessage,
        model: currentModel,
        grounding: isGroundingEnabled,
      }),
    });

    const data = await response.json();
    addMessageBubble(data.response, "ai");

  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "에러 발생",
      text: "서버와의 통신 중 문제가 발생했어요.",
    });
    console.error("Error:", error);
  }

  document.getElementById("userInput").value = "";
}

// Change model function
function changeModel() {
  currentModel = document.getElementById("modelSelect").value;
}

// Grounding toggle function
function toggleGrounding() {
  isGroundingEnabled = !isGroundingEnabled;
  document.getElementById("groundingToggle").textContent = `Grounding: ${isGroundingEnabled ? "ON" : "OFF"}`;
}

// Start new chat
function startNewChat() {
  document.getElementById("chatContainer").innerHTML = "";
  Swal.fire({
    icon: "info",
    title: "새 채팅이 시작되었습니다",
  });
}

// Open settings
function openSettings() {
  Swal.fire({
    icon: "info",
    title: "설정",
    text: "설정 기능이 준비 중입니다.",
  });
}