// app/about/page.tsx (assuming this is the about page; adjust path as needed)
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
  Fade,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import NextLink from "next/link";

import Header from "@/components/landing/Header"; // Import the separate Header component

function About() {
  return (
    <React.Fragment>
      <CssBaseline />
      <Header /> {/* Use the imported Header here */}

      {/* Hero Section: Introduction to SPF */}
      <Box
        sx={{
          position: "relative",
          minHeight: "50vh",
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
              Who We Are
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mb: 4,
                opacity: 0.9,
              }}
            >
              Safeguarding Singapore since 1820. Committed to preventing crime and ensuring safety for all.
            </Typography>
            <Button
              variant="contained"
              size="large"
              component={NextLink}
              href="/contact-us"
              sx={{
                backgroundColor: "#ff4d4f",
                px: 4,
                py: 1.5,
                fontWeight: 600,
                "&:hover": { backgroundColor: "#d9363e" },
              }}
            >
              Contact Us
            </Button>
          </Container>
        </Fade>
      </Box>

      {/* Main Content Sections: Mission, Vision, Values, History, Facts */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Mission Section */}
        <Box sx={{ mb: 8 }}>
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
            Our Mission
          </Typography>
          <Typography
            variant="body1"
            sx={{
              textAlign: "center",
              maxWidth: "800px",
              mx: "auto",
              color: "text.secondary",
            }}
          >
            The mission of the Singapore Police Force is to prevent, deter and detect crime to ensure the safety and security of Singapore.
          </Typography>
        </Box>

        {/* Vision Section */}
        <Box sx={{ mb: 8 }}>
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
            Our Vision
          </Typography>
          <Typography
            variant="body1"
            sx={{
              textAlign: "center",
              maxWidth: "800px",
              mx: "auto",
              color: "text.secondary",
            }}
          >
            To make Singapore the safest place in the world.
          </Typography>
        </Box>

        {/* Values Section */}
        <Box sx={{ mb: 8 }}>
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
            Our Core Values
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  height: "100%",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                  transition: "transform 0.3s ease",
                  "&:hover": { transform: "translateY(-4px)" },
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Courage
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    We are willing to risk our lives, if necessary, in order to safeguard our society. We also have the moral courage to seek and speak the truth, and to set wrongs right.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  height: "100%",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                  transition: "transform 0.3s ease",
                  "&:hover": { transform: "translateY(-4px)" },
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Integrity
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    We never forsake our ethics in order to attain our objectives. Our actions are guided by our principle, not expediency.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  height: "100%",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                  transition: "transform 0.3s ease",
                  "&:hover": { transform: "translateY(-4px)" },
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Fairness
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    We are fair in our dealings with people, irrespective of their race, religion, gender, age, standing in life and irrespective of whether they are victims, suspects or convicts. We also apply the same standard to the members of the police force.
                  </Typography>
                </CardContent>
              </Card>
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
      </Box>
    </React.Fragment>
  );
}

export default About;