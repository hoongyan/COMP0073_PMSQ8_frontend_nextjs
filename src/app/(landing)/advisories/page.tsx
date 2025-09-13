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
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import SecurityIcon from "@mui/icons-material/Security";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import EmailIcon from "@mui/icons-material/Email";
import GavelIcon from "@mui/icons-material/Gavel";
import NextLink from "next/link";

import Header from "@/components/landing/Header"; // Assuming the Header is in this path, adjust if needed

function Advisories() {
  return (
    <React.Fragment>
      <CssBaseline />
      <Header /> {/* Use the imported Header */}

      {/* Hero Section: Engaging Introduction to Advisories */}
      <Box
        sx={{
          position: "relative",
          minHeight: "40vh",
          background: "linear-gradient(135deg, #001f3f 0%, #004080 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          color: "white",
          textAlign: "center",
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
        <Fade in timeout={800}>
          <Container maxWidth="md">
            <WarningIcon sx={{ fontSize: 80, mb: 2 }} />
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontFamily: "Inter",
                fontWeight: 700,
                mb: 2,
              }}
            >
              Scam Advisories
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mb: 4,
                opacity: 0.9,
              }}
            >
              Learn how to identify and protect yourself from common scams. Stay vigilant and report suspicious activities.
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
              Report a Scam
            </Button>
          </Container>
        </Fade>
      </Box>

      {/* Main Content: Detailed Scam Advisories */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
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
          Common Scam Types
        </Typography>
        <Grid container spacing={4}>
          {/* E-Commerce Scams */}
          <Grid item xs={12}>
            <Card
              sx={{
                boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                transition: "transform 0.3s ease",
                "&:hover": { transform: "translateY(-4px)" },
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <ShoppingCartIcon sx={{ fontSize: 40, color: "#ff4d4f", mr: 2 }} />
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    E-Commerce Scams
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  E-commerce scams involve fraudulent sales on online platforms where scammers advertise attractive deals but fail to deliver goods after payment.
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  Common Tactics:
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><WarningIcon sx={{ color: "#ff4d4f" }} /></ListItemIcon>
                    <ListItemText primary="Advertisements for discounted items like electronics, gold, Pokémon cards, or event tickets (e.g., NDP 2025) on platforms such as Shopee, Facebook, Telegram." />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><WarningIcon sx={{ color: "#ff4d4f" }} /></ListItemIcon>
                    <ListItemText primary="Requests to transact outside official apps (e.g., via WhatsApp or Telegram) with promises of discounts." />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><WarningIcon sx={{ color: "#ff4d4f" }} /></ListItemIcon>
                    <ListItemText primary="Fake buyers in group chats confirming legitimacy, or claims of customs fees requiring extra payments." />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><WarningIcon sx={{ color: "#ff4d4f" }} /></ListItemIcon>
                    <ListItemText primary="Payments via PayNow or bank transfers; sellers become uncontactable after receiving money." />
                  </ListItem>
                </List>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, mt: 2 }}>
                  How to Identify:
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><SecurityIcon sx={{ color: "#001f3f" }} /></ListItemIcon>
                    <ListItemText primary="Deals that seem too good to be true, especially for high-demand items." />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><SecurityIcon sx={{ color: "#001f3f" }} /></ListItemIcon>
                    <ListItemText primary="Insistence on paying outside the platform or to unknown accounts." />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><SecurityIcon sx={{ color: "#001f3f" }} /></ListItemIcon>
                    <ListItemText primary="No delivery of goods and seller unresponsiveness." />
                  </ListItem>
                </List>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, mt: 2 }}>
                  Prevention Tips:
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><SecurityIcon sx={{ color: "#001f3f" }} /></ListItemIcon>
                    <ListItemText primary="Transact only within official platforms (e.g., Shopee Guarantee holds payment until delivery)." />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><SecurityIcon sx={{ color: "#001f3f" }} /></ListItemIcon>
                    <ListItemText primary="Install ScamShield app and check for scam signs." />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><SecurityIcon sx={{ color: "#001f3f" }} /></ListItemIcon>
                    <ListItemText primary="Avoid transferring money to unknown parties; verify offers via official sources." />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><SecurityIcon sx={{ color: "#001f3f" }} /></ListItemIcon>
                    <ListItemText primary="Report suspicious listings and call ScamShield Helpline at 1799 if unsure." />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Phishing Scams */}
          <Grid item xs={12}>
            <Card
              sx={{
                boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                transition: "transform 0.3s ease",
                "&:hover": { transform: "translateY(-4px)" },
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <EmailIcon sx={{ fontSize: 40, color: "#ff4d4f", mr: 2 }} />
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Phishing Scams
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  Phishing scams trick victims into revealing personal or financial information through fake communications, often leading to unauthorized transactions.
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  Common Tactics:
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><WarningIcon sx={{ color: "#ff4d4f" }} /></ListItemIcon>
                    <ListItemText primary="Video calls (e.g., Google Meet) from imposters in police uniforms claiming bank account issues or investigations." />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><WarningIcon sx={{ color: "#ff4d4f" }} /></ListItemIcon>
                    <ListItemText primary="Social media ads for discounted food items (e.g., durians, crackers) on TikTok, Facebook, Instagram, with links to fake websites." />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><WarningIcon sx={{ color: "#ff4d4f" }} /></ListItemIcon>
                    <ListItemText primary="Requests for credit/debit card details, banking credentials, OTPs, or app login codes." />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><WarningIcon sx={{ color: "#ff4d4f" }} /></ListItemIcon>
                    <ListItemText primary="Redirects to phishing sites or unauthorized account takeovers (e.g., YouTrip wallets)." />
                  </ListItem>
                </List>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, mt: 2 }}>
                  How to Identify:
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><SecurityIcon sx={{ color: "#001f3f" }} /></ListItemIcon>
                    <ListItemText primary="Unsolicited calls or ads requesting sensitive information urgently." />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><SecurityIcon sx={{ color: "#001f3f" }} /></ListItemIcon>
                    <ListItemText primary="Suspicious URLs or websites mimicking legitimate ones." />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><SecurityIcon sx={{ color: "#001f3f" }} /></ListItemIcon>
                    <ListItemText primary="Unexpected transactions or login notifications." />
                  </ListItem>
                </List>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, mt: 2 }}>
                  Prevention Tips:
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><SecurityIcon sx={{ color: "#001f3f" }} /></ListItemIcon>
                    <ListItemText primary="Enable 2FA/MFA and set transaction limits on accounts." />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><SecurityIcon sx={{ color: "#001f3f" }} /></ListItemIcon>
                    <ListItemText primary="Avoid clicking on unknown links; verify ads and callers via official channels." />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><SecurityIcon sx={{ color: "#001f3f" }} /></ListItemIcon>
                    <ListItemText primary="Never share OTPs, banking details, or personal info." />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><SecurityIcon sx={{ color: "#001f3f" }} /></ListItemIcon>
                    <ListItemText primary="Use ScamShield app and helpline (1799); report to bank immediately if compromised." />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Government Officials Impersonation Scams */}
          <Grid item xs={12}>
            <Card
              sx={{
                boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                transition: "transform 0.3s ease",
                "&:hover": { transform: "translateY(-4px)" },
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <GavelIcon sx={{ fontSize: 40, color: "#ff4d4f", mr: 2 }} />
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Government Officials Impersonation Scams
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  Scammers pretend to be government officials to deceive victims into handing over money or information under false pretenses.
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  Common Tactics:
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><WarningIcon sx={{ color: "#ff4d4f" }} /></ListItemIcon>
                    <ListItemText primary="Unsolicited calls from fake telco officials (e.g., Singtel) claiming mobile number used in crimes, then transferring to 'foreign police'." />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><WarningIcon sx={{ color: "#ff4d4f" }} /></ListItemIcon>
                    <ListItemText primary="Showing fake IDs via WhatsApp or delivering bogus documents to build trust." />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><WarningIcon sx={{ color: "#ff4d4f" }} /></ListItemIcon>
                    <ListItemText primary="Instructing victims to withdraw cash and hand it to a 'mule' for 'safekeeping' or investigation." />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><WarningIcon sx={{ color: "#ff4d4f" }} /></ListItemIcon>
                    <ListItemText primary="Using locals as cash mules to collect money from victims." />
                  </ListItem>
                </List>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, mt: 2 }}>
                  How to Identify:
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><SecurityIcon sx={{ color: "#001f3f" }} /></ListItemIcon>
                    <ListItemText primary="Requests to transfer money, disclose details, or hand over cash over the phone." />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><SecurityIcon sx={{ color: "#001f3f" }} /></ListItemIcon>
                    <ListItemText primary="Involvement of 'foreign police' or unverified officials." />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><SecurityIcon sx={{ color: "#001f3f" }} /></ListItemIcon>
                    <ListItemText primary="No physical warrant cards; only images or calls." />
                  </ListItem>
                </List>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, mt: 2 }}>
                  Prevention Tips:
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><SecurityIcon sx={{ color: "#001f3f" }} /></ListItemIcon>
                    <ListItemText primary="Government officials never ask for money transfers or cash handovers via phone." />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><SecurityIcon sx={{ color: "#001f3f" }} /></ListItemIcon>
                    <ListItemText primary="Verify callers by hanging up and calling official numbers." />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><SecurityIcon sx={{ color: "#001f3f" }} /></ListItemIcon>
                    <ListItemText primary="Install ScamShield, enable 2FA, and use Money Lock." />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><SecurityIcon sx={{ color: "#001f3f" }} /></ListItemIcon>
                    <ListItemText primary="Report suspicious visits or calls to police; call 1799 for advice." />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Call to Action */}
        <Box sx={{ textAlign: "center", mt: 6 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            If you suspect a scam, act immediately!
          </Typography>
          <Button
            variant="outlined"
            component={NextLink}
            href="/contact-us"
            sx={{ borderColor: "#001f3f", color: "#001f3f", mr: 2 }}
          >
            Contact Us
          </Button>
          <Button
            variant="contained"
            component={NextLink}
            href="/report-scam"
            sx={{ backgroundColor: "#ff4d4f", color: "white" }}
          >
            Report Now
          </Button>
        </Box>
      </Container>

      {/* Footer */}
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

export default Advisories;