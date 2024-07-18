import { WebContainer } from "@webcontainer/api";

export async function startDevServer(
	webContainer: WebContainer,
	iframeRef: any
) {
	// run `npm run start` to start the express app
	await webContainer.spawn("npm", ["run", "dev"]);

	// wait for `server-ready` event
	webContainer.on("server-ready", (port, url) => {
		console.log(port, url);
		if (iframeRef.current) {
			iframeRef.current.src = url;
		}
	});
}

export async function installDependencies(webContainer: WebContainer) {
	// install dependencies
	const installProcess = await webContainer.spawn("npm", ["install"]);

	installProcess.output.pipeTo(
		new WritableStream({
			write(data) {
				console.log(data);
			},
		})
	);

	// wait for install command to exit
	return installProcess.exit;
}

export async function runCommand(
	webContainer: WebContainer,
	command: string,
	args: string[]
) {
	// install dependencies
	const process = await webContainer.spawn(command, args);

	process.output.pipeTo(
		new WritableStream({
			write(data) {
				console.log(data);
			},
		})
	);

	// wait for install command to exit
	return process.exit;
}
