/* style.css */
/* Dark cosmic-inspired background and a modern layout with grid */

html, body {
  margin: 0;
  padding: 0;
  background: linear-gradient(135deg, #141e30 0%, #243b55 100%);
  font-family: 'Roboto', sans-serif;
  color: #eee;
  height: 100%;
}

/* Container with grid layout */
#container {
  display: grid;
  grid-template-areas:
    "user-panel user-panel"
    "story chat"
    "decision-panel shared-decisions";
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 1fr auto;
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* USER PANEL */
#user-panel {
  grid-area: user-panel;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 6px;
  padding: 20px;
  text-align: center;
}

#user-panel h1 {
  margin-top: 0;
}

.username-box {
  margin-top: 20px;
}
.username-box input {
  width: 200px;
  padding: 8px;
  margin-right: 10px;
  border: none;
  border-radius: 4px;
}
.username-box button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #4caf50;
  color: #fff;
  cursor: pointer;
}
.username-box button:hover {
  background-color: #45a049;
}

/* STORY */
#story {
  grid-area: story;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 6px;
  padding: 20px;
  overflow-y: auto;
  max-height: 60vh; /* adjust as needed */
}
#story h2 {
  margin-top: 0;
}
#story-content {
  margin-top: 10px;
  line-height: 1.6;
}

/* CHAT */
#chat {
  grid-area: chat;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 6px;
  padding: 20px;
  display: flex;
  flex-direction: column;
}
#chat h2 {
  margin-top: 0;
}
#chat-messages {
  flex: 1;
  overflow-y: auto;
  border: 1px solid #444;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.05);
}
#chat-input {
  display: flex;
}
#chat-text {
  flex: 1;
  padding: 8px;
  border: none;
  border-radius: 4px;
  margin-right: 10px;
}
#chat-send-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #2196F3;
  color: #fff;
  cursor: pointer;
}
#chat-send-btn:hover {
  background-color: #1976D2;
}

/* DECISION PANEL */
#decision-panel {
  grid-area: decision-panel;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 6px;
  padding: 20px;
  text-align: center;
}
#decision-panel h2 {
  margin-top: 0;
}
.decision-box {
  margin-top: 20px;
}
#decision-input {
  width: 60%;
  padding: 8px;
  border: none;
  border-radius: 4px;
  margin-right: 10px;
}
#decision-send-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #f44336;
  color: #fff;
  cursor: pointer;
}
#decision-send-btn:hover {
  background-color: #d32f2f;
}

/* SHARED DECISIONS */
#shared-decisions {
  grid-area: shared-decisions;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 6px;
  padding: 20px;
}
#shared-decisions h2 {
  margin-top: 0;
}
#decision-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
#decision-list li {
  margin-bottom: 8px;
  border-bottom: 1px solid #555;
  padding: 4px 0;
}

/* Scrollbars, optional styling */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: #333;
}
::-webkit-scrollbar-thumb {
  background: #555;
  border-radius: 4px;
}
