// src/components/TerminalComponent.tsx
import React, { useEffect } from "react";
import { ReactTerminal, TerminalContext } from "react-terminal";
import styles from "./TerminalComponent.module.scss";

interface TerminalComponentProps {
	output: string;
	theme: string;
}

interface Theme {
	themeBGColor: string;
	themeToolbarColor: string;
	themeColor: string;
	themePromptColor: string;
	errorColor: string;
	linkColor: string;
	successColor?: string;
}

const TerminalComponent: React.FC<TerminalComponentProps> = ({
	output,
	theme,
}) => {
	const { setBufferedContent } = React.useContext(TerminalContext);
	const themes: { [key: string]: Theme } = {
		matrix: {
			themeBGColor: "#0D0208",
			themeToolbarColor: "#0D0208",
			themeColor: "#00FF41",
			themePromptColor: "#008F11",
			errorColor: "#008F11",
			successColor: "#008F11",
			linkColor: "#00FF41",
		},
		ocean: {
			themeBGColor: "#224fbc",
			themeToolbarColor: "#216dff",
			themeColor: "#e5e5e5",
			themePromptColor: "#00e5e5",
			errorColor: "#e5e500",
			linkColor: "#e5e5e5",
		},
		portfolio: {
			themeBGColor: "#fdf6e4",
			themeToolbarColor: "#d8d8d8",
			themeColor: "#333",
			themePromptColor: "#4495D4",
			errorColor: "#FF443E",
			successColor: "#5B9E47",
			linkColor: "#4495D4",
		},
	};
	const error = {
		color: themes[theme].errorColor,
		fontWeight: "bold",
	};
	const success = {
		color: themes[theme].successColor,
		fontWeight: "bold",
	};
	const link = {
		color: themes[theme].linkColor,
		textDecoration: "underline",
		cursor: "pointer",
	};
	const welcomeMessage = (
		<span>
			Click <strong>Start WebContainer</strong> button !!
			<br />
			<br />
		</span>
	);

	useEffect(() => {
		// Programmatically add logs
		setBufferedContent(output);
	}, [output]);

	return (
		<div className={styles.terminal}>
			<ReactTerminal
				name="WebContainer Terminal"
				welcomeMessage={welcomeMessage}
				prompt="$"
				errorMessage={<span style={error}>Command not found</span>}
				enableInput={false}
				showControlBar={false}
				showControlButtons={false}
				themes={themes}
				theme={theme}
			/>
		</div>
	);
};

export default TerminalComponent;
