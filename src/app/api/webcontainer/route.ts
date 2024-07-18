// src/app/api/webcontainer/route.ts
import { WebContainer } from "@webcontainer/api";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	const body = await req.json();

	const webContainer = await WebContainer.boot();
	const { files } = body;

	await webContainer.mount(files);

	const installProcess = await webContainer.spawn("npm", ["install"]);
	await installProcess.exit;

	const runProcess = await webContainer.spawn("npm", ["start"]);
	runProcess.output.pipeTo(
		new WritableStream({
			write(data) {
				console.log(data);
			},
		})
	);

	return NextResponse.json({ message: "WebContainer started successfully" });
}
