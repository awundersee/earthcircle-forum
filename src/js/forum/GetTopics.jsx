import React, { useEffect, useState } from "react";
import API_BASE from "../config.js";
import GetSubtopics from "./GetSubtopics.jsx";

export default function GetTopics() {
  const [themen, setThemen] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/themen`)
      .then(r => r.json())
      .then(setThemen)
      .catch(err => console.error(err));
  }, []);

  return (
    <section className="themen ueberblick-wrapper">
      <div className="px-1 px-sm-2 px-md-3 pb-lg-0 pt-3 pt-md-4 px-lg-4 px-xl-5">
        <div className="container-fluid py-5">
            <div className="row mb-3 d-flex align-items-stretch">
              {themen.map(t => (
                <div className="col-lg-4 col-md-8 offset-md-2 offset-lg-0 mb-4 themenliste-wrapper" data-themaid={t.themaID} key={t.themaID}>
                  <div className="rounded-3">

                    <div className="bg-secondary bg-opacity-25 text-white p-3 rounded-top mx-2 form-gradient">
                      <h3 className="fw-bold fs-4 text-primary">{t.titel}</h3>
                      <div className="text-dark" dangerouslySetInnerHTML={{ __html: t.inhalt }} />
                    </div>

                    {/* Unterthemen laden */}
                    <GetSubtopics themaID={t.themaID} />

                  </div>
                </div>
              ))}
            </div>
        </div>
      </div>
    </section>
  );
}