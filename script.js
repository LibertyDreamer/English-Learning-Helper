/**************************************************
 * Global Variables
 **************************************************/
// wordData: { word: { examples: [{ text, video, start, end }], rating, ignored } }
let wordData = {};
let words = [];      // Array of word keys
let videoFiles = []; // Array of video File objects (both old and new)
let videoMapping = {}; // Mapping: video file name -> object URL
let currentExampleObj = null; // Chosen example for the current card
let currentWord = "";

/**************************************************
 * Utility: SRT Parsing
 **************************************************/
function parseSRT(srtString) {
  const blocks = srtString.split(/\r?\n\r?\n/);
  let results = [];
  blocks.forEach(block => {
    const lines = block.split(/\r?\n/).map(l => l.trim()).filter(l => l);
    if (lines.length < 2) return;
    let timeLine = "";
    let textLines = [];
    if (/^\d+$/.test(lines[0])) {
      timeLine = lines[1];
      textLines = lines.slice(2);
    } else {
      timeLine = lines[0];
      textLines = lines.slice(1);
    }
    if (!timeLine.includes("-->")) return;
    const [startStr, endStr] = timeLine.split("-->").map(s => s.trim());
    const startSec = srtTimeToSeconds(startStr);
    const endSec = srtTimeToSeconds(endStr);
    const text = textLines.join(" ");
    results.push({ start: startSec, end: endSec, text: text });
  });
  return results;
}

function srtTimeToSeconds(timeStr) {
  const parts = timeStr.split(":");
  if (parts.length < 3) return 0;
  const [hh, mm, ssMs] = parts;
  const [ss, ms] = ssMs.split(",");
  return (parseInt(hh) * 3600) + (parseInt(mm) * 60) + parseInt(ss) + (parseInt(ms) / 1000);
}

/**************************************************
 * Add New Content (Video + SRT)
 **************************************************/
document.getElementById("addNewContentBtn").addEventListener("click", () => {
  const videoInput = document.getElementById("newVideo");
  const srtInput = document.getElementById("newSRT");
  if (videoInput.files.length === 0 || srtInput.files.length === 0) {
    alert("Select both a video and an SRT file.");
    return;
  }
  const videoFile = videoInput.files[0];
  const srtFile = srtInput.files[0];
  
  // Add video file to mapping if not already present.
  if (!videoMapping[videoFile.name]) {
    videoFiles.push(videoFile);
    videoMapping[videoFile.name] = URL.createObjectURL(videoFile);
  }
  
  const reader = new FileReader();
  reader.onload = (e) => {
    const srtContent = e.target.result;
    const srtBlocks = parseSRT(srtContent);
    srtBlocks.forEach(block => {
      const wordsInBlock = block.text.toLowerCase().match(/[a-zA-Z]+/g);
      if (wordsInBlock) {
        wordsInBlock.forEach(word => {
          if (!wordData[word]) {
            wordData[word] = {
              examples: [{
                text: block.text,
                video: videoFile.name,
                start: block.start,
                end: block.end
              }],
              rating: 0,
              ignored: false
            };
          } else {
            const exists = wordData[word].examples.some(ex => ex.text === block.text && ex.video === videoFile.name);
            if (!exists) {
              wordData[word].examples.push({
                text: block.text,
                video: videoFile.name,
                start: block.start,
                end: block.end
              });
            }
          }
        });
      }
    });
    words = Object.keys(wordData);
    alert("New content added from SRT.");
    if (!currentWord) {
      currentWord = getNextCard();
      if (currentWord) showCurrentCard();
    }
  };
  reader.readAsText(srtFile);
});

/**************************************************
 * Load Archive from ZIP (JSON + Videos)
 **************************************************/
document.getElementById("archiveFile").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const zip = new JSZip();
  zip.loadAsync(file).then(zipContent => {
    // Load JSON data
    return zipContent.file("words.json").async("string").then(jsonStr => {
      try {
        wordData = JSON.parse(jsonStr);
        words = Object.keys(wordData);
        // Load video files from "videos" folder.
        const videoFolder = zipContent.folder("videos");
        if (videoFolder) {
          let videoPromises = [];
          videoFolder.forEach((relPath, fileEntry) => {
            let promise = fileEntry.async("blob").then(blob => {
              const url = URL.createObjectURL(blob);
              // Extract the base file name in case there's a folder path.
              const parts = fileEntry.name.split("/");
              const baseName = parts[parts.length - 1];
              
              // Map the baseName to the URL.
              videoMapping[baseName] = url;
              
              // Add the video file to videoFiles if not already present.
              const alreadyInArray = videoFiles.some(f => f.name === baseName);
              if (!alreadyInArray) {
                const fileFromBlob = new File([blob], baseName, { type: blob.type });
                videoFiles.push(fileFromBlob);
              }
            });
            videoPromises.push(promise);
          });
          Promise.all(videoPromises).then(() => {
            alert("Archive loaded.");
            if (!currentWord) {
              currentWord = getNextCard();
              if (currentWord) showCurrentCard();
            }
          });
        } else {
          alert("Archive loaded. No video files found.");
          if (!currentWord) {
            currentWord = getNextCard();
            if (currentWord) showCurrentCard();
          }
        }
      } catch (err) {
        alert("Error parsing archive: " + err);
      }
    });
  }).catch(err => {
    alert("Error loading archive: " + err);
  });
});

/**************************************************
 * Export Archive to ZIP (JSON + Videos)
 **************************************************/
document.getElementById("exportArchiveBtn").addEventListener("click", async () => {
  const zip = new JSZip();
  zip.file("words.json", JSON.stringify(wordData, null, 2));
  const videoFolder = zip.folder("videos");
  if (videoFiles.length === 0) {
    alert("No new video files loaded.");
    return;
  }
  for (const file of videoFiles) {
    videoFolder.file(file.name, file);
  }
  try {
    const content = await zip.generateAsync({ type: "blob" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(content);
    a.download = "archive.zip";
    a.click();
  } catch(err) {
    console.error("Error exporting archive:", err);
  }
});

/**************************************************
 * Drill Section: UI and Weighted Selection
 **************************************************/
// Update the word's rating (no scheduling).
function updateCard(word, rating) {
  wordData[word].rating = rating;
}

// Weighted random selection: lower-rated words appear more often.
function getNextCard() {
  const availableWords = words.filter(w => !wordData[w].ignored);
  if (availableWords.length === 0) return null;
  let totalWeight = 0;
  const weightedWords = [];
  availableWords.forEach(word => {
    let r = wordData[word].rating;
    if (r === undefined) { r = 0; }
    const weight = 101 - r; // Lower ratings yield higher weight.
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
  
  // Auto-play video fragment when a new word is shown.
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

function reviewCurrentCard(rating) {
  updateCard(currentWord, rating);
  currentWord = getNextCard();
  if (currentWord) showCurrentCard();
  else {
    document.getElementById("currentWord").textContent = "No cards available.";
    document.getElementById("currentExample").textContent = "";
  }
}

/**************************************************
 * Event Listeners
 **************************************************/
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

// Attach event listeners to percent rating buttons.
document.querySelectorAll(".ratingBtn").forEach(btn => {
  btn.addEventListener("click", () => {
    const rating = parseInt(btn.getAttribute("data-rating"));
    if (currentWord && wordData[currentWord]) {
      reviewCurrentCard(rating);
    }
  });
});

// Attach event listener for the repeat fragment button.
document.getElementById("repeatFragmentBtn").addEventListener("click", () => {
  autoPlayVideoFragment();
});

// Initialize on page load.
window.addEventListener("load", () => {
  currentWord = getNextCard();
  if (currentWord) showCurrentCard();
});
