// Global variables for JSON and video files
let wordData = {};
let videoFiles = []; // Array of File objects for videos
let videoMapping = {}; // Mapping: file name -> object URL
let editor = null;

// Initialize CodeMirror on page load for JSON editing
window.addEventListener('load', () => {
  editor = CodeMirror.fromTextArea(document.getElementById("jsonEditor"), {
    mode: { name: "javascript", json: true },
    lineNumbers: true,
    theme: "default"
  });
});

// Load archive (.zip) and extract words.json and video files
document.getElementById("archiveFile").addEventListener("change", function(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  const zip = new JSZip();
  zip.loadAsync(file).then(zipContent => {
    // Read and parse words.json
    return zipContent.file("words.json").async("string").then(jsonStr => {
      try {
        wordData = JSON.parse(jsonStr);
        editor.setValue(JSON.stringify(wordData, null, 2));
      } catch (err) {
        alert("Error parsing words.json: " + err);
      }
      // Process video files in the "videos" folder
      const videoFolder = zipContent.folder("videos");
      if (videoFolder) {
        let videoPromises = [];
        videoFolder.forEach((relativePath, fileEntry) => {
          let promise = fileEntry.async("blob").then(blob => {
            const parts = fileEntry.name.split("/");
            const baseName = parts[parts.length - 1];
            const fileObj = new File([blob], baseName, { type: blob.type });
            // Add file if not already present
            if (!videoFiles.some(f => f.name === baseName)) {
              videoFiles.push(fileObj);
            }
            videoMapping[baseName] = URL.createObjectURL(blob);
          });
          videoPromises.push(promise);
        });
        Promise.all(videoPromises).then(() => {
          updateFileList();
        });
      } else {
        updateFileList();
      }
    });
  }).catch(err => {
    alert("Error loading archive: " + err);
  });
});

// Update the file list UI
function updateFileList() {
  const listElem = document.getElementById("fileList");
  listElem.innerHTML = "";
  videoFiles.forEach(file => {
    const li = document.createElement("li");
    li.textContent = file.name;
    listElem.appendChild(li);
  });
}

// Add a new video file from the "Add File" input
document.getElementById("addFileBtn").addEventListener("click", () => {
  const fileInput = document.getElementById("addFileInput");
  if (fileInput.files.length === 0) {
    alert("Select a file to add.");
    return;
  }
  const newFile = fileInput.files[0];
  if (videoFiles.some(f => f.name === newFile.name)) {
    alert("File with that name already exists.");
    return;
  }
  videoFiles.push(newFile);
  updateFileList();
  fileInput.value = "";
});

// Download the updated archive (words.json and video files)
document.getElementById("downloadArchiveBtn").addEventListener("click", async () => {
  const zip = new JSZip();
  let updatedJSON;
  try {
    updatedJSON = JSON.parse(editor.getValue());
  } catch (err) {
    alert("Invalid JSON. Please fix errors before downloading.");
    return;
  }
  zip.file("words.json", JSON.stringify(updatedJSON, null, 2));
  const videoFolder = zip.folder("videos");
  videoFiles.forEach(file => {
    videoFolder.file(file.name, file);
  });
  try {
    const content = await zip.generateAsync({ type: "blob" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(content);
    a.download = "archive.zip";
    a.click();
  } catch (err) {
    alert("Error generating archive: " + err);
  }
});
