"use client";
import React, { useState, useEffect } from "react";
import { Box, List, ListItem, ListItemText, Typography, Paper, Button, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete"
import { toast, ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 


interface Message {
  id: number;
  content: string;
  sender_type: "victim" | "police";
  user_id: number | null;
  agent_id: number | null;
}

interface Conversation {
  conversation_id: number;
  title: string;
  description: string | null;
  conversation_type: "autonomous" | "non-autonomous";
  messages: Message[];
}

interface ChatHistoryProps {
  onSelectConversation: (conversation: Conversation) => void;
  refreshKey: number;
  onRefresh: () => void; 
}

export default function ChatHistory({ onSelectConversation, refreshKey, onRefresh}: ChatHistoryProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);

  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/conversations`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch conversations");
        }
        const response = await res.json();
        setConversations(response.conversations);
        // toast.success("Conversations fetched successfully"); #Not necessary to avoid degrading UI experience with repeated prompts
      } catch (err: any) {
        setError(err.message);
        toast.error(`Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [refreshKey]);

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversationId(conversation.conversation_id);
    onSelectConversation(conversation);
  };

  const handleDeleteConversation = async (conversationId: number) => {
    if (!confirm("Are you sure you want to delete this conversation?")) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/conversations/${conversationId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete conversation");
      }
      setConversations(conversations.filter((conv) => conv.conversation_id !== conversationId));
      if (selectedConversationId === conversationId) {
        setSelectedConversationId(null);
      }
      onRefresh(); // Trigger refresh
      toast.success("Conversation deleted successfully");
    } catch (err: any) {
      setError(err.message);
      toast.error(`Error: ${err.message}`); 
    }
  };

  const handleExport = () => {
    if (!selectedConversationId) {
      toast.error("Please select a conversation to export");
      return;
    }

    const selectedConversation = conversations.find(
      (conv) => conv.conversation_id === selectedConversationId
    );
    if (!selectedConversation) {
      setError("Selected conversation not found");
      toast.error("Selected conversation not found"); 
      return;
    }

    const headers = ["conversation_id", "id", "content", "sender_type", "user_id", "agent_id"];
    const rows = selectedConversation.messages.map((msg) => [
      selectedConversation.conversation_id,
      msg.id,
      `"${msg.content.replace(/"/g, '""')}"`,
      msg.sender_type,
      msg.user_id ?? "",
      msg.agent_id ?? "",
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `conversation_${selectedConversationId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportAll = () => {
    if (!conversations.length) {
      setError("No conversations available to export");
      toast.error("No conversations available to export"); // CHANGE: Added error toast (line 122)
      return;
    }

    const sortedConversations = [...conversations].sort(
      (a, b) => a.conversation_id - b.conversation_id
    );

    const headers = ["conversation_id", "id", "content", "sender_type", "user_id", "agent_id"];
    const rows = sortedConversations.flatMap((conv) =>
      conv.messages.map((msg) => [
        conv.conversation_id,
        msg.id,
        `"${msg.content.replace(/"/g, '""')}"`,
        msg.sender_type,
        msg.user_id ?? "",
        msg.agent_id ?? "",
      ])
    );
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "all_conversations.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("All conversations exported successfully"); 
  };

  const getSenderLabel = (msg: Message) => {
    return msg.sender_type === "victim" ? "Victim" : "Police";
  };

  return (
    <Box sx={{ width: "300px", p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
      <ToastContainer />
      <Box>
        <Paper
          sx={{
            p: 2,
            border: "2px solid #555555",
            borderRadius: "8px",
            maxHeight: "60vh",
            overflowY: "auto",
          }}
        >
          <Typography variant="h6" gutterBottom className="text-gray-900">
            Conversation History
          </Typography>
          {loading && <Typography>Loading...</Typography>}
          {error && <Typography color="error">Error: {error}</Typography>}
          <List>
            {conversations.map((conv) => (
              <ListItem
                key={conv.conversation_id}
                button={true}
                onClick={() => handleSelectConversation(conv)}
                sx={{
                  borderBottom: "1px solid #eee",
                  bgcolor: selectedConversationId === conv.conversation_id ? "#e3f2fd" : "inherit",
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center", 
                }}
              >
              <ListItemText
                primary={
                  conv.conversation_type === "non-autonomous"
                    ? `Non-Autonomous Chat ${conv.conversation_id}`
                    : `Autonomous Chat ${conv.conversation_id}`
                }
                secondary={
                  conv.messages.length > 0
                    ? `${getSenderLabel(conv.messages[conv.messages.length - 1])}: ${
                        conv.messages[conv.messages.length - 1].content.substring(0, 50)
                      }...`
                    : "No messages"
                }
              />
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering ListItem click
                  handleDeleteConversation(conv.conversation_id);
                }}
              >
                <DeleteIcon />
              </IconButton>
            </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Button
          variant="contained"
          onClick={handleExport}
          disabled={!selectedConversationId}
          sx={{ width: "100%", bgcolor: "#1976d2", "&:hover": { bgcolor: "#1565c0" } }}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Export Selected Conversation
        </Button>
        <Button
          variant="contained"
          onClick={handleExportAll}
          sx={{ width: "100%", bgcolor: "#1976d2", "&:hover": { bgcolor: "#1565c0" } }}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Export All Conversations
        </Button>
      </Box>
    </Box>
  );
}