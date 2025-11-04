/** @format */

import { getAuthToken } from "@/app-colocation/auth/utils";
import { AudioControlPanel } from "@/app-colocation/main-tabs/home/audio-control-panel";
import { ConversationRoomProvider } from "@/app-colocation/main-tabs/home/conversation-room-context";
import { TranslationTranscript } from "@/app-colocation/main-tabs/home/translation-transcript";
import { vtSocket } from "@/app-colocation/main-tabs/home/vt-socket-manager";
import { Box } from "@/components/ui/box";
import { toast } from "@/components/ui/toast";
import { getErrorMessage } from "@/lib/utils";
import React from "react";

export default function HomeScreen() {
	React.useEffect(() => {
		const onConnectError = (error: unknown) => {
			toast.error("Couldn't connect to voice translate panel", {
				description: getErrorMessage(error),
			});
		};
		vtSocket.on("connect_error", onConnectError);
		const setupVtSocket = async () => {
			try {
				const accessToken = await getAuthToken();

				if (!accessToken) {
					throw new Error("User not authenticated");
				}
				vtSocket.auth = { accessToken };
				vtSocket.connect();
			} catch (error) {
				toast.error("Unable to setup Voice Translate Panel", {
					description: getErrorMessage(error),
				});
				console.error(error);
			}
		};
		void setupVtSocket();

		return () => {
			vtSocket.off("connect_error", onConnectError);
			vtSocket.disconnect();
		};
	}, []);

	return (
		<ConversationRoomProvider>
			<Box className="flex-1 gap-6 px-1 py-4">
				<TranslationTranscript />

				<AudioControlPanel />
			</Box>
		</ConversationRoomProvider>
	);
}
