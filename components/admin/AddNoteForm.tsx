"use client";

import { useState } from "react";

export function AddNoteForm({ submissionId }: { submissionId: string }) {
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!note.trim()) return;
    setStatus("saving");
    try {
      const resp = await fetch("/api/admin/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submission_id: submissionId, note }),
      });
      if (!resp.ok) throw new Error("Failed");
      setNote("");
      setStatus("saved");
      window.location.reload();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Add an internal note…"
        className="w-full border border-[#D7E1EA] rounded-lg min-h-[100px] p-3 text-sm"
      />
      <button
        type="submit"
        disabled={status === "saving"}
        className="bg-[#1F5E95] text-white text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-60"
      >
        {status === "saving" ? "Saving…" : "Save note"}
      </button>
      {status === "error" && <p className="text-red-600 text-sm">Failed to save note.</p>}
    </form>
  );
}
