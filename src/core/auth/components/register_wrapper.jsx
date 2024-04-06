import {
  Button,
  Divider,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { FullTitleElement } from "../../../shared";
import { Google } from "@mui/icons-material";
import { NavLink, Outlet } from "react-router-dom";

// TODO: fix form autofilling
const RegisterPage = () => {
  return (
    <Stack
      className="auth-container"
      direction="column"
      spacing={0}
      alignItems="center"
      sx={{ maxWidth: 400, mx: "auto", padding: 5, height: 'fit-content'}}
    >
      <FullTitleElement />
      <Typography variant="h6" sx={{ fontWeight: 500, color: "#fff" }}>
        Create an Account
      </Typography>
      <Stack direction='row' justifyContent='space-between' id="registeration-options-links">
        <NavLink to={"/auth/register/student"}>
          <Button size='small' variant="text">As Student</Button>
        </NavLink>
        <NavLink to={"/auth/register/editor"}>
          <Button size='small' variant="text">As Editor</Button>
        </NavLink>
        <NavLink to={"/auth/register/client"}>
          <Button size='small' variant="text">As Client</Button>
        </NavLink>
      </Stack>
      <Outlet />
      <Button
        fullWidth
        variant="contained"
        sx={{ backgroundColor: "#fff", my: 2 }}
      >
        Continue with <Google sx={{ marginLeft: "2px", color: "#f00" }} />
        oogle
      </Button>
      <Divider sx={{ width: "100%", color: "#fff", opacity: 1 }}>Or</Divider>
      <Link
        href={`/auth/login`}
        sx={{ margin: "10px", alignSelf: "start" }}
      >
        Log In Instead
      </Link>
    </Stack>
  );
};

export default RegisterPage;
