import React, { useEffect, useState } from "react";
import API_BASE from "../config";

export default function EintraegeListe({ unterthemaID }) {
  const [eintraege, setEintraege] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!unterthemaID) return;

    const fetchEintraege = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(`${API_BASE}/unterthemen/${unterthemaID}/eintraege`);
        if (!res.ok) throw new Error("Fehler beim Laden der Einträge");
        const data = await res.json();
        setEintraege(data);
      } catch (err) {
        console.error(err);
        setError("Einträge konnten nicht geladen werden.");
      } finally {
        setLoading(false);
      }
    };

    fetchEintraege();
  }, [unterthemaID]);

  if (!unterthemaID) return null;
  if (loading) return <p>Lade Einträge...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!eintraege.length) return <div className="border-top border-bottom p-3">Keine Einträge vorhanden.</div>;

  return (
    <div className="eintraege-liste">
      {eintraege.map(e => (
        <a href={`./forum/eintrag?eintragID=${e.eintragID}`} key={e.eintragID} className="border-top p-3 text-decoration-none d-flex align-items-center justify-content-between">
          <div>
            <h3 className="fs-5 m-0 text-primary">{e.titel}</h3>
            <small className="text-dark">{e.kommentarAnzahl} Kommentar{e.kommentarAnzahl !== 1 ? "e" : ""}</small>
          </div>
          <i class="ph ph-caret-right fs-4 text-dark"></i>
        </a>
      ))}
    </div>
  );
}