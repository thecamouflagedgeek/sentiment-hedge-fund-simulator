"use client";
import React, { useState } from "react";

export default function AdminPage() {
	const [status, setStatus] = useState<string | null>(null);
	const [file, setFile] = useState<File | null>(null);

	async function refetch() {
		setStatus("Refetching...");
		try {
			const res = await fetch("/admin/refetch", { method: "POST" });
			const txt = await res.text();
			setStatus(`OK: ${txt}`);
		} catch (e) {
			setStatus("Failed to trigger refetch");
		}
	}

	async function upload() {
		if (!file) return setStatus("Select a file first");
		const fd = new FormData();
		fd.append("file", file);
		setStatus("Uploading...");
		try {
			const res = await fetch("/admin/upload", { method: "POST", body: fd });
			const txt = await res.text();
			setStatus(`Upload result: ${txt}`);
		} catch (e) {
			setStatus("Upload failed");
		}
	}

	return (
		<div className="p-8">
			<h2 className="text-xl font-semibold mb-2">Admin / Data Manager</h2>
			<p className="text-sm text-zinc-500 mb-4">Trigger news fetch or upload CSV for batch processing.</p>

			<div className="space-y-4 max-w-lg">
				<button onClick={refetch} className="rounded bg-black text-white px-4 py-2">Trigger Fetch</button>

				<div>
					<input type="file" accept=".csv" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
					<button onClick={upload} className="ml-2 rounded bg-blue-600 text-white px-3 py-1">Upload</button>
				</div>

				{status && <div className="text-sm text-zinc-600">Status: {status}</div>}
			</div>
		</div>
	);
}
