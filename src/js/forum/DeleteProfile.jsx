import React, { useState, useRef } from "react";
import { Modal } from "bootstrap";
import ReactDOM from "react-dom";
import API_BASE from "../config";
import { useAuth } from "./authContext";

export default function DeleteProfile() {
  const { loggedIn, logout } = useAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const modalRef = useRef(null);
  let modalInstance = null;

  if (!loggedIn) return null;

  const openModal = () => {
    const bootstrap = window.bootstrap;
    modalInstance = new Modal(modalRef.current);
    modalInstance.show();
  };

  const closeModal = () => {
    const bootstrap = window.bootstrap;
    modalInstance = Modal.getInstance(modalRef.current);
    if (modalInstance) modalInstance.hide();
    setPassword("");
    setError("");
  };

  const modal = (
    <div className="modal fade" tabIndex="-1" ref={modalRef}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header border-0">
            <h5 className="modal-title">Profil löschen</h5>
            <button type="button" className="btn-close" onClick={closeModal}></button>
          </div>

          <div className="modal-body bg-opacity-25 bg-primary">
            <p className="lead">
              Willst du dein Profil wirklich löschen? Dieser Vorgang kann{" "}
              <span className="text-primary fw-bold">nicht rückgängig gemacht werden.</span>
            </p>
            <p>Bitte beachten: <span className="text-muted">Wenn Du Dein Profil löscht, werden automatisch auch alle Einträge und Kommentare von Dir gelöscht.</span></p>
            <input
              type="password"
              className="form-control"
              placeholder="Passwort eingeben"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <div className="alert alert-danger mt-2">{error}</div>}
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={closeModal}>
              Abbrechen
            </button>
            <button
              className="btn btn-danger"
              onClick={handleConfirmDelete}
              disabled={loading}
            >
              {loading ? "Löschen…" : "Profil löschen"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  async function handleConfirmDelete() {
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Nicht eingeloggt!");
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE}/delete-profile`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data?.message || "Profil konnte nicht gelöscht werden.");
        setLoading(false);
        return;
      }

      logout();
      closeModal();
      setLoading(false);
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      setError("Serverfehler. Bitte später erneut versuchen.");
      setLoading(false);
    }
  }

  return (
    <>
      <h2 className="lead fw-bold">Profil löschen</h2>
      <p className="text-lg-end fs-6 opacity-75">
        <small>
          Es wird das gesamte Profil sowie alle dazugehörigen Kommentare gelöscht.  
          <strong> Nicht rückgängig.</strong>
        </small>
      </p>

      <button className="btn btn-danger mt-3 bg-opacity-50 align-self-start align-self-lg-end text-nowrap" onClick={openModal}>
        Profil löschen
      </button>

      {ReactDOM.createPortal(modal, document.body)}
    </>
  );
}
