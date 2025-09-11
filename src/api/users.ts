// users.ts
"use client";

export type RowType = {
  userId: number;
  firstName: string;
  lastName: string;
  sex: string;
  dob: string;  // "YYYY-MM-DD" or ''
  nationality: string;
  race: string;
  contactNo: string;
  email: string;
  blk: string;
  street: string;
  unitNo: string;
  postCode: string;
  registrationDate: string;  // "YYYY-MM-DD"
  lastLoginDate: string;  // "YYYY-MM-DD" or "N/A"
  role: string;  // e.g., "ANALYST"
  status: string;  // e.g., "ACTIVE"
  permission: { [key: string]: string };  // e.g., {"victim_info": "View"}
};

const API_BASE_URL = 'http://localhost:8000';  // Update if different

export async function fetchUsers(): Promise<RowType[]> {
  const response = await fetch(`${API_BASE_URL}/users?limit=1000&offset=0`);
  if (!response.ok) {
    throw new Error(`Failed to fetch users: ${response.statusText}`);
  }
  const data = await response.json();
  return data.users.map((user: any) => {
    const regDate = user.registration_datetime.split('T')[0];
    const lastUpdated = user.last_updated_datetime.split('T')[0];
    const lastLogin = (regDate === lastUpdated) ? "N/A" : lastUpdated;
    return {
      userId: user.user_id,
      firstName: user.first_name,
      lastName: user.last_name,
      sex: user.sex || '',
      dob: user.dob || '',
      nationality: user.nationality || '',
      race: user.race || '',
      contactNo: user.contact_no,
      email: user.email,
      blk: user.blk || '',
      street: user.street || '',
      unitNo: user.unit_no || '',
      postCode: user.postcode || '',
      registrationDate: regDate,
      lastLoginDate: lastLogin,
      role: user.role,
      status: user.status,
      permission: user.permission || {},
    };
  });
}

export async function createUser(newUser: Partial<RowType> & { password: string }): Promise<RowType> {
  const body = {
    password: newUser.password,
    first_name: newUser.firstName,
    last_name: newUser.lastName,
    sex: newUser.sex,
    dob: newUser.dob ? newUser.dob.split('T')[0] : undefined,
    nationality: newUser.nationality,
    race: newUser.race,
    contact_no: newUser.contactNo,
    email: newUser.email,
    blk: newUser.blk,
    street: newUser.street,
    unit_no: newUser.unitNo,
    postcode: newUser.postCode,
    role: newUser.role,
    status: newUser.status || 'PENDING',  // Default if not provided
    permission: newUser.permission || {},
  };
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`Failed to create user: ${response.statusText}`);
  }
  const created = await response.json();
  // Map back to RowType (similar to fetch)
  const regDate = created.registration_datetime.split('T')[0];
  const lastUpdated = created.last_updated_datetime.split('T')[0];
  const lastLogin = (regDate === lastUpdated) ? "N/A" : lastUpdated;
  return {
    userId: created.user_id,
    firstName: created.first_name,
    lastName: created.last_name,
    sex: created.sex || '',
    dob: created.dob || '',
    nationality: created.nationality || '',
    race: created.race || '',
    contactNo: created.contact_no,
    email: created.email,
    blk: created.blk || '',
    street: created.street || '',
    unitNo: created.unit_no || '',
    postCode: created.postcode || '',
    registrationDate: regDate,
    lastLoginDate: lastLogin,
    role: created.role,
    status: created.status,
    permission: created.permission || {},
  };
}

export async function updateUser(userId: number, updates: Partial<RowType>): Promise<RowType> {
  const body: any = {
    first_name: updates.firstName,
    last_name: updates.lastName,
    sex: updates.sex,
    dob: updates.dob ? updates.dob.split('T')[0] : undefined,
    nationality: updates.nationality,
    race: updates.race,
    contact_no: updates.contactNo,
    email: updates.email,
    blk: updates.blk,
    street: updates.street,
    unit_no: updates.unitNo,
    postcode: updates.postCode,
    role: updates.role,
    status: updates.status,
    permission: updates.permission,
    password: updates.password,  // Optional for reset
  };
  
  // Remove undefined keys
  Object.keys(body).forEach(key => body[key] === undefined && delete body[key]);
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`Failed to update user ${userId}: ${response.statusText}`);
  }
  const updated = await response.json();
  // Map back to RowType
  const regDate = updated.registration_datetime.split('T')[0];
  const lastUpdated = updated.last_updated_datetime.split('T')[0];
  const lastLogin = (regDate === lastUpdated) ? "N/A" : lastUpdated;
  return {
    userId: updated.user_id,
    firstName: updated.first_name,
    lastName: updated.last_name,
    sex: updated.sex || '',
    dob: updated.dob || '',
    nationality: updated.nationality || '',
    race: updated.race || '',
    contactNo: updated.contact_no,
    email: updated.email,
    blk: updated.blk || '',
    street: updated.street || '',
    unitNo: updated.unit_no || '',
    postCode: updated.postcode || '',
    registrationDate: regDate,
    lastLoginDate: lastLogin,
    role: updated.role,
    status: updated.status,
    permission: updated.permission || {},
  };
}

export async function deleteUser(userId: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, { method: 'DELETE' });
  if (!response.ok) {
    throw new Error(`Failed to delete user ${userId}: ${response.statusText}`);
  }
}