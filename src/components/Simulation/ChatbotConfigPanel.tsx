// "use client";
// import React from "react";
// import {
//   Box,
//   TextField,
//   Button,
//   Typography,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   TextareaAutosize,
//   Checkbox,
//   FormControlLabel,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
// } from "@mui/material";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// interface ChatConfig {
//   agent_type: string;
//   agent_name: string;
//   llm_provider: string;
//   model: string;
//   is_rag: boolean;
//   prompt: string;
//   allow_search: boolean;
// }

// interface ChatbotConfigPanelProps {
//   config: ChatConfig;
//   onConfigChange: (
//     field: keyof ChatConfig,
//     value: string | boolean
//   ) => void;
//   isFixed: boolean;
//   onCreate: () => void;
//   availableModels: string[];
//   supportedModels: { [key: string]: string[] };
//   title: string;
// }

// export default function ChatbotConfigPanel({
//   config,
//   onConfigChange,
//   isFixed,
//   onCreate,
//   availableModels,
//   supportedModels,
//   title,
// }: ChatbotConfigPanelProps) {
//   return (
//     <Accordion defaultExpanded>
//       <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//         <Typography variant="h6" className="text-gray-800">
//           {title}
//         </Typography>
//       </AccordionSummary>
//       <AccordionDetails>
//         <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
//           <TextField
//             fullWidth
//             variant="outlined"
//             label="Agent Name"
//             value={config.agent_name}
//             onChange={(e) => onConfigChange("agent_name", e.target.value)}
//             disabled={isFixed}
//             className="bg-white"
//           />
//           <FormControl fullWidth disabled={isFixed}>
//             <InputLabel>LLM Provider</InputLabel>
//             <Select
//               value={config.llm_provider}
//               onChange={(e) => onConfigChange("llm_provider", e.target.value)}
//               label="LLM Provider"
//               className="bg-white"
//             >
//               {Object.keys(supportedModels).map((provider) => (
//                 <MenuItem key={provider} value={provider}>
//                   {provider}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//           <FormControl fullWidth disabled={isFixed}>
//             <InputLabel>Model</InputLabel>
//             <Select
//               value={config.model}
//               onChange={(e) => onConfigChange("model", e.target.value)}
//               label="Model"
//               className="bg-white"
//             >
//               {availableModels.map((model) => (
//                 <MenuItem key={model} value={model}>
//                   {model}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//           <FormControlLabel
//             control={
//               <Checkbox
//                 checked={config.is_rag}
//                 onChange={(e) => onConfigChange("is_rag", e.target.checked)}
//                 disabled={isFixed}
//                 className="text-blue-600"
//               />
//             }
//             label="Enable RAG"
//           />
//           <FormControlLabel
//             control={
//               <Checkbox
//                 checked={config.allow_search}
//                 onChange={(e) => onConfigChange("allow_search", e.target.checked)}
//                 disabled={isFixed}
//                 className="text-blue-600"
//               />
//             }
//             label="Enable Search"
//           />
//           <Box>
//             <Typography variant="body1" gutterBottom className="text-gray-800">
//               System Prompt
//             </Typography>
//             <TextareaAutosize
//               minRows={3}
//               style={{
//                 width: "100%",
//                 padding: "8px",
//                 borderRadius: "4px",
//                 borderColor: "#ccc",
//               }}
//               value={config.prompt}
//               onChange={(e) => onConfigChange("prompt", e.target.value)}
//               disabled={isFixed}
//               placeholder="Enter system prompt..."
//               className="bg-white"
//             />
//           </Box>
//           <Button
//             variant="contained"
//             onClick={onCreate}
//             disabled={isFixed}
//             className="bg-blue-600 hover:bg-blue-700"
//           >
//             Create {config.agent_type.charAt(0).toUpperCase() + config.agent_type.slice(1)} Chatbot
//           </Button>
//         </Box>
//       </AccordionDetails>
//     </Accordion>
//   );
// }

"use client";
import React from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextareaAutosize,
  Checkbox,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface ChatConfig {
  agent_type: string;
  agent_name: string;
  llm_provider: string;
  model: string;
  is_rag: boolean;
  prompt: string;
  allow_search: boolean;
}

interface ChatbotConfigPanelProps {
  config: ChatConfig;
  onConfigChange: (field: keyof ChatConfig, value: string | boolean) => void;
  isFixed: boolean;
  onCreate: () => void;
  availableModels: string[];
  supportedModels: { [key: string]: string[] };
  title: string;
}

export default function ChatbotConfigPanel({
  config,
  onConfigChange,
  isFixed,
  onCreate,
  availableModels,
  supportedModels,
  title,
}: ChatbotConfigPanelProps) {
  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6" className="text-gray-800">
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            label="Agent Name"
            value={config.agent_name}
            onChange={(e) => onConfigChange("agent_name", e.target.value)}
            disabled={isFixed}
            className="bg-white"
          />
          <FormControl fullWidth disabled={isFixed}>
            <InputLabel>LLM Provider</InputLabel>
            <Select
              value={config.llm_provider}
              onChange={(e) => onConfigChange("llm_provider", e.target.value)}
              label="LLM Provider"
              className="bg-white"
            >
              {Object.keys(supportedModels).map((provider) => (
                <MenuItem key={provider} value={provider}>
                  {provider}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth disabled={isFixed}>
            <InputLabel>Model</InputLabel>
            <Select
              value={config.model}
              onChange={(e) => onConfigChange("model", e.target.value)}
              label="Model"
              className="bg-white"
            >
              {availableModels.map((model) => (
                <MenuItem key={model} value={model}>
                  {model}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Checkbox
                checked={config.is_rag}
                onChange={(e) => onConfigChange("is_rag", e.target.checked)}
                disabled={isFixed}
                className="text-blue-600"
              />
            }
            label="Enable RAG"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={config.allow_search}
                onChange={(e) =>
                  onConfigChange("allow_search", e.target.checked)
                }
                disabled={isFixed}
                className="text-blue-600"
              />
            }
            label="Enable Search"
          />
          <Box>
            <Typography variant="body1" gutterBottom className="text-gray-800">
              System Prompt
            </Typography>
            <TextareaAutosize
              minRows={5}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                borderColor: "#ccc",
              }}
              value={config.prompt}
              onChange={(e) => onConfigChange("prompt", e.target.value)}
              disabled={isFixed}
              placeholder="Enter system prompt for the chatbot (e.g., 'You are a police officer investigating a scam...' or 'You are a victim of a scam...')"
              className="bg-white"
            />
          </Box>
          <Button
            variant="contained"
            onClick={onCreate}
            disabled={isFixed || !config.prompt.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Create{" "}
            {config.agent_type.charAt(0).toUpperCase() +
              config.agent_type.slice(1)}{" "}
            Chatbot
          </Button>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
