import { RowType } from '@/app/(dashboard)/reports/page'; 

export async function fetchScamReports(): Promise<RowType[]> {
  const response = await fetch(`/api/reports?limit=1000&offset=0`, { cache: 'no-store' });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `Failed to fetch reports: ${response.statusText}`);
  }
  const data = await response.json();
  return data.reports.map((report: any) => ({
    ...report,
    report_id: report.report_id,
    scam_incident_date: report.scam_incident_date ?? '',
    scam_report_date: report.scam_report_date ?? '',
    scam_amount_lost: report.scam_amount_lost ? report.scam_amount_lost.toString() : '',
    io_in_charge: report.assigned_IO_id ?? null,
    linked_persons: report.linked_persons || [],
  }));
}

export async function deleteScamReport(reportId: number): Promise<void> {
  const response = await fetch(`/api/reports/${reportId}`, { method: 'DELETE' });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `Failed to delete report ${reportId}: ${response.statusText}`);
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

  // Handle unassignment of io
  if (body.io_in_charge == null || body.io_in_charge === '' || body.io_in_charge === 0) {
    body.io_in_charge = null;
    body.status = 'UNASSIGNED';
  }

  if (body.status === 'UNASSIGNED' && body.io_in_charge != null) {
    body.io_in_charge = null;
  }

  if (body.status === 'ASSIGNED' && body.io_in_charge == null) {
    body.status = 'UNASSIGNED';  
  }

  const response = await fetch(`/api/reports/${reportId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `Failed to update report ${reportId}: ${response.statusText}`);
  }
  const updated = await response.json();
  return {
    ...updated,
    report_id: updated.report_id,
    scam_amount_lost: updated.scam_amount_lost ? updated.scam_amount_lost.toString() : '',
  };
}

export async function fetchLinkedPersons(reportId: number): Promise<LinkedPerson[]> {
  const response = await fetch(`/api/reports/${reportId}/linked_persons`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `Failed to fetch linked persons for report ${reportId}: ${response.statusText}`);
  }
  return response.json();
}

export async function createScamReport(newReport: Partial<RowType>): Promise<RowType> {
  const body = {
    ...newReport,
    scam_incident_date: newReport.scam_incident_date ? newReport.scam_incident_date.split('T')[0] : undefined,
    scam_report_date: newReport.scam_report_date ? newReport.scam_report_date.split('T')[0] : undefined,
    scam_amount_lost: newReport.scam_amount_lost ? parseFloat(newReport.scam_amount_lost) : undefined,
    status: newReport.status ? newReport.status.toUpperCase() : undefined,
  };

  if (body.io_in_charge == null || body.io_in_charge === '' || body.io_in_charge === 0) {
    body.io_in_charge = null;  
  }

  const response = await fetch(`/api/reports`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `Failed to create report: ${response.statusText}`);
  }
  const created = await response.json();
  return {
    ...created,
    report_id: created.report_id,
    scam_amount_lost: created.scam_amount_lost ? created.scam_amount_lost.toString() : '',
  };
}

export async function addLinkedPerson(reportId: number, person: { person_id: number; role: string }): Promise<LinkedPerson> {
  const response = await fetch(`/api/reports/${reportId}/linked_persons`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ person_id: person.person_id, role: person.role.toLowerCase() }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `Failed to add linked person: ${response.statusText}`);
  }
  return response.json();
}

export async function deleteLinkedPerson(reportId: number, personId: number): Promise<void> {
  const response = await fetch(`/api/reports/${reportId}/linked_persons?person_id=${personId}`, { method: 'DELETE' });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `Failed to delete linked person: ${response.statusText}`);
  }
}

export async function fetchIOs(): Promise<{ user_id: number; full_name: string }[]> {
  const response = await fetch(`/api/users/io`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `Failed to fetch IOs: ${response.statusText}`);
  }
  const data = await response.json();
  return data.ios;  
}