const API_BASE =
  import.meta.env.MODE === "development"
    ? "http://localhost:3001/api"
    : "https://earthcircle.wundersee.dev/api";

export default API_BASE;