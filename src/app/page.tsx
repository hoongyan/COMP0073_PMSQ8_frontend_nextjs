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
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import InfoIcon from "@mui/icons-material/Info";
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
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontFamily: "Inter",
                fontWeight: 700,
                mb: 2,
              }}
            >
              Protect Yourself from Scams
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mb: 4,
                opacity: 0.9,
              }}
            >
              The Police Force is committed to safeguarding our community. Report scams, access advisories, and stay informed.
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
        </Grid>
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
      </Box>
    </React.Fragment>
  );
}

export default Home;