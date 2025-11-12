import React, { useEffect, useState, useRef } from "react";
import API_BASE from "../config";

export default function CreateEntry() {
  const [unterthemaID, setUnterthemaID] = useState(null);
  const [unterthema, setUnterthema] = useState(null);
  const [titel, setTitel] = useState("");
  const [inhalt, setInhalt] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [successData, setSuccessData] = useState("");

  const textareaRef = useRef(null);
  const maxHeight = 450; // Max Höhe in px

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

  // URL-Parameter auslesen
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("unterthemaID");
    setUnterthemaID(id);
  }, []);

  // Unterthema + Thema abrufen
  useEffect(() => {
    if (!unterthemaID) return;
    fetch(`${API_BASE}/unterthema/${unterthemaID}`)
      .then(res => res.json())
      .then(setUnterthema)
      .catch(err => console.error(err));
  }, [unterthemaID]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Pflichtfelder prüfen
    if (!titel.trim() || !inhalt.trim()) {
      setError("Titel und Inhalt sind Pflichtfelder.");
      return;
    }

    // HTML Elemente prüfen
    const forbidden = /<(?!\/?(strong|i|em|a)(\s|>|\/))/i;

    if (forbidden.test(inhalt)) {
      setError("Nur <strong>, <i>, <em> und <a> sind erlaubt.");
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

      const response = await fetch(`${API_BASE}/eintrag-erstellen`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          unterthemaID,
          titel,
          inhalt,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Fehler beim Speichern des Eintrags.");
      } else {
        setSuccess("Eintrag erfolgreich gespeichert!");
        setTitel("");
        setInhalt("");
        setSuccessData(data);
      }
    } catch (err) {
      console.error(err);
      setError("Serverfehler. Bitte später erneut versuchen.");
    } finally {
      setLoading(false);
    }
  };

  if (!unterthemaID || !unterthema) return <p>Lade Unterthema...</p>;

  return (
    <div className="create-entry-wrapper min-height-inner row">
      <div className="col-md-8 offset-md-2 offset-lg-0 col-lg-4">
        <div class="pe-5">
          <h2 className="fw-bold fs-4 text-primary">Neuen Eintrag erstellen</h2> 
          <p>
            Thema: <strong>{unterthema.themaTitel}</strong><br />
            Unterthema: <strong>{unterthema.unterthemaTitel}</strong>
          </p>

          <p><small>Bitte beachte, dass als HTML-Markup nur <code>&lt;strong&gt;</code>, <code>&lt;i&gt;</code>, <code>&lt;em&gt;</code> und <code>&lt;a&gt;</code> erlaubt sind.</small></p>
        </div>
      </div>

      <div class="col-md-8 offset-md-2 offset-lg-0 col-lg-6">
        {!success && (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Titel</label>
              <input
                type="text"
                className="form-control"
                value={titel}
                onChange={e => setTitel(e.target.value)}
                placeholder="Titel des Eintrags"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Inhalt</label>
              <textarea
                ref={textareaRef}
                value={inhalt}
                onChange={e => setInhalt(e.target.value)}
                placeholder="Hier deinen Beitrag eingeben (nur <strong>, <i>, <em>, <a>)"
                rows={6}
                className="form-control"
                required
              />
            </div>
            
            <button className="btn btn-primary text-nowrap" type="submit" disabled={loading}>
              {loading ? "Speichern..." : "Eintrag speichern"}
            </button>
          </form>
        )}

        {error && <div className="alert alert-danger mt-3">{error}</div>}
        {success && successData && (
          <>
          <div className="alert alert-success">{success}</div>
          <div className="d-flex gap-2 align-items-center">
            <a className="btn btn-primary" href={`/forum/eintrag?eintragID=${successData.eintragID}`}>Zum Eintrag</a>
            <a className="btn bg-white text-primary border border-primary" href="/forum">Zum Forum</a>
          </div>
          </>
        )}
      </div>
    </div>
  );
}