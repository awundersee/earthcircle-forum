import React, { useState } from "react";
import { CSSTransition } from "react-transition-group";
import Profilleiste from "./Profilleiste";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { useAuth } from "./authContext";

export default function HeaderForum( props ) {
  const { loggedIn, login, logout } = useAuth();

  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const handleLoginClick = () => {
    setShowLogin(true);
    setShowRegister(false);
  };

  const handleRegisterClick = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  const handleCloseClick = () => {
    setShowLogin(false);
    setShowRegister(false);
  };  

  const handleLoginSuccess = (token) => {
    login(token);
    setShowLogin(false);
    setShowRegister(false);
  };

  return (
    <>
      <div className={`outer-forum-wrapper  ${loggedIn ? "logged-in" : ""}`}>
        <section className={`hero-banner hero-forum d-flex mobile-hero ${loggedIn ? "logged-in" : ""}`}>
            <div className="c-banner d-lg-block z-1 position-absolute top-0 bottom-0 start-0 end-0"></div>
            <div className="bg-banner d-none d-sm-block position-absolute top-0 bottom-0 start-0 end-0 bg-black bg-opacity-50 z-2 z-lg-0"></div>
            <div className="container-fluid text-white position-relative align-items-end justify-content-end z-2">
                <div className="mx-1 mx-sm-2 mx-md-3 mx-lg-4 mx-xl-5 my-3 my-md-4 py-3 py-sm-0">
                    <div className="row">
                        <div className="col-lg-7 offset-lg-4 col-md-10">
                            <h2 className="display-3 small-xs-display fw-bold">Wir schaffen ein gutes Klima zum Austausch</h2>
                            <p className="lead mb-4">Unser Forum bietet die Möglichkeit zum Austausch übers Klima, CO₂-Emissionen und Aktivitäten unserer NGO.</p>
                            {/* Buttons nur anzeigen, wenn nicht eingeloggt */}
                            {!loggedIn && (
                              <>

                                {!props.registerLinkHidden ? (
                                <a href="/forum/registrierung" 
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleRegisterClick();
                                  }}
                                  className="btn btn-primary btn-lg me-3 btn-register text-nowrap">
                                  Jetzt registrieren
                                </a>
                                ):(
                                  <a
                                    href="/forum"
                                    className="btn bg-primary btn-lg me-3 text-white"
                                  >
                                    Zum Forum
                                  </a>      
                                )}

                                {!props.forumLink ? (
                                  <a
                                    href="/forum/login"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleLoginClick();
                                    }}
                                    className="btn text-primary bg-white btn-lg"
                                  >
                                    Login
                                  </a>
                                ) : (
                                  <a
                                    href="/forum"
                                    className="btn text-primary bg-white btn-lg"
                                  >
                                    Zum Forum
                                  </a>                                  
                                )}
                              </>
                            )}
                      </div>
                    </div>
                </div>
            </div>       
        </section>
      </div>
      {/* RegisterForm nur anzeigen, wenn showRegister true */}
      {showRegister && !loggedIn && (
        <>
          <CSSTransition
            in={showRegister}
            timeout={500}
            classNames="login"
            unmountOnExit
          >
            <section className="bg-primary bg-opacity-25">
              <div className="px-1 px-sm-2 px-md-3 pb-lg-0 pt-3 pt-md-4 px-lg-4 px-xl-5">
                <div className="container-fluid py-5 pt-1 pt-lg-3 pt-xl-5">
                  <div className="row mb-3">
                    <div className="col-xl-4 col-lg-8 offset-lg-2 offset-xl-0 order-1">
                      <h2 className="fw-bold mb-3 text-primary">Registrierung</h2>

                      <p className="lead fw-bold">
                        Bitte gebe einen{" "}
                        <span className="text-primary">Benutzernamen</span>, deine{" "}
                        <span className="text-primary">E-Mail-Adresse</span> und ein{" "}
                        <span className="text-primary">Passwort</span> ein.
                      </p>

                      <p>
                        Falls Du bereits einen Account hast, kannst{" "}
                        <a 
                          href="/forum/login" // Fallback, wenn JS deaktiviert ist
                          onClick={(e) => {
                            e.preventDefault(); // verhindert den normalen Seitenwechsel
                            handleLoginClick();  // React-LoginForm anzeigen
                          }}
                          className="text-black decoration-underline">
                          Du Dich direkt einloggen.
                        </a>
                      </p>

                      <p>
                        Nach Deiner Registrierung erhältst Du eine E-Mail mit einem Link,
                        um Deine Registrierung zu bestätigen.
                      </p>
                    </div>

                    <div className="col-xl-6 col-lg-8 offset-lg-2 offset-xl-0 order-2 mt-4 mt-xl-0">
                      <div className="ms-xxl-3">
                        <RegisterForm />
                      </div>
                    </div>

                    <div className="col-xl-2 d-flex justify-content-end align-items-start order-0 order-xl-3 mb-4 mb-xl-0">
                      <button
                        className="bg-transparent border-0 p-0"
                        onClick={(e) => {
                          e.preventDefault();
                          handleCloseClick();
                        }}
                      ><small>Schließen <span className="ph ph-x-circle"></span></small></button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </CSSTransition>
        </>
      )}

      {/* LoginForm nur anzeigen, wenn showLogin true */}
      {showLogin && !loggedIn && (
        <>
          <CSSTransition
            in={showLogin}
            timeout={500}
            classNames="login"
            unmountOnExit
          >
            <section className="bg-primary bg-opacity-25">
              <div className="px-1 px-sm-2 px-md-3 pb-lg-0 pt-3 pt-md-4 px-lg-4 px-xl-5">
                <div className="container-fluid py-5 pt-1 pt-lg-3 pt-xl-5">
                  <div className="row mb-3">
                    <div className="col-xl-4 col-lg-8 offset-lg-2 offset-xl-0 order-2 order-xl-1">
                      <p className="lead">
                        <span className="fw-bold">
                          Bitte gebe deinen{" "}
                          <span className="text-primary">Benutzernamen</span> oder deine{" "}
                          <span className="text-primary">E-Mail-Adresse</span> sowie{" "}
                          <span className="text-primary">Passwort</span> ein.
                        </span>{" "}
                        Falls Du noch keinen Account hast, kannst{" "}
                        <a 
                          href="/forum/registrierung" 
                          onClick={(e) => {
                            e.preventDefault();
                            handleRegisterClick();
                          }}
                          className="text-black decoration-underline">
                          Du Dich kostenlos registrieren.
                        </a>
                      </p>

                      <p className="text-secondary fs-6">
                        <span className="fw-bold">Passwort vergessen?</span> Dann einfach{" "}
                        <a href="/forum/passwort-vergessen" className="text-secondary">
                          Passwort zurücksetzen.
                        </a>
                      </p>
                    </div>

                    <div className="col-xl-6 col-lg-8 offset-lg-2 offset-xl-0 order-1 order-xl-2 mb-4 mb-xl-0">
                      <div className="ms-xxl-3">
                        <LoginForm onLoginSuccess={handleLoginSuccess} />
                      </div>
                    </div>
                    
                    <div className="col-xl-2 d-flex justify-content-end align-items-start order-0 order-xl-3 mb-4 mb-xl-0">
                      <button
                        className="bg-transparent border-0 p-0"
                        onClick={(e) => {
                          e.preventDefault();
                          handleCloseClick(); 
                        }}
                      ><small>Schließen <span className="ph ph-x-circle"></span></small></button>
                    </div>

                  </div>
                </div>
              </div>
            </section>
          </CSSTransition>
        </>
      )}

      {/* UserPanel nur anzeigen, wenn eingeloggt */}
      {loggedIn && <Profilleiste profilForumLink={props.profilForumLink} onLogout={handleLogout} />}   
    </>
  );
}
