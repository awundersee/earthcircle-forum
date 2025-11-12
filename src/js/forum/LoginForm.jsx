import React, { useState } from "react";
import { useAuth } from "./authContext";
import API_BASE from "../config";

const LoginForm = () => {
  const { login } = useAuth();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwortForgotten, setPasswortForgotten] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: usernameOrEmail, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.message || "Login fehlgeschlagen.");
        setLoading(false);
        return;
      }

      if (!data.token) {
        setError("Login fehlgeschlagen: kein Token vom Server.");
        setLoading(false);
        return;
      }

      login(data.token);
      setSuccess("Login erfolgreich!");
      setLoading(false);

    } catch (err) {
      console.error(err);
      setError("Serverfehler. Bitte später erneut versuchen.");
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

        <form onSubmit={handleSubmit} className="position-relative">

            <div className="mb-3">
            <label className="form-label">
                <span className="text-primary fw-bold">Benutzername</span> oder E-Mail
            </label>
            <input
                type="text"
                className="form-control"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                required
            />
            </div>

            <div className="mb-3">
            <label className="form-label">
                <span className="text-primary fw-bold">Passwort</span>
            </label>
            <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            </div>

            <button type="submit" className="btn btn-primary">
            Anmelden
            </button>

        </form>
      </div>

      {error && <div className="alert alert-danger mt-3">{error}</div>}

      {error === "Falsches Passwort" && (
        <div className="text-primary p-3"><span className="fw-bold">Passwort vergessen?</span> Du kannst Dein <a href="./passwort-vergessen" className="text-primary text-decoration-underline">Passwort auch zurücksetzen.</a></div>
      )}

      {success && <div className="alert alert-success mt-3">{success}</div>}       
    </>
  );
};

export default LoginForm;
