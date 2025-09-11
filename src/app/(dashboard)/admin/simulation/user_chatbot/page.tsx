"use client";
import React, { useState } from "react";
import { Drawer, IconButton, Box, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NonAutonomousSimulation from "@/components/Simulation/NonAutonomousSimulation";
import InfoForm from "@/components/Simulation/InfoForm";

export default function NonAutonomousChatPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <div className="p-4 flex flex-col w-full h-screen">
      <Box className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-center flex-1">
          Victim-Police Non-Autonomous Simulation
        </h1>
        <IconButton
          onClick={toggleDrawer}
          aria-label="Open Crime Report Form"
          className="md:hidden"
        >
          <MenuIcon />
        </IconButton>
      </Box>
      <Box className="flex flex-1 w-full overflow-hidden">
        <Box className="w-full bg-white shadow-md rounded-lg p-4 flex flex-col">
          <h2 className="text-xl font-semibold mb-2">Simulator</h2>
          <NonAutonomousSimulation />
        </Box>
        <Drawer
          anchor="right"
          open={isDrawerOpen}
          onClose={toggleDrawer}
          sx={{
            "& .MuiDrawer-paper": {
              width: { xs: "100%", sm: 600 },
              boxSizing: "border-box",
              p: 2,
              borderLeft: "2px solid #555555",
            },
          }}
        >
          <Box className="flex justify-between items-center mb-4">
            <Typography variant="h6" className="text-gray-900">
              Crime Report Form
            </Typography>
            <IconButton onClick={toggleDrawer} aria-label="Close Drawer">
              <MenuIcon />
            </IconButton>
          </Box>
          <InfoForm />
        </Drawer>
      </Box>
    </div>
  );
}
