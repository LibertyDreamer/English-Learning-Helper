// Validate all answer fields (works for both text inputs and comboboxes)
function checkAnswers() {
  const answers = document.querySelectorAll('.answer');
  answers.forEach(answer => {
    const correct = answer.getAttribute('data-answer').trim().toLowerCase();
    const userAnswer = answer.value.trim().toLowerCase();
    if (userAnswer === correct) {
      answer.style.backgroundColor = 'lightgreen';
    } else {
      answer.style.backgroundColor = 'pink';
    }
  });
}

// Reveal all answers at once (adds a span next to each answer field)
function showAnswers() {
  const answers = document.querySelectorAll('.answer');
  answers.forEach(answer => {
    const correct = answer.getAttribute('data-answer');
    let answerSpan = answer.nextElementSibling;
    if (!answerSpan || !answerSpan.classList.contains('correct-answer')) {
      answerSpan = document.createElement('span');
      answerSpan.className = 'correct-answer';
      answerSpan.style.marginLeft = '10px';
      answer.parentNode.insertBefore(answerSpan, answer.nextSibling);
    }
    answerSpan.textContent = `Correct: ${correct}`;
  });
}

// Reveal answer only for the question containing the clicked button
function showAnswerForQuestion(button) {
  const questionDiv = button.closest('.question');
  if (!questionDiv) return;
  const answers = questionDiv.querySelectorAll('.answer');
  answers.forEach(answer => {
    const correct = answer.getAttribute('data-answer');
    let answerSpan = answer.nextElementSibling;
    if (!answerSpan || !answerSpan.classList.contains('correct-answer')) {
      answerSpan = document.createElement('span');
      answerSpan.className = 'correct-answer';
      answerSpan.style.marginLeft = '10px';
      answer.parentNode.insertBefore(answerSpan, answer.nextSibling);
    }
    answerSpan.textContent = `Correct: ${correct}`;
  });
}
