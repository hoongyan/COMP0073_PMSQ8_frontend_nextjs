"use client";

import React from "react";
import {
  Typography,
  Button,
  Box,
  Container,
  CssBaseline,
  Grid,
  Card,
  CardContent,
  CardActions,
  Fade,
  Link,
} from "@mui/material";
import LocalPoliceIcon from "@mui/icons-material/LocalPolice";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import InfoIcon from "@mui/icons-material/Info";
import SecurityIcon from "@mui/icons-material/Security";
import NextLink from "next/link";

import Header from "@/components/landing/Header"; // Import the separate Header component

function Home() {
  return (
    <React.Fragment>
      <CssBaseline />
      <Header /> {/* Use the imported Header here */}

      {/* Hero Section: Engaging Welcome with Call to Action */}
      <Box
        sx={{
          position: "relative",
          minHeight: "60vh",
          background: "linear-gradient(135deg, #001f3f 0%, #004080 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          color: "white",
          textAlign: "center",
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
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
            opacity: 0.3,
          }}
        />
        <Fade in timeout={800}>
          <Container maxWidth="md">
            <LocalPoliceIcon sx={{ fontSize: 80, mb: 2 }} />
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontFamily: "Inter",
                fontWeight: 700,
                mb: 2,
              }}
            >
              Protect Yourself from Fraud
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mb: 4,
                opacity: 0.9,
              }}
            >
              The Singapore Police Force is committed to safeguarding our community. Report scams, access advisories, and stay informed.
            </Typography>
            <Button
              variant="contained"
              size="large"
              component={NextLink}
              href="/report-scam"
              sx={{
                backgroundColor: "#ff4d4f",
                px: 4,
                py: 1.5,
                fontWeight: 600,
                "&:hover": { backgroundColor: "#d9363e" },
              }}
            >
              Report a Scam Now
            </Button>
          </Container>
        </Fade>
      </Box>

      {/* Main Content Sections: Informative and Action-Oriented */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Quick Actions Grid */}
        <Typography
          variant="h4"
          component="h2"
          sx={{
            fontFamily: "Inter",
            fontWeight: 700,
            color: "#001f3f",
            textAlign: "center",
            mb: 6,
          }}
        >
          What Can We Help You With?
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: "100%",
                boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                transition: "transform 0.3s ease",
                "&:hover": { transform: "translateY(-4px)" },
              }}
            >
              <CardContent sx={{ textAlign: "center" }}>
                <ReportProblemIcon sx={{ fontSize: 50, color: "#ff4d4f", mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Report a Scam
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Submit details of suspicious activities or fraud incidents securely.
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "center", pb: 2 }}>
                <Button
                  variant="outlined"
                  component={NextLink}
                  href="/report-scam"
                  sx={{ borderColor: "#001f3f", color: "#001f3f" }}
                >
                  Start Reporting
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: "100%",
                boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                transition: "transform 0.3s ease",
                "&:hover": { transform: "translateY(-4px)" },
              }}
            >
              <CardContent sx={{ textAlign: "center" }}>
                <InfoIcon sx={{ fontSize: 50, color: "#004080", mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Fraud Advisories
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Stay updated on the latest scam trends and prevention tips.
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "center", pb: 2 }}>
                <Button
                  variant="outlined"
                  component={NextLink}
                  href="/advisories"
                  sx={{ borderColor: "#001f3f", color: "#001f3f" }}
                >
                  View Advisories
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: "100%",
                boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                transition: "transform 0.3s ease",
                "&:hover": { transform: "translateY(-4px)" },
              }}
            >
              <CardContent sx={{ textAlign: "center" }}>
                <SecurityIcon sx={{ fontSize: 50, color: "#001f3f", mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  E-Services
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Access online tools for police reports and other services.
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "center", pb: 2 }}>
                <Button
                  variant="outlined"
                  component={NextLink}
                  href="/e-services"
                  sx={{ borderColor: "#001f3f", color: "#001f3f" }}
                >
                  Explore Services
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>

        {/* Educational Section */}
        <Box sx={{ mt: 8 }}>
          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontFamily: "Inter",
              fontWeight: 700,
              color: "#001f3f",
              textAlign: "center",
              mb: 4,
            }}
          >
            Learn About Common Scams
          </Typography>
          <Typography
            variant="body1"
            sx={{
              textAlign: "center",
              maxWidth: "800px",
              mx: "auto",
              mb: 6,
              color: "text.secondary",
            }}
          >
            Knowledge is your best defense. Explore resources to identify and avoid fraud.
          </Typography>
          {/* Placeholder for scam types; in production, fetch dynamically */}
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 3, border: "1px solid #ddd", borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Phishing Scams
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Fraudulent emails or messages tricking you into revealing personal information.
                </Typography>
                <Link
                  href="/advisories/phishing"
                  component={NextLink}
                  sx={{ mt: 2, display: "block" }}
                >
                  Learn More
                </Link>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 3, border: "1px solid #ddd", borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Investment Scams
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Promises of high returns with low risk, often leading to financial loss.
                </Typography>
                <Link
                  href="/advisories/investment"
                  component={NextLink}
                  sx={{ mt: 2, display: "block" }}
                >
                  Learn More
                </Link>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* Footer: Simple and Informative */}
      <Box
        sx={{
          backgroundColor: "#001f3f",
          color: "white",
          py: 4,
          textAlign: "center",
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            © {new Date().getFullYear()} Singapore Police Force. All rights reserved.
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Link href="/privacy-policy" component={NextLink} sx={{ color: "white", mx: 2 }}>
              Privacy Policy
            </Link>
            <Link href="/terms-of-use" component={NextLink} sx={{ color: "white", mx: 2 }}>
              Terms of Use
            </Link>
            <Link href="/contact-us" component={NextLink} sx={{ color: "white", mx: 2 }}>
              Contact Us
            </Link>
          </Box>
        </Container>
      </Box>
    </React.Fragment>
  );
}

export default Home;