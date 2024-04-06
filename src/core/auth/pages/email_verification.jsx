import { Button, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import VerificationInput from "react-verification-input";
import { FullTitleElement } from "../../../shared";
import axios from 'axios';

function EmailVerification() {
    const navigate = useNavigate();
    const location = useLocation();
    const [verificationCode, setVerificationCode] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
   
    console.log("Verification page state:", location.state);
    const { email: userEmail, userType } = location.state; // Retrieve the user's email passed from the previous page

    const handleChange = (value) => {
        setVerificationCode(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (verificationCode.trim() === "") {
            setErrorMessage("Please enter the verification code");
            return;
        }

        setLoading(true);
        const verifyUrl = `http://localhost:4000/${userType}s/verify_email`;
        console.log("Sending verification request to:", verifyUrl);

        try {
          const response = await axios.post(verifyUrl, {
              email: userEmail,
              verificationCode
          });

          console.log("Verification response:", response.data);
      
          // Handle a successful verification
          if (response.data?.message === 'Email verified and user registered successfully.') {
            navigate(`/${response.data.userType}`);
              
              //console.log(`Redirecting to /${userType}`);
              
          } else {;
              // Handle any other messages or errors
              setErrorMessage(response.data?.message || "Verification failed. Please try again.");
          }
      } catch (error) {
          const message = error.response?.data?.message || "Network error. Please try again.";
          setErrorMessage(message);
          console.error("Verification error:", message);
      } finally {
          setLoading(false);
      }
    }

    return (
        <Stack
            className="auth-container verification-container"
            direction="column"
            spacing={3}
            alignItems="center"
            sx={{ maxWidth: 800, mx: "auto", height: "fit-content" }}
        >
            <FullTitleElement />
            <Typography sx={{ color: "#fff" }}>
                {/* Display the email to which the verification code was sent */}
                We sent a verification code to {userEmail ? userEmail : "your email address"}.
            </Typography>
            <form onSubmit={handleSubmit}>
                <VerificationInput 
                    onChange={handleChange}
                    id='verification-code'
                    length={6}
                    validChars="0-9"
                    container={{ className: "characters" }}
                    character={{
                        className: "character",
                        classNameInactive: "character--inactive",
                        classNameSelected: "character--selected",
                    }}
                />
                <Typography color='error' sx={{ marginTop: '15px' }}>{errorMessage}</Typography>
                <Stack direction='row' justifyContent='space-between' marginY={3}>
                    <Button size="large" variant="contained" onClick={() => navigate(-1)}>Back</Button>
                    <Button size="large" type="submit" variant="contained" disabled={loading}>
                        {loading ? 'Verifying...' : 'Verify'}
                    </Button>
                </Stack>
            </form>
        </Stack>
    );
}

export default EmailVerification;

