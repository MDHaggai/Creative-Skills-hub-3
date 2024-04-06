import { createTheme } from "@mui/material";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      light: "#FF9B3E",
      main: "#FF7B00",
      dark: "#CB6200",
    },
    secondary: {
      light: "#3EA2FF",
      main: "#0084FF",
      dark: "#006ACB",
    },
  },
  typography: {
      fontFamily: ["Poppins", "sans-serif"].join(", ")
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536
    }
  },

});

export default lightTheme;
