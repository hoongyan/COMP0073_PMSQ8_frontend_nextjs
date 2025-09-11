// "use client";
// import React, { useState } from "react";
// import { Drawer, IconButton, Box, Typography } from "@mui/material";
// import MenuIcon from "@mui/icons-material/Menu";
// import AutonomousSimulation from "@/components/Simulation/AutonomousSimulation";
// import InfoForm from "@/components/Simulation/InfoForm";
// import ChatHistory from "@/components/Simulation/ChatHistory";

// export default function AutonomousChatbotPage() {
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);

//   const toggleDrawer = () => {
//     setIsDrawerOpen(!isDrawerOpen);
//   };

//   return (
//     <div className="p-4 flex flex-col w-full h-screen">
//       {/* Header */}
//       <Box className="flex justify-between items-center mb-4">
//         <h1 className="text-3xl font-bold text-center flex-1">
//           Autonomous Victim-Police Chatbot Simulation
//         </h1>
//         <IconButton
//           onClick={toggleDrawer}
//           aria-label="Open Configuration"
//           className="md:hidden"
//         >
//           <MenuIcon />
//         </IconButton>
//       </Box>

//       {/* Main Content */}
//       <Box className="flex flex-1 w-full overflow-hidden">
//         {/* Chatbot Simulator */}
//         <Box className="w-full bg-white shadow-md rounded-lg p-4 flex flex-col">
//           <h2 className="text-xl font-semibold mb-2">
//             Victim-Police Chatbot Simulator
//           </h2>
//           <AutonomousSimulation />
//         </Box>

//         {/* Drawer for Future Forms */}
//         <Drawer
//           anchor="right"
//           open={isDrawerOpen}
//           onClose={toggleDrawer}
//           sx={{
//             "& .MuiDrawer-paper": {
//               width: { xs: "100%", sm: 600 },
//               boxSizing: "border-box",
//               p: 2,
//               borderLeft: "2px solid #555555",
//             },
//           }}
//         >
//           <Box className="flex justify-between items-center mb-4">
//             <Typography variant="h6" className="text-gray-800">
//               Configuration
//             </Typography>
//             <IconButton onClick={toggleDrawer} aria-label="Close Drawer">
//               <MenuIcon />
//             </IconButton>
//           </Box>
//           {/* Placeholder for future forms */}
//           <Typography variant="body1" className="text-gray-600">
//             Additional configuration options will be added here.
//           </Typography>
//         </Drawer>
//       </Box>
//     </div>
//   );
// }

// "use client";
// import React, { useState } from "react";
// import { Box, Typography } from "@mui/material";
// import AutonomousSimulation from "@/components/Simulation/AutonomousSimulation";
// import InfoForm from "@/components/Simulation/InfoForm";
// import ChatHistory from "@/components/Simulation/ChatHistory";

// interface Message {
//   role: "police" | "victim";
//   content: string;
// }

// interface Conversation {
//   conversation_id: number;
//   title: string;
//   description: string | null;
//   messages: {
//     id: number;
//     content: string;
//     sender_type: string;
//     sender_id: number | null;
//     agent_id: number | null;
//   }[];
// }

// interface FormData {
//   firstName?: string;
//   lastName?: string;
//   telNo?: string;
//   address?: string;
//   occupation?: string;
//   age?: string;
//   incidentDate?: string;
//   reportDate?: string;
//   location?: string;
//   crimeType?: string;
//   approachPlatform?: string;
//   communicationPlatform?: string;
//   bank?: string;
//   bankNo?: string;
//   contactInfo?: string;
//   description?: string;
//   summary?: string;
// }

// export default function AutonomousChatbotPage() {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [refreshKey, setRefreshKey] = useState<number>(0);
//   const [formData, setFormData] = useState<FormData>({});

//   const handleSelectConversation = (conversation: Conversation) => {
//     const newMessages = conversation.messages.map((msg) => ({
//       role: msg.sender_type as "police" | "victim",
//       content: msg.content,
//     }));
//     setMessages(newMessages);
//     // Generate JSON output for selected conversation
//     const jsonOutput = generateJsonOutput(newMessages);
//     setFormData(jsonOutput);
//   };

//   const handleRefresh = () => {
//     setRefreshKey((prev) => prev + 1);
//   };

//   // Duplicate generateJsonOutput for page-level use
//   const generateJsonOutput = (messages: Message[]): FormData => {
//     let crimeType = "unknown";
//     let description = "";
//     let incidentDate = "";
//     let approachPlatform = "";
//     let communicationPlatform = "";
//     let amountLost: number | undefined;

//     messages.forEach((msg) => {
//       if (msg.role === "victim") {
//         if (msg.content.includes("e-commerce scam")) {
//           crimeType = "e-commerce scam";
//         } else if (msg.content.includes("government officials impersonation")) {
//           crimeType = "government officials impersonation";
//         }
//         if (msg.content.includes("contacted via")) {
//           approachPlatform = msg.content.match(/contacted via (\w+)/)?.[1] || "";
//           communicationPlatform = approachPlatform;
//         }
//         if (msg.content.includes("lost")) {
//           const match = msg.content.match(/lost \$?(\d+)/);
//           if (match) amountLost = parseInt(match[1]);
//         }
//         description += msg.content + " ";
//         if (msg.content.includes("on")) {
//           const dateMatch = msg.content.match(/on (\d{4}-\d{2}-\d{2})/);
//           if (dateMatch) incidentDate = dateMatch[1];
//         }
//       }
//     });

//     return {
//       crimeType,
//       description: description.trim(),
//       incidentDate,
//       approachPlatform,
//       communicationPlatform,
//       amountLost,
//     };
//   };

//   return (
//     <div className="p-4 flex flex-col w-full h-screen">
//       <Box className="flex justify-between items-center mb-4">
//         <h1 className="text-3xl font-bold text-center flex-1">
//           Autonomous Victim-Police Chatbot Simulation
//         </h1>
//       </Box>
//       <Box className="flex flex-1 w-full overflow-hidden">
//         <Box sx={{ display: "flex", flex: 1, gap: 2, flexWrap: "wrap" }}>
//           <Box sx={{ width: { xs: "200px", md: "300px" } }}>
//             <ChatHistory
//               onSelectConversation={handleSelectConversation}
//               refreshKey={refreshKey}
//               onRefresh={handleRefresh}
//             />
//           </Box>
//           <Box sx={{ flex: 1, minWidth: { xs: "300px" } }}>
//             <AutonomousSimulation
//               messages={messages}
//               setMessages={setMessages}
//               triggerRefresh={handleRefresh}
//               onJsonOutput={setFormData}
//             />
//           </Box>
//           <Box sx={{ flex: 1, minWidth: { xs: "300px" } }}>
//             <InfoForm initialData={formData} />
//           </Box>
//         </Box>
//       </Box>
//     </div>
//   );
// }

// "use client";
// import React, { useState } from "react";
// import { Box, Typography } from "@mui/material";
// import AutonomousSimulation from "@/components/Simulation/AutonomousSimulation";
// import InfoForm from "@/components/Simulation/InfoForm";
// import ChatHistory from "@/components/Simulation/ChatHistory";

// interface Message {
//   role: "police" | "victim";
//   content: string;
// }

// interface Conversation {
//   conversation_id: number;
//   title: string;
//   description: string | null;
//   messages: {
//     id: number;
//     content: string;
//     sender_type: string;
//     sender_id: number | null;
//     agent_id: number | null;
//   }[];
// }

// interface FormData {
//   firstName?: string;
//   lastName?: string;
//   telNo?: string;
//   address?: string;
//   occupation?: string;
//   age?: string;
//   incidentDate?: string;
//   reportDate?: string;
//   location?: string;
//   crimeType?: string;
//   approachPlatform?: string;
//   communicationPlatform?: string;
//   bank?: string;
//   bankNo?: string;
//   contactInfo?: string;
//   description?: string;
//   summary?: string;
// }

// export default function AutonomousChatbotPage() {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [refreshKey, setRefreshKey] = useState<number>(0);
//   const [formData, setFormData] = useState<FormData>({});

//   const handleSelectConversation = async (conversation: Conversation) => {
//     const newMessages = conversation.messages.map((msg) => ({
//       role: msg.sender_type as "police" | "victim",
//       content: msg.content,
//     }));
//     setMessages(newMessages);
//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/get-info-form-data/${conversation.conversation_id}`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.error || "Failed to fetch info form data");
//       }
//       const response = await res.json();
//       setFormData(response.info_form_data || {});
//     } catch (err: any) {
//       console.error("Error fetching info form data:", err.message);
//       setFormData({});
//     }
//   };

//   const handleRefresh = () => {
//     setRefreshKey((prev) => prev + 1);
//   };

//   return (
//     <div className="p-4 flex flex-col w-full h-screen">
//       <Box className="flex justify-between items-center mb-4">
//         <h1 className="text-3xl font-bold text-center flex-1">
//           Autonomous Victim-Police Chatbot Simulation
//         </h1>
//       </Box>
//       <Box className="flex flex-1 w-full overflow-hidden">
//         <Box sx={{ display: "flex", flex: 1, gap: 2, flexWrap: "wrap" }}>
//           <Box sx={{ width: { xs: "200px", md: "300px" } }}>
//             <ChatHistory
//               onSelectConversation={handleSelectConversation}
//               refreshKey={refreshKey}
//               onRefresh={handleRefresh}
//             />
//           </Box>
//           <Box sx={{ flex: 1, minWidth: { xs: "300px" } }}>
//             <AutonomousSimulation
//               messages={messages}
//               setMessages={setMessages}
//               triggerRefresh={handleRefresh}
//               onJsonOutput={setFormData}
//             />
//           </Box>
//           <Box sx={{ flex: 1, minWidth: { xs: "300px" } }}>
//             <InfoForm initialData={formData} />
//           </Box>
//         </Box>
//       </Box>
//     </div>
//   );
// }

"use client";
import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import AutonomousSimulation from "@/components/Simulation/AutonomousSimulation";
import InfoForm from "@/components/Simulation/InfoForm";
import ChatHistory from "@/components/Simulation/ChatHistory";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Message {
  role: "police" | "victim";
  content: string;
}

interface Conversation {
  conversation_id: number;
  title: string;
  description: string | null;
  messages: {
    id: number;
    content: string;
    sender_type: string;
    sender_id: number | null;
    agent_id: number | null;
  }[];
}

interface FormData {
  firstName?: string;
  lastName?: string;
  telNo?: string;
  address?: string;
  occupation?: string;
  age?: string;
  incidentDate?: string;
  reportDate?: string;
  location?: string;
  crimeType?: string;
  approachPlatform?: string;
  communicationPlatform?: string;
  bank?: string;
  bankNo?: string;
  contactInfo?: string;
  description?: string;
  summary?: string;
}

export default function AutonomousChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [formData, setFormData] = useState<FormData>({});

  const handleSelectConversation = async (conversation: Conversation) => {
    const newMessages = conversation.messages.map((msg) => ({
      role: msg.sender_type as "police" | "victim",
      content: msg.content,
    }));
    setMessages(newMessages);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/get-info-form-data/${conversation.conversation_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch info form data");
      }
      const response = await res.json();
      setFormData(response.info_form_data || {});
      toast.success("Conversation loaded successfully");
    } catch (err: any) {
      console.error("Error fetching info form data:", err.message);
      setFormData({});
      toast.error(`Error loading form data: ${err.message}`);
    }
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="p-4 flex flex-col w-full h-screen">
      <ToastContainer />
      <Box className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-center flex-1">
          Autonomous Victim-Police Chatbot Simulation
        </h1>
      </Box>
      <Box className="flex flex-1 w-full overflow-hidden">
        <Box sx={{ display: "flex", flex: 1, gap: 2, flexWrap: "wrap" }}>
          <Box sx={{ width: { xs: "200px", md: "300px" } }}>
            <ChatHistory
              onSelectConversation={handleSelectConversation}
              refreshKey={refreshKey}
              onRefresh={handleRefresh}
            />
          </Box>
          <Box sx={{ flex: 1, minWidth: { xs: "300px" } }}>
            <AutonomousSimulation
              messages={messages}
              setMessages={setMessages}
              triggerRefresh={handleRefresh}
              onJsonOutput={setFormData}
            />
          </Box>
          <Box sx={{ flex: 1, minWidth: { xs: "300px" } }}>
            <InfoForm initialData={formData} />
          </Box>
        </Box>
      </Box>
    </div>
  );
}
