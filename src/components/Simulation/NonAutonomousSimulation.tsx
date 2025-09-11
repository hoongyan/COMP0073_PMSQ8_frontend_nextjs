"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextareaAutosize,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ChatHistory from "./ChatHistory";

// Define TypeScript types
interface Message {
  role: "victim" | "police";
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

interface Conversation {
  conversation_id: number;
  title: string;
  description: string | null;
  conversation_type: "autonomous" | "non-autonomous";
  messages: {
    id: number;
    content: string;
    sender_type: "victim" | "police";
    user_id: number | null;
    agent_id: number | null;
  }[];
}

interface ChatResponse {
  response: string;
  conversation_history: Message[];
  conversation_type: string;
}

export default function NonAutonomousSimulation() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [agentId, setAgentId] = useState<number | null>(null);
  const [chatConfig, setChatConfig] = useState<ChatConfig>({
    agent_type: "police",
    agent_name: `PoliceBot-${Date.now()}`,
    llm_provider: "Ollama",
    model: "llama3.2",
    is_rag: false,
    prompt:
      "You are a professional police assistant. Provide accurate and concise responses to victim queries related to police procedures, safety tips, or scam reports. Maintain a respectful and neutral tone.",
    allow_search: false,
  });
  const [isAgentConfigFixed, setIsAgentConfigFixed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [supportedModels, setSupportedModels] = useState<{
    [key: string]: string[];
  }>({});
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch provider-to-model mapping via API
  useEffect(() => {
    async function fetchModels() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/llm/models`
        );
        if (!response.ok) throw new Error("Failed to fetch models");
        const data = await response.json();
        setSupportedModels(data.supported_models);
        setAvailableModels(
          data.supported_models[chatConfig.llm_provider] || []
        );
      } catch (error) {
        console.error("Error fetching models:", error);
        setError("Failed to load available models");
      }
    }
    fetchModels();
  }, []);

  // Models are updated when provider is selected
  useEffect(() => {
    setAvailableModels(supportedModels[chatConfig.llm_provider] || []);
    if (supportedModels[chatConfig.llm_provider]) {
      setChatConfig((prev) => ({
        ...prev,
        model: supportedModels[prev.llm_provider][0] || "",
      }));
    }
  }, [chatConfig.llm_provider, supportedModels]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleChatConfigChange = (
    field: keyof ChatConfig,
    value: string | boolean
  ) => {
    if (!isAgentConfigFixed) {
      setChatConfig((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleConfirmAgentConfig = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        agent_type: chatConfig.agent_type,
        agent_name: chatConfig.agent_name,
        llm_provider: chatConfig.llm_provider,
        model: chatConfig.model,
        is_rag: chatConfig.is_rag,
        prompt: chatConfig.prompt,
        allow_search: chatConfig.allow_search,
      };
      console.log("Create Payload:", JSON.stringify(payload, null, 2));
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/create-police-chatbot`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          credentials: "include",
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        console.error("Create Error Response:", errorData);
        throw new Error(errorData.error || "Failed to create police chatbot");
      }
      const response = await res.json();
      console.log("Create Response:", response);
      setAgentId(response.agent_id);
      setIsAgentConfigFixed(true);
      setRefreshKey((prev) => prev + 1);
    } catch (err: any) {
      console.error("Create Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !isAgentConfigFixed || !agentId) return;
    const victimMessage: Message = { role: "victim", content: input };
    setMessages((prev) => [...prev, victimMessage]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const payload = {
        agent_id: agentId,
        query: input,
        user_id: null,
        conversation_history: messages,
      };
      console.log("Chat Payload:", JSON.stringify(payload, null, 2));
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include",
      });
      if (!res.ok) {
        const errorData = await res.json();
        console.error("Chat Error Response:", errorData);
        throw new Error(
          errorData.error || errorData.detail || "Network response was not ok"
        );
      }
      const response: ChatResponse = await res.json();
      if (
        !response.response ||
        response.conversation_type.trim() !== "non-autonomous"
      ) {
        throw new Error("Invalid response from police chatbot");
      }
      const policeMessage: Message = {
        role: "police",
        content: response.response,
      };
      setMessages((prev) => [...prev, policeMessage]);
      setRefreshKey((prev) => prev + 1);
    } catch (err: any) {
      console.error("Chat Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setInput("");
    setAgentId(null);
    setIsAgentConfigFixed(false);
    setChatConfig({
      agent_type: "police",
      agent_name: `PoliceBot-${Date.now()}`,
      llm_provider: "Ollama",
      model: "llama3.2",
      is_rag: false,
      prompt:
        "You are a professional police assistant. Provide accurate and concise responses to victim queries related to police procedures, safety tips, or scam reports. Maintain a respectful and neutral tone.",
      allow_search: false,
    });
    setError(null);
    setRefreshKey((prev) => prev + 1);
  };

  const handleSelectConversation = (conversation: Conversation) => {
    if (conversation.conversation_type !== "non-autonomous") {
      setError("Selected conversation is not a victim-police chat.");
      return;
    }
    setAgentId(
      conversation.messages.find((msg) => msg.agent_id !== null)?.agent_id ||
        null
    );
    setMessages(
      conversation.messages.map((msg) => ({
        role: msg.sender_type,
        content: msg.content,
      }))
    );
    setIsAgentConfigFixed(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        gap: 2,
        className: "p-4",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flex: 1,
          flexDirection: "row",
          gap: 2,
          overflow: "auto",
          className: "w-full",
        }}
      >
        <ChatHistory
          onSelectConversation={handleSelectConversation}
          refreshKey={refreshKey}
        />
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Paper
            sx={{
              flexGrow: 1,
              p: 2,
              overflowY: "auto",
              mb: 2,
              border: "2px solid #555555",
              borderRadius: "8px",
              className: "rounded-lg",
            }}
          >
            {messages.map((msg, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent:
                    msg.role === "victim" ? "flex-end" : "flex-start",
                  mb: 2,
                }}
              >
                <Paper
                  sx={{
                    p: 2,
                    maxWidth: "70%",
                    bgcolor: msg.role === "victim" ? "#d81b60" : "#1976d2",
                    color: "#fff",
                    borderRadius:
                      msg.role === "victim"
                        ? "20px 20px 0 20px"
                        : "20px 20px 20px 0",
                  }}
                >
                  <Typography variant="body2" sx={{ opacity: 0.7 }}>
                    {msg.role === "victim" ? "Victim" : "Police"}
                  </Typography>
                  <Typography variant="body1">{msg.content}</Typography>
                </Paper>
              </Box>
            ))}
            {loading && (
              <Box
                sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}
              >
                <Paper
                  sx={{
                    p: 2,
                    bgcolor: "#f5f5f5",
                    borderRadius: "20px 20px 20px 0",
                  }}
                >
                  <Typography variant="body1">Thinking...</Typography>
                </Paper>
              </Box>
            )}
            {error && (
              <Box
                sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}
              >
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
          <Box sx={{ display: "flex", gap: 2, className: "w-full" }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading || !isAgentConfigFixed}
              className="w-full"
            />
            <Button
              variant="contained"
              endIcon={<SendIcon />}
              onClick={handleSend}
              disabled={loading || !input.trim() || !isAgentConfigFixed}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Send
            </Button>
            <Button
              variant="outlined"
              onClick={handleNewChat}
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
              New Chat
            </Button>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "300px",
          }}
        >
          <Paper
            sx={{
              p: 2,
              overflowY: "auto",
              border: "2px solid #555555",
              borderRadius: "8px",
              className: "rounded-lg",
            }}
          >
            <Typography variant="h6" gutterBottom className="text-gray-900">
              Police Chatbot Configuration
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              label="Agent Name"
              value={chatConfig.agent_name}
              onChange={(e) =>
                handleChatConfigChange("agent_name", e.target.value)
              }
              disabled={isAgentConfigFixed}
              sx={{ mb: 2 }}
              className="bg-white"
            />
            <FormControl fullWidth sx={{ mb: 2 }} disabled={isAgentConfigFixed}>
              <InputLabel>LLM Provider</InputLabel>
              <Select
                value={chatConfig.llm_provider}
                onChange={(e) =>
                  handleChatConfigChange("llm_provider", e.target.value)
                }
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
            <FormControl fullWidth sx={{ mb: 2 }} disabled={isAgentConfigFixed}>
              <InputLabel>Model</InputLabel>
              <Select
                value={chatConfig.model}
                onChange={(e) =>
                  handleChatConfigChange("model", e.target.value)
                }
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
                  checked={chatConfig.is_rag}
                  onChange={(e) =>
                    handleChatConfigChange("is_rag", e.target.checked)
                  }
                  disabled={isAgentConfigFixed}
                  className="text-blue-600"
                />
              }
              label="Enable RAG"
              sx={{ mb: 2 }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={chatConfig.allow_search}
                  onChange={(e) =>
                    handleChatConfigChange("allow_search", e.target.checked)
                  }
                  disabled={isAgentConfigFixed}
                  className="text-blue-600"
                />
              }
              label="Enable Search"
              sx={{ mb: 2 }}
            />
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="body1"
                gutterBottom
                className="text-gray-900"
              >
                System Prompt
              </Typography>
              <TextareaAutosize
                minRows={3}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  borderColor: "#ccc",
                }}
                value={chatConfig.prompt}
                onChange={(e) =>
                  handleChatConfigChange("prompt", e.target.value)
                }
                disabled={isAgentConfigFixed}
                placeholder="Enter system prompt..."
                className="bg-white"
              />
            </Box>
            <Button
              variant="contained"
              onClick={handleConfirmAgentConfig}
              disabled={isAgentConfigFixed || loading}
              sx={{ mt: 2 }}
              className="bg-blue-600 hover:bg-blue-700 w-full"
            >
              Create Police Chatbot
            </Button>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
