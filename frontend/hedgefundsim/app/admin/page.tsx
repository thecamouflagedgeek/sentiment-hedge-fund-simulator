"use client";
import React, { useState } from "react";

export default function AdminPage() {
	const [file, setFile] = useState<File | null>(null);
	const [status, setStatus] = useState<string | null>(null);
	const [endpoint, setEndpoint] = useState("/admin/refetch");
	const [responseText, setResponseText] = useState<string | null>(null);

	async function doRefetch() {
		setStatus("Triggering...");
		try {
			const res = await fetch("/admin/refetch", { method: "POST" });
			const txt = await res.text();
			setStatus("OK");
			setResponseText(txt);
		} catch (e) {
			setStatus("Failed");
		}
	}

	async function uploadFile() {
		if (!file) return setStatus("Select a file");
		setStatus("Uploading...");
		const fd = new FormData();
		fd.append("file", file);
		try {
			const res = await fetch("/admin/upload", { method: "POST", body: fd });
			const txt = await res.text();
			setStatus("Uploaded");
			setResponseText(txt);
		} catch (e) {
			setStatus("Upload failed");
		}
	}

	async function testEndpoint() {
		try {
			const res = await fetch(endpoint);
			const txt = await res.text();
			setResponseText(txt);
		} catch (e) {
			setResponseText("Error");
		}
	}

	return (
		<div className="min-h-screen bg-slate-900 text-zinc-50">
			<div className="max-w-4xl mx-auto p-6 space-y-4">
				<h1 className="text-2xl font-semibold">Admin / Data Manager</h1>
				<div className="rounded bg-slate-800/40 p-4 space-y-2">
					<button onClick={doRefetch} className="rounded bg-emerald-600 px-3 py-1">Trigger Refetch</button>

					<div className="mt-2">
						<input type="file" accept=".csv,.json" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
						<button onClick={uploadFile} className="ml-2 rounded bg-sky-600 px-3 py-1">Upload</button>
					</div>

					<div className="mt-4">
						<div className="flex gap-2">
							<input value={endpoint} onChange={(e)=>setEndpoint(e.target.value)} className="flex-1 rounded px-2 py-1 bg-slate-800" />
							<button onClick={testEndpoint} className="rounded bg-indigo-600 px-3 py-1">Test</button>
						</div>
						{status && <div className="text-sm mt-2 text-slate-300">Status: {status}</div>}
						{responseText && <pre className="mt-2 text-xs p-2 bg-slate-900 rounded">{responseText}</pre>}
					</div>
				</div>
			</div>
		</div>
	);
}
