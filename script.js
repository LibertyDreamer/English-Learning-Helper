async function askAI() {
    let userInput = document.getElementById("question").value;

    let response = await fetch("https://api.github.com/repos/LibertyDreamer/openai-github-actions/actions/workflows/openai.yml/dispatches", {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + TOKEN_AI,  // Change this to your real token!
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
        let errorText = await response.text();
        document.getElementById("response").innerText = "Error: " + errorText;
    }
}
