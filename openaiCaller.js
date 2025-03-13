// openaiCaller.js

// Configuration for your Azure OpenAI endpoint and model.
const endpoint = 'https://models.inference.ai.azure.com/openai/deployments/gpt-4o/chat/completions?api-version=2024-02-15-preview';
const modelHeader = { 'x-ms-model-mesh-model-name': 'gpt-4o' };

/**
 * Calls the Azure OpenAI endpoint with a conversation array.
 *
 * @param {Array} convArray - Array of message objects in the conversation.
 * @param {string} pat - The Azure OpenAI PAT token.
 * @returns {Promise<string>} - Resolves with the AI's message content.
 * @throws Will throw an error if the API returns an error or no choices.
 */
export async function callOpenAI(convArray, pat) {
  const bodyData = {
    messages: convArray,
    temperature: 1,
    max_tokens: 1024,
    top_p: 1
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + pat,
      ...modelHeader
    },
    body: JSON.stringify(bodyData)
  });

  const data = await response.json();

  if (data.error) {
    throw new Error(JSON.stringify(data.error));
  }
  if (!data.choices || data.choices.length === 0) {
    throw new Error("No response from AI");
  }

  return data.choices[0].message.content;
}
