// "use client";
// import React, { useState, useRef, useEffect } from "react";
// import {
//   Box,
//   TextField,
//   Button,
//   Paper,
//   Typography,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   TextareaAutosize,
//   Checkbox,
//   FormControlLabel,
//   Drawer,
//   IconButton,
// } from "@mui/material";
// import MenuIcon from "@mui/icons-material/Menu";
// import SettingsIcon from "@mui/icons-material/Settings";
// import ChatHistory from "./ChatHistory";

// import ChatbotConfigPanel from "./ChatbotConfigPanel";

// // Define TypeScript types
// interface Message {
//   role: "police" | "victim";
//   content: string;
// }

// interface ChatConfig {
//   agent_type: string;
//   agent_name: string;
//   llm_provider: string;
//   model: string;
//   is_rag: boolean;
//   prompt: string;
//   allow_search: boolean;
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

// interface SimulationResponse {
//   status: string;
//   conversation_id: number;
//   conversation_history: { role: "police" | "victim"; content: string }[];
// }

// export default function AutonomousSimulation() {
//   const [policeConfig, setPoliceConfig] = useState<ChatConfig>({
//     agent_type: "police",
//     agent_name: `PoliceBot-${Date.now()}`,
//     llm_provider: "Ollama",
//     model: "llama3.2",
//     is_rag: false,
//     prompt:
//         "You are a professional police officer investigating a scam. Ask clear, concise questions to gather details about the incident. Maintain a supportive and professional tone, encouraging the victim to provide specific information. You have to first identify the scam type (e-commerce scam or government officials impersonation scam) and ask follow-up questions to ascertain details of the scam",
//     allow_search: false,
//   });
//   const [victimConfig, setVictimConfig] = useState<ChatConfig>({
//     agent_type: "victim",
//     agent_name: `VictimBot-${Date.now()}`,
//     llm_provider: "Ollama",
//     model: "llama3.2",
//     is_rag: false,
//     prompt:
//       "You are a victim of an e-commerce scam. Provide realistic, varied details about the scam (e.g., method of contact, amount lost, timeline) in response to police questions. Express hesitation or confusion to simulate a real victim’s behavior. Avoid repeating the police’s questions or your previous answers; instead, offer new information or clarify details to progress the conversation.",
//     allow_search: false,
//   });
//   const [policeAgentId, setPoliceAgentId] = useState<number | null>(null);
//   const [victimAgentId, setVictimAgentId] = useState<number | null>(null);
//   const [maxTurns, setMaxTurns] = useState<number>(10);
//   const [initialQuery, setInitialQuery] = useState<string>(
//     "Hello, this is the police. How can we help you?"
//   );
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [isPoliceConfigFixed, setIsPoliceConfigFixed] =
//     useState<boolean>(false);
//   const [isVictimConfigFixed, setIsVictimConfigFixed] =
//     useState<boolean>(false);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);
//   const [refreshKey, setRefreshKey] = useState<number>(0);
//   const [isConfigDrawerOpen, setIsConfigDrawerOpen] = useState<boolean>(false);
//   const [supportedModels, setSupportedModels] = useState<{ [key: string]: string[] }>({});
//   const [policeAvailableModels, setPoliceAvailableModels] = useState<string[]>([]);
//   const [victimAvailableModels, setVictimAvailableModels] = useState<string[]>([]);
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   // Fetch provider-to-model mapping via API
//   useEffect(() => {
//     async function fetchModels() {
//       try {
//         const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/llm/models`);
//         if (!response.ok) throw new Error('Failed to fetch models');
//         const data = await response.json();
//         setSupportedModels(data.supported_models);
//         setPoliceAvailableModels(data.supported_models[policeConfig.llm_provider] || []);
//         setVictimAvailableModels(data.supported_models[victimConfig.llm_provider] || []);
//       } catch (error) {
//         console.error('Error fetching models:', error);
//         setError('Failed to load available models');
//       }
//     }
//     fetchModels();
//   }, []);

//   // Models update when provider changes
//   useEffect(() => {
//     setPoliceAvailableModels(supportedModels[policeConfig.llm_provider] || []);
//     if (supportedModels[policeConfig.llm_provider]) {
//       setPoliceConfig((prev) => ({
//         ...prev,
//         model: supportedModels[prev.llm_provider][0] || ''
//       }));
//     }
//   }, [policeConfig.llm_provider, supportedModels]);

//   useEffect(() => {
//     setVictimAvailableModels(supportedModels[victimConfig.llm_provider] || []);
//     if (supportedModels[victimConfig.llm_provider]) {
//       setVictimConfig((prev) => ({
//         ...prev,
//         model: supportedModels[prev.llm_provider][0] || ''
//       }));
//     }
//   }, [victimConfig.llm_provider, supportedModels]);

//   // Scroll to the latest message
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // Handle configuration changes
//   const handleConfigChange = (
//     configType: "police" | "victim",
//     field: keyof ChatConfig,
//     value: string | boolean
//   ) => {
//     if (configType === "police" && !isPoliceConfigFixed) {
//       setPoliceConfig((prev) => ({ ...prev, [field]: value }));
//     } else if (configType === "victim" && !isVictimConfigFixed) {
//       setVictimConfig((prev) => ({ ...prev, [field]: value }));
//     }
//   };

//   const createChatbot = async (configType: "police" | "victim") => {
//     setLoading(true);
//     setError(null);
//     const config = configType === "police" ? policeConfig : victimConfig;
//     const endpoint =
//         configType === "police"
//             ? "/create-police-chatbot"
//             : "/create-victim-chatbot";
//     try {
//         console.log(`Creating ${configType} chatbot with config:`, JSON.stringify(config, null, 2)); // Debug
//         const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(config),
//         });
//         if (!res.ok) {
//             const errorData = await res.json();
//             console.error(`Failed to create ${configType} chatbot:`, errorData);
//             throw new Error(errorData.error || `Failed to create ${configType} chatbot`);
//         }
//         const response = await res.json();
//         console.log(`${configType} chatbot created:`, JSON.stringify(response, null, 2)); // Debug
//         if (configType === "police") {
//             setPoliceAgentId(response.agent_id);
//             setIsPoliceConfigFixed(true);
//         } else {
//             setVictimAgentId(response.agent_id);
//             setIsVictimConfigFixed(true);
//         }
//         setRefreshKey((prev) => prev + 1);
//     } catch (err: any) {
//         console.error(`Error creating ${configType} chatbot:`, err);
//         setError(`Failed to create ${configType} chatbot: ${err.message}`);
//     } finally {
//         setLoading(false);
//     }
// };

//   // Start simulation
//   const handleStartSimulation = async () => {
//     if (!policeAgentId || !victimAgentId) {
//       setError("Both chatbots must be created before starting the simulation.");
//       return;
//     }
//     setLoading(true);
//     setError(null);
//     setMessages([]);
//     try {
//       const payload = {
//         police_agent_id: policeAgentId,
//         victim_agent_id: victimAgentId,
//         max_turns: maxTurns,
//         initial_query: initialQuery,
//       };
//       console.log("Simulation payload:", JSON.stringify(payload, null, 2)); // Debug
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/simulate-conversation`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(payload),
//         }
//       );
//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.error || "Failed to run simulation");
//       }
//       const response: SimulationResponse = await res.json();
//       console.log("Simulation response:", JSON.stringify(response, null, 2)); // Debug
//       setMessages(response.conversation_history); // Use backend roles directly
//       setRefreshKey((prev) => prev + 1);
//     } catch (err: any) {
//       console.error("Simulation error:", err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Reset simulation
//   const handleReset = () => {
//     setPoliceConfig({
//       agent_type: "police",
//       agent_name: `PoliceBot-${Date.now()}`,
//       llm_provider: "Ollama",
//       model: "llama3.2",
//       is_rag: false,
//       prompt:
//         "You are a professional police officer investigating a scam. Ask clear, concise questions to gather details about the incident. Maintain a supportive and professional tone, encouraging the victim to provide specific information. You have to first identify the scam type (e-commerce scam or government officials impersonation scam) and ask follow-up questions to ascertain details of the scam",
//       allow_search: false,
//     });
//     setVictimConfig({
//       agent_type: "victim",
//       agent_name: `VictimBot-${Date.now()}`,
//       llm_provider: "OpenAI",
//       model: "gpt-4o-mini",
//       is_rag: false,
//       prompt:
//         "You are a victim of an e-commerce scam. Provide realistic details about the scam when asked, such as the method of contact, amount lost, and timeline. Express hesitation or confusion to simulate a real victim’s behavior.",
//       allow_search: false,
//     });
//     setPoliceAgentId(null);
//     setVictimAgentId(null);
//     setIsPoliceConfigFixed(false);
//     setIsVictimConfigFixed(false);
//     setMessages([]);
//     setMaxTurns(10);
//     setInitialQuery(
//       "Hello, this is the police. How can we help?"
//     );
//     setError(null);
//     setRefreshKey((prev) => prev + 1);
//   };

//   // Handle selecting a conversation
//   const handleSelectConversation = (conversation: Conversation) => {
//     setMessages(
//       conversation.messages.map((msg) => ({
//         role: msg.sender_type,
//         content: msg.content,
//       }))
//     );
//   };

//   // Handle refresh for ChatHistory
//   const handleRefresh = () => {
//     setRefreshKey((prev) => prev + 1); // Increment refreshKey to trigger useEffect in ChatHistory
//   };

//   // CHANGE: Added function to toggle config drawer
//   const toggleConfigDrawer = () => {
//     setIsConfigDrawerOpen(!isConfigDrawerOpen);
//   };

//   return (
//  // CHANGE: Simplified layout, removed inline configs and right drawer
//     <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
//       <Box sx={{ display: "flex", flex: 1, gap: 2 }}>
//         {/* Chat History (unchanged, but styled for responsiveness) */}
//         <Box sx={{ width: "300px", display: { xs: "none", md: "block" } }}>
//           <ChatHistory
//             onSelectConversation={handleSelectConversation}
//             refreshKey={refreshKey}
//             onRefresh={handleRefresh}
//           />
//         </Box>
//         {/* Chatbot Box */}
//         <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
//           <Paper
//             sx={{
//               flexGrow: 1,
//               p: 2,
//               overflowY: "auto",
//               mb: 2,
//               border: "2px solid #555555",
//               borderRadius: "8px",
//             }}
//           >
//             {messages.map((msg, index) => (
//               <Box
//                 key={index}
//                 sx={{
//                   display: "flex",
//                   justifyContent:
//                     msg.role === "police" ? "flex-end" : "flex-start",
//                   mb: 2,
//                 }}
//               >
//                 <Paper
//                   sx={{
//                     p: 2,
//                     maxWidth: "70%",
//                     bgcolor: msg.role === "police" ? "#1976d2" : "#d81b60",
//                     color: "#fff",
//                     borderRadius:
//                       msg.role === "police"
//                         ? "20px 20px 0 20px"
//                         : "20px 20px 20px 0",
//                   }}
//                 >
//                   <Typography variant="body2" sx={{ opacity: 0.7 }}>
//                     {msg.role === "police" ? "Police" : "Victim"}
//                   </Typography>
//                   <Typography variant="body1">{msg.content}</Typography>
//                 </Paper>
//               </Box>
//             ))}
//             {loading && (
//               <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}>
//                 <Paper
//                   sx={{
//                     p: 2,
//                     bgcolor: "#f5f5f5",
//                     borderRadius: "20px 20px 20px 0",
//                   }}
//                 >
//                   <Typography variant="body1">Simulating...</Typography>
//                 </Paper>
//               </Box>
//             )}
//             {error && (
//               <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}>
//                 <Paper
//                   sx={{
//                     p: 2,
//                     bgcolor: "#ffebee",
//                     borderRadius: "20px 20px 20px 0",
//                   }}
//                 >
//                   <Typography variant="body1" color="error">
//                     Error: {error}
//                   </Typography>
//                 </Paper>
//               </Box>
//             )}
//             <div ref={messagesEndRef} />
//           </Paper>
//           {/* CHANGE: Added Configure Chatbots button, adjusted input layout */}
//           <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
//             <TextField
//               variant="outlined"
//               label="Max Turns"
//               type="number"
//               value={maxTurns}
//               onChange={(e) => setMaxTurns(Number(e.target.value))}
//               disabled={loading}
//               sx={{ flex: 1, minWidth: "100px" }}
//             />
//             <TextField
//               variant="outlined"
//               label="Initial Query"
//               value={initialQuery}
//               onChange={(e) => setInitialQuery(e.target.value)}
//               disabled={loading}
//               sx={{ flex: 2, minWidth: "200px" }}
//             />
//             <Button
//               variant="contained"
//               onClick={handleStartSimulation}
//               disabled={loading || !policeAgentId || !victimAgentId}
//               className="bg-blue-600 hover:bg-blue-700"
//             >
//               Start Simulation
//             </Button>
//             <Button
//               variant="outlined"
//               onClick={handleReset}
//               sx={{
//                 borderColor: "#d32f2f",
//                 color: "#d32f2f",
//                 "&:hover": {
//                   backgroundColor: "#ffebee",
//                   borderColor: "#b71c1c",
//                   color: "#b71c1c",
//                 },
//               }}
//             >
//               Reset
//             </Button>
//             <Button
//               variant="contained"
//               startIcon={<SettingsIcon />}
//               onClick={toggleConfigDrawer}
//               disabled={loading}
//               className="bg-gray-600 hover:bg-gray-700"
//             >
//               Configure Chatbots
//             </Button>
//           </Box>
//         </Box>
//       </Box>
//       {/* CHANGE: Added bottom drawer for configurations */}
//       <Drawer
//         anchor="bottom"
//         open={isConfigDrawerOpen}
//         onClose={toggleConfigDrawer}
//         sx={{
//           "& .MuiDrawer-paper": {
//             height: "80vh",
//             p: 2,
//             borderTop: "2px solid #555555",
//           },
//         }}
//       >
//         <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
//           <Typography variant="h6" className="text-gray-800">
//             Chatbot Configurations
//           </Typography>
//           <IconButton onClick={toggleConfigDrawer}>
//             <SettingsIcon />
//           </IconButton>
//         </Box>
//         <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
//           <ChatbotConfigPanel
//             config={policeConfig}
//             onConfigChange={(field, value) =>
//               handleConfigChange("police", field, value)
//             }
//             isFixed={isPoliceConfigFixed}
//             onCreate={() => createChatbot("police")}
//             availableModels={policeAvailableModels}
//             supportedModels={supportedModels}
//             title="Police Chatbot Configuration"
//           />
//           <ChatbotConfigPanel
//             config={victimConfig}
//             onConfigChange={(field, value) =>
//               handleConfigChange("victim", field, value)
//             }
//             isFixed={isVictimConfigFixed}
//             onCreate={() => createChatbot("victim")}
//             availableModels={victimAvailableModels}
//             supportedModels={supportedModels}
//             title="Victim Chatbot Configuration"
//           />
//         </Box>
//       </Drawer>
//     </Box>
//   );
// }

// "use client";
// import React, { useState, useRef, useEffect } from "react";
// import {
//   Box,
//   TextField,
//   Button,
//   Paper,
//   Typography,
//   Drawer,
//   IconButton,
// } from "@mui/material";
// import SettingsIcon from "@mui/icons-material/Settings";
// import ChatbotConfigPanel from "./ChatbotConfigPanel";

// interface Message {
//   role: "police" | "victim";
//   content: string;
// }

// interface ChatConfig {
//   agent_type: string;
//   agent_name: string;
//   llm_provider: string;
//   model: string;
//   is_rag: boolean;
//   prompt: string;
//   allow_search: boolean;
// }

// interface SimulationResponse {
//   status: string;
//   conversation_id: number;
//   conversation_history: { role: "police" | "victim"; content: string }[];
// }

// interface FormData {
//   crimeType?: string;
//   description?: string;
//   incidentDate?: string;
//   approachPlatform?: string;
//   communicationPlatform?: string;
//   amountLost?: number;
// }

// interface AutonomousSimulationProps {
//   messages: Message[];
//   setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
//   triggerRefresh: () => void;
//   onJsonOutput?: (data: FormData) => void;
// }

// export function AutonomousSimulation({
//   messages,
//   setMessages,
//   triggerRefresh,
//   onJsonOutput,
// }: AutonomousSimulationProps) {
//   const [policeConfig, setPoliceConfig] = useState<ChatConfig>({
//     agent_type: "police",
//     agent_name: `PoliceBot-${Date.now()}`,
//     llm_provider: "Ollama",
//     model: "llama3.2",
//     is_rag: false,
//     prompt:
//       //"You are a professional police officer investigating a scam. Ask clear, concise questions to gather details about the incident. Maintain a supportive and professional tone, encouraging the victim to provide specific information. You have to first identify the scam type (e-commerce scam or government officials impersonation scam) and ask follow-up questions to ascertain details of the scam",
//       "You are a professional police officer investigating a scam. Ask clear, concise questions to gather details about the incident, including the victim's first name, last name, phone number, address, occupation, age, incident date (YYYY-MM-DD), location, crime type (e.g., e-commerce scam, government officials impersonation), approach platform, communication platform, bank name, bank account number, and suspect's contact information. Maintain a supportive and professional tone.",
//     allow_search: false,
//   });
//   const [victimConfig, setVictimConfig] = useState<ChatConfig>({
//     agent_type: "victim",
//     agent_name: `VictimBot-${Date.now()}`,
//     llm_provider: "Ollama",
//     model: "llama3.2",
//     is_rag: false,
//     prompt:
//       //"You are a victim of an e-commerce scam. Provide realistic, varied details about the scam (e.g., method of contact, amount lost, timeline) in response to police questions. Express hesitation or confusion to simulate a real victim’s behavior. Avoid repeating the police’s questions or your previous answers; instead, offer new information or clarify details to progress the conversation.",
//       "You are a victim of a scam. Provide realistic details in response to police questions, including your first name, last name, phone number, address, occupation, age, incident date (YYYY-MM-DD), location, crime type (e.g., e-commerce scam, government officials impersonation), approach platform, communication platform, bank name, bank account number, and suspect's contact information. Express hesitation or confusion to simulate a real victim’s behavior. When you have provided sufficient details, say '[I am willing to report]' to indicate readiness to file a report.",
//     allow_search: false,
//   });
//   const [policeAgentId, setPoliceAgentId] = useState<number | null>(null);
//   const [victimAgentId, setVictimAgentId] = useState<number | null>(null);
//   const [maxTurns, setMaxTurns] = useState<number>(10);
//   const [initialQuery, setInitialQuery] = useState<string>(
//     "Hello, this is the police. How can we help you?"
//   );
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);
//   const [isConfigDrawerOpen, setIsConfigDrawerOpen] = useState<boolean>(false);
//   const [supportedModels, setSupportedModels] = useState<{
//     [key: string]: string[];
//   }>({});
//   const [policeAvailableModels, setPoliceAvailableModels] = useState<string[]>(
//     []
//   );
//   const [victimAvailableModels, setVictimAvailableModels] = useState<string[]>(
//     []
//   );
//   // CHANGE: Added missing state declarations
//   const [isPoliceConfigFixed, setIsPoliceConfigFixed] =
//     useState<boolean>(false);
//   const [isVictimConfigFixed, setIsVictimConfigFixed] =
//     useState<boolean>(false);
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   // CHANGE: Debug isPoliceConfigFixed and isVictimConfigFixed
//   useEffect(() => {
//     console.log("isPoliceConfigFixed:", isPoliceConfigFixed);
//     console.log("isVictimConfigFixed:", isVictimConfigFixed);
//   }, [isPoliceConfigFixed, isVictimConfigFixed]);

//   // Fetch provider-to-model mapping via API
//   useEffect(() => {
//     async function fetchModels() {
//       try {
//         const response = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/llm/models`
//         );
//         if (!response.ok) throw new Error("Failed to fetch models");
//         const data = await response.json();
//         setSupportedModels(data.supported_models);
//         setPoliceAvailableModels(
//           data.supported_models[policeConfig.llm_provider] || []
//         );
//         setVictimAvailableModels(
//           data.supported_models[victimConfig.llm_provider] || []
//         );
//       } catch (error) {
//         console.error("Error fetching models:", error);
//         setError("Failed to load available models");
//       }
//     }
//     fetchModels();
//   }, []);

//   // Models update when provider changes
//   useEffect(() => {
//     setPoliceAvailableModels(supportedModels[policeConfig.llm_provider] || []);
//     if (supportedModels[policeConfig.llm_provider]) {
//       setPoliceConfig((prev) => ({
//         ...prev,
//         model: supportedModels[prev.llm_provider][0] || "",
//       }));
//     }
//   }, [policeConfig.llm_provider, supportedModels]);

//   useEffect(() => {
//     setVictimAvailableModels(supportedModels[victimConfig.llm_provider] || []);
//     if (supportedModels[victimConfig.llm_provider]) {
//       setVictimConfig((prev) => ({
//         ...prev,
//         model: supportedModels[prev.llm_provider][0] || "",
//       }));
//     }
//   }, [victimConfig.llm_provider, supportedModels]);

//   // Scroll to the latest message
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // Handle configuration changes
//   const handleConfigChange = (
//     configType: "police" | "victim",
//     field: keyof ChatConfig,
//     value: string | boolean
//   ) => {
//     if (configType === "police" && !isPoliceConfigFixed) {
//       setPoliceConfig((prev) => ({ ...prev, [field]: value }));
//     } else if (configType === "victim" && !isVictimConfigFixed) {
//       setVictimConfig((prev) => ({ ...prev, [field]: value }));
//     }
//   };

//   // Create chatbot
//   const createChatbot = async (configType: "police" | "victim") => {
//     setLoading(true);
//     setError(null);
//     const config = configType === "police" ? policeConfig : victimConfig;
//     const endpoint =
//       configType === "police"
//         ? "/create-police-chatbot"
//         : "/create-victim-chatbot";
//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(config),
//       });
//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(
//           errorData.error || `Failed to create ${configType} chatbot`
//         );
//       }
//       const response = await res.json();
//       if (configType === "police") {
//         setPoliceAgentId(response.agent_id);
//         setIsPoliceConfigFixed(true);
//         console.log("Police chatbot created, isPoliceConfigFixed set to true");
//       } else {
//         setVictimAgentId(response.agent_id);
//         setIsVictimConfigFixed(true);
//         console.log("Victim chatbot created, isVictimConfigFixed set to true");
//       }
//       triggerRefresh();
//     } catch (err: any) {
//       setError(`Failed to create ${configType} chatbot: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Generate JSON output
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
//           approachPlatform =
//             msg.content.match(/contacted via (\w+)/)?.[1] || "";
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

//   // Start simulation
//   const handleStartSimulation = async () => {
//     if (!policeAgentId || !victimAgentId) {
//       setError("Both chatbots must be created before starting the simulation.");
//       return;
//     }
//     setLoading(true);
//     setError(null);
//     setMessages([]);
//     try {
//       const payload = {
//         police_agent_id: policeAgentId,
//         victim_agent_id: victimAgentId,
//         max_turns: maxTurns,
//         initial_query: initialQuery,
//       };
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/simulate-conversation`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(payload),
//         }
//       );
//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.error || "Failed to run simulation");
//       }
//       const response: SimulationResponse = await res.json();
//       setMessages(response.conversation_history);
//       triggerRefresh();
//       if (onJsonOutput) {
//         const jsonOutput = generateJsonOutput(response.conversation_history);
//         onJsonOutput(jsonOutput);
//       }
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Reset simulation
//   const handleReset = () => {
//     setPoliceConfig({
//       agent_type: "police",
//       agent_name: `PoliceBot-${Date.now()}`,
//       llm_provider: "Ollama",
//       model: "llama3.2",
//       is_rag: false,
//       prompt:
//         "You are a professional police officer investigating a scam. Ask clear, concise questions to gather details about the incident. Maintain a supportive and professional tone, encouraging the victim to provide specific information. You have to first identify the scam type (e-commerce scam or government officials impersonation scam) and ask follow-up questions to ascertain details of the scam",
//       allow_search: false,
//     });
//     setVictimConfig({
//       agent_type: "victim",
//       agent_name: `VictimBot-${Date.now()}`,
//       llm_provider: "Ollama",
//       model: "llama3.2",
//       is_rag: false,
//       prompt:
//         "You are a victim of an e-commerce scam. Provide realistic details about the scam when asked, such as the method of contact, amount lost, and timeline. Express hesitation or confusion to simulate a real victim’s behavior.",
//       allow_search: false,
//     });
//     setPoliceAgentId(null);
//     setVictimAgentId(null);
//     setIsPoliceConfigFixed(false);
//     setIsVictimConfigFixed(false);
//     setMessages([]);
//     setMaxTurns(10);
//     setInitialQuery("Hello, this is the police. How can we help?");
//     setError(null);
//     triggerRefresh();
//     if (onJsonOutput) {
//       onJsonOutput({});
//     }
//     console.log("Reset called, isPoliceConfigFixed set to false");
//   };

//   const toggleConfigDrawer = () => {
//     setIsConfigDrawerOpen(!isConfigDrawerOpen);
//   };

//   return (
//     <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
//       <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
//         <Paper
//           sx={{
//             flexGrow: 1,
//             p: 2,
//             overflowY: "auto",
//             mb: 2,
//             border: "2px solid #555555",
//             borderRadius: "8px",
//             maxHeight: "calc(100vh - 200px)",
//           }}
//         >
//           {messages.map((msg, index) => (
//             <Box
//               key={index}
//               sx={{
//                 display: "flex",
//                 justifyContent:
//                   msg.role === "police" ? "flex-end" : "flex-start",
//                 mb: 2,
//               }}
//             >
//               <Paper
//                 sx={{
//                   p: 2,
//                   maxWidth: "70%",
//                   bgcolor: msg.role === "police" ? "#1976d2" : "#d81b60",
//                   color: "#fff",
//                   borderRadius:
//                     msg.role === "police"
//                       ? "20px 20px 0 20px"
//                       : "20px 20px 20px 0",
//                 }}
//               >
//                 <Typography variant="body2" sx={{ opacity: 0.7 }}>
//                   {msg.role === "police" ? "Police" : "Victim"}
//                 </Typography>
//                 <Typography variant="body1">{msg.content}</Typography>
//               </Paper>
//             </Box>
//           ))}
//           {loading && (
//             <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}>
//               <Paper
//                 sx={{
//                   p: 2,
//                   bgcolor: "#f5f5f5",
//                   borderRadius: "20px 20px 20px 0",
//                 }}
//               >
//                 <Typography variant="body1">Simulating...</Typography>
//               </Paper>
//             </Box>
//           )}
//           {error && (
//             <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}>
//               <Paper
//                 sx={{
//                   p: 2,
//                   bgcolor: "#ffebee",
//                   borderRadius: "20px 20px 20px 0",
//                 }}
//               >
//                 <Typography variant="body1" color="error">
//                   Error: {error}
//                 </Typography>
//               </Paper>
//             </Box>
//           )}
//           <div ref={messagesEndRef} />
//         </Paper>
//         <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
//           <TextField
//             variant="outlined"
//             label="Max Turns"
//             type="number"
//             value={maxTurns}
//             onChange={(e) => setMaxTurns(Number(e.target.value))}
//             disabled={loading}
//             sx={{ flex: 1, minWidth: "100px" }}
//           />
//           <TextField
//             variant="outlined"
//             label="Initial Query"
//             value={initialQuery}
//             onChange={(e) => setInitialQuery(e.target.value)}
//             disabled={loading}
//             sx={{ flex: 2, minWidth: "200px" }}
//           />
//           <Button
//             variant="contained"
//             onClick={handleStartSimulation}
//             disabled={loading || !policeAgentId || !victimAgentId}
//             className="bg-blue-600 hover:bg-blue-700"
//           >
//             Start Simulation
//           </Button>
//           <Button
//             variant="outlined"
//             onClick={handleReset}
//             sx={{
//               borderColor: "#d32f2f",
//               color: "#d32f2f",
//               "&:hover": {
//                 backgroundColor: "#ffebee",
//                 borderColor: "#b71c1c",
//                 color: "#b71c1c",
//               },
//             }}
//           >
//             Reset
//           </Button>
//           <Button
//             variant="contained"
//             startIcon={<SettingsIcon />}
//             onClick={toggleConfigDrawer}
//             disabled={loading}
//             className="bg-gray-600 hover:bg-gray-700"
//           >
//             Configure Chatbots
//           </Button>
//         </Box>
//       </Box>
//       <Drawer
//         anchor="bottom"
//         open={isConfigDrawerOpen}
//         onClose={toggleConfigDrawer}
//         sx={{
//           "& .MuiDrawer-paper": {
//             height: "80vh",
//             p: 2,
//             borderTop: "2px solid #555555",
//           },
//         }}
//       >
//         <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
//           <Typography variant="h6" className="text-gray-800">
//             Chatbot Configurations
//           </Typography>
//           <IconButton onClick={toggleConfigDrawer}>
//             <SettingsIcon />
//           </IconButton>
//         </Box>
//         <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
//           <ChatbotConfigPanel
//             key={`police-${isPoliceConfigFixed}`} // CHANGE: Force re-render
//             config={policeConfig}
//             onConfigChange={(field, value) =>
//               handleConfigChange("police", field, value)
//             }
//             isFixed={isPoliceConfigFixed}
//             onCreate={() => createChatbot("police")}
//             availableModels={policeAvailableModels}
//             supportedModels={supportedModels}
//             title="Police Chatbot Configuration"
//           />
//           <ChatbotConfigPanel
//             key={`victim-${isVictimConfigFixed}`} // CHANGE: Force re-render
//             config={victimConfig}
//             onConfigChange={(field, value) =>
//               handleConfigChange("victim", field, value)
//             }
//             isFixed={isVictimConfigFixed}
//             onCreate={() => createChatbot("victim")}
//             availableModels={victimAvailableModels}
//             supportedModels={supportedModels}
//             title="Victim Chatbot Configuration"
//           />
//         </Box>
//       </Drawer>
//     </Box>
//   );
// }

// export default AutonomousSimulation;

"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Drawer,
  IconButton,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import ChatbotConfigPanel from "./ChatbotConfigPanel";
import { toast } from "react-toastify";

interface Message {
  role: "police" | "victim";
  content: string;
}

interface ChatConfig {
  agent_type: string;
  agent_name: string;
  llm_provider: string;
  model: string;
  is_rag: boolean;
  prompt: string;
  allow_search: boolean;
}

interface SimulationResponse {
  status: string;
  conversation_id: number;
  conversation_history: { role: "police" | "victim"; content: string }[];
  info_form_data: {
    firstName: string;
    lastName: string;
    telNo: string;
    address: string;
    occupation: string;
    age: string;
    incidentDate: string;
    reportDate: string;
    location: string;
    crimeType: string;
    approachPlatform: string;
    communicationPlatform: string;
    bank: string;
    bankNo: string;
    contactInfo: string;
    description: string;
    summary: string;
  };
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

interface AutonomousSimulationProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  triggerRefresh: () => void;
  onJsonOutput: (data: FormData) => void;
}

export function AutonomousSimulation({
  messages,
  setMessages,
  triggerRefresh,
  onJsonOutput,
}: AutonomousSimulationProps) {
  const [policeConfig, setPoliceConfig] = useState<ChatConfig>({
    agent_type: "police",
    agent_name: `PoliceBot-${Date.now()}`,
    llm_provider: "Ollama",
    model: "llama3.2",
    is_rag: false,
    prompt: `You are simulating a professional police officer assisting a victim with reporting a scam. Your task is to identify the scam type and extract as much information as possible for the scam report. Ask clear, concise questions to gather details about the incident in a supportive and professional tone, encouraging the victim to provide specific information and persuading them to make a report.

Provide a response in the following structured format:
- conversational_response: A natural language response, without quotation marks, addressing the victim's input and asking follow-up questions to gather more details.
- firstName, lastName, telNo, address, occupation, age, incidentDate, reportDate, location, crimeType, approachPlatform, communicationPlatform, bank, bankNo, contactInfo, description, summary: Extracted scam details, with empty strings for unknown fields.

Ensure the conversational_response is professional and encourages further details, and fill in the scam details based on the conversation context.`,
    allow_search: false,
  });
  const [victimConfig, setVictimConfig] = useState<ChatConfig>({
    agent_type: "victim",
    agent_name: `VictimBot-${Date.now()}`,
    llm_provider: "Ollama",
    model: "llama3.2",
    is_rag: false,
    prompt: `You are simulating a victim of a scam. Provide realistic details in response to police questions, including your first name, last name, phone number, address, occupation, age, incident date (YYYY-MM-DD), location, crime type (e.g., e-commerce scam, government officials impersonation), approach platform, communication platform, bank name, bank account number, and suspect's contact information. Express hesitation to simulate a real victim’s behavior. 
    
    When you have provided sufficient details, say '[I am willing to report]' to indicate readiness to file a report.
    You may end the conversation with [END_CONVERSATION] when you feel that the conversation has completed.`,
    allow_search: false,
  });
  const [policeAgentId, setPoliceAgentId] = useState<number | null>(null);
  const [victimAgentId, setVictimAgentId] = useState<number | null>(null);
  const [maxTurns, setMaxTurns] = useState<number>(10);
  const [initialQuery, setInitialQuery] = useState<string>(
    "Hello, this is the police. How can we help you?"
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isConfigDrawerOpen, setIsConfigDrawerOpen] = useState<boolean>(false);
  const [supportedModels, setSupportedModels] = useState<{
    [key: string]: string[];
  }>({});
  const [policeAvailableModels, setPoliceAvailableModels] = useState<string[]>(
    []
  );
  const [victimAvailableModels, setVictimAvailableModels] = useState<string[]>(
    []
  );
  const [isPoliceConfigFixed, setIsPoliceConfigFixed] =
    useState<boolean>(false);
  const [isVictimConfigFixed, setIsVictimConfigFixed] =
    useState<boolean>(false);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchModels() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/llm/models`
        );
        if (!response.ok) throw new Error("Failed to fetch models");
        const data = await response.json();
        setSupportedModels(data.supported_models);
        setPoliceAvailableModels(
          data.supported_models[policeConfig.llm_provider] || []
        );
        setVictimAvailableModels(
          data.supported_models[victimConfig.llm_provider] || []
        );
      } catch (error) {
        console.error("Error fetching models:", error);
        setError("Failed to load available models");
        toast.error("Failed to load available models");
      }
    }
    fetchModels();
  }, []);

  useEffect(() => {
    setPoliceAvailableModels(supportedModels[policeConfig.llm_provider] || []);
    if (supportedModels[policeConfig.llm_provider]) {
      setPoliceConfig((prev) => ({
        ...prev,
        model: supportedModels[prev.llm_provider][0] || "",
      }));
    }
  }, [policeConfig.llm_provider, supportedModels]);

  useEffect(() => {
    setVictimAvailableModels(supportedModels[victimConfig.llm_provider] || []);
    if (supportedModels[victimConfig.llm_provider]) {
      setVictimConfig((prev) => ({
        ...prev,
        model: supportedModels[prev.llm_provider][0] || "",
      }));
    }
  }, [victimConfig.llm_provider, supportedModels]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Poll info_form_data during simulation
  useEffect(() => {
    if (conversationId && loading) {
      const interval = setInterval(async () => {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/get-info-form-data/${conversationId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(
              errorData.error || "Failed to fetch info form data"
            );
          }
          const response = await res.json();
          if (response.info_form_data && onJsonOutput) {
            onJsonOutput(response.info_form_data);
          }
        } catch (err: any) {
          console.error("Error fetching info form data:", err.message);
          toast.error(`Error fetching form data: ${err.message}`);
        }
      }, 3000); // Poll every 3 seconds
      return () => clearInterval(interval);
    }
  }, [conversationId, loading, onJsonOutput]);

  const handleConfigChange = (
    configType: "police" | "victim",
    field: keyof ChatConfig,
    value: string | boolean
  ) => {
    if (configType === "police" && !isPoliceConfigFixed) {
      setPoliceConfig((prev) => ({ ...prev, [field]: value }));
    } else if (configType === "victim" && !isVictimConfigFixed) {
      setVictimConfig((prev) => ({ ...prev, [field]: value }));
    }
  };

  const createChatbot = async (configType: "police" | "victim") => {
    setLoading(true);
    setError(null);
    const config = configType === "police" ? policeConfig : victimConfig;
    const endpoint =
      configType === "police"
        ? "/create-police-chatbot"
        : "/create-victim-chatbot";
    try {
      if (!config.prompt.trim()) {
        throw new Error("Prompt cannot be empty");
      }
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.error || `Failed to create ${configType} chatbot`
        );
      }
      const response = await res.json();
      if (configType === "police") {
        setPoliceAgentId(response.agent_id);
        setIsPoliceConfigFixed(true);
      } else {
        setVictimAgentId(response.agent_id);
        setIsVictimConfigFixed(true);
      }
      triggerRefresh();
      toast.success(`${configType} chatbot created successfully`);
    } catch (err: any) {
      setError(`Failed to create ${configType} chatbot: ${err.message}`);
      toast.error(`Failed to create ${configType} chatbot: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleStartSimulation = async () => {
    if (!policeAgentId || !victimAgentId) {
      setError("Both chatbots must be created before starting the simulation.");
      toast.error(
        "Both chatbots must be created before starting the simulation."
      );
      return;
    }
    setLoading(true);
    setError(null);
    setMessages([]);
    setConversationId(null);
    try {
      const payload = {
        police_agent_id: policeAgentId,
        victim_agent_id: victimAgentId,
        max_turns: maxTurns,
        initial_query: initialQuery,
      };
      console.log(
        "[API] Simulation payload:",
        JSON.stringify(payload, null, 2)
      ); // LOG 1: Request payload
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/simulate-conversation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        console.error(
          "[API] Simulation error response:",
          JSON.stringify(errorData, null, 2)
        ); // LOG 2: Error response
        throw new Error(errorData.error || "Failed to run simulation");
      }
      const response: SimulationResponse = await res.json();
      console.log(
        "[API] Simulation response:",
        JSON.stringify(response, null, 2)
      ); // LOG 3: Raw API response
      console.log(
        "[Frontend] Setting messages:",
        JSON.stringify(response.conversation_history, null, 2)
      ); // LOG 4: Messages set in state
      setMessages(response.conversation_history);
      setConversationId(response.conversation_id);
      if (onJsonOutput && response.info_form_data) {
        console.log(
          "[Frontend] Setting info_form_data:",
          JSON.stringify(response.info_form_data, null, 2)
        ); // LOG 5: Info form data
        onJsonOutput(response.info_form_data);
      }
      triggerRefresh();
      toast.success("Simulation completed successfully");
    } catch (err: any) {
      console.error("[API] Simulation error:", err.message); // LOG 6: Error
      setError(err.message);
      toast.error(`Simulation error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPoliceConfig({
      agent_type: "police",
      agent_name: `PoliceBot-${Date.now()}`,
      llm_provider: "Ollama",
      model: "llama3.2",
      is_rag: false,
      prompt: "",
      allow_search: false,
    });
    setVictimConfig({
      agent_type: "victim",
      agent_name: `VictimBot-${Date.now()}`,
      llm_provider: "Ollama",
      model: "llama3.2",
      is_rag: false,
      prompt: "",
      allow_search: false,
    });
    setPoliceAgentId(null);
    setVictimAgentId(null);
    setIsPoliceConfigFixed(false);
    setIsVictimConfigFixed(false);
    setMessages([]);
    setMaxTurns(10);
    setInitialQuery("Hello, this is the police. How can we help?");
    setError(null);
    setConversationId(null);
    onJsonOutput({});
    triggerRefresh();
    toast.success("Simulation reset successfully");
  };

  const toggleConfigDrawer = () => {
    setIsConfigDrawerOpen(!isConfigDrawerOpen);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Paper
          sx={{
            flexGrow: 1,
            p: 2,
            overflowY: "auto",
            mb: 2,
            border: "2px solid #555555",
            borderRadius: "8px",
            maxHeight: "calc(100vh - 200px)",
          }}
        >
          {messages.map((msg, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                justifyContent:
                  msg.role === "police" ? "flex-end" : "flex-start",
                mb: 2,
              }}
            >
              <Paper
                sx={{
                  p: 2,
                  maxWidth: "70%",
                  bgcolor: msg.role === "police" ? "#1976d2" : "#d81b60",
                  color: "#fff",
                  borderRadius:
                    msg.role === "police"
                      ? "20px 20px 0 20px"
                      : "20px 20px 20px 0",
                }}
              >
                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                  {msg.role === "police" ? "Police" : "Victim"}
                </Typography>
                <Typography variant="body1">{msg.content}</Typography>
              </Paper>
            </Box>
          ))}
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}>
              <Paper
                sx={{
                  p: 2,
                  bgcolor: "#f5f5f5",
                  borderRadius: "20px 20px 20px 0",
                }}
              >
                <Typography variant="body1">Simulating...</Typography>
              </Paper>
            </Box>
          )}
          {error && (
            <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}>
              <Paper
                sx={{
                  p: 2,
                  bgcolor: "#ffebee",
                  borderRadius: "20px 20px 20px 0",
                }}
              >
                <Typography variant="body1" color="error">
                  Error: {error}
                </Typography>
              </Paper>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Paper>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <TextField
            variant="outlined"
            label="Max Turns"
            type="number"
            value={maxTurns}
            onChange={(e) => setMaxTurns(Number(e.target.value))}
            disabled={loading}
            sx={{ flex: 1, minWidth: "100px" }}
          />
          <TextField
            variant="outlined"
            label="Initial Query"
            value={initialQuery}
            onChange={(e) => setInitialQuery(e.target.value)}
            disabled={loading}
            sx={{ flex: 2, minWidth: "200px" }}
          />
          <Button
            variant="contained"
            onClick={handleStartSimulation}
            disabled={loading || !policeAgentId || !victimAgentId}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Start Simulation
          </Button>
          <Button
            variant="outlined"
            onClick={handleReset}
            sx={{
              borderColor: "#d32f2f",
              color: "#d32f2f",
              "&:hover": {
                backgroundColor: "#ffebee",
                borderColor: "#b71c1c",
                color: "#b71c1c",
              },
            }}
          >
            Reset
          </Button>
          <Button
            variant="contained"
            startIcon={<SettingsIcon />}
            onClick={toggleConfigDrawer}
            disabled={loading}
            className="bg-gray-600 hover:bg-gray-700"
          >
            Configure Chatbots
          </Button>
        </Box>
      </Box>
      <Drawer
        anchor="bottom"
        open={isConfigDrawerOpen}
        onClose={toggleConfigDrawer}
        sx={{
          "& .MuiDrawer-paper": {
            height: "80vh",
            p: 2,
            borderTop: "2px solid #555555",
          },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6" className="text-gray-800">
            Chatbot Configurations
          </Typography>
          <IconButton onClick={toggleConfigDrawer}>
            <SettingsIcon />
          </IconButton>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <ChatbotConfigPanel
            key={`police-${isPoliceConfigFixed}`}
            config={policeConfig}
            onConfigChange={(field, value) =>
              handleConfigChange("police", field, value)
            }
            isFixed={isPoliceConfigFixed}
            onCreate={() => createChatbot("police")}
            availableModels={policeAvailableModels}
            supportedModels={supportedModels}
            title="Police Chatbot Configuration"
          />
          <ChatbotConfigPanel
            key={`victim-${isVictimConfigFixed}`}
            config={victimConfig}
            onConfigChange={(field, value) =>
              handleConfigChange("victim", field, value)
            }
            isFixed={isVictimConfigFixed}
            onCreate={() => createChatbot("victim")}
            availableModels={victimAvailableModels}
            supportedModels={supportedModels}
            title="Victim Chatbot Configuration"
          />
        </Box>
      </Drawer>
    </Box>
  );
}

export default AutonomousSimulation;
