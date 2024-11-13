let currentModel = "gemini-1.5-pro-002";
let isGroundingEnabled = false;

async function sendMessage() {
  const userMessage = document.getElementById("userInput").value;

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
      text: "서버와의 통신 중 문제가 발생했습니다.",
    });
    console.error("Error:", error);
  }

  document.getElementById("userInput").value = "";
}

// 모델 선택 드롭다운 토글
function toggleModelSelect() {
  const modelSelect = document.getElementById("modelSelect");
  modelSelect.classList.toggle("hidden");
}

// 모델 변경
function changeModel() {
  currentModel = document.getElementById("modelSelect").value;
  toggleModelSelect();
}

// Grounding 설정 토글
function toggleGrounding() {
  isGroundingEnabled = !isGroundingEnabled;
  const groundingIcon = document.querySelector(".fa-cogs");
  groundingIcon.style.color = isGroundingEnabled ? "green" : "indigo";
}

// 대화 버블 추가 함수
function addMessageBubble(message, sender) {
  const chatContainer = document.getElementById("chatContainer");
  const bubble = document.createElement("div");

  bubble.className = sender === "user" 
    ? "bg-blue-500 text-white p-3 rounded-xl rounded-br-none self-end max-w-xs animate-pop-up"
    : "bg-gray-300 text-gray-900 p-3 rounded-xl rounded-bl-none self-start max-w-xs animate-pop-up";
  bubble.classList.add("mb-2", "shadow-sm");
  bubble.textContent = message;

  chatContainer.appendChild(bubble);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}