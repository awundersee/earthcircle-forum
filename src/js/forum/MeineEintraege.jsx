import React, { useEffect, useState, useContext } from "react";
import API_BASE from "../config";
import { AuthContext } from "@/forum/AuthContext";
import DeleteModal from "./DeleteModal";

export default function MeineEintraege() {
  const { loggedIn } = useContext(AuthContext);
  const [eintraege, setEintraege] = useState([]);
  const [loading, setLoading] = useState(true);

  // ===== Modal-Handling =====
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    if (!loggedIn) return;
    fetch(`${API_BASE}/meine-eintraege`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then(res => res.json())
      .then(data => setEintraege(data))
      .finally(() => setLoading(false));
  }, [loggedIn]);

  // ===== Modal öffnen =====
  const handleDeleteClick = (e) => {
    setDeleteTarget({ ...e, type: "eintrag" });
    setShowDeleteModal(true);
  };

  // ===== Löschen bestätigen =====
  const confirmDelete = async () => {
    const { eintragID } = deleteTarget;
    const res = await fetch(`${API_BASE}/eintrag/${eintragID}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const data = await res.json();
    if (data.success) {
      // Eintrag lokal entfernen
      setEintraege(prev => prev.filter(e => e.eintragID !== eintragID));
      // Event feuern, damit Kommentare live entfernt werden
      window.dispatchEvent(new CustomEvent("eintragGeloescht", { detail: { eintragID } }));
    }
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  if (!loggedIn) return null;
  if (loading) return <p>Lade Einträge...</p>;

  return (
    <div>
      <h2 className="fs-5 fw-bold text-primary ps-3">Meine Einträge</h2>
      {eintraege.map(e => (
        <div key={e.eintragID} className="card mb-2">
          <div className="p-3 border-bottom border-primary bg-none">
            <div className="d-flex gap-2 gap-md-3 align-items-center justify-content-between flex-wrap flex-md-nowrap">
              <div>
                <small className="text-primary">Erstellt am: {new Date(e.erstelltAm).toLocaleDateString("de-DE")}</small>
                <h3 className="card-title fs-5 fw-bold text-primary">{e.titel}</h3>
              </div>
              <a className="btn border border-primary text-primary btn-sm fw-bold text-nowrap" href={`./forum/eintrag?eintragID=${e.eintragID}`}>Zum Eintrag</a>
            </div>
          </div>
          <div className="card-body">
            <div className="d-flex align-items-end gap-4 gap-md-3 justify-content-between flex-wrap flex-md-nowrap">
              <div style={{ whiteSpace: "pre-wrap" }} dangerouslySetInnerHTML={{ __html: e.inhalt }} />
              <button className="btn btn-danger btn-sm" onClick={() => handleDeleteClick(e)}>Löschen</button>
            </div>
          </div>
        </div>
      ))}

      {eintraege.length === 0 && (
        <>        
        <div className="card">
          <div className="card-body">Keine Einträge gefunden.</div>
        </div>
        </>
      )}      

      {/* Modal am Ende der Seite */}
      <DeleteModal
        show={showDeleteModal}
        target={deleteTarget}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
