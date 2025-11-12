import React, { useState, useEffect } from "react";
import API_BASE from "../config";
import CreateComment from "./CreateComment";
import { useAuth } from "./authContext";

export default function GetComments({ eintragID, loggedIn, maxEbene = 4 }) {
  const [kommentare, setKommentare] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [highlightedComments, setHighlightedComments] = useState([]);
  const { user } = useAuth();

  // ======= Initial load =======
  useEffect(() => {
    const fetchKommentare = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/eintraege/${eintragID}/kommentare`);
        if (!res.ok) throw new Error("Fehler beim Laden");
        const data = await res.json();
        data.sort((a, b) => new Date(b.erstelltAm) - new Date(a.erstelltAm));
        setKommentare(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (eintragID) fetchKommentare();
  }, [eintragID]);

  function fixName(comment, user) {
    return {
      ...comment,
      benutzername:
        comment.benutzername && comment.benutzername !== "Du"
          ? comment.benutzername
          : user?.username ?? "Unbekannt"
    };
  }
    
  // ======= Listener für externe Top-Level-Kommentare =======
    useEffect(() => {
    const handler = (ev) => {
        const newComment = ev.detail;

        if (String(newComment.eintragID) === String(eintragID)) {

        // Nur Top-Level akzeptieren
        if (!newComment.parentID) {
            setKommentare(prev => [
              fixName(newComment, user),
              ...prev
            ]);
        }
        }
    };

    window.addEventListener("kommentarErstellt", handler);
    return () => window.removeEventListener("kommentarErstellt", handler);
    }, [eintragID]);

  // ======= Kommentar hinzufügen (lokal, Replies) =======
    const handleNewReply = (newComment) => {

    setKommentare(prev => [
      fixName(newComment, user),
      ...prev
    ]);

    // Highlight
    setHighlightedComments(prev => [...prev, newComment.kommentarID]);
    setTimeout(() => {
        setHighlightedComments(prev => prev.filter(id => id !== newComment.kommentarID));
    }, 3000);

    };

  // ======= Loading / Fehler / Keine Kommentare =======
  if (loading) return <p>Lade Kommentare…</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!kommentare.length) return <div className="row"><div className="offset-4 col-6">Keine Kommentare vorhanden.</div></div>;

  // ======= Einzelner Kommentar =======
  const CommentItem = ({ comment, level }) => {
    const [showReplyForm, setShowReplyForm] = useState(false);

    return (
      
      <div className={`ebene-${level} row my-4 row-comment-wrapper`}>
        {level === 0 && (
          <div className="col-md-3 col-lg-4 d-flex flex-column align-items-md-end mb-3 mb-md-0 pt-3">
            <div>von <span className="fs-5 text-primary fw-bold">{comment.benutzername}</span></div>
            <span className="text-muted">am {new Date(comment.erstelltAm).toLocaleString()}</span>
          </div>
        )}
        
        <div className={`margin-start-${level} col-md-8 col-xl-6 comment-wrapper py-3 d-flex flex-column ${highlightedComments.includes(comment.kommentarID) ? "new-comment" : ""}`}>
          <div style={{ whiteSpace: "pre-wrap" }} dangerouslySetInnerHTML={{ __html: comment.inhalt }} />
          <small className="text-muted">
            von <span className="text-primary fw-bold">{comment.benutzername}</span> — {new Date(comment.erstelltAm).toLocaleString()}
          </small>

          {/* Button für Antworten */}
          {loggedIn && level < maxEbene && (
            <>
              <button
                className="btn btn-sm bg-white text-primary border border-primary mt-3 align-self-start text-nowrap"
                onClick={(e) => { e.preventDefault(); setShowReplyForm(prev => !prev); }}
              >
                {showReplyForm ? "Formular ausblenden" : "Kommentar kommentieren"}
              </button>

              {showReplyForm && (
                <CreateComment
                  eintragID={eintragID}
                  parentID={comment.kommentarID}
                  onCommentCreated={(newComment) => {
                    handleNewReply(newComment)
                    window.dispatchEvent(
                        new CustomEvent("responseComment", { detail: newComment })
                    )
                  }}
                />
              )}
            </>
          )}

          {/* Rekursives Rendern von Replies */}
          {renderComments(comment.kommentarID, level + 1)}
        </div>
      </div>
    );
  };

  // ======= Rekursives Rendering =======
  const renderComments = (parentID = null, level = 0) => {
    return kommentare
      .filter(c => String(c.parentID) === String(parentID))
      .sort((a, b) => new Date(b.erstelltAm) - new Date(a.erstelltAm))
      .map(c => <CommentItem key={c.kommentarID} comment={c} level={level} />);
  };

  return renderComments(null, 0);
}