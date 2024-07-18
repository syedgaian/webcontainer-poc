/** @type {import('next').NextConfig} */
const nextConfig = {
	async headers() {
		return [
			{
				// Apply these headers to all routes in your application.
				source: "/(.*)",
				headers: [
					{
						key: "Cross-Origin-Embedder-Policy",
						value: "require-corp",
					},
					{
						key: "Cross-Origin-Opener-Policy",
						value: "same-origin",
					},
				],
			},
		];
	},
};

export default nextConfig;
