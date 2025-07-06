export const getImageUrl = (path) => {
  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const serverBase = apiBase.endsWith("/api")
    ? apiBase.slice(0, -4)
    : apiBase;
  return `${serverBase}${path}`;
};