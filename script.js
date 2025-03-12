document.addEventListener("DOMContentLoaded", function() {
  const quizListElement = document.getElementById("quizList");
  const listSection = document.getElementById("listSection");
  const quizSection = document.getElementById("quizSection");
  const quizContainer = document.getElementById("quizContainer");
  const backBtn = document.getElementById("backBtn");
  const checkBtn = document.getElementById("checkBtn");

  // List your quiz files here (they should exist in the quizzes/ folder)
  const quizFiles = ['quiz1.quiz', 'quiz2.quiz'];
  let correctAnswers = [];

  // Build the quiz list
  function displayQuizList() {
    quizListElement.innerHTML = "";
    quizFiles.forEach(filename => {
      const li = document.createElement("li");
      const link = document.createElement("a");
      link.href = "#";
      link.textContent = filename;
      link.addEventListener("click", function(event) {
        event.preventDefault();
        loadQuiz(filename);
      });
      li.appendChild(link);
      quizListElement.appendChild(li);
    });
  }

  // Fetch and load a quiz file
  async function loadQuiz(filename) {
    try {
      const response = await fetch(`quizzes/${filename}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const text = await response.text();
      
      // Reset previous answers
      correctAnswers = [];
      
      // Process the quiz text:
      // Look for blanks in the format ___[answer] and replace them with an input field.
      const processedQuiz = text.replace(/_{3,}\[([^\]]+)\]/g, function(match, answer) {
        correctAnswers.push(answer.trim().toLowerCase());
        return `<input type="text" class="answer" placeholder="Your answer">`;
      });
      
      quizContainer.innerHTML = processedQuiz;
      // Switch view: hide quiz list, show quiz
      listSection.classList.add("hidden");
      quizSection.classList.remove("hidden");
    } catch (error) {
      console.error("Error fetching quiz file:", error);
      alert("Failed to load quiz: " + error.message);
    }
  }

  // Validate the user's answers
  function checkAnswers() {
    const answerInputs = document.querySelectorAll(".answer");
    answerInputs.forEach((input, index) => {
      const userAnswer = input.value.trim().toLowerCase();
      if (userAnswer === correctAnswers[index]) {
        input.style.backgroundColor = "lightgreen";
      } else {
        input.style.backgroundColor = "pink";
      }
    });
  }

  // Return to the quiz list view
  function backToList() {
    quizSection.classList.add("hidden");
    listSection.classList.remove("hidden");
    quizContainer.innerHTML = "";
  }

  // Attach event listeners
  checkBtn.addEventListener("click", checkAnswers);
  backBtn.addEventListener("click", backToList);

  // Initialize quiz list
  displayQuizList();
});
