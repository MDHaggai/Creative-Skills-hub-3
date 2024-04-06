import {
    Button,
    MenuItem,
    TextField,
  } from "@mui/material";
  import { ErrorMessage, Field, Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
  import * as Yup from "yup";
  import axios from 'axios';

const ClientRegistrationForm = () => {
    const navigate = useNavigate()
    return (
      <Formik
      initialValues={{
        clientType: "",
        fullname: "",
        phone: "",
        address: "",
        website: "",
        email: "",
        password: "",
      }}
      validationSchema={Yup.object({
        clientType: Yup.string().trim().required("Field is required"),
        fullname: Yup.string().trim().required("Name is required"),
        phone: Yup.string().trim().required("Phone is required"),
        email: Yup.string()
          .trim()
          .email("Invalid email address")
          .required("Email is required"),
        password: Yup.string()
          .trim()
          .min(6, "Password must be at least 6 characters")
          .required("Password is required"),
      })}
      onSubmit={(values, { setSubmitting }) => {
  
        console.log("Form values:", values);

        axios.post('http://localhost:4000/clients/register_client', values, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(response => {
          console.log("Registration response:", response.data);
          
          // Navigate to verification page and pass along the email as state
          navigate("/auth/verify-email", { state: { email: values.email, userType: 'client' } });

        })
        .catch(error => {
          console.error("Registration failed:", error);
          alert("Registration failed. Please try again.");
        })
        .finally(() => {
          setSubmitting(false); // Ensures the form is no longer in a submitting state
        });
      }}
    >
      <Form className="auth-form" id="client-form">
        <Field 
          name="clientType"
          as={TextField}
          fullWidth
          id="clientType"
          label="Individual or Organisation"
          variant="outlined"
          select
          size="small"
          sx={{ margin: "10px 0" }}
          helperText={<ErrorMessage name="clientType" />}
        >
          <MenuItem value="" selected>Individual or Organisation</MenuItem>
          <MenuItem value="beginner">Individual</MenuItem>
          <MenuItem value="amateur">Organisation</MenuItem>
        </Field>
        <Field
          name="fullname"
          type="text"
          as={TextField}
          fullWidth
          id="fullname"
          size="small"
          label="What is your (business) name?"
          variant="outlined"
          sx={{ margin: "10px 0" }}
          helperText={<ErrorMessage name="fullname" />}
        />
        <Field
          name="phone"
          type="tel"
          as={TextField}
          fullWidth
          id="phone"
          size="small"
          label="Enter Phone Number"
          variant="outlined"
          sx={{ margin: "10px 0" }}
          helperText={<ErrorMessage name="phone" />}
        />
        <Field
          name="address"
          type="text"
          as={TextField}
          fullWidth
          id="address"
          size="small"
          label="Enter address"
          variant="outlined"
          sx={{ margin: "10px 0" }}
        />
        <Field
          name="website"
          type="text"
          as={TextField}
          fullWidth
          id="website"
          size="small"
          label="Enter website url"
          variant="outlined"
          sx={{ margin: "10px 0" }}
        />
        <Field
          name="email"
          type="email"
          as={TextField}
          fullWidth
          id="email"
          size="small"
          label="Enter email"
          variant="outlined"
          sx={{ margin: "10px 0" }}
          helperText={<ErrorMessage name="email" />}
        />
        <Field
          name="password"
          type="password"
          as={TextField}
          fullWidth
          id="password"
          size="small"
          label="Enter password"
          variant="outlined"
          sx={{ margin: "10px 0" }}
          helperText={<ErrorMessage name="password" />}
        />
        <Button
          fullWidth
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Sign Up
        </Button>
      </Form>
    </Formik>)
}

export default ClientRegistrationForm;