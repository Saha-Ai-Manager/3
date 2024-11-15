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
  document.getElementById("userInput").value = "";

  // 로딩 상태 표시
  Swal.fire({
    title: '응답을 기다리는 중...',
    text: '서버에서 응답을 기다리는 중입니다.',
    didOpen: () => {
      Swal.showLoading();
    }
  });

  try {
    const response = await fetch("http://localhost:3000/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, message: userMessage, model: currentModel, grounding: isGroundingEnabled }),
    });

    // 로딩 상태 종료
    Swal.close();

    if (response.status === 429) {  // 429 상태 코드 (쿼터 초과) 처리
      Swal.fire({ icon: "error", title: "요청 한도 초과", text: "하루 한도를 초과했어요. 잠시 후 다시 시도해주세요." });
      return;
    }

    const data = await response.json();

    if (!data.response || data.response.trim() === "") {
      Swal.fire({ icon: "warning", title: "AI 응답이 없어요. 하루 한도를 초과 했을 수도 있어요. (response.message.content가 비어 있음)" });
      return;
    }

    addMessageBubble(data.response, "ai");

  } catch (error) {
    Swal.close();
    Swal.fire({ icon: "error", title: "에러 발생", text: "서버와의 통신 중 문제가 발생했어요." });
  }
}

function addMessageBubble(message, sender) {
  const chatContainer = document.getElementById("chatContainer");
  const bubble = document.createElement("div");
  bubble.className = sender === "user" ? "user-bubble" : "ai-bubble";
  bubble.textContent = message;
  chatContainer.appendChild(bubble);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}