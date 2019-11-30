import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@material-ui/styles";
import { SnackbarProvider } from "notistack";
import theme from "./ui/theme";
import "./index.css";
import App from "./App";
import store from "./store";

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <Provider store={store}>
      <SnackbarProvider maxSnack={2}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </SnackbarProvider>
    </Provider>
  </ThemeProvider>,
  document.getElementById("root")
);
