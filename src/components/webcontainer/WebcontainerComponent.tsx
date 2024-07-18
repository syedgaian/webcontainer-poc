"use client";
// src/components/WebContainerComponent.tsx
import { useRef, useState } from "react";
import { WebContainer } from "@webcontainer/api";
import { startDevServer } from "./utils";

function WebContainerComponent() {
	const [output, setOutput] = useState<string>("");
	const iframeRef = useRef<HTMLIFrameElement>(null);

	const startWebContainer = async () => {
		const webContainer = await WebContainer.boot();

		const files = {
			"package.json": {
				file: {
					contents: JSON.stringify({
						name: "webcontainer-app",
						version: "1.0.0",
						dependencies: {},
						devDependencies: {
							"create-vite": "latest",
						},
						scripts: {
							"create:react":
								"npm create vite@latest my-react-app -- --template react && ls",
						},
					}),
				},
			},
		};

		await webContainer.mount(files);

		const installProcess = await webContainer.spawn("npm", ["install"]);
		installProcess.output.pipeTo(
			new WritableStream({
				write(data) {
					setOutput((prev) => prev + data);
				},
			})
		);
		await installProcess.exit;

		const createAppProcess = await webContainer.spawn("npm", [
			"run",
			"create:react",
		]);
		createAppProcess.output.pipeTo(
			new WritableStream({
				write(data) {
					setOutput((prev) => prev + data);
				},
			})
		);
		const viteCreate = await createAppProcess.exit;

		if (viteCreate === 0) {
			const cdIntoFolder = await webContainer.spawn("cd", [
				"my-react-app",
			]);
			cdIntoFolder.output.pipeTo(
				new WritableStream({
					write(data) {
						setOutput((prev) => prev + data);
					},
				})
			);
			if ((await cdIntoFolder.exit) === 0) {
				const installProcess = await webContainer.spawn("npm", [
					"install",
				]);
				installProcess.output.pipeTo(
					new WritableStream({
						write(data) {
							setOutput((prev) => prev + data);
						},
					})
				);
				await installProcess.exit;
				const startProcess = await webContainer.spawn("npm", ["run"]);
				startProcess.output.pipeTo(
					new WritableStream({
						write(data) {
							setOutput((prev) => prev + data);
						},
					})
				);

				await startDevServer(webContainer, iframeRef);
			}
		}
	};

	return (
		<div>
			<button onClick={startWebContainer}>Start WebContainer</button>
			<pre>{output}</pre>
			<iframe
				ref={iframeRef}
				style={{ width: "100%", height: "500px" }}
			></iframe>
		</div>
	);
}

export default WebContainerComponent;
