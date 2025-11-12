import React, { useState, useEffect } from "react";
import { useAuth } from "@/forum/AuthContext";

import API_BASE from "../config";

export default function ResetPassword() {
  const [mode, setMode] = useState("request"); // "request" oder "reset"
  const [hash, setHash] = useState("");
  const [identifier, setIdentifier] = useState(""); // E-Mail oder Benutzername
  const [neuesPasswort, setNeuesPasswort] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const { loggedIn } = useAuth();

  const validatePassword = (neuesPasswort) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/.test(neuesPasswort);

  // Prüfen, ob hash im URL-Parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const h = params.get("hash");
    if (h) {
      setHash(h);
      setMode("reset");
    }
  }, []);

  const handleRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!identifier.trim()) {
      setError("Bitte Benutzername oder E-Mail eingeben.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/passwort-zuruecksetzen-anfordern`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Fehler beim Anfordern");

      setSuccess("E-Mail zum Zurücksetzen wurde gesendet.");
      setIdentifier("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!neuesPasswort.trim()) {
      setError("Bitte neues Passwort eingeben.");
      setLoading(false);
      return;
    }

    if (neuesPasswort !== confirmPassword) {
      setError("Passwörter stimmen nicht überein.");
      setLoading(false);
      return;
    }

    if (!validatePassword(neuesPasswort)) {
      setError(
        "Passwort muss mindestens 8 Zeichen lang sein und Groß-/Kleinbuchstaben, Zahlen und Sonderzeichen enthalten."
      );
      setLoading(false);
      return;
    }    

    try {
      const res = await fetch(`${API_BASE}/passwort-zuruecksetzen`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hash, neuesPasswort }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Fehler beim Zurücksetzen");

      setSuccess("Passwort erfolgreich geändert. Du kannst dich nun einloggen.");
      setNeuesPasswort("");
      setConfirmPassword("");
      setMode("request"); // optional: wieder zum Anfrage-Modus
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-entry-wrapper min-height-inner row">
      <div className="col-md-4">
        <div className="pe-5">
          {!success ? (
            <h2 className="fw-bold fs-4 text-primary">Passwort zurücksetzen</h2> 
          ):(
            <>
            <a href="./forum" className="btn btn-primary me-3 text-nowrap">Zum Forum</a>
            <a href="./forum/login" className="btn text-primary border-primary text-nowrap">Zum Login</a>
            </>
          )}

        {loggedIn && (
            <p className="lead text-primary">Auch <span class="fw-bold">eingeloggte Benutzer</span> müssen Ihr Passwort aktuell über <span className="fw-bold">den Link in der Mail ändern.</span></p>
        )}

        {mode === "request" && !success && (

          <p>
            Bitte gib Deinen <strong>Benutzernamen</strong> oder Deine <strong>E-Mail-Adresse</strong> ein. Du bekommst Dann eine E-Mail mit einem Link über den Du Dein Passwort zurücksetzen kannst. 
          </p>

        )}

        {mode === "reset" && !success && (
            <>
                <p className="lead text-primary">
                    Bitte gib ein <span className="fw-bold">neues Passwort</span> ein. 
                </p>

                <p><strong>Bitte Beachte:</strong> Auch das neue Passwort muss mindestens 8 Zeichen lang sein und Groß-/Kleinbuchstaben, Zahlen und Sonderzeichen enthalten.</p>
            </>
        )}        

        </div>
      </div>

      <div className="col-md-8 col-lg-6">
        <div className="reset-password-wrapper">

        {mode === "request" && !success && (
            <form onSubmit={handleRequest}>
            <div className="mb-3">
                <label className="form-label"><span className="fw-bold text-primary">Benutzername</span> oder <span className="fw-bold text-primary">E-Mail</span></label>
                <input
                type="text"
                className="form-control"
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                placeholder="Benutzername oder E-Mail"
                required
                />
            </div>
            <button type="submit" className="btn btn-primary " disabled={loading}>
                {loading ? "Senden..." : "Link zum Zurücksetzen anfordern"}
            </button>
            </form>
        )}

        {mode === "reset" && !success && (
            <form onSubmit={handleReset}>
            <div className="mb-3">
                <label className="form-label fw-bold text-primary">Neues Passwort</label>
                <input
                type="password"
                className="form-control"
                value={neuesPasswort}
                onChange={e => setNeuesPasswort(e.target.value)}
                placeholder="Neues Passwort"
                required
                />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Passwort bestätigen</label>
              <input
                type="password"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Passwort bestätigen"
                required
              />
            </div>            
            <button type="submit" className="btn btn-primary text-nowrap" disabled={loading}>
                {loading ? "Speichern..." : "Passwort zurücksetzen"}
            </button>
            </form>
        )}

        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-danger mt-4">{error}</div>}

        </div>
    </div>
  </div>
  );
}