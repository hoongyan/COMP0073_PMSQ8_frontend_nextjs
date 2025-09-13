'use client';

export interface PublicReportSubmission {
    first_name: string;
    last_name: string;
    contact_no: string;
    email: string;
    sex?: string;
    dob?: string;
    nationality?: string;
    race?: string;
    occupation?: string;
    blk?: string;
    street?: string;
    unit_no?: string;
    postcode?: string;
    role?: string; // e.g., "victim" or "reportee"
    scam_incident_date: string; // YYYY-MM-DD
    scam_report_date?: string; // YYYY-MM-DD, optional
    scam_type?: string;
    scam_approach_platform?: string;
    scam_communication_platform?: string;
    scam_transaction_type?: string;
    scam_beneficiary_platform?: string;
    scam_beneficiary_identifier?: string;
    scam_contact_no?: string;
    scam_email?: string;
    scam_moniker?: string;
    scam_url_link?: string;
    scam_amount_lost?: number;
    scam_incident_description: string;
    conversation_id?: number;
  }
  
  export interface Message {
    role: "user" | "ai";
    content: string;
  }

// export async function submitPublicReport(data: PublicReportSubmission): Promise<{ report_id: number; conversation_id?: number }> {
//   const response = await fetch('/api/public/reports/submit', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(data),
//     cache: 'no-store', // Match your fetch style
//   });

//   if (!response.ok) {
//     const errorData = await response.json();
//     throw new Error(errorData.error || `Failed to submit report: ${response.statusText}`);
//   }

//   const result = await response.json();
//   return {
//     report_id: result.report_id,
//     conversation_id: result.conversation_id ?? undefined,
//   };
// }

export async function submitPublicReport(data: PublicReportSubmission): Promise<{ report_id: number; conversation_id?: number }> {
  const response = await fetch('/api/reports/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    cache: 'no-store',
  });

  if (!response.ok) {
    let errorMessage = `Failed to submit report: ${response.statusText}`;
    try {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } else {
        const errorText = await response.text();
        errorMessage = errorText || errorMessage;
      }
    } catch (parseError) {
      // If parsing fails, stick with statusText
    }
    throw new Error(errorMessage);
  }

  const result = await response.json();
  return {
    report_id: result.report_id,
    conversation_id: result.conversation_id ?? undefined,
  };
}

// export async function sendChatMessage(query: string, conversation_id: number | null): Promise<{ response: string; conversation_id?: number }> {
//   const response = await fetch('/api/chat', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ query, conversation_id }),
//     cache: 'no-store', // Match your fetch style
//   });

//   if (!response.ok) {
//     const errorData = await response.json();
//     throw new Error(errorData.error || `Failed to send message: ${response.statusText}`);
//   }

//   const result = await response.json();
//   return {
//     response: result.response, // Assume backend returns {response: str, conversation_id?: int}
//     conversation_id: result.conversation_id ?? undefined,
//   };
// }

export async function sendChatMessage(query: string, conversation_id: number | null): Promise<{ response: string; conversation_id?: number; structured_data: Record<string, any> }> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, conversation_id }),
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `Failed to send message: ${response.statusText}`);
  }

  const result = await response.json();
  return {
    response: result.response,
    conversation_id: result.conversation_id ?? undefined,
    structured_data: result.structured_data || {},  // Add this—fallback to empty object if missing
  };
}