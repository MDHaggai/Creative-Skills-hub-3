import React from 'react';
import {
  Box,
  Button,
  Divider,
  Link as MUILink,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FullTitleElement } from "../../../shared";
import { Google, MusicNote } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

const LoginForm = () => {
  const navigate = useNavigate();

  return (
    <Stack
      className="auth-container"
      direction="column"
      spacing={0}
      alignItems="center"
      sx={{ maxWidth: 400, mx: "auto", height: "fit-content" }}
    >
      <Typography variant="h5" sx={{ fontWeight: 500, color: "#fff" }}>
        Log in to
      </Typography>
      <FullTitleElement />
      <Typography variant="h5" sx={{ fontWeight: 500, color: "#fff" }}>
        Account
      </Typography>
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={Yup.object({
          email: Yup.string()
            .email("Invalid email address")
            .required("Email is required"),
          password: Yup.string()
            .min(6, "Password must be at least 6 characters")
            .required("Password is required"),
        })}
        onSubmit={(values, { setSubmitting }) => {
          axios.post('http://localhost:4000/login', values)
            .then(response => {
              // Assuming the response contains a field 'userType' indicating where to navigate
              console.log("Login successful:", response.data);
              const { userType } = response.data;
              // Navigate based on userType
              navigate(`/${userType}`); // Adjust to match your routing setup
            })
            .catch(error => {
              console.error("Login failed:", error.response?.data?.message || "An error occurred");
              alert('invalid email and password combination');
            })
            .finally(() => {
              setSubmitting(false);
            });
        }}
      >
        {() => (
          <Form className="auth-form">
            <Field
              name="email"
              type="email"
              as={TextField}
              fullWidth
              id="email"
              label="Enter Email"
              variant="outlined"
              margin="normal"
            />
            <ErrorMessage name="email" component="div" />
            <Field
              name="password"
              type="password"
              as={TextField}
              fullWidth
              id="password"
              label="Enter Password"
              variant="outlined"
              margin="normal"
            />
            <ErrorMessage name="password" component="div" />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              Sign In
            </Button>
          </Form>
        )}
      </Formik>
      <Box sx={{ my: 2 }}>
        <Button
          fullWidth
          variant="contained"
          sx={{ backgroundColor: "#fff" }}
          startIcon={<Google color="error" />}
        >
          Continue with Google
        </Button>
      </Box>
      <MUILink component={Link} to="#" sx={{ margin: "10px", alignSelf: "start" }}>
        Forgot Password?
      </MUILink>
      <Divider sx={{ width: "100%", color: "#fff", opacity: 1, my: 2 }}>Or</Divider>
      <MUILink component={Link} to="/auth/register/student" sx={{ alignSelf: "center" }}>
        Create an account instead
      </MUILink>
    </Stack>
  );
};

export default LoginForm;
