/** @format */

const VISIBLE_CANDLES_COUNT = 5;
// Define reference values for human voice range
const HUMAN_VOICE_MIN = 0.01; // Adjust based on your typical minimum amplitude for speech

const HUMAN_VOICE_MAX = 0.2; // Maximum amplitude for normal speech

const AMPLITUDE_MAX = 0.8; // Maximum possible amplitude

// Define the proportion of canvas height for normal speech
const NORMAL_SPEECH_HEIGHT_PROPORTION = 0.95; // 95% of canvas height for normal speech

const CANDLES_CANVAS_HEIGHT = 100;

/**Amplitude threshold for detecting speech (very low for sensitivity) */
const UTTERANCE_THRESHOLD = HUMAN_VOICE_MIN;
/**Number of consecutive low-amplitude data points required to detect silence (stop utterance) */
const SILENCE_WINDOW_COUNT = 15;

export {
	AMPLITUDE_MAX,
	CANDLES_CANVAS_HEIGHT,
	HUMAN_VOICE_MAX,
	HUMAN_VOICE_MIN,
	NORMAL_SPEECH_HEIGHT_PROPORTION,
	SILENCE_WINDOW_COUNT,
	UTTERANCE_THRESHOLD,
	VISIBLE_CANDLES_COUNT,
};
