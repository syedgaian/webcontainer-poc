"use client";
// src/components/WebContainerComponent.tsx
import { useRef, useState } from "react";
import { WebContainer } from "@webcontainer/api";
import { startDevServer } from "./utils";
import { Button } from "../ui/button";

function WebContainerComponent() {
	const [output, setOutput] = useState<string>("");
	const iframeRef = useRef<HTMLIFrameElement>(null);
	let webContainer: WebContainer;

	const writeOutput = (data: string) => {
		setOutput((prev) => prev + data);
	};

	const createWritableStream = () => {
		return new WritableStream({
			write(data) {
				writeOutput(data);
			},
		});
	};

	const handleError = (error: Error) => {
		writeOutput(`Error: ${error.message}`);
	};

	const startWebContainer = async () => {
		try {
			webContainer = await WebContainer.boot();

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

			let process = await webContainer.spawn("npm", ["install"]);
			process.output.pipeTo(createWritableStream());
			await process.exit;

			process = await webContainer.spawn("npm", ["run", "create:react"]);
			process.output.pipeTo(createWritableStream());
			const viteCreate = await process.exit;

			if (viteCreate === 0) {
				// Install dependencies inside my-react-app
				process = await webContainer.spawn("npm", ["install"], {
					cwd: "/my-react-app",
				});
				process.output.pipeTo(createWritableStream());
				await process.exit;

				// Start development server inside my-react-app
				process = await webContainer.spawn("npm", ["run", "dev"], {
					cwd: "/my-react-app",
				});
				process.output.pipeTo(createWritableStream());

				await startDevServer(webContainer, iframeRef);
			}
		} catch (error: any) {
			handleError(error);
		}
	};

	const destroyContainer = () => {
		webContainer.teardown();
	};

	return (
		<div>
			<Button onClick={startWebContainer} variant="default">
				Start WebContainer
			</Button>
			<Button onClick={destroyContainer} variant="destructive">
				Destroy WebContainer
			</Button>
			<pre>{output}</pre>
			<iframe
				ref={iframeRef}
				style={{ width: "100%", height: "500px" }}
			></iframe>
		</div>
	);
}

export default WebContainerComponent;
