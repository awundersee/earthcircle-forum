import React, { useEffect, useState } from "react";
import CreateComment from "./CreateComment";
import LoginForm from "./LoginForm";
import GetComments from "./GetComments"; // Import hinzufügen
import API_BASE from "../config";
import { useAuth } from "./authContext";

export default function Entry({ eintragID }) {
  const { loggedIn } = useAuth();
  const [eintrag, setEintrag] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!eintragID) return;

    const fetchEintrag = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(`${API_BASE}/eintrag/${eintragID}`);
        if (!res.ok) throw new Error("Fehler beim Laden der Einträge");
        const data = await res.json();
        setEintrag(data);
      } catch (err) {
        console.error(err);
        setError("Eintrag konnte nicht geladen werden.");
      } finally {
        setLoading(false);
      }
    };

    fetchEintrag();
  }, [eintragID]);

  useEffect(() => {
    const handler = (ev) => {
      const newComment = ev.detail;

      setEintrag(prev =>
        prev.map(item => {
          if (item.eintragID === newComment.eintragID) {
            const current = Number(item.kommentarAnzahl || 0);
            return { ...item, kommentarAnzahl: current + 1 }
          }
          return item;
        })
      );
    };

    window.addEventListener("responseComment", handler)
    return () => window.removeEventListener("responseComment", handler)
  }, []);


  if (!eintragID) return null;
  if (loading) return <p>Lade Einträge...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!eintrag.length) return <div className="border-bottom p-3 text-center">Kein Inhalt.</div>;

  // ... innerhalb der Komponente Eintrag
  const handleCommentCreated = (newComment) => {
    // Event feuern, damit GetComments (Listener) das neue Kommentar vorne einfügt
    window.dispatchEvent(new CustomEvent("kommentarErstellt", { detail: newComment }));

    // Und die Kommentaranzahl des aktuellen Eintrags lokal inkrementieren
    setEintrag(prev => prev.map(item => {
      if (item.eintragID === newComment.eintragID) {
        // kommentarAnzahl scheint als String gespeichert zu sein (siehe dein vorheriger Code)
        const current = Number(item.kommentarAnzahl || 0);
        return { ...item, kommentarAnzahl: String(current + 1) };
      }
      return item;
    }));
  };

  return (
    <>
    {eintrag.map(e => (
      <>
      <section className="eintrag-wrapper bg-primary bg-opacity-25">
        <div className="px-1 px-sm-2 px-md-3 px-lg-4 px-xl-5">
          <div className="container-fluid py-5">
            <div className="row">
                <div className="col-lg-4">
                  <p className="d-flex align-items-center gap-2 mb-1">
                    <span className="text-primary">{new Date(e.eintragErstelltAm).toLocaleDateString('de-DE')}</span>
                    {e.kommentarAnzahl != "0" && (
                      <>
                      <span className="text-muted">|</span>
                      <span className="text-muted fs-6">{e.kommentarAnzahl} Kommentar{e.kommentarAnzahl !== 1 ? "e" : ""}</span>
                      </>
                    )}
                  </p>
                  <h1 className="fs-5 m-0 text-primary fw-bold">{e.eintragTitel}</h1>
                  <p>
                    von {e.benutzername}
                  </p>
                  <div class="kategorie-wrapper d-flex gap-1 align-items-center mb-4 mb-lg-0 flex-wrap">
                    {e.themaTitel && (
                      <span className="badge bg-light bg-opacity-75 text-primary fw-regular fw-normal fs-6">
                        {e.themaTitel}
                      </span>
                    )}
                    {e.unterthemaTitel && (
                      <>
                        <i class="ph ph-caret-right text-muted fs-6"></i>
                        <span className="badge bg-light bg-opacity-25 text-primary fw-regular fw-normal fs-6">
                          {e.unterthemaTitel}
                        </span>
                      </>
                    )}   
                  </div>  
                </div>
                <div className="col-lg-8 col-xl-6 mt-4" style={{ whiteSpace: "pre-wrap" }} dangerouslySetInnerHTML={{ __html: e.eintragInhalt }} />              
            </div>
          </div>
        </div>
      </section>
      <section className="eintrag-kommentar-wrapper bg-primary bg-opacity-50 border-top border-primary">
        <div className="px-1 px-sm-2 px-md-3 px-lg-4 px-xl-5">
          <div className="container-fluid py-5">
            <div className="row">      
              {loggedIn ? (
                <>
                <div className="col-lg-4">
                  <div className="pe-5">
                    <h2 className="fs-5 fw-bold text-primary">Was denkst Du?</h2>
                    <p><span className="fw-bold">Hinterlasse einen Kommentar</span> als Antwort zum Eintrag von {e.benutzername}.<br />
                      <small className="text-muted">Bitte beachte, dass als HTML-Markup nur <code>&lt;strong&gt;</code>, <code>&lt;i&gt;</code>,{" "}
                      <code>&lt;em&gt;</code> und <code>&lt;a&gt;</code> erlaubt sind.</small></p>
                  </div>
                </div>
                <div className="col-lg-8 col-xl-6">

                    <CreateComment eintragID={e.eintragID} parentID={null} onCommentCreated={handleCommentCreated} />

                </div>
                </>
              ) : (
                <div className="col-lg-4 offset-lg-4 mt-4">
                  <h3 className="fs-6 mb-4 fw-bold">Zum Kommentieren bitte einloggen:</h3>
                  <LoginForm />
                </div>
              )}
            </div>  
          </div>
        </div>
      </section>
      <section className="border-bottom">
        <div className="px-1 px-sm-2 px-md-3 px-lg-4 px-xl-5">
          <div className="container-fluid py-5">
            <div className="row">   
              {/* Kommentare anzeigen (sichtbar für alle) */}
              <div className="col-12">
                <GetComments eintragID={e.eintragID} loggedIn={loggedIn} maxEbene={4} />
              </div>
            </div>  
          </div>
        </div>
      </section>
      </>
    ))}
    </>
  );
}