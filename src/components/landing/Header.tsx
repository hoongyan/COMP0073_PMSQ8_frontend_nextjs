import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Container,
  Menu,
  MenuItem,
} from "@mui/material";
import LocalPoliceIcon from "@mui/icons-material/LocalPolice";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import NextLink from "next/link";

export default function Header() {
  // For the "For Staff" dropdown menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ backgroundColor: "#001f3f" }}>
      <Container maxWidth={false} sx={{ px: { xs: 2, sm: 4, md: 8 } }}>
        {" "}
        {/* Full width with responsive padding */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            py: 2,
            width: "100%",
          }}
        >
          {/* Left: Logo */}
          <Box
            sx={{ display: "flex", alignItems: "center", mr: { xs: 2, md: 4 } }}
          >
            <LocalPoliceIcon sx={{ color: "white", fontSize: 32, mr: 1 }} />
            <Typography variant="h6" sx={{ color: "white", fontWeight: 700 }}>
              Police Scam Reporting Site
            </Typography>
          </Box>
          {/* Center: Main Navigation Links - Spread out with space-around */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "space-around",
              gap: { xs: 1, md: 2 },
              mx: { xs: 1, md: 4 },
            }}
          >
            <Button
              color="inherit"
              component={NextLink}
              href="/"
              sx={{
                color: "white",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                minWidth: "auto",
              }}
            >
              Home
            </Button>
            <Button
              color="inherit"
              component={NextLink}
              href="/about"
              sx={{
                color: "white",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                minWidth: "auto",
              }}
            >
              About
            </Button>
            <Button
              color="inherit"
              component={NextLink}
              href="/advisories"
              sx={{
                color: "white",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                minWidth: "auto",
              }}
            >
              Advisories
            </Button>
            <Button
              color="inherit"
              component={NextLink}
              href="/contact-us"
              sx={{
                color: "white",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                minWidth: "auto",
              }}
            >
              Contact Us
            </Button>
          </Box>
          {/* Right: For Staff and Report a Scam */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1, md: 3 },
            }}
          >
            {/* For Staff Dropdown */}
            <Button
              color="inherit"
              onClick={handleClick}
              endIcon={<ArrowDropDownIcon />}
              sx={{
                color: "white",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
              }}
            >
              For Staff
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem component={NextLink} href="/auth/sign-in">
                Sign In
              </MenuItem>
              <MenuItem component={NextLink} href="/auth/sign-up">
                Sign Up
              </MenuItem>
            </Menu>
            {/* Big Report a Scam Button */}
            <Button
              variant="contained"
              component={NextLink}
              href="/report-scam"
              sx={{
                backgroundColor: "#ff4d4f", // Red for urgency
                color: "white",
                px: { xs: 2, md: 4 },
                py: 1.5,
                fontSize: "1rem",
                fontWeight: 600,
                "&:hover": { backgroundColor: "#d9363e" },
              }}
            >
              Report a Scam
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
