


"use client";

import React from "react";
import {
  Typography,
  Box,
  Container,
  CssBaseline,
  Grid,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import NextLink from "next/link";

import Header from "@/components/landing/Header"; // Import the separate Header component

function ContactUs() {
  return (
    <React.Fragment>
      <CssBaseline />
      <Header /> {/* Use the imported Header here */}

      {/* Hero Section: Contact Introduction */}
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
            Contact Us
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mb: 4,
              opacity: 0.9,
            }}
          >
            Reach out for inquiries, reports, or support related to fraud and scams.
          </Typography>
        </Container>
      </Box>

      {/* Main Content: Contact Information */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={6}>
          {/* Contact Details Section */}
          <Grid item xs={12}>
            {/* Emergency Contact Numbers */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, color: "#001f3f", mb: 2 }}>
                Emergency Contact Numbers
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon><PhoneIcon sx={{ color: "#001f3f" }} /></ListItemIcon>
                  <ListItemText primary="Police Emergency (For immediate police assistance): 999" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><PhoneIcon sx={{ color: "#001f3f" }} /></ListItemIcon>
                  <ListItemText primary="Emergency SMS (For immediate police assistance if it is not safe to talk): 70999" />
                </ListItem>
              </List>
            </Box>

            {/* Hotline Numbers and Other Services */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, color: "#001f3f", mb: 2 }}>
                Hotline Numbers and Other Services
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon><PhoneIcon sx={{ color: "#001f3f" }} /></ListItemIcon>
                  <ListItemText primary="Police Hotline (To provide crime-related info to police): 1800 255 0000" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><PhoneIcon sx={{ color: "#001f3f" }} /></ListItemIcon>
                  <ListItemText primary="ScamShield Helpline (Available 24/7, Monday to Sunday): 1799" />
                </ListItem>
              </List>
            </Box>

            {/* Police Investigation Branch Hotlines */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, color: "#001f3f", mb: 2 }}>
                Police Investigation Branch Hotlines
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Operating hours: Monday to Thursday 8:30am to 6:00pm, Friday 8:30am to 5:30pm
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon><PhoneIcon sx={{ color: "#001f3f" }} /></ListItemIcon>
                  <ListItemText primary="Ang Mo Kio Division: 6218 1343" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><PhoneIcon sx={{ color: "#001f3f" }} /></ListItemIcon>
                  <ListItemText primary="Bedok Division: 6244 7200" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><PhoneIcon sx={{ color: "#001f3f" }} /></ListItemIcon>
                  <ListItemText primary="Central Division: 6557 5076" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><PhoneIcon sx={{ color: "#001f3f" }} /></ListItemIcon>
                  <ListItemText primary="Clementi Division: 6872 7683" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><PhoneIcon sx={{ color: "#001f3f" }} /></ListItemIcon>
                  <ListItemText primary="Jurong Division: 6316 7508" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><PhoneIcon sx={{ color: "#001f3f" }} /></ListItemIcon>
                  <ListItemText primary="Tanglin Division: 6391 4762" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><PhoneIcon sx={{ color: "#001f3f" }} /></ListItemIcon>
                  <ListItemText primary="Woodlands Division: 6364 7559" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><PhoneIcon sx={{ color: "#001f3f" }} /></ListItemIcon>
                  <ListItemText primary="Airport Police Division: 6543 8058" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><PhoneIcon sx={{ color: "#001f3f" }} /></ListItemIcon>
                  <ListItemText primary="Traffic Police: 6547 6391" />
                </ListItem>
              </List>
            </Box>

            {/* Operating Hours */}
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600, color: "#001f3f", mb: 2 }}>
                Operating Hours
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Neighbourhood Police Centre (NPC): 24 Hours" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Neighbourhood Police Post (NPP): 12pm to 10pm (Daily)" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Redesigned NPP (Self-Help Kiosks Only): 24 Hours" />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Traffic Police: Mon - Fri 8.30am to 5.30pm, Sat 8.30am to 1pm (Closed on Sundays and Public Holidays)"
                  />
                </ListItem>
              </List>
            </Box>
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

export default ContactUs;