import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ErrorBoundary } from "./components/ui/ErrorBoundary";

// Automatyczne wykrywanie błędów załadowania chunków po nowym wdrożeniu (stary chunk usunięty z serwera)
window.addEventListener("vite:preloadError", (event) => {
  console.warn("Wykryto błąd preloadingu nowego chunka Vite. Wymuszenie odświeżenia...", event);
  const reloaded = sessionStorage.getItem("wally_chunk_reload");
  if (!reloaded) {
    sessionStorage.setItem("wally_chunk_reload", "true");
    window.location.reload();
  }
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary fallbackTitle="Błąd aplikacji W-ally">
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
