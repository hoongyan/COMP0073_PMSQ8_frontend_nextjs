// src/api/conversation.ts

// Define types aligned with backend (from model.py)
interface FrontendMessage {
    messageId: string;
    conversationId: string;
    senderRole: "HUMAN" | "AI";  // Aligned with backend enum values
    content: string;
    sentDate: string;  // 'dd/mm/yy HH:MM'
  }
  
  interface FrontendConversation {
    conversationId: string;
    reportId: string | null;
    creationDate: string;  // 'dd/mm/yy HH:MM'
    messages: FrontendMessage[];
    summary: string;
  }
  
  interface ConversationListResponse {
    conversations: FrontendConversation[];
  }
  
  const API_BASE_URL = 'http://localhost:8000';
  
  // Fetch all conversations (high limit for client-side pagination/filtering)
  export async function fetchConversations(): Promise<FrontendConversation[]> {
    const response = await fetch(`${API_BASE_URL}/conversations?limit=1000&offset=0`);
    if (!response.ok) {
      throw new Error(`Failed to fetch conversations: ${response.statusText}`);
    }
    const data: ConversationListResponse = await response.json();
    // No mapping needed as types align; backend returns null for reportId, strings for others
    return data.conversations;
  }
  
  // Delete a single conversation
  export async function deleteConversation(conversationId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/conversations/${conversationId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete conversation ${conversationId}: ${response.statusText}`);
    }
  }
  
  // Bulk delete (sequential calls, since no bulk endpoint)
  export async function bulkDeleteConversations(conversationIds: string[]): Promise<void> {
    await Promise.all(conversationIds.map(id => deleteConversation(id)));
  }