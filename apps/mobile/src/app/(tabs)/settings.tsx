/** @format */

import { useAuth } from "@/app-colocation/auth/context";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

export default function SettingsScreen() {
	const { logout } = useAuth();
	return (
		<Box className="flex-1 items-center justify-center">
			<Text>Settings Screen</Text>
			<Button onPress={() => void logout()}>
				<ButtonText>Log out</ButtonText>
			</Button>
		</Box>
	);
}
