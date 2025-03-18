const availableVoices = [
    "Matthew", "Joanna", "Kimberly", "Salli", 
    "Amy", "Emma", "Brian", "Russell"
];

/**
 * Converts text to speech using StreamElements API.
 *
 * @param {string} text - The text to be spoken.
 * @param {string} [voice="Salli"] - The voice to use (must be one of the available voices).
 */
export async function sayThis(text, voice = "Salli") {
    if (!text) {
        console.error("No text provided.");
        return;
    }

    if (!availableVoices.includes(voice)) {
        console.warn(`Invalid voice "${voice}". Defaulting to "Salli".`);
        voice = "Salli";
    }

    const ttsUrl = `https://api.streamelements.com/kappa/v2/speech?voice=${voice}&text=` + encodeURIComponent(text);

    try {
        const audio = new Audio(ttsUrl);
        await audio.play();
    } catch (error) {
        console.error("TTS Error:", error);
    }
}

/**
 * Returns a list of available voices.
 */
export function getAvailableVoices() {
    return availableVoices;
}
