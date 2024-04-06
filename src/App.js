import { RouterProvider } from "react-router-dom";
import routes from "./routes";
import { ThemeProvider } from "@mui/material";
import { lightTheme } from "./shared";

function App() {
  return (
    <ThemeProvider theme={lightTheme}>
      <RouterProvider router={routes} />
    </ThemeProvider>
  );
}

export default App;
