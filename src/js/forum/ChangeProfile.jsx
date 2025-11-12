import React, { useContext } from "react";
import { AuthContext } from "@/forum/AuthContext";

export default function ChangeProfile() {
  const { loggedIn } = useContext(AuthContext);

  return (
    <>
      <p className="lead">
        <span className="badge bg-light text-danger mb-2 text-uppercase">Bitte beachten</span><br />
        <span className="ps-2 fw-normal">Die gesamte Seite inklusive Forum gehört zu einer <span className="text-light fw-bold">fiktiven NGO und wird nur für Testzwecke verwendet.</span></span>
      </p>
      <p>
        Es können neue, persönliche Profile angelegt und verwaltet werden. Die Verwaltungsfunktionen umfassen nur das Minimum:{" "}
        <strong><a href="./passwort-vergessen" className="text-white decoration-underline">Passwort über Link zurücksetzen,</a></strong> sowie das <strong>Profil und die dazugehörigen Kommentare löschen.</strong>
      </p>
      <p>
        Mehr Informationen zum Urheber und Projekt gibt es <a href="../impressum" className="text-white decoration-underline">im Impressum.</a>
      </p>
    </>
  );
}