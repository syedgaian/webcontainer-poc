// src/components/WebContainerComponent.tsx
"use client";
import { useState } from "react";
import { WebContainer } from "@webcontainer/api";

function WebContainerComponent() {
	const [output, setOutput] = useState<string>("");

	const startWebContainer = async () => {
		const webContainer = await WebContainer.boot();

		const files = {
			"package.json": {
				file: {
					contents: JSON.stringify({
						name: "webcontainer-app",
						version: "1.0.0",
						scripts: {
							start: "node index.js",
						},
					}),
				},
			},
			"index.js": {
				file: {
					contents: `
            const http = require('http');
            const server = http.createServer((req, res) => {
              res.writeHead(200, { 'Content-Type': 'text/plain' });
              res.end('Hello, world!');
            });
            server.listen(3000, () => {
              console.log('Server running at http://localhost:3000/');
            });
          `,
				},
			},
		};

		await webContainer.mount(files);

		const installProcess = await webContainer.spawn("npm", ["install"]);
		installProcess.output.pipeTo(
			new WritableStream({
				write(data) {
					console.log(data);
				},
			})
		);
		await installProcess.exit;

		const runProcess = await webContainer.spawn("npm", ["start"]);
		runProcess.output.pipeTo(
			new WritableStream({
				write(data) {
					setOutput((prev) => prev + data);
				},
			})
		);
	};

	return (
		<div>
			<button onClick={startWebContainer}>Start WebContainer</button>
			<pre>{output}</pre>
		</div>
	);
}

export default WebContainerComponent;
