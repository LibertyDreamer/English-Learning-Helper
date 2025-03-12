// Check each answer input against its data-answer attribute.
function checkAnswers() {
  const inputs = document.querySelectorAll('.answer');
  inputs.forEach(input => {
    const correct = input.getAttribute('data-answer');
    const userAnswer = input.value.trim().toLowerCase();
    if (userAnswer === correct.trim().toLowerCase()) {
      input.style.backgroundColor = 'lightgreen';
    } else {
      input.style.backgroundColor = 'pink';
    }
  });
}

// Display the correct answer next to each input.
function showAnswers() {
  const inputs = document.querySelectorAll('.answer');
  inputs.forEach(input => {
    const correct = input.getAttribute('data-answer');
    let answerSpan = input.nextElementSibling;
    // Create the answer span if it doesn't exist or update it if it does.
    if (!answerSpan || !answerSpan.classList.contains('correct-answer')) {
      answerSpan = document.createElement('span');
      answerSpan.className = 'correct-answer';
      answerSpan.style.marginLeft = '10px';
      input.parentNode.insertBefore(answerSpan, input.nextSibling);
    }
    answerSpan.textContent = `Correct: ${correct}`;
  });
}
