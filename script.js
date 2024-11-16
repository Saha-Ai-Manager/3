async function sendMessage() {
  const userInput = document.getElementById("userInput");
  const modelSelect = document.getElementById("modelSelect");
  const groundingToggle = document.getElementById("groundingToggle");
  const userMessage = userInput.value.trim();
  const selectedModel = modelSelect.value;
  const groundingEnabled = groundingToggle.checked; // Grounding 상태
  const chatContainer = document.getElementById("chatContainer");

  if (!userMessage) {
    Swal.fire({
      icon: "warning",
      title: "질문을 입력해주세요",
      text: "입력창이 비어 있습니다.",
    });
    return;
  }

  // 사용자 메시지를 채팅창에 추가
  appendMessage("user", userMessage);
  userInput.value = ""; // 입력창 초기화

  try {
    const response = await fetch("http://localhost:3000/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        message: userMessage, 
        model: selectedModel,
        groundingEnabled 
      }),
    });

    const data = await response.json();
    const aiResponse = data.response || "AI가 응답하지 않았습니다.";

    // AI 응답을 채팅창에 추가
    appendMessage("ai", aiResponse);

  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "에러 발생",
      text: "서버와의 통신 중 문제가 발생했습니다. 다시 시도해 주세요.",
    });
    console.error("Error:", error);
  }
}

function appendMessage(sender, message) {
  const chatContainer = document.getElementById("chatContainer");
  const messageElement = document.createElement("div");
  messageElement.classList.add("flex", "items-start", "space-x-4");

  if (sender === "user") {
    messageElement.innerHTML = `
      <div class="bg-blue-500 text-white p-3 rounded-lg max-w-sm">
        ${message}
      </div>
    `;
    messageElement.classList.add("justify-end");
  } else {
    messageElement.innerHTML = `
      <div class="bg-gray-200 text-gray-800 p-3 rounded-lg max-w-sm">
        ${message}
      </div>
    `;
  }

  chatContainer.appendChild(messageElement);
  chatContainer.scrollTop = chatContainer.scrollHeight; // 자동 스크롤
}