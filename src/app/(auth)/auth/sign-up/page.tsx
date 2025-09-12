"use client";

import React from "react";  
import { useSearchParams} from "next/navigation";
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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Link,
  LinearProgress,  
  CircularProgress, 
} from "@mui/material";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';  
// import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'; 
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { DatePicker, AdapterDateFns, LocalizationProvider } from '@mui/x-date-pickers';
import { format } from 'date-fns';
import { useForm, Controller } from 'react-hook-form';  
import { yupResolver } from '@hookform/resolvers/yup'; 
import * as yup from 'yup';  
import zxcvbn from 'zxcvbn';  

import Header from "@/components/landing/Header"; 
import { signup, SignupData } from '@/lib/auth'; 

const signupSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Confirm password is required'),
  firstName: yup.string().min(2, 'First name too short').required('First name is required'),
  lastName: yup.string().min(2, 'Last name too short').required('Last name is required'),
  contactNo: yup.string().matches(/^\d{8,12}$/, 'Contact number must be 8-12 digits').required('Contact number is required'),
  sex: yup.string().oneOf(['Male', 'Female', 'Other'], 'Invalid sex').required('Sex is required'),  // Required in frontend
  dob: yup.date().max(new Date(), 'Date of birth cannot be in the future').nullable().optional(),
  nationality: yup.string().nullable().optional(),  
  race: yup.string().nullable().optional(),  
  blk: yup.string().nullable().optional(),  
  street: yup.string().nullable().optional(),  
  unitNo: yup.string().nullable().optional(),  
  postCode: yup.string().nullable().optional(),
  role: yup.string().oneOf(['INVESTIGATION OFFICER', 'ANALYST', 'ADMIN'], 'Invalid role').required('Role is required'),  
});

type SignupFormData = yup.InferType<typeof signupSchema>;  

function SignUp() {
  const searchParams = useSearchParams();
  const rawError = searchParams.get("error");

  const errorMap: Record<string, string> = {
    RegistrationFailed: "Registration failed. Please try again.",
    // Add more error mappings as needed for production
  };

  const errorMessage = rawError ? errorMap[rawError] : null;

  const { control, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm<SignupFormData>({
    resolver: yupResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      sex: '',
      dob: null, 
      nationality: '',
      race: '',
      contactNo: '',
      blk: '',
      street: '',
      unitNo: '',
      postCode: '',
      role: '',
    },
  });

  // Password strength
  const password = watch('password');  
  const passwordStrength = zxcvbn(password || '');
  const strengthScore = passwordStrength.score;  // 0-4
  const strengthLabel = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'][strengthScore];
  const strengthColor = ['error', 'error', 'warning', 'info', 'success'][strengthScore];

  // State for submission status
  const [submissionStatus, setSubmissionStatus] = React.useState<"idle" | "success" | "error">("idle");
  const [submissionMessage, setSubmissionMessage] = React.useState("");


  const onSubmit = async (data: SignupFormData) => {
    try {
      const signupData: SignupData = {
        email: data.email,  
        password: data.password, 
        first_name: data.firstName.trim().toUpperCase() || '',  
        last_name: data.lastName.trim().toUpperCase() || '',
        contact_no: data.contactNo,  
        sex: data.sex?.trim().toUpperCase() || undefined,  
        dob: data.dob ? format(new Date(data.dob), 'yyyy-MM-dd') : undefined,  
        nationality: data.nationality?.trim().toUpperCase() || undefined,
        race: data.race?.trim().toUpperCase() || undefined,
        blk: data.blk?.trim().toUpperCase() || undefined,
        street: data.street?.trim().toUpperCase() || undefined,
        unit_no: data.unitNo?.trim().toUpperCase() || undefined,
        postcode: data.postCode?.trim().toUpperCase() || undefined,  
        role: data.role?.trim().toUpperCase() || undefined,  
      };

      const created = await signup(signupData);  // Get UserRead

        setSubmissionStatus("success");
        setSubmissionMessage(
          `Your registration has been submitted successfully, ${created.first_name}! Your status is ${created.status}. Please wait for a few business working days while the admin reviews your application.`
        );
      } catch (error: any) {
        console.error("Signup error:", error);
        let message = "Registration submission encountered an issue. Please try again later or contact support.";
        if (error.message.includes('Email already registered')) {
          message = error.message;  // Specific from auth.ts
        } else if (error.message.includes('Invalid')) {
          message = 'Invalid input: ' + error.message;  
        }
        setSubmissionStatus("error");
        setSubmissionMessage(message);
      }
    };

  if (submissionStatus === "success") {
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
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
              opacity: 0.3,
            }}
          />
          <Fade in timeout={800}>
            <Container maxWidth="md">
              <Box
                sx={{
                  padding: "32px 24px",
                  borderRadius: "16px",
                  backgroundColor: "rgba(255,255,255,0.95)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                  textAlign: "center",
                }}
              >
                <LockOutlinedIcon
                  sx={{ fontSize: 60, color: "#001f3f", mb: 1 }}
                />
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: "Inter",
                    fontWeight: 700,
                    color: "#001f3f",
                    mb: 1,
                  }}
                >
                  Registration Submitted
                </Typography>
                <Alert severity="success" sx={{ mb: 2 }}>
                  {submissionMessage}
                </Alert>
                <Button
                  fullWidth
                  variant="contained"
                  component={NextLink}
                  href="/auth/sign-in"
                  sx={{ mt: 2, mb: 1, backgroundColor: "#001f3f" }}
                >
                  Back to Sign In
                </Button>
              </Box>
            </Container>
          </Fade>
        </Box>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <Header />

      {/* Main Content: Centralized Sign-Up with Creative Design */}
      <Box
        sx={{
          minHeight: "calc(100vh - 80px)", // Adjusted height for the header
          background: "linear-gradient(135deg, #001f3f 0%, #004080 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle Background Elements */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
            opacity: 0.3,
          }}
        />
        <Fade in timeout={800}>
          <Container maxWidth="sm">  {/* Increased width for better layout */}
            <Box
              sx={{
                padding: "32px 24px",
                borderRadius: "16px",
                backgroundColor: "rgba(255,255,255,0.95)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
              }}
            >
              <Typography
                variant="h5"
                align="center"
                sx={{
                  fontFamily: "Inter",
                  fontWeight: 700,
                  color: "#001f3f",
                  mb: 2,
                }}
              >
                Create Your Account
              </Typography>
              {errorMessage && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {errorMessage}
                </Alert>
              )}
              {submissionStatus === "error" && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {submissionMessage}
                </Alert>
              )}
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                  {/* Email and Password first */}
                  <Grid size={{ xs: 12 }}>
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          margin="dense"
                          required
                          fullWidth
                          id="email"
                          label="Email Address"
                          autoComplete="email"
                          error={!!errors.email}
                          helperText={errors.email?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Controller
                      name="password"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          margin="dense"
                          required
                          fullWidth
                          name="password"
                          label="Password"
                          type="password"
                          id="password"
                          autoComplete="new-password"
                          error={!!errors.password}
                          helperText={errors.password?.message}
                        />
                      )}
                    />
                    {/* Password Strength */}
                    {password && (
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2">Password Strength: {strengthLabel}</Typography>
                        <LinearProgress
                          variant="determinate"
                          value={(strengthScore / 4) * 100}
                          color={strengthColor as any}
                        />
                      </Box>
                    )}
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Controller
                      name="confirmPassword"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          margin="dense"
                          required
                          fullWidth
                          name="confirmPassword"
                          label="Confirm Password"
                          type="password"
                          id="confirmPassword"
                          error={!!errors.confirmPassword}
                          helperText={errors.confirmPassword?.message}
                        />
                      )}
                    />
                  </Grid>
                  {/* Other required fields */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                      name="firstName"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          margin="dense"
                          required
                          fullWidth
                          id="firstName"
                          label="First Name"
                          name="firstName"
                          error={!!errors.firstName}
                          helperText={errors.firstName?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                      name="lastName"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          margin="dense"
                          required
                          fullWidth
                          id="lastName"
                          label="Last Name"
                          name="lastName"
                          error={!!errors.lastName}
                          helperText={errors.lastName?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                      name="contactNo"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          margin="dense"
                          required
                          fullWidth
                          id="contactNo"
                          label="Contact Number"
                          name="contactNo"
                          type="tel"
                          autoComplete="tel"
                          error={!!errors.contactNo}
                          helperText={errors.contactNo?.message}
                        />
                      )}
                    />
                  </Grid>
                  {/* Optional fields */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth margin="dense" required>
                      <InputLabel id="sex-label">Sex</InputLabel>
                      <Controller
                        name="sex"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            labelId="sex-label"
                            id="sex"
                            label="Sex"
                            sx={{ textAlign: "left" }}
                            error={!!errors.sex}
                          >
                            <MenuItem value="Male">Male</MenuItem>
                            <MenuItem value="Female">Female</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                          </Select>
                        )}
                      />
                      {errors.sex && <Typography color="error">{errors.sex.message}</Typography>}
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <Controller
                        name="dob"
                        control={control}
                        render={({ field }) => (
                          <DatePicker
                            {...field}
                            label="Date of Birth"
                            slotProps={{
                              textField: {
                                margin: 'dense',
                                fullWidth: true,
                                error: !!errors.dob,
                                helperText: errors.dob?.message,
                              },
                            }}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                      name="nationality"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          margin="dense"
                          fullWidth
                          id="nationality"
                          label="Nationality"
                          name="nationality"
                          error={!!errors.nationality}
                          helperText={errors.nationality?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                      name="race"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          margin="dense"
                          fullWidth
                          id="race"
                          label="Race"
                          name="race"
                          error={!!errors.race}
                          helperText={errors.race?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                      name="blk"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          margin="dense"
                          fullWidth
                          id="blk"
                          label="Block"
                          name="blk"
                          error={!!errors.blk}
                          helperText={errors.blk?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                      name="street"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          margin="dense"
                          fullWidth
                          id="street"
                          label="Street"
                          name="street"
                          error={!!errors.street}
                          helperText={errors.street?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                      name="unitNo"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          margin="dense"
                          fullWidth
                          id="unitNo"
                          label="Unit Number"
                          name="unitNo"
                          error={!!errors.unitNo}
                          helperText={errors.unitNo?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                      name="postCode"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          margin="dense"
                          fullWidth
                          id="postCode"
                          label="Postal Code"
                          name="postCode"
                          error={!!errors.postCode}
                          helperText={errors.postCode?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <FormControl fullWidth margin="dense" required>
                      <InputLabel id="role-label">Role</InputLabel>
                      <Controller
                        name="role"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            labelId="role-label"
                            id="role"
                            label="Role"
                            sx={{ textAlign: "left" }}
                            error={!!errors.role}
                          >
                            <MenuItem value="INVESTIGATION OFFICER">
                              Investigation Officer
                            </MenuItem>
                            <MenuItem value="ANALYST">Analyst</MenuItem>
                            <MenuItem value="ADMIN">Admin</MenuItem>
                          </Select>
                        )}
                      />
                      {errors.role && <Typography color="error">{errors.role.message}</Typography>}
                    </FormControl>
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isSubmitting}
                  sx={{ mt: 2, mb: 1, backgroundColor: "#001f3f" }}
                >
                  {isSubmitting ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Submit Registration"
                  )}
                </Button>
                <Grid
                  container
                  direction="column"
                  alignItems="center"
                  spacing={0.5}
                >
                  <Grid item>
                    <Button
                      fullWidth
                      variant="text"
                      component={NextLink}
                      href="/auth/sign-in"
                      sx={{ textTransform: 'none' }}  
                    >
                      Already have an account? Sign In here.
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      fullWidth
                      variant="text"
                      component={NextLink}
                      href="/contact-support"
                      sx={{ textTransform: 'none' }}
                    >
                      Contact Support
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Box>
          </Container>
        </Fade>
      </Box>
    </React.Fragment>
  );
}

export default SignUp;