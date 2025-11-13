import React, { useState, useEffect } from "react";
import { useAuth } from "./authContext";

export default function UserPanel({profilForumLink, onLogout }) {
  const { loggedIn, user, logout } = useAuth();

  const handleLogout = () => {
    if (onLogout) onLogout(); 
    logout(); // setzt loggedIn und user automatisch
  };

  if (!loggedIn || !user) return null; // nichts anzeigen, wenn nicht eingeloggt

  return (
    <section className="border-bottom border-primary b-1">
      <div className="px-1 px-sm-2 px-md-3 px-lg-4 px-xl-5">
        <div className="container-fluid py-3">
          <div className="align-items-md-center justify-content-between d-flex">
            <span>
              Hallo,{" "}
              <a href="/forum/profil" className="text-black">
                <strong>{user.username}</strong>
              </a>
              {user.email && (
                <>{" "}
                <span className="on-profile-only">({user.email})</span></>
              )}
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