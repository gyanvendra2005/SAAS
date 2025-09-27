"use client";
import { useEffect, useState } from "react";

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);


  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const tenantSlug = typeof window !== "undefined" ? localStorage.getItem("tenant_slug") : null;
  const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;

  async function fetchNotes() {
    setLoading(true);
    try {
      const res = await fetch("/api/notes", { headers: { Authorization: "Bearer " + token } });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Could not fetch notes");
      else setNotes(data);
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
    setLoading(false);
  }

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }
    fetchNotes();
  }, []);

  async function createNote(e) {
    e.preventDefault();
    setError(null);
    if (!title || !content) {
      setError("Title and Content are required");
      return;
    }

    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({ title, content }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.error && data.error.toLowerCase().includes("limit"))
          setError("Limit reached — upgrade to Pro to add more notes.");
        else setError(data.error || "Create failed");
        return;
      }
      setNotes((prev) => [data, ...prev]);
      setTitle("");
      setContent("");
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  }

  async function del(id) {
    try {
      await fetch(`/api/notes/${id}`, { method: "DELETE", headers: { Authorization: "Bearer " + token } });
      setNotes((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      setError(err.message || "Delete failed");
    }
  }

  async function upgrade() {
    setError(null);
    try {
      const res = await fetch(`/api/tenants/${tenantSlug}/upgrade`, { method: "POST", headers: { Authorization: "Bearer " + token } });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Upgrade failed");
        return;
      }
      alert("Upgraded to Pro! You can now create unlimited notes.");
      fetchNotes();
    } catch (err) {
      setError(err.message || "Upgrade failed");
    }
  }
 const tenantPlan = typeof window !== "undefined" ? localStorage.getItem("tenant_plan") : "free";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Notes</h2>
        <p className="text-center mb-6 text-gray-600">
          Role: <strong>{role}</strong>
        </p>

        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <form onSubmit={createNote} className="space-y-4">
            {error && <p className="text-red-600">{error}</p>}
            <input
              className="w-full border text-black rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
            />
            <textarea
              className="w-full border text-black rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Content"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition w-full"
            >
              Create
            </button>
          </form>
        </div>

     {notes.length >= 3 && tenantPlan === "free" && (
  <div className="bg-yellow-100 border-l-4 border-yellow-400 text-yellow-700 p-4 mb-6 rounded">
    <p>You have reached the Free plan limit (3 notes).</p>
    {role === "admin" ? (
      <button
        onClick={upgrade}
        className="mt-2 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
      >
        Upgrade to Pro
      </button>
    ) : (
      <p className="mt-2 text-sm">Ask an Admin to upgrade your tenant to Pro.</p>
    )}
  </div>
)}


        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <div className="grid gap-4">
            {notes.map((n) => (
              <div key={n._id} className="bg-white shadow rounded p-4">
                <h3 className="text-xl text-black font-semibold mb-1">{n.title}</h3>
                <p className="text-gray-700 mb-2">{n.content}</p>
                <small className="text-gray-400">{new Date(n.createdAt).toLocaleString()}</small>
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={() => del(n._id)}
                    className="text-red-500 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
