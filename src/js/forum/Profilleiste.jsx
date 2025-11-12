import React, { useState, useEffect } from "react";
import { useAuth } from "./authContext";

export default function Profilleiste({profilForumLink, onLogout }) {
  const { loggedIn, login, logout } = useAuth();
  const [username, setUsername] = useState("");
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUsername(payload.username || "");
    } catch (err) {
      console.error("Token konnte nicht gelesen werden", err);
    }
  }, []);

  const handleLogout = () => {
    if (onLogout) onLogout();   // AuthContext.logout()
    setUsername("");
  };

  if (!username) return null;

  return (
    <section className="border-bottom border-primary b-1">
      <div className="px-1 px-sm-2 px-md-3 px-lg-4 px-xl-5">
        <div className="container-fluid py-3">
          <div className="align-items-md-center justify-content-between d-flex">
            <span>
              Hallo,{" "}
              <a href="/forum/profil" className="text-black">
                <strong>{username}</strong>
              </a>
            </span>

            <div className="justify-content-end d-flex gap-3 flex-wrap">

                {profilForumLink != "hidden" && (
                  <a href="/forum" className="btn btn-primary text-nowrap">Zurück zum Forum</a>
                )}
                
                <button className="btn btn-outline-primary text-nowrap" onClick={handleLogout}>
                Logout
                </button>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
}