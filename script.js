async function askAI() {
    let userInput = document.getElementById("question").value;

    let response = await fetch("https://api.github.com/repos/LibertyDreamer/quizzes/actions/workflows/openai.yml/dispatches", {
        method: "POST",
        headers: {
            "Authorization": "Bearer "+ ${GITHUB_TOKEN},
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
        setTimeout(checkWorkflowOutput, 5000);  // ✅ Wait 5 seconds, then check for output
    } else {
        let errorText = await response.text();
        document.getElementById("response").innerText = "Error: " + errorText;
    }
}

async function checkWorkflowOutput() {
    let response = await fetch("https://api.github.com/repos/LibertyDreamer/quizzes/actions/runs", {
        headers: {
            "Authorization": "Bearer " + ${GITHUB_TOKEN},
            "Accept": "application/vnd.github.v3+json"
        }
    });

    let data = await response.json();
    if (data.workflow_runs.length > 0) {
        let latestRun = data.workflow_runs[0];
        let runId = latestRun.id;

        let outputResponse = await fetch(`https://api.github.com/repos/LibertyDreamer/quizzes/actions/runs/${runId}`, {
            headers: {
                "Authorization": "Bearer " + ${GITHUB_TOKEN},
                "Accept": "application/vnd.github.v3+json"
            }
        });

        let outputData = await outputResponse.json();
        if (outputData.jobs && outputData.jobs.length > 0) {
            let aiResponse = outputData.jobs[0].steps.find(step => step.name === "Ask OpenAI").outputs.ai_response;
            document.getElementById("response").innerText = aiResponse || "Response not found.";
        } else {
            document.getElementById("response").innerText = "No output found.";
        }
    } else {
        document.getElementById("response").innerText = "No workflow runs found.";
    }
}
