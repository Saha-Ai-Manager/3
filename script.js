// 초기 모델과 Grounding 설정 상태
let currentModel = "gemini-1.5-pro-002";
let isGroundingEnabled = false;

// 메시지 전송 함수
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

// 모델 선택 시 선택한 모델로 전환
function changeModel() {
  currentModel = document.getElementById("modelSelect").value;
}

// Grounding 설정 토글
function toggleGrounding() {
  isGroundingEnabled = !isGroundingEnabled;
  document.getElementById("groundingToggle").textContent = `Grounding: ${isGroundingEnabled ? "ON" : "OFF"}`;
}

// iMessage 스타일의 대화 버블 추가
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