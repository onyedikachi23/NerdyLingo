/** @format */

import { useEffectEvent } from "@/hooks/use-effect-event";
import type { ReceivedEventData } from "../../types";
import { toast } from "@/components/ui/toast";
import React from "react";
import { vtSocket } from "../../vt-socket-manager";

export const useListenForUtteranceResult = () => {
	const onResult = useEffectEvent(
		(data: ReceivedEventData<"utterance:result">) => {
			toast.info("Utterance result", {
				description: data.sourceText,
			});
		},
	);

	React.useEffect(() => {
		vtSocket.on("utterance:result", onResult);
		return () => {
			vtSocket.off("utterance:result", onResult);
		};
	}, []);
};
