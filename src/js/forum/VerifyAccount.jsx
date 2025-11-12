import React, { useState, useEffect } from "react";

import API_BASE from "../config";

export default function VerfifyAccount() {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams(window.location.search);
    const token = params.get("hash");

    if (!token) {
      setError("Kein Verifizierungs-Token gefunden.");
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(`${API_BASE}/verify/${token}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Fehler beim Verifizieren");

        setSuccess("Account erfolgreich verifiziert!");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, []);

  return (
    <section className="bg-primary bg-opacity-25">
      <div className="px-1 px-sm-2 px-md-3 px-lg-4 px-xl-5">
        <div className="container-fluid py-5"> 
          <div className="create-entry-wrapper min-height-inner row">
            <div className="col-md-4">
              <div className="pe-5">
                  <h2 className="fw-bold fs-4 text-primary mb-3">
                    {success ? (
                      <>Account bestätigen</>
                    ) : (
                      <>Fehlermeldung</>
                    )}
                  </h2> 
                  <div class="d-flex gap-3 align-items-center">
                    <a href="./" className="btn btn-primary text-nowrap">Zum Forum</a>
                    <a href="./login" className="btn text-primary border-primary text-nowrap">Zum Login</a>
                  </div>
              </div>
            </div>            
            <div className="col-md-8 col-lg-6">
              {loading && <div className="text-white">Verifiziere Account...</div>}
              {success && <div className="alert alert-success mt-4">{success}</div>}
              {error && <div className="alert alert-danger mt-4">{error}</div>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}