"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation"; 
import NextLink from "next/link";

import {
  Typography,
  Button,
  Box,
  Alert,
  Container,
  CssBaseline,
  Fade,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Grid,
  CircularProgress, 
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Header from "@/components/landing/Header";
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { signin, SigninData } from '@/lib/auth';

const signinSchema = yup.object({
  email: yup.string().required('Email is required').email('Invalid email'),
  password: yup.string().required('Password is required').min(8, 'Password must be at least 8 characters'),
});

type SigninFormData = yup.InferType<typeof signinSchema>;

function SignIn() {
  const searchParams = useSearchParams();
  const router = useRouter(); 
  const rawError = searchParams.get("error");

  const errorMap: Record<string, string> = {
    InvalidCredentials:
      "Invalid login details. Please check your email and password.",
    DeactivatedAccount:
      "This account has been deactivated. Please contact the admin.",
    CredentialsSignin: "Invalid login attempt. Please try again.",
  };

  const errorMessage = rawError ? errorMap[rawError] : null;

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<SigninFormData>({
    resolver: yupResolver(signinSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [rememberMe, setRememberMe] = React.useState(false);
  const [submissionStatus, setSubmissionStatus] = React.useState<"idle" | "success" | "error">("idle");
  const [submissionMessage, setSubmissionMessage] = React.useState("");

  const onSubmit = async (data: SigninFormData) => {
    try {
      const credentials: SigninData = {
        email: data.email,
        password: data.password,
        rememberMe,
      };

      await signin(credentials);
      
      setSubmissionStatus("success");
      setSubmissionMessage("Login successful! Redirecting...");
      
      setTimeout(() => {
        router.push('/reports');
      }, 1500);

    } catch (error: any) {
      console.error("Signin error:", error); 
      setSubmissionStatus("error");
      setSubmissionMessage(error.message || "An unexpected error occurred. Please try again.");
    }
  };

  if (submissionStatus === "success") {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Alert severity="success">{submissionMessage}</Alert>
      </Box>
    ); 
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <Header /> 
      <Box
        sx={{
          minHeight: "calc(100vh - 80px)", 
          background: "linear-gradient(135deg, #001f3f 0%, #004080 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
            opacity: 0.3,
          }}
        />
        {/* Sign-In Card */}
        <Fade in timeout={800}>
          <Container maxWidth="xs"> 
            <Box
              sx={{
                padding: "48px 32px",
                borderRadius: "16px",
                backgroundColor: "rgba(255,255,255,0.95)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                textAlign: "center",
              }}
            >
              <LockOutlinedIcon sx={{ fontSize: 60, color: "#001f3f", mb: 2 }} />
              <Typography
                variant="h5"
                sx={{
                  fontFamily: "Inter",
                  fontWeight: 700,
                  color: "#001f3f",
                  mb: 1,
                }}
              >
                Staff Sign-In
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(0, 0, 0, 0.6)",
                  mb: 4,
                }}
              >
                Secure access for police officers and analysts.
              </Typography>
              {errorMessage && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {errorMessage}
                </Alert>
              )}
              {submissionStatus === "error" && ( 
                <Alert severity="error" sx={{ mb: 3 }}>
                  {submissionMessage}
                </Alert>
              )}
              {/* Inline Sign-In Form */}
              <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}> 
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      margin="normal"
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      autoComplete="email"
                      autoFocus
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  )}
                />
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      margin="normal"
                      required
                      fullWidth
                      label="Password"
                      type="password"
                      id="password"
                      autoComplete="current-password"
                      error={!!errors.password}
                      helperText={errors.password?.message}
                    />
                  )}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      value="remember"
                      color="primary"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                  }
                  label="Remember me"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isSubmitting} 
                  sx={{ mt: 3, mb: 2, backgroundColor: "#001f3f" }}
                >
                  {isSubmitting ? (
                    <CircularProgress size={24} color="inherit" /> 
                  ) : (
                    "Sign In"
                  )}
                </Button>
                <Grid container direction="column" alignItems="center" spacing={1}>
                  <Grid item>
                    <Button
                      fullWidth
                      variant="text"
                      component={NextLink}
                      href="/auth/sign-up"  
                      sx={{ textTransform: 'none' }}  
                    >
                      Don't have an account? Sign Up here.
                    </Button>
                  </Grid>
                  <Grid item>
                    <Typography variant="body2" color="textSecondary">
                      For password resets please contact administrators directly.
                    </Typography>
                  </Grid>
                </Grid>
                <Box sx={{ mt: 2 }}>
                </Box>
              </Box>
            </Box>
          </Container>
        </Fade>
      </Box>
    </React.Fragment>
  );
}

export default SignIn;