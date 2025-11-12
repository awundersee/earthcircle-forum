const API_BASE =
  import.meta.env.MODE === "development"
    ? "http://localhost:3001/api"
    : "http://localhost:3001/api";

export default API_BASE;