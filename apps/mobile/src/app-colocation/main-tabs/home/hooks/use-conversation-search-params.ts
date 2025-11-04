/** @format */

import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";

type ConversationId = string | null;
interface ConversationSearchParamsControl {
	conversationId: ConversationId;
	setConversationId: (id: ConversationId) => void;
}
export const useConversationSearchParams =
	(): ConversationSearchParamsControl => {
		const { conversationId: id } = useLocalSearchParams<{
			conversationId?: string;
		}>();
		const conversationId: ConversationSearchParamsControl["conversationId"] =
			id ?? null;

		const router = useRouter();
		const setConversationId: ConversationSearchParamsControl["setConversationId"] =
			React.useCallback(
				(id) => {
					router.setParams({ conversationId: id });
				},
				[router],
			);

		return {
			conversationId,
			setConversationId,
		};
	};
