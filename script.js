async function sendMessage() {
  const userMessage = document.getElementById("userInput").value;

  if (!userMessage) {
    Swal.fire({
      icon: "warning",
      title: "질문을 입력해주세요",
      text: "입력창이 비어 있습니다.",
    });
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: userMessage }),
    });

    const data = await response.json();

    Swal.fire({
      icon: "success",
      title: "AI의 응답",
      text: data.response,
      confirmButtonText: "확인",
    });

  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "에러 발생",
      text: "서버와의 통신 중 문제가 발생했습니다. 다시 시도해 주세요.",
    });
    console.error("Error:", error);
  }
}