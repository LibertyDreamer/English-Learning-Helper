<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Zip Archive Drill System</title>
  <!-- Include JSZip for archive handling -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>Zip Archive Drill System</h1>
  
  <!-- Drill Section -->
  <section id="drillSection">
    <h2>Drill</h2>
    <div id="drill-card-section">
      <h3 id="currentWord"></h3>
      <video id="drillVideo" controls></video>
      
      <!-- Controls Row -->
      <div id="controlsRow">
        <button id="repeatFragmentBtn">Repeat Fragment</button>
        <button id="showTextBtn">Show Example</button>
      </div>
      
      <!-- Rating Buttons (in one row) -->
      <div id="ratingSection">
        <button class="ratingBtn" data-rating="0">0%</button>
        <button class="ratingBtn" data-rating="10">10%</button>
        <button class="ratingBtn" data-rating="20">20%</button>
        <button class="ratingBtn" data-rating="30">30%</button>
        <button class="ratingBtn" data-rating="40">40%</button>
        <button class="ratingBtn" data-rating="50">50%</button>
        <button class="ratingBtn" data-rating="60">60%</button>
        <button class="ratingBtn" data-rating="70">70%</button>
        <button class="ratingBtn" data-rating="80">80%</button>
        <button class="ratingBtn" data-rating="90">90%</button>
        <button class="ratingBtn" data-rating="100">100%</button>
      </div>
      
      <!-- Ignore Word Button (moved to its own row) -->
      <div id="ignoreWordRow">
        <button id="ignoreWordBtn">Ignore Word</button>
      </div>
      
      <!-- Example Text -->
      <p id="currentExample" style="display: none;"></p>
    </div>
  </section>
  
  <!-- Archive Management Section -->
  <section id="archiveManagement">
    <h2>Archive Management</h2>
    <div>
      <label for="archiveFile">Load Archive (.zip):</label>
      <input type="file" id="archiveFile" accept=".zip">
    </div>
    <div>
      <button id="exportArchiveBtn">Export Archive</button>
    </div>
  </section>
  
  <!-- New Content Section -->
  <section id="newContentSection">
    <h2>Add New Content (Video + SRT)</h2>
    <div>
      <label for="newVideo">Video File:</label>
      <input type="file" id="newVideo" accept="video/*">
      <label for="newSRT">SRT File:</label>
      <input type="file" id="newSRT" accept=".srt">
      <button id="addNewContentBtn">Add New Content</button>
    </div>
  </section>
  
  <script src="script.js"></script>
</body>
</html>
