import React, { useEffect, useState } from "react";
import EintraegeListe from "./EintraegeListe.jsx";
import API_BASE from "../config";

export default function UnterthemenListe({ themaID }) {
  const [unterthemen, setUnterthemen] = useState([]);

  useEffect(() => {
    if (!themaID) return;

    fetch(`${API_BASE}/themen/${themaID}/unterthemen`)
      .then(res => res.json())
      .then(setUnterthemen)
      .catch(err => console.error(err));
  }, [themaID]);

  if (!unterthemen.length) return null;

  return (
    <div className="unterthemen accordion shadow-sm">
      {unterthemen.map(u => (
        <div data-unterthemaid={u.unterthemaID} key={u.unterthemaID} className="accordion-item border-primary">
            <h2 className="accordion-header">
                <button 
                    className="accordion-button collapsed border-0 shadow-none fs-5 fw-bold" 
                    type="button" 
                    data-bs-toggle="collapse"
                    data-bs-target={`#unterthema-${u.unterthemaID}`}
                    aria-expanded="false" 
                    aria-controls={`unterthema-${u.unterthemaID}`}
                >
                  <div className="accordion-content">
                    <span className="me-2 text-wrap accordion-text">{u.titel}</span>
                    <span className="fw-light badge rounded-3 bg-primary bg-opacity-25 text-primary">{u.eintragCount ?? 0}</span>
                  </div>
                </button>
            </h2>
          <div
            id={`unterthema-${u.unterthemaID}`}
            className="accordion-collapse collapse" 
          >
            <div className="p-3 bg-primary bg-opacity-25 opacity-75 text-dark" dangerouslySetInnerHTML={{ __html: u.inhalt ?? "" }} />
            <EintraegeListe unterthemaID={u.unterthemaID} />
            <a href={`./eintrag-verfassen?unterthemaID=${u.unterthemaID}`} className="btn-eintrag-verfassen p-3 bg-primary bg-opacity-25 text-primary w-100 d-inline-block text-decoration-none border-top border-primary border-bottom">Einen neuen Eintrag verfassen <i class="ph ph-caret-right"></i></a>
          </div>
        </div>
      ))}
    </div>
  );
}
