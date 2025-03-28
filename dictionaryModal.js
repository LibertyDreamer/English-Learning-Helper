// dictionaryModal.js

/**
 * Opens a new browser window centered on the screen.
 * @param {string} url - The URL to open.
 * @param {string} title - The window title.
 * @param {number} w - The width of the window.
 * @param {number} h - The height of the window.
 */
export function openCenteredWindow(url, title, w, h) {
  const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left;
  const dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth || screen.width;
  const windowHeight = window.innerHeight || document.documentElement.clientHeight || screen.height;
  const left = (windowWidth - w) / 2 + dualScreenLeft;
  const top = (windowHeight - h) / 2 + dualScreenTop;
  const newWindow = window.open(
    url,
    title,
    `scrollbars=yes,width=${w},height=${h},top=${top},left=${left}`
  );
  if (newWindow && newWindow.focus) {
    newWindow.focus();
  }
}

/**
 * Creates and shows a dictionary modal for a given word and its meaning.
 * @param {string} word - The word being looked up.
 * @param {string} meaning - The dictionary explanation.
 * @param {Function} sayThis - TTS function to read the word aloud.
 * @param {HTMLElement} voiceSelectElement - The TTS voice selection element.
 */
export function showDictionaryModal(word, meaning, sayThis, voiceSelectElement) {
  // Play the word via TTS.
  sayThis(word, voiceSelectElement.value);

  // Remove existing modal if present.
  const existingModal = document.getElementById("custom-alert");
  if (existingModal) {
    existingModal.remove();
  }

  // Create modal container.
  const modal = document.createElement("div");
  modal.id = "custom-alert";
  modal.classList.add("custom-alert");

  // Create title element.
  const titleElement = document.createElement("h2");
  titleElement.textContent = word;
  modal.appendChild(titleElement);

  // Create meaning paragraph.
  const meaningElement = document.createElement("p");
  meaningElement.textContent = meaning;
  modal.appendChild(meaningElement);

  // Create container for buttons.
  const buttonsContainer = document.createElement("div");
  buttonsContainer.classList.add("modal-buttons");

  // Play button.
  const playButton = document.createElement("button");
  playButton.textContent = "🔊 Play";
  playButton.onclick = () => {
    sayThis(word, voiceSelectElement.value);
  };
  buttonsContainer.appendChild(playButton);

  // Deep learning button.
  const deepLearningButton = document.createElement("button");
  deepLearningButton.textContent = "Deep learning";
  deepLearningButton.onclick = () => {
    openCenteredWindow(`https://youglish.com/pronounce/${word}/english`, "Youglish", 800, 600);
  };
  buttonsContainer.appendChild(deepLearningButton);

  // Oxford button.
  const oxfordButton = document.createElement("button");
  oxfordButton.textContent = "Oxford";
  oxfordButton.onclick = () => {
    openCenteredWindow(
      `https://www.oxfordlearnersdictionaries.com/us/definition/english/${word}?q=${word}`,
      "Oxford",
      800,
      600
    );
  };
  buttonsContainer.appendChild(oxfordButton);

  // Cambridge button.
  const cambridgeButton = document.createElement("button");
  cambridgeButton.textContent = "Cambridge";
  cambridgeButton.onclick = () => {
    openCenteredWindow(
      `https://dictionary.cambridge.org/us/dictionary/english/${word}`,
      "Cambridge",
      800,
      600
    );
  };
  buttonsContainer.appendChild(cambridgeButton);

  // Close button.
  const closeButton = document.createElement("button");
  closeButton.textContent = "Close";
  closeButton.onclick = () => {
    modal.remove();
  };
  buttonsContainer.appendChild(closeButton);

  // Append the buttons container to the modal.
  modal.appendChild(buttonsContainer);

  // Append modal to the document body.
  document.body.appendChild(modal);
}
