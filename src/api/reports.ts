
import { RowType } from '@/app/(dashboard)/reports/page';

const API_BASE_URL = 'http://localhost:8000'; // Update if different.

export async function fetchScamReports(): Promise<RowType[]> {
  const response = await fetch(`${API_BASE_URL}/get_reports?limit=1000&offset=0`);
  if (!response.ok) {
    throw new Error(`Failed to fetch reports: ${response.statusText}`);
  }
  const data = await response.json();
  return data.reports.map((report: any) => ({
    ...report,
    report_id: report.report_id, 
    scam_incident_date: report.scam_incident_date || '',
    scam_report_date: report.scam_report_date || '',
    scam_amount_lost: report.scam_amount_lost ? report.scam_amount_lost.toString() : '', // Float to string
    linked_persons: report.linked_persons || [],
  }));
}



export async function deleteScamReport(reportId: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/delete_reports/${reportId}`, { method: 'DELETE' });
  if (!response.ok) {
    throw new Error(`Failed to delete report ${reportId}: ${response.statusText}`);
  }
}





export async function updateScamReport(reportId: number, updates: Partial<RowType>): Promise<RowType> {
  const body = {
    ...updates,
    scam_incident_date: updates.scam_incident_date ? updates.scam_incident_date.split('T')[0] : undefined,
    scam_report_date: updates.scam_report_date ? updates.scam_report_date.split('T')[0] : undefined,
    scam_amount_lost: updates.scam_amount_lost ? parseFloat(updates.scam_amount_lost) : undefined,
    status: updates.status ? updates.status.toUpperCase() : undefined,
  };
  const response = await fetch(`${API_BASE_URL}/update_reports/${reportId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`Failed to update report ${reportId}: ${response.statusText}`);
  }
  const updated = await response.json();
  return {
    ...updated,
    report_id: updated.report_id || updated.scam_report_no, //check
    scam_amount_lost: updated.scam_amount_lost ? updated.scam_amount_lost.toString() : '',
  };
}