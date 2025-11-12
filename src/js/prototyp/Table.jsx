import React, { useState, useEffect } from "react";

export default function Table() {
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

  // Custom Event Listener
  useEffect(() => {
    const tableEl = document.getElementById("table");
    if (!tableEl) return;
    const handleFilterChanged = (e) => setFilter(e.detail);
    tableEl.addEventListener("filterChanged", handleFilterChanged);
    return () => tableEl.removeEventListener("filterChanged", handleFilterChanged);
  }, []);

  // Input- und Dropdown-Listener
  useEffect(() => {
    const input = document.getElementById("searchInput");
    const dropdownItems = document.querySelectorAll(
      "#sortDropdownButton + .dropdown-menu .dropdown-item"
    );

    const handleInput = (e) => setFilter(e.target.value);
    const handleDropdownClick = (e) => {
      const key = e.target.dataset.key;
      const dir = e.target.dataset.dir;
      setSortKey(key);
      setSortAsc(dir === "asc");

      dropdownItems.forEach(item => item.classList.remove("active"));
      e.target.classList.add("active");
    };

    input?.addEventListener("input", handleInput);
    dropdownItems.forEach(item => item.addEventListener("click", handleDropdownClick));

    const initActive = Array.from(dropdownItems).find(
      item => item.dataset.key === sortKey && item.dataset.dir === (sortAsc ? "asc" : "desc")
    );
    initActive?.classList.add("active");

    return () => {
      input?.removeEventListener("input", handleInput);
      dropdownItems.forEach(item => item.removeEventListener("click", handleDropdownClick));
    };
  }, [sortKey, sortAsc]);

  // Gefilterte & sortierte Daten
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

  const getSortClass = (key) => sortKey === key ? (sortAsc ? "asc-sorting" : "desc-sorting") : "no-sorting";
  const getAriaLabel = (key, label) => sortKey === key ? (sortAsc ? `${label}, aufsteigend sortiert` : `${label}, absteigend sortiert`) : `${label}, nicht sortiert`;

  const handleSortButton = (key) => {
    const newAsc = sortKey === key ? !sortAsc : true;
    setSortKey(key);
    setSortAsc(newAsc);

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

  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th className={getSortClass("country")} aria-sort={sortKey === "country" ? (sortAsc ? "ascending" : "descending") : "none"}>
            <button onClick={() => handleSortButton("country")} aria-label={getAriaLabel("country","Land")} className="text-nowrap cursor-pointer p-0 border-0 bg-transparent">Land</button>
          </th>
          <th className={getSortClass("company")} aria-sort={sortKey === "company" ? (sortAsc ? "ascending" : "descending") : "none"}>
            <button onClick={() => handleSortButton("company")} aria-label={getAriaLabel("company","Unternehmen")} className="text-nowrap cursor-pointer p-0 border-0 bg-transparent">Unternehmen</button>
          </th>
          <th className={getSortClass("emissions")} aria-sort={sortKey === "emissions" ? (sortAsc ? "ascending" : "descending") : "none"}>
            <button onClick={() => handleSortButton("emissions")} aria-label={getAriaLabel("emissions","CO₂-Emissionen (MtCO₂)")} className="text-nowrap cursor-pointer p-0 border-0 bg-transparent">CO₂-Emissionen (t)</button>
          </th>
        </tr>
      </thead>
      <tbody>
        {filteredData.length === 0 ? (
          <tr><td colSpan="3" className="text-muted">Nichts gefunden</td></tr>
        ) : (
          filteredData.map((row, idx) => (
            <tr key={idx}>
              <td className={sortKey==="country"?"is-selected":""}>{row.country}</td>
              <td className={sortKey==="company"?"is-selected":""}>{row.company}</td>
              <td className={sortKey==="emissions"?"is-selected":""}>{row.emissions}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
