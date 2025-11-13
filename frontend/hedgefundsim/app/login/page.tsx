"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [pw, setPw] = useState("");
	const router = useRouter();

	function submit(e: React.FormEvent) {
		e.preventDefault();
		// placeholder: implement auth
		router.push("/");
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-slate-900">
			<form onSubmit={submit} className="bg-slate-800/50 p-6 rounded space-y-3 max-w-sm w-full">
				<h2 className="text-lg font-semibold">Login</h2>
				<input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" className="w-full px-3 py-2 rounded bg-slate-700" />
				<input type="password" value={pw} onChange={(e)=>setPw(e.target.value)} placeholder="Password" className="w-full px-3 py-2 rounded bg-slate-700" />
				<button className="w-full rounded bg-sky-600 py-2">Sign in</button>
			</form>
		</div>
	);
}
