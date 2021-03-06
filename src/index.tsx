import React from "react";
import ReactDOM from "react-dom";
import { ApolloProvider } from "@apollo/client/react";
import App from "./App";
import { client } from "./apollo";
import { HelmetProvider } from "react-helmet-async";
import reportWebVitals from "./reportWebVitals";
import "./styles/index.css";

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
