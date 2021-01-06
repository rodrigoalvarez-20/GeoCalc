import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./src";
import { CookiesProvider } from "react-cookie";

ReactDOM.render(
  <BrowserRouter>
    <CookiesProvider>
      <App />
    </CookiesProvider>
  </BrowserRouter>,
  document.getElementById("app")
);
