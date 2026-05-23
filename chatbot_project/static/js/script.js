let currentSessionId = null;
let allSessions = [];
let isLoading = false;

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
  loadSessions();
  createNewSession();
});

// Event Listeners
function setupEventListeners() {
  document
    .getElementById("newChatBtn")
    .addEventListener("click", createNewSession);

  document.querySelectorAll(".nav-item").forEach((item) => {
    item.addEventListener("click", (e) => {
      document
        .querySelectorAll(".nav-item")
        .forEach((i) => i.classList.remove("active"));
      e.currentTarget.classList.add("active");
      switchPage(e.currentTarget.dataset.page);
    });
  });

  document.getElementById("chatForm").addEventListener("submit", sendMessage);

  // Allow Ctrl+Enter to send message
  document.getElementById("messageInput").addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "Enter") {
      sendMessage(e);
    }
  });
}

// Page Navigation
function switchPage(page) {
  document
    .querySelectorAll(".page")
    .forEach((p) => p.classList.remove("active"));
  document.getElementById(page + "Page").classList.add("active");

  if (page === "analytics") {
    loadAnalytics();
  }
}

// Create New Session
function createNewSession() {
  fetch("/api/session/new", { method: "POST" })
    .then((res) => res.json())
    .then((data) => {
      currentSessionId = data.session_id;
      loadSessions();
      clearChat();
      document.getElementById("messageInput").focus();
    })
    .catch((err) => showError("Failed to create new session: " + err.message));
}

// Load Sessions
function loadSessions() {
  fetch("/api/sessions")
    .then((res) => res.json())
    .then((sessions) => {
      allSessions = sessions;
      renderChatList();
    })
    .catch((err) => console.error("Failed to load sessions:", err));
}

// Render Chat List
function renderChatList() {
  const chatList = document.getElementById("chatList");
  chatList.innerHTML = "";

  allSessions.forEach((session) => {
    const chatItem = document.createElement("button");
    chatItem.className =
      "chat-item" + (session.id === currentSessionId ? " active" : "");
    chatItem.textContent = session.title;
    chatItem.onclick = () => switchSession(session.id);
    chatList.appendChild(chatItem);
  });
}

// Switch Session
function switchSession(sessionId) {
  currentSessionId = sessionId;
  renderChatList();
  loadChat(sessionId);
}

// Clear Chat
function clearChat() {
  document.getElementById("messagesContainer").innerHTML = "";
  document.getElementById("welcomeScreen").style.display = "flex";
}

// Load Chat Messages
function loadChat(sessionId) {
  const messagesContainer = document.getElementById("messagesContainer");
  messagesContainer.innerHTML = "";
  document.getElementById("welcomeScreen").style.display = "none";

  fetch(`/api/chat?session_id=${sessionId}`)
    .then((res) => {
      if (!res.ok) return;
      return res.json();
    })
    .catch((err) => console.error("Failed to load chat:", err));
}

// Set Quick Message
function setQuickMessage(message) {
  document.getElementById("messageInput").value = message;
  document.getElementById("messageInput").focus();
}

// Send Message
function sendMessage(e) {
  e.preventDefault();

  const input = document.getElementById("messageInput");
  const message = input.value.trim();

  if (!message || isLoading || !currentSessionId) return;

  // Hide welcome screen
  document.getElementById("welcomeScreen").style.display = "none";

  // Add user message to UI
  addMessageToUI("user", message);
  input.value = "";
  input.focus();

  // Show typing indicator
  addTypingIndicator();

  isLoading = true;
  document.getElementById("sendBtn").disabled = true;

  // Send to backend
  fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: message,
      session_id: currentSessionId,
    }),
  })
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((data) => {
      removeTypingIndicator();
      addMessageToUI("assistant", data.response);
      loadSessions(); // Refresh sessions to update title
    })
    .catch((err) => {
      removeTypingIndicator();
      showError("Error: " + err.message);
    })
    .finally(() => {
      isLoading = false;
      document.getElementById("sendBtn").disabled = false;
    });
}

// Add Message to UI
function addMessageToUI(role, content) {
  const container = document.getElementById("messagesContainer");

  const messageDiv = document.createElement("div");
  messageDiv.className = "message " + role;

  const avatar = document.createElement("div");
  avatar.className = "message-avatar";
  avatar.textContent = role === "user" ? "👤" : "🤖";

  const contentDiv = document.createElement("div");
  contentDiv.className = "message-content";
  contentDiv.textContent = content;

  if (role === "user") {
    messageDiv.appendChild(contentDiv);
    messageDiv.appendChild(avatar);
  } else {
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(contentDiv);
  }

  container.appendChild(messageDiv);
  scrollToBottom();
}

// Typing Indicator
function addTypingIndicator() {
  const container = document.getElementById("messagesContainer");
  const messageDiv = document.createElement("div");
  messageDiv.className = "message assistant";
  messageDiv.id = "typingIndicator";

  const avatar = document.createElement("div");
  avatar.className = "message-avatar";
  avatar.textContent = "🤖";

  const typingDiv = document.createElement("div");
  typingDiv.className = "typing-indicator";
  typingDiv.innerHTML =
    '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';

  messageDiv.appendChild(avatar);
  messageDiv.appendChild(typingDiv);
  container.appendChild(messageDiv);
  scrollToBottom();
}

function removeTypingIndicator() {
  const indicator = document.getElementById("typingIndicator");
  if (indicator) indicator.remove();
}

// Scroll to Bottom
function scrollToBottom() {
  const container = document.getElementById("messagesContainer");
  setTimeout(() => {
    container.scrollTop = container.scrollHeight;
  }, 0);
}

// Error Message
function showError(message) {
  const container = document.getElementById("messagesContainer");
  const errorDiv = document.createElement("div");
  errorDiv.style.cssText =
    "padding: 12px 16px; background: rgba(239, 68, 68, 0.1); border: 1px solid rgb(239, 68, 68); border-radius: 8px; color: rgb(239, 68, 68); margin: 10px 0;";
  errorDiv.textContent = message;
  container.appendChild(errorDiv);
  scrollToBottom();
}

// Analytics
function loadAnalytics() {
  if (!currentSessionId) return;

  fetch(`/api/analytics/${currentSessionId}`)
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("totalMessages").textContent =
        data.total_messages;
      document.getElementById("totalConversations").textContent =
        allSessions.length;
      document.getElementById("totalSessions").textContent = allSessions.length;
      document.getElementById("lastActive").textContent =
        new Date().toLocaleDateString();
    })
    .catch((err) => console.error("Failed to load analytics:", err));
}

function submitFeedback() {
  const feedback = document.getElementById("feedbackText").value.trim();

  if (!feedback) {
    alert("Please enter some feedback");
    return;
  }

  fetch("/api/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      session_id: currentSessionId,
      feedback: feedback,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      alert("Thank you for your feedback!");
      document.getElementById("feedbackText").value = "";
    })
    .catch((err) => alert("Error submitting feedback: " + err.message));
}
