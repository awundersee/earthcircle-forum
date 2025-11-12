import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider, useAuth } from "@/forum/AuthContext";

import Search from "@/prototyp/Search.jsx";
import Table from "@/prototyp/Table.jsx";
import CustomForm from "@/prototyp/CustomForm.jsx";
import HeaderForum from "@/forum/Header.jsx";
import DeleteProfile from "@/forum/DeleteProfile.jsx";
import ChangeProfile from "@/forum/ChangeProfile.jsx";
import Profilleiste from "@/forum/Profilleiste.jsx";
import Themenliste from "@/forum/Themenliste.jsx";
import CreateEntry from "@/forum/CreateEntry.jsx";
import LoginForm from "@/forum/LoginForm.jsx";
import RegisterForm from "@/forum/RegisterForm.jsx";
import MeineEintraege from "@/forum/MeineEintraege.jsx";
import MeineKommentare from "@/forum/MeineKommentare.jsx";
import Eintrag from "@/forum/Eintrag.jsx";
import ResetPassword from "@/forum/ResetPassword.jsx";
import VerifyAccount from "@/forum/VerifyAccount.jsx";

/**
 * Render VerifyAccount
 */
const verifyAccountEl = document.getElementById("verifyAccount");
if (verifyAccountEl) {
  ReactDOM.createRoot(verifyAccountEl).render(<VerifyAccount />);
}

/**
 * Password vergessen
 */
const ResetPasswortContent = () => {
  const { loggedIn, logout } = useAuth();
  const handleLogout = () => {
    logout();
  };  
  return (
    <>
    {loggedIn && (
      <>
        <section className="border-top border-primary">
          <Profilleiste onLogout={handleLogout} />
        </section>
      </>
    )}
    <section className="bg-primary bg-opacity-25">
      <div className="px-1 px-sm-2 px-md-3 px-lg-4 px-xl-5">
        <div className="container-fluid py-5">
          <ResetPassword />
        </div>
      </div>
    </section>
    </>
  );
};

const passwortVergessenEl = document.getElementById("passwortVergessen");
if (passwortVergessenEl) {
  ReactDOM.createRoot(passwortVergessenEl).render(
    <AuthProvider>
       <ResetPasswortContent />
    </AuthProvider>
  );
}

/**
 * Eintrag-Komponente
 */
const EntryContent = () => {
  const { loggedIn, logout } = useAuth();
  const [eintragID, seteintragID] = useState(null);

  // URL-Parameter auslesen
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const eintragID = params.get("eintragID");
    seteintragID(eintragID);
  }, []);

  const handleLogout = () => {
    logout();
  };  

  return (
    <>
    <section className="border-top border-primary">
      {loggedIn ? (
        <Profilleiste onLogout={handleLogout} />
      ) : (
        <div className="border-bottom border-primary">
          <div className="px-1 px-sm-2 px-md-3 px-lg-4 px-xl-5">
            <div className="container-fluid py-3">
              <div className="align-items-center justify-content-end d-flex">
                <a href="./" className="btn border-primary border text-primary">Zurück zum Forum</a>
              </div>
            </div>
          </div>
        </div>
      )}
      <Eintrag eintragID={eintragID}/>
    </section>
    <section className="pt-5 border-top border-primary">
      <div className="d-flex align-items-center justify-content-center">
        <h2 className="fs-5 text-primary fw-bold">Andere Themen aus unserem Forum</h2>
      </div>
      <Themenliste />
    </section>
    </>
  );
};

/**
 * Eintrag Erstellen-Komponente
 */
const CreateEntryContent = () => {
  const { loggedIn, logout } = useAuth();
  const handleLogout = () => {
    logout();
  };  

  return (
    <>
    {!loggedIn ? (
        <>
        <HeaderForum forumLink={true} />
        <section className="text-white bg-primary bg-reverse">
          <div className="px-1 px-sm-2 px-md-3 px-lg-4 px-xl-5">
            <div className="container-fluid py-5">
              <div className="row">
                <div className={`col-xl-4 col-lg-6 ${loggedIn ? "" : "offset-lg-4"}`}>
                  <div className="ps-xxl-4">
                    <strong>Du musst eingeloggt sein,</strong> um einen Eintrag zu verfassen:
                    <div className="mt-4"><LoginForm/></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        </>
    ) : (
      <>
        <section className="border-top border-primary">
          <Profilleiste onLogout={handleLogout} />
        </section>
        <section className="bg-primary bg-opacity-25">
          <div className="px-1 px-sm-2 px-md-3 px-lg-4 px-xl-5">
            <div className="container-fluid py-5">
              <CreateEntry />
            </div>
          </div>
        </section>
      </>
    )}
    </>
  );
};

/**
 * Profil-Bereich Wrapper-Komponente
 */
const ProfilContent = () => {
  const { loggedIn } = useAuth();

  return (
    <>
      <HeaderForum />
      {loggedIn && (
        <>
        <section className="bg-primary bg-opacity-25">
          <div className="px-1 px-sm-2 px-md-3 px-lg-4 px-xl-5">
            <div className="container-fluid py-5">
              <div className="row">
                <div class="col-md-8 offset-md-2 col-lg-6 offset-lg-0">
                  <MeineEintraege />
                </div>
                <div class="col-md-8 offset-md-2 col-lg-6 offset-lg-0 mt-5 mt-lg-0">
                  <MeineKommentare />
                </div>
              </div>
            </div>
          </div>
        </section>
        </>
      )}
      <section className="text-white bg-primary">
        <div className="px-1 px-sm-2 px-md-3 px-lg-4 px-xl-5">
          <div className="container-fluid py-5">
            <div className="row">
              <div className={`col-xl-4 col-lg-6 ${loggedIn ? "" : "offset-lg-4"}`}>
                <ChangeProfile />
              </div>
              <div className="mt-4 mt-lg-2 col-md-6 col-lg-4 offset-lg-2 offset-xl-4 col-xxl-3 offset-xxl-5 d-flex align-items-lg-end flex-column">
                <DeleteProfile />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

/**
 * Forum Header Wrapper
 */
const ForumContent = () => (
  <>
    <HeaderForum profilForumLink="hidden" />
    <Themenliste />
  </>
);

/**
 * Render Registrierung-Seite
 */

const RegisterContent = () => {
  const { loggedIn, logout } = useAuth();
  const handleLogout = () => {
    logout();
  };  

  return (
    <>

      {loggedIn ? (
        <>
        <Profilleiste onLogout={handleLogout} />
        <section className="bg-primary bg-opacity-25">
          <div className="px-1 px-sm-2 px-md-3 px-lg-4 px-xl-5">
            <div className="container-fluid py-5">
              <div className="row min-height-inner">
                <div class="col-12"><span className="text-primary">Du bist bereits eingeloggt.</span></div>
              </div>
            </div>
          </div>
        </section>
        </>
      ):(
        <>
        <HeaderForum registerLinkHidden={true} />
        <section className="">
          <div className="px-1 px-sm-2 px-md-3 px-lg-4 px-xl-5">
            <div className="container-fluid py-5">
              <div className="row">
                <div className="col-lg-4">
                  <h2 className="fw-bold mb-3 text-primary">Registrierung</h2>

                  <p className="lead fw-bold">
                    Bitte gebe einen{" "}
                    <span className="text-primary">Benutzernamen</span>, deine{" "}
                    <span className="text-primary">E-Mail-Adresse</span> und ein{" "}
                    <span className="text-primary">Passwort</span> ein.
                  </p>

                  <p>
                    Nach Deiner Registrierung erhältst Du eine E-Mail mit einem Link,
                    um Deine Registrierung zu bestätigen.
                  </p>
                </div>
                
                <div className="col-md-8 col-lg-6">
                  <div className="mt-4 ms-xxl-4"><RegisterForm /></div>
                </div>
              </div>
            </div>
          </div>
        </section>
        </>
      )}
      
    </>
  );
};

const registerFormEL = document.getElementById("registerForm");
if (registerFormEL) {
  ReactDOM.createRoot(registerFormEL).render(
    <AuthProvider>
      <RegisterContent />
    </AuthProvider>
  );
}

/**
 * Render Login-Seite
 */

const LoginContent = () => {
  const { loggedIn, logout } = useAuth();
  const handleLogout = () => {
    logout();
  };  

  return (
    <>

      {loggedIn ? (
        <>
        <ForumContent />
        </>
      ):(
        <>
        <HeaderForum forumLink={true} />
        <section className="">
          <div className="px-1 px-sm-2 px-md-3 px-lg-4 px-xl-5">
            <div className="container-fluid py-5">
              <div className="row">
                <div className="col-md-8 col-lg-6 offset-lg-4">
                  <div className="mt-4 ms-xxl-4"><LoginForm/></div>
                </div>
              </div>
            </div>
          </div>
        </section>
        </>
      )}
      
    </>
  );
};

const loginFormEL = document.getElementById("loginForm");
if (loginFormEL) {
  ReactDOM.createRoot(loginFormEL).render(
    <AuthProvider>
      <LoginContent />
    </AuthProvider>
  );
}

/**
 * Render Entry
 */
const entryEl = document.getElementById("eintrag");
if (entryEl) {
  ReactDOM.createRoot(entryEl).render(
    <AuthProvider>
      <EntryContent />
    </AuthProvider>
  );
}

/**
 * Render Create Entry
 */
const createEntryEl = document.getElementById("eintrag-verfassen");
if (createEntryEl) {
  ReactDOM.createRoot(createEntryEl).render(
    <AuthProvider>
      <CreateEntryContent />
    </AuthProvider>
  );
}

/**
 * Render Profil
 */
const profilEl = document.getElementById("profil");
if (profilEl) {
  ReactDOM.createRoot(profilEl).render(
    <AuthProvider>
      <ProfilContent />
    </AuthProvider>
  );
}

/**
 * Render Forum Header
 */
const forumEl = document.getElementById("forum");
if (forumEl) {
  ReactDOM.createRoot(forumEl).render(
    <AuthProvider>
      <ForumContent />
    </AuthProvider>
  );
}

/**
 * Render Suche
 */
const searchEl = document.querySelector(".search-wrapper");
if (searchEl) {
  ReactDOM.createRoot(searchEl).render(<Search />);
}

/**
 * Render Tabelle
 */
const tableEl = document.getElementById("table");
if (tableEl) {
  ReactDOM.createRoot(tableEl).render(<Table />);
}

/**
 * Render andere Formulare
 */
document.querySelectorAll(".form").forEach((el, i) => {
  const typeAttr = (el.getAttribute("data-type") || "").toLowerCase();
  if (!["newsletter", "mitgliedsantrag", "contact"].includes(typeAttr)) return;

  const formId = el.getAttribute("data-id") || typeAttr + "-" + (i + 1);
  ReactDOM.createRoot(el).render(<CustomForm type={typeAttr} formId={formId} />);
});
