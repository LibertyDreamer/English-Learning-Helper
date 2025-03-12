async function askAI() {
    let userInput = document.getElementById("question").value;

    let response = await fetch("https://api.github.com/repos/LibertyDreamer/openai-github-actions/actions/workflows/openai.yml/dispatches", {
        method: "POST",
        headers: {
            "Authorization": "Bearer YOUR_GITHUB_PERSONAL_ACCESS_TOKEN",
            "Accept": "application/vnd.github.v3+json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            ref: "main",
            inputs: { question: userInput }
        })
    });

    if (response.ok) {
        document.getElementById("response").innerText = "Processing...";
    } else {
        document.getElementById("response").innerText = "Error starting request.";
    }
}
