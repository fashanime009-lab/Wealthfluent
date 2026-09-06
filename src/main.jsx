import React from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import "./index.css";
import { WorkspaceProvider } from "./context/WorkspaceContext";

import { FinanceProvider } from "./context/FinanceContext";

import { SettingsProvider } from "./context/SettingsContext";
import { ThemeProvider } from "./context/ThemeContext";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
   <HelmetProvider>
  <ThemeProvider>
  <FinanceProvider>
    <SettingsProvider>
      <WorkspaceProvider>
        <App />
      </WorkspaceProvider>
    </SettingsProvider>
  </FinanceProvider>
  </ThemeProvider>
</HelmetProvider>
  </React.StrictMode>
);