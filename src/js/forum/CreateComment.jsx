import React, { useState, useRef, useEffect } from "react";
import API_BASE from "../config";

export default function CreateComment({ eintragID, parentID = null, onCommentCreated }) {
  const [inhalt, setInhalt] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const textareaRef = useRef(null);
  const maxHeight = 250; // Max Höhe in px

  // Auto-Resize
  const autoResize = () => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = `${Math.min(ta.scrollHeight, maxHeight)}px`;
    }
  };

  useEffect(() => {
    autoResize();
  }, [inhalt]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!inhalt.trim()) {
      setError("Kommentar darf nicht leer sein.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Bitte zuerst einloggen.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE}/kommentar-erstellen`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          eintragID,
          parentID,
          inhalt,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Fehler beim Speichern des Kommentars.");
      } else {
        // === WICHTIG =====================
        // Falls das Backend kein fertiges Objekt sendet → lokal erzeugen
        const newComment = {
          kommentarID: data.kommentarID ?? data.id ?? Math.random(),
          eintragID,
          parentID,
          inhalt,
          erstelltAm: new Date().toISOString(),
          benutzername: data.benutzername ?? "Du",
        };

        // → Dispatch an parent (Eintrag.jsx)
        if (onCommentCreated) onCommentCreated(newComment);

        setSuccess("Kommentar erfolgreich gespeichert!");
        setInhalt("");
      }
    } catch (err) {
      console.error(err);
      setError("Serverfehler. Bitte später erneut versuchen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-comment-wrapper my-2">
      {!success && (
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <textarea
              ref={textareaRef}
              value={inhalt}
              onChange={(e) => setInhalt(e.target.value)}
              placeholder="Kommentar eingeben (nur <strong>, <i>, <em>, <a>)"
              rows={3}
              className="form-control"
              required
            />
          </div>

          <button className="btn btn-primary text-nowrap" type="submit" disabled={loading}>
            {loading ? "Speichern..." : "Kommentar speichern"}
          </button>
        </form>
      )}

      {error && <div className="alert alert-danger mt-3">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
    </div>
  );
}
