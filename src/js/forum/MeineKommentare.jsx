import React, { useEffect, useState, useContext } from "react";
import API_BASE from "../config";
import { AuthContext } from "@/forum/AuthContext";
import DeleteModal from "./DeleteModal";

export default function MeineKommentare() {
  const { loggedIn } = useContext(AuthContext);
  const [kommentare, setKommentare] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // ===== Rekursive Funktion: Kommentar + Kinder entfernen =====
const removeCommentWithChildren = (comments, kommentarID) => {
  const idsToRemove = new Set([kommentarID]);
  let added = true;

  while (added) {
    added = false;
    comments.forEach(c => {
      if (c.parentID != null && idsToRemove.has(c.parentID) && !idsToRemove.has(c.kommentarID)) {
        idsToRemove.add(c.kommentarID);
        added = true;
      }
    });
  }

  return comments.filter(c => !idsToRemove.has(c.kommentarID));
};


  // ===== Initial Load =====
  useEffect(() => {
    if (!loggedIn) return;
    fetch(`${API_BASE}/meine-kommentare`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then(res => res.json())
      .then(data => setKommentare(data))
      .finally(() => setLoading(false));
  }, [loggedIn]);

  // ===== Live Updates für gelöschte Einträge =====
  useEffect(() => {
    const handleEntryDelete = (ev) => {
      const { eintragID } = ev.detail;
      setKommentare(prev => prev.filter(k => k.eintragID !== eintragID));
    };

    window.addEventListener("eintragGeloescht", handleEntryDelete);
    return () => window.removeEventListener("eintragGeloescht", handleEntryDelete);
  }, []);

  // ===== Delete Modal Handling =====
  const handleDeleteClick = (k) => {
    setDeleteTarget({ ...k, type: "kommentar" });
    setShowDeleteModal(true);
  };

const confirmDelete = async () => {
  if (!deleteTarget) return;

  const { kommentarID } = deleteTarget;

  try {
    const res = await fetch(`${API_BASE}/kommentar/${kommentarID}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    const data = await res.json();

    if (data.success) {
      setKommentare(prev => removeCommentWithChildren(prev, kommentarID));
      // Event feuern NUR nachdem der State aktualisiert ist
      window.dispatchEvent(new CustomEvent("kommentarGeloescht", { detail: { kommentarID } }));
    }
  } catch (err) {
    console.error("Fehler beim Löschen:", err);
  } finally {
    setShowDeleteModal(false);
    setDeleteTarget(null);
  }
};

  if (!loggedIn) return null;
  if (loading) return <p>Lade Kommentare...</p>;

  return (
    <div>
      <h2 className="fs-5 fw-bold text-primary ps-3">Meine Kommentare</h2>

      {kommentare.map(k => (
        <div key={k.kommentarID} className="card mb-2">
          <div className="p-3 d-flex justify-content-between flex-wrap flex-md-nowrap bg-light rounded-top align-items-center gap-2 gap-md-3">
            <div>
              <small>{new Date(k.eintragErstelltAm).toLocaleDateString("de-DE")}</small>
              <h3 className="card-title fs-5 fw-bold mb-0 text-primary">{k.eintragTitel}</h3>
              <small>von {k.eintragVerfasser}</small>
            </div>
            <a className="btn border border-primary text-primary btn-sm fw-bold bg-white bg-opacity-50 text-nowrap" href={`./eintrag?eintragID=${k.eintragID}`}>Zum Eintrag</a>
          </div>
          <div className="card-body">
            <div className="d-flex align-items-bottom justify-content-between gap-4 gap-md-3 flex-wrap flex-md-nowrap">
              <div>
                <small className="text-primary">Kommentiert am: {new Date(k.erstelltAm).toLocaleString("de-DE")}</small>
                <div style={{ whiteSpace: "pre-wrap" }} dangerouslySetInnerHTML={{ __html: k.inhalt }} />
              </div>
              <div>
                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteClick(k)}>Löschen</button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {kommentare.length === 0 && (
        <>        
        <div className="card">
          <div className="card-body">Keine Kommentare gefunden.</div>
        </div>
        </>
      )}

      <DeleteModal
        show={showDeleteModal}
        target={deleteTarget}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
