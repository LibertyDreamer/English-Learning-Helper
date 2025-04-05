// Global Variables
// wordData: { word: { examples: [{ text, video, start, end }], rating, ignored } }
let wordData = {};
let words = [];      
let videoMapping = {}; // Mapping: video file name -> object URL
let currentExampleObj = null;
let currentWord = "";

// Weighted random selection: lower-rated words appear more often.
function getNextCard() {
  const availableWords = words.filter(w => !wordData[w].ignored);
  if (availableWords.length === 0) return null;
  let totalWeight = 0;
  const weightedWords = [];
  availableWords.forEach(word => {
    let r = wordData[word].rating;
    if (r === undefined) r = 0;
    const weight = 101 - r; // Lower rating gives higher weight.
    totalWeight += weight;
    weightedWords.push({ word, weight });
  });
  let rand = Math.random() * totalWeight;
  for (let i = 0; i < weightedWords.length; i++) {
    rand -= weightedWords[i].weight;
    if (rand <= 0) return weightedWords[i].word;
  }
  return weightedWords[weightedWords.length - 1].word;
}

function showCurrentCard() {
  if (!currentWord) return;
  document.getElementById("currentWord").textContent = currentWord;
  const examples = wordData[currentWord].examples;
  const randomIndex = Math.floor(Math.random() * examples.length);
  currentExampleObj = examples[randomIndex];
  document.getElementById("currentExample").textContent = currentExampleObj.text;
  document.getElementById("currentExample").style.display = "none";
  autoPlayVideoFragment();
}

function autoPlayVideoFragment() {
  if (!currentWord || !currentExampleObj) return;
  const videoURL = videoMapping[currentExampleObj.video];
  if (!videoURL) {
    console.warn("Video not available for this fragment.");
    return;
  }
  const drillVideo = document.getElementById("drillVideo");
  drillVideo.src = videoURL;
  drillVideo.currentTime = currentExampleObj.start;
  drillVideo.play();
  const checkInterval = setInterval(() => {
    if (drillVideo.currentTime >= currentExampleObj.end) {
      drillVideo.pause();
      clearInterval(checkInterval);
    }
  }, 100);
}

function updateCard(word, rating) {
  wordData[word].rating = rating;
}

function reviewCurrentCard(rating) {
  updateCard(currentWord, rating);
  currentWord = getNextCard();
  if (currentWord) showCurrentCard();
  else {
    document.getElementById("currentWord").textContent = "No cards available.";
    document.getElementById("currentExample").textContent = "";
  }
}

// Event Listeners
document.getElementById("showTextBtn").addEventListener("click", () => {
  const exampleElem = document.getElementById("currentExample");
  exampleElem.style.display = (exampleElem.style.display === "none") ? "block" : "none";
});

document.getElementById("ignoreWordBtn").addEventListener("click", () => {
  if (currentWord) {
    wordData[currentWord].ignored = true;
    currentWord = getNextCard();
    if (currentWord) showCurrentCard();
    else {
      document.getElementById("currentWord").textContent = "No more cards available.";
      document.getElementById("currentExample").textContent = "";
    }
  }
});

document.querySelectorAll(".ratingBtn").forEach(btn => {
  btn.addEventListener("click", () => {
    const rating = parseInt(btn.getAttribute("data-rating"));
    if (currentWord && wordData[currentWord]) {
      reviewCurrentCard(rating);
    }
  });
});

document.getElementById("repeatFragmentBtn").addEventListener("click", () => {
  autoPlayVideoFragment();
});

// For demonstration purposes, if no archive has been loaded, we set sample data.
if (Object.keys(wordData).length === 0) {
  wordData = {
    "example": {
      examples: [{
        text: "This is an example sentence.",
        video: "example.mp4",
        start: 0,
        end: 5
      }],
      rating: 0,
      ignored: false
    }
  };
  words = Object.keys(wordData);
  // Sample video mapping – using a public sample video.
  videoMapping["example.mp4"] = "https://www.w3schools.com/html/mov_bbb.mp4";
}

currentWord = getNextCard();
if (currentWord) showCurrentCard();
