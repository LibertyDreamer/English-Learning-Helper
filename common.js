// Validate all answers on the page
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

// Reveal all answers at once
function showAnswers() {
  const inputs = document.querySelectorAll('.answer');
  inputs.forEach(input => {
    const correct = input.getAttribute('data-answer');
    let answerSpan = input.nextElementSibling;
    if (!answerSpan || !answerSpan.classList.contains('correct-answer')) {
      answerSpan = document.createElement('span');
      answerSpan.className = 'correct-answer';
      answerSpan.style.marginLeft = '10px';
      input.parentNode.insertBefore(answerSpan, input.nextSibling);
    }
    answerSpan.textContent = `Correct: ${correct}`;
  });
}

// Reveal one answer at a time
let nextAnswerIndex = 0;
function showOneAnswer() {
  const inputs = document.querySelectorAll('.answer');
  if (nextAnswerIndex < inputs.length) {
    const input = inputs[nextAnswerIndex];
    let answerSpan = input.nextElementSibling;
    if (!answerSpan || !answerSpan.classList.contains('correct-answer')) {
      answerSpan = document.createElement('span');
      answerSpan.className = 'correct-answer';
      answerSpan.style.marginLeft = '10px';
      input.parentNode.insertBefore(answerSpan, input.nextSibling);
    }
    const correct = input.getAttribute('data-answer');
    answerSpan.textContent = `Correct: ${correct}`;
    nextAnswerIndex++;
  } else {
    alert("All answers have been shown!");
  }
}
