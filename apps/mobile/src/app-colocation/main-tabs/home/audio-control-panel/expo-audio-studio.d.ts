/** @format */

import type {} from "@siteed/expo-audio-studio";

declare module "@siteed/expo-audio-studio" {
	// Define a type for the permission response.
	export type PermissionResponse = {
		status: "granted" | "denied" | "undetermined";
		expires: "never";
		canAskAgain: boolean;
		granted: boolean;
	};

	// Define the main module object.
	export const ExpoAudioStreamModule: {
		requestPermissionsAsync: () => Promise<PermissionResponse>;
		getPermissionsAsync: () => Promise<PermissionResponse>;
		extractAudioData: (options: any) => Promise<any>;
		trimAudio: (options: any) => Promise<any>;
		prepareRecording: (options: any) => Promise<boolean>;
		addListener: (
			eventName: string,
			listener: Function,
		) => { remove: () => void };
		removeAllListeners: (eventName: string) => void;
		sendEvent: (eventName: string, params: any) => void;
	};
}
