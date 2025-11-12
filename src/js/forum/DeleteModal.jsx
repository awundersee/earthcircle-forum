import { useEffect, useRef } from "react";
import { Modal } from "bootstrap";
import ReactDOM from "react-dom";

export default function DeleteModal({ show, target, onClose, onConfirm }) {
  const modalRef = useRef();

  useEffect(() => {
    if (!modalRef.current) return;

    const modal = new Modal(modalRef.current, {
      backdrop: "static",
    });

    show ? modal.show() : modal.hide();

    // Cleanup
    return () => modal.hide();
  }, [show]);

  if (!target) return null;

  return ReactDOM.createPortal(
    <div ref={modalRef} className="modal fade" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header border-0">
            <h5 className="modal-title">Löschen bestätigen</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body bg-primary bg-opacity-25 border-0">
            <p className="lead">
              Willst du {target.type === "eintrag" ? "den Eintrag" : "den Kommentar"} <span className="fw-bold text-primary">{target.titel || ""}</span> wirklich endgültig löschen?
            </p>
            <p>Bitte beachten: <span className="text-muted">Der Löschvorgang kann nicht rückgängig gemacht werden und es werden auch alle{" "}
              Kommentare, die zu {target.type === "eintrag" ? "dem Eintrag" : "dem Kommentar"} gehören, gelöscht.</span></p>
          </div>
          <div className="modal-footer border-0">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Abbrechen</button>
            <button type="button" className="btn btn-danger" onClick={onConfirm}>Löschen</button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}