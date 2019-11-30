import { red } from "@material-ui/core/colors";
import { createMuiTheme } from "@material-ui/core/styles";

// A custom theme for this app
const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#388E3C"
    },
    secondary: {
      main: "#8D6E63"
    },
    error: {
      main: red.A400
    },
    background: {
      default: "#FFF"
      // default: "rgba(232, 223, 224, 0.64)"
    }
  }
});

export default theme;
