type Message = {
    messageId: string;
    conversationId: string;
    senderRole: "HUMAN" | "AI";
    content: string;
    sentDate: string;
  };
  
  export type RowType = {
    conversationId: string;
    reportId: string | null;
    creationDate: string;
    messages: Message[];
    summary: string;
  };
  
  // Fetch 
  export async function fetchConversations(): Promise<RowType[]> {
    const response = await fetch('/api/conversations?limit=1000&offset=0');  // Calls proxy
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to fetch conversations: ${response.statusText}`);
    }
    const data = await response.json();
    return data.conversations;  
  }
  
  // Delete 
  export async function deleteConversation(conversationId: string): Promise<void> {
    const response = await fetch(`/api/conversations?conversationId=${conversationId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to delete conversation ${conversationId}: ${response.statusText}`);
    }
  }
  
  // Bulk delete
  export async function bulkDeleteConversations(conversationIds: string[]): Promise<void> {
    await Promise.all(conversationIds.map(id => deleteConversation(id)));
  }