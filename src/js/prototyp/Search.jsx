import React, { useState } from "react";

export default function Search() {
  const [filter, setFilter] = useState("");

  const handleInput = (e) => {
    const val = e.target.value;
    setFilter(val);
    document.getElementById("table")?.dispatchEvent(
      new CustomEvent("filterChanged", { detail: val })
    );
  };

  const handleClick = () => {
    if (filter.trim() !== "") {
      setFilter("");
      document.getElementById("table")?.dispatchEvent(
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
        className={`btn btn-sm btn-primary position-absolute end-0 top-0 search-btn ${
          filter.trim() !== "" ? "active-search" : ""
        }`}
        onClick={handleClick}
      >
        <i className="ph ph-arrow-right"></i>
      </button>
    </>
  );
}
