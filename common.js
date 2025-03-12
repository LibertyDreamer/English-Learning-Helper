// Validate all answer fields (works for text inputs and comboboxes)
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

// Reveal one answer at a time (global order)
let nextAnswerIndex = 0;
function showOneAnswer() {
  const answers = document.querySelectorAll('.answer');
  if (nextAnswerIndex < answers.length) {
    const answer = answers[nextAnswerIndex];
    let answerSpan = answer.nextElementSibling;
    if (!answerSpan || !answerSpan.classList.contains('correct-answer')) {
      answerSpan = document.createElement('span');
      answerSpan.className = 'correct-answer';
      answerSpan.style.marginLeft = '10px';
      answer.parentNode.insertBefore(answerSpan, answer.nextSibling);
    }
    const correct = answer.getAttribute('data-answer');
    answerSpan.textContent = `Correct: ${correct}`;
    nextAnswerIndex++;
  } else {
    alert("All answers have been shown!");
  }
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
