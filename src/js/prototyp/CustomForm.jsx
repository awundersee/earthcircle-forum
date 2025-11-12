import React, { useState } from "react";

// Formulare
const h = React.createElement;

// Validierungen
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
const isValidName = (text) => /^[\p{L}\s'-]+$/u.test(String(text || "")); 
const isValidMessage = (text) =>
  /^[\p{L}\p{N}\s.,!?;:'"()\-@äöüÄÖÜßéèêàáâçñ€$%&/\\]+$/u.test(String(text || ""));

// Feld mit optionaler Fehlermeldung
function FieldWrapper({ children, error }) {
  return h(
    "div",
    { className: "mb-2 w-100 z-1 position-relative" },
    children,
    error ? h("div", { className: "invalid-feedback d-block" }, error) : null
  );
}

// Formular erstellen
export default function CustomForm({ type, formId }) {

  const baseurl = window.BASEURL || "";
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    newsletter: false,
    message: "",
    honeypot: "",
  });
  const [errors, setErrors] = React.useState({});
  const [submitted, setSubmitted] = React.useState(false);

  const setField = (name, value) =>
    setFormData((prev) => ({ ...prev, [name]: value }));

  // Live-Validierung
  const handleChange = (e) => {
    const t = e.target;
    const value = t.type === "checkbox" ? !!t.checked : t.value;
    setField(t.name, value);

    if (errors[t.name]) {
      let newErrors = { ...errors };
      if (t.name === "name" && String(value).trim() && isValidName(value)) {
        delete newErrors.name;
      }
      if (t.name === "email" && isValidEmail(value)) {
        delete newErrors.email;
      }
      if (t.name === "message" && String(value).trim() && isValidMessage(value)) {
        delete newErrors.message;
      }
      setErrors(newErrors);
    }
  };

  const validate = () => {
    const newErrors = {};

    // Honeypot-Prüfung
    if (formData.honeypot && String(formData.honeypot).trim() !== "")
      return { honeypot: true };

    // Name nur bei Mitgliedsantrag & Kontakt
    if (type !== "newsletter") {
      if (!String(formData.name).trim()) {
        newErrors.name = "Bitte einen Namen eingeben.";
      } else if (!isValidName(formData.name)) {
        newErrors.name = "Ungültige Eingabe.";
      }
    }

    // E-Mail Pflichtfeld bei allen
    if (!isValidEmail(formData.email)) {
      newErrors.email = "Bitte eine gültige E-Mail eingeben.";
    }

    // Nachricht nur bei Kontaktformular
    if (type === "contact") {
      if (!String(formData.message).trim()) {
        newErrors.message = "Bitte eine Nachricht eingeben.";
      } else if (!isValidMessage(formData.message)) {
        newErrors.message = "Ungültige Eingabe.";
      }
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (newErrors.honeypot) return;
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setSubmitted(true);
  };

  // Bestätigungsnachricht
  if (submitted) {
    return h(
      "div",
      { className: "alert alert-success my-3" },
      type === "newsletter"
        ? ["Vielen Dank für Deine Anmeldung zum Newsletter! ", h('span', {className: "fw-bold"}, "Bitte bestätige Deine Anmeldung zum Newsletter durch den Klick auf den Bestätigungslink"), " in der Mail, die wir an Dich verschickt haben."]
        : type === "mitgliedsantrag"
        ? h(
            React.Fragment,
            null,
            h(
              "span",
              { className: "text-primary fw-bold d-block mb-2 lead" },
              "Vielen Dank für Dein Interesse!"
            ),
            "Wir haben Dir das Antragsformular per Mail gesendet. Falls Du in den nächsten Minuten keine Mail bekommst, ",
            h(
              "span",
              { className: "text-primary" },
              "prüfe bitte auch Deinen SPAM-Ordner."
            ),
            formData.newsletter &&
              h(
                "p",
                { className: "mt-2 fw-bold text-primary" },
                "Bitte bestätige außerdem Deine Anmeldung zum Newsletter in der zusätzlichen Mail, die wir Dir soeben gesendet haben."
              )
          )
        : "Vielen Dank für Deine Nachricht!"
    );
  }

  const cls = (err) => "form-control" + (err ? " is-invalid" : "");

  const formClassName =
    type === "mitgliedsantrag"
      ? "p-3 border rounded-3 mb-4 d-flex flex-wrap justify-content-between align-items-center form-gradient"
      : "mb-4 d-flex flex-wrap justify-content-between align-items-center";

  // Formular ausgeben
  return h(
    "form",
    { className: formClassName, onSubmit: handleSubmit, noValidate: true },

    type !== "newsletter" &&
      h(
        FieldWrapper,
        { error: errors.name },
        h(
          "label",
          { className: "form-label", htmlFor: formId + "-name" },
          "Name"
        ),
        h("input", {
          id: formId + "-name",
          name: "name",
          type: "text",
          className: cls(errors.name),
          value: formData.name,
          onChange: handleChange,
          required: true,
        })
      ),

    h(
      FieldWrapper,
      { error: errors.email },
      h(
        "label",
        { className: type === "newsletter" ? "d-none form-label" : "form-label", 
          htmlFor: formId + "-email" },
        "E-Mail"
      ),
      h("input", {
        id: formId + "-email",
        name: "email",
        type: "email",
        className: cls(errors.email),
        value: formData.email,
        onChange: handleChange,
        required: true,
        placeholder: type === "newsletter" ? "E-Mail" : ""
      })
    ),

    type === "mitgliedsantrag" &&
      h(
        "small",
        { className: "pb-3 form-hint opacity-75 z-1" },
        "Du wirst mit dem Absenden des Formulars nicht automatisch Mitglied, sondern erhältst alle Informationen zur Mitgliedschaft sowie das Antragsformular per Mail. Mit dem Absenden stimmst Du unseren ",
        h(
          "a",
          {
            href: `${baseurl}/datenschutz`,
            target: "_blank",
            className: "underline text-primary",
          },
          "Datenschutzbestimmungen"
        ),
        " zu."
      ),
    type === "mitgliedsantrag" &&
      h(
        "div",
        { className: "form-check mb-4 z-1" },
        h("input", {
          id: formId + "-newsletter",
          name: "newsletter",
          type: "checkbox",
          className: "form-check-input",
          checked: formData.newsletter,
          onChange: handleChange,
        }),
        h(
          "label",
          { htmlFor: formId + "-newsletter", className: "form-check-label" },
          h("span", { className: "text-primary fw-bold" }, "Ja,"),
          " ich möchte mich jetzt auch direkt",
          h("span", { className: "text-primary" }, " zum Newsletter anmelden.")
        )
      ),

    type === "contact" &&
      h(
        FieldWrapper,
        { error: errors.message },
        h(
          "label",
          { className: "form-label", htmlFor: formId + "-message" },
          "Nachricht"
        ),
        h("textarea", {
          id: formId + "-message",
          name: "message",
          rows: 4,
          className: cls(errors.message),
          value: formData.message,
          onChange: handleChange,
          required: true,
        })
      ),
    type === "contact" &&
      h(
        "small",
        { className: "pb-3 form-hint opacity-75 z-1 w-100" },
        "Mit dem Absenden stimmst Du unseren ",
        h(
          "a",
          {
            href: `${baseurl}/datenschutz`,
            target: "_blank",
            className: "underline text-primary",
          },
          "Datenschutzbestimmungen"
        ),
        " zu."
      ),

    h("input", {
      type: "text",
      name: "honeypot",
      value: formData.honeypot,
      onChange: handleChange,
      style: { display: "none" },
    }),

    h(
      "button",
      {
        type: "submit",
        className: type === "newsletter" 
          ? "btn btn-light text-primary z-1" 
          : "btn btn-primary z-1"
      },
      type === "newsletter"
        ? h("span", {className: "ph ph-arrow-right"})
        : type === "mitgliedsantrag"
        ? "Antragsformular anfordern"
        : "Senden"
    )
  );
}