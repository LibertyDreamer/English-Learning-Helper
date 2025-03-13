/**
 * Makes every word in the specified container clickable.
 *
 * For each non-space token in the container's text, the function wraps it in a <span>
 * with a data-index attribute corresponding to its position among all words.
 *
 * When a word is clicked, the callback is invoked with:
 *   - clickedWord: the text of the clicked word.
 *   - context: a string composed of up to 100 words before and 100 words after the clicked word.
 *
 * @param {string} containerId - The id of the container element (e.g., "story").
 * @param {function} callback - A function that receives (clickedWord, context).
 */
export function makeWordsClickable(containerId, callback) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with id "${containerId}" not found.`);
    return;
  }

  // Ensure that whitespace (spaces, newlines) is preserved in the container.
  container.style.whiteSpace = "pre-wrap";

  // Preserve original formatting by splitting text on spaces, keeping whitespace tokens.
  const originalText = container.textContent;
  const tokens = originalText.split(/(\s+)/);

  // Collect non-space tokens for context calculations.
  const wordsArray = [];
  let wordIndex = 0;

  // Wrap non-space tokens in a clickable span while preserving whitespace.
  const processedTokens = tokens.map(token => {
    if (token.trim() === "") {
      return token; // Return whitespace unchanged.
    } else {
      wordsArray.push(token);
      const span = `<span class="clickable-word" data-index="${wordIndex}">${token}</span>`;
      wordIndex++;
      return span;
    }
  });

  // Update container's content without altering formatting.
  container.innerHTML = processedTokens.join('');

  // Attach click event listener to the container.
  container.addEventListener('click', event => {
    if (event.target.classList.contains('clickable-word')) {
      const index = parseInt(event.target.getAttribute('data-index'), 10);
      const clickedWord = wordsArray[index];

      // Compute context: up to 100 words before and 100 words after.
      const contextStart = Math.max(0, index - 100);
      const contextEnd = Math.min(wordsArray.length, index + 101); // Include clicked word.
      const context = wordsArray.slice(contextStart, contextEnd).join(' ');

      // Call the callback with the clicked word and its context.
      callback(clickedWord, context);
    }
  });
}
