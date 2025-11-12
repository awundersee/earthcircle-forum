import React, { useState } from "react";
import API_BASE from "../config";

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/.test(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!validateEmail(email)) {
      setError("Ungültige E-Mail-Adresse.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwörter stimmen nicht überein.");
      setLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setError(
        "Passwort muss mindestens 8 Zeichen lang sein und Groß-/Kleinbuchstaben, Zahlen und Sonderzeichen enthalten."
      );
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registrierung fehlgeschlagen.");
        setLoading(false);
        return;
      }

      setSuccess('<span class="text-primary fw-bold">Registrierung erfolgreich!</span> ' 
        + 'Du bekommst eine Bestätigungsmail an Deine E-Mail-Adresse. '
        + '<span class="text-primary fw-bold">Bitte klicke auf den Link in der Mail, um Deinen Account zu bestätigen.</span> '
        + 'Erst danach kannst Du Dich einloggen.');
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setLoading(false);

    } catch (err) {
      setError("Serverfehler. Bitte versuche es später.");
      setLoading(false);
    }
  };

  return (
    <>
      <div className="position-relative">

        {loading && (
            <div
            className="overlay-blocker"
            style={{
                pointerEvents: "all",
            }}
            ></div>
        )}

        {!success && (  
          <form onSubmit={handleSubmit} className="position-relative">
            
            <div className="mb-3">
              <label className="form-label fw-bold text-primary">Benutzername</label>
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold text-primary">E-Mail</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold text-primary">Passwort</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                required
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Registrieren
            </button>

          </form>
        )}

        {error && <div className="alert alert-danger mt-3">{error}</div>}
        {success && <div className="alert alert-success mt-3" dangerouslySetInnerHTML={{ __html: success }} />}

      </div>
      {/* END WRAPPER */}
    </>
  );
};

export default RegisterForm;