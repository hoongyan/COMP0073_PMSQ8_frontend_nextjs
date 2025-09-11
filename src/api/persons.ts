// persons.ts
"use client";

import { LinkedReport } from '@/app/(dashboard)/persons_info/page';  // Import if needed; assuming it's defined in page.tsx

export type RowType = {
  person_id: number; 
  first_name: string;
  last_name: string;
  sex: string;
  dob: string;  // "YYYY-MM-DD" or empty
  nationality: string;
  race: string;
  occupation: string;
  contact_no: string;
  email: string;
  blk: string;
  street: string;
  unit_no: string;
  postcode: string;  
};

const API_BASE_URL = 'http://localhost:8000';  // Same as reports.ts; update if different.

export async function fetchPersons(): Promise<RowType[]> {
  const response = await fetch(`${API_BASE_URL}/persons?limit=1000&offset=0`);
  if (!response.ok) {
    throw new Error(`Failed to fetch persons: ${response.statusText}`);
  }
  const data = await response.json();
  return data.persons.map((person: any) => ({
    person_id: person.person_id,
    first_name: person.first_name,
    last_name: person.last_name,
    sex: person.sex || '',
    dob: person.dob || '',
    nationality: person.nationality || '',
    race: person.race || '',
    occupation: person.occupation || '',
    contact_no: person.contact_no,
    email: person.email,
    blk: person.blk || '',
    street: person.street || '',
    unit_no: person.unit_no || '',
    postcode: person.postcode || '',  
  }));
}

export async function createPerson(newPerson: Partial<RowType>): Promise<RowType> {
  const body = {
    first_name: newPerson.first_name,
    last_name: newPerson.last_name,
    sex: newPerson.sex,
    dob: newPerson.dob ? newPerson.dob.split('T')[0] : undefined,  // Ensure "YYYY-MM-DD"
    nationality: newPerson.nationality,
    race: newPerson.race,
    occupation: newPerson.occupation,
    contact_no: newPerson.contact_no,
    email: newPerson.email,
    blk: newPerson.blk,
    street: newPerson.street,
    unit_no: newPerson.unit_no,
    postcode: newPerson.postcode,  
  };
  const response = await fetch(`${API_BASE_URL}/persons`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`Failed to create person: ${response.statusText}`);
  }
  const created = await response.json();
  return {
    person_id: created.person_id,
    first_name: created.first_name,
    last_name: created.last_name,
    sex: created.sex || '',
    dob: created.dob || '',
    nationality: created.nationality || '',
    race: created.race || '',
    occupation: created.occupation || '',
    contact_no: created.contact_no,
    email: created.email,
    blk: created.blk || '',
    street: created.street || '',
    unit_no: created.unit_no || '',
    postcode: created.postcode || '',
  };
}

export async function updatePerson(personId: number, updates: Partial<RowType>): Promise<RowType> {
  const body = {
    ...updates,
    dob: updates.dob ? updates.dob.split('T')[0] : undefined,  // Ensure "YYYY-MM-DD"
    
  };
  delete body.person_id;  
 
  console.log('UpdatePerson: Sending body to backend:', JSON.stringify(body, null, 2));

  const response = await fetch(`${API_BASE_URL}/persons/${personId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`Failed to update person ${personId}: ${response.statusText}`);
  }
  const updated = await response.json();

  console.log('UpdatePerson: Received response from backend:', JSON.stringify(updated, null, 2));
  
  return {
    person_id: updated.person_id,
    first_name: updated.first_name,
    last_name: updated.last_name,
    sex: updated.sex || '',
    dob: updated.dob || '',
    nationality: updated.nationality || '',
    race: updated.race || '',
    occupation: updated.occupation || '',
    contact_no: updated.contact_no,
    email: updated.email,
    blk: updated.blk || '',
    street: updated.street || '',
    unit_no: updated.unit_no || '',
    postcode: updated.postcode || '',
  };
}

export async function deletePerson(personId: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/persons/${personId}`, { method: 'DELETE' });
  if (!response.ok) {
    throw new Error(`Failed to delete person ${personId}: ${response.statusText}`);
  }
}

export async function fetchLinkedReports(personId: number): Promise<LinkedReport[]> {
  const response = await fetch(`${API_BASE_URL}/persons/${personId}/linked_reports`);
  if (!response.ok) {
    throw new Error(`Failed to fetch linked reports for person ${personId}: ${response.statusText}`);
  }
  const data = await response.json();
  return data;  // Already in format [{ report_id: string, role: string }]
}