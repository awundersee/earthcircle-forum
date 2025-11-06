const { useState, useEffect } = React;

// Suchleiste
function Search() {
  const [filter, setFilter] = React.useState("");

  // Wenn Input geändert wird, Custom Event feuern
  const handleInput = (e) => {
    const val = e.target.value;
    setFilter(val);

    document.getElementById("table").dispatchEvent(
      new CustomEvent("filterChanged", { detail: val })
    );
  };

  // Button klick
  const handleClick = () => {
    if (filter.trim() !== "") {
      setFilter("");
      document.getElementById("table").dispatchEvent(
        new CustomEvent("filterChanged", { detail: "" })
      );
    }
  };

  return (
    <>
      <label htmlFor="searchInput" className="form-label visually-hidden">
        Suche nach Firma oder Land
      </label>
      <input
        id="searchInput"
        type="text"
        className="form-control"
        placeholder="Nach Firma oder Land suchen"
        value={filter}
        onChange={handleInput}
      />
      <button
        className={`btn btn-sm btn-primary position-absolute end-0 top-0 search-btn ${filter.trim() !== "" ? "active-search" : ""}`}
        onClick={handleClick}
      >
        <i className="ph ph-arrow-right"></i>
      </button>
    </>
  );
}


// Tabelle
function App() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("");
  const [sortKey, setSortKey] = useState("country");
  const [sortAsc, setSortAsc] = useState(true);
  const baseurl = window.BASEURL || "";

  // Daten laden
  useEffect(() => {
    fetch(`${baseurl}/public/data/data.json`)
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error("Fehler beim Laden:", err));
  }, []);

  // Event Listener für Custom Event
  useEffect(() => {
    const tableEl = document.getElementById("table");
    if (!tableEl) return;

    const handleFilterChanged = (e) => setFilter(e.detail);

    tableEl.addEventListener("filterChanged", handleFilterChanged);

    return () => {
      tableEl.removeEventListener("filterChanged", handleFilterChanged);
    };
  }, []);

  // Input- und Dropdown-Listener
  useEffect(() => {
    const input = document.getElementById("searchInput");
    const dropdownItems = document.querySelectorAll(
      "#sortDropdownButton + .dropdown-menu .dropdown-item"
    );

    // Input
    const handleInput = (e) => setFilter(e.target.value);

    // Dropdown Klick
    const handleDropdownClick = (e) => {
      const key = e.target.dataset.key;
      const dir = e.target.dataset.dir;

      setSortKey(key);
      setSortAsc(dir === "asc");

      // Aktive Klasse setzen
      dropdownItems.forEach(item => item.classList.remove("active"));
      e.target.classList.add("active");
    };

    input.addEventListener("input", handleInput);
    dropdownItems.forEach(item => item.addEventListener("click", handleDropdownClick));

    // Initial active setzen (country asc beim ersten Render)
    const initActive = Array.from(dropdownItems).find(
      item => item.dataset.key === sortKey && item.dataset.dir === (sortAsc ? "asc" : "desc")
    );
    if (initActive) {
      initActive.classList.add("active");
    }

    return () => {
      input.removeEventListener("input", handleInput);
      dropdownItems.forEach(item => item.removeEventListener("click", handleDropdownClick));
    };
  }, [sortKey, sortAsc]);

  // Gefilterte und sortierte Daten
  const filteredData = data
    .filter(row =>
      row.company.toLowerCase().includes(filter.toLowerCase()) ||
      row.country.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => {
      if (a[sortKey] < b[sortKey]) return sortAsc ? -1 : 1;
      if (a[sortKey] > b[sortKey]) return sortAsc ? 1 : -1;
      return 0;
    });

  // ARIA & Sort-Klassen
  const getSortClass = (key) => {
    if (sortKey === key) return sortAsc ? "asc-sorting" : "desc-sorting";
    return "no-sorting";
  };

  const getAriaLabel = (key, label) => {
    if (sortKey === key) {
      return sortAsc
        ? `${label}, aufsteigend sortiert`
        : `${label}, absteigend sortiert`;
    }
    return `${label}, nicht sortiert`;
  };

  // Tabellen-Header Button Klick
  const handleSortButton = (key) => {
    let newAsc = true;
    if (sortKey === key) newAsc = !sortAsc;

    setSortKey(key);
    setSortAsc(newAsc);

    // Dropdown synchronisieren
    const dropdownItems = document.querySelectorAll(
      "#sortDropdownButton + .dropdown-menu .dropdown-item"
    );

    const matchingItem = Array.from(dropdownItems).find(
      item => item.dataset.key === key && item.dataset.dir === (newAsc ? "asc" : "desc")
    );
    if (matchingItem) {
      dropdownItems.forEach(item => item.classList.remove("active"));
      matchingItem.classList.add("active");
    }
  };

  // Tabelle ausgeben
  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th scope="col" className={getSortClass("country")} aria-sort={sortKey === "country" ? (sortAsc ? "ascending" : "descending") : "none"}>
            <button
              type="button"
              onClick={() => handleSortButton("country")}
              aria-label={getAriaLabel("country", "Land")}
              className="text-nowrap cursor-pointer p-0 border-0 bg-transparent"
            >
              Land
            </button>
          </th>

          <th scope="col" className={getSortClass("company")} aria-sort={sortKey === "company" ? (sortAsc ? "ascending" : "descending") : "none"}>
            <button
              type="button"
              onClick={() => handleSortButton("company")}
              aria-label={getAriaLabel("company", "Unternehmen")}
              className="text-nowrap cursor-pointer p-0 border-0 bg-transparent"
            >
              Unternehmen
            </button>
          </th>

          <th scope="col" className={getSortClass("emissions")} aria-sort={sortKey === "emissions" ? (sortAsc ? "ascending" : "descending") : "none"}>
            <button
              type="button"
              onClick={() => handleSortButton("emissions")}
              aria-label={getAriaLabel("emissions", "CO₂-Emissionen (MtCO₂)")}
              className="text-nowrap cursor-pointer p-0 border-0 bg-transparent"
            >
              CO₂-Emissionen (t)
            </button>
          </th>
        </tr>
      </thead>

      <tbody>
        {filteredData.length === 0 ? (
          <tr>
            <td colSpan="3" className=" text-muted">
              Nichts gefunden
            </td>
          </tr>
        ) : (
          filteredData.map((row, idx) => (
            <tr key={idx}>
              <td className={sortKey === "country" ? "is-selected" : ""}>{row.country}</td>
              <td className={sortKey === "company" ? "is-selected" : ""}>{row.company}</td>
              <td className={sortKey === "emissions" ? "is-selected" : ""}>{row.emissions}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

// ----------------- Rendering -----------------
const searchEl = document.querySelector('.search-wrapper');
if (searchEl) {
  ReactDOM.createRoot(searchEl).render(<Search />);
}
const tableEl = document.getElementById("table");
if (tableEl) {
  ReactDOM.createRoot(tableEl).render(<App />);
}


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
function CustomForm({ type, formId }) {

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

// ---------- Mounting ----------
document.querySelectorAll(".form").forEach((el, i) => {
  const typeAttr = (el.getAttribute("data-type") || "").toLowerCase();
  if (
    typeAttr !== "newsletter" &&
    typeAttr !== "mitgliedsantrag" &&
    typeAttr !== "contact"
  )
    return;
  const formId = el.getAttribute("data-id") || typeAttr + "-" + (i + 1);
  const root = ReactDOM.createRoot(el);
  root.render(h(CustomForm, { type: typeAttr, formId }));
});