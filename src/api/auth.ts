"use client";  

export type UserRead = {
  email: string;
  first_name: string;
  last_name: string;
  contact_no: string;
  role: string;
  status: string;
  permission?: Record<string, any>;
};

export type SignupData = {
  first_name: string;
  last_name: string;
  contact_no: string;
  email: string;
  password: string;
  sex?: string; 
  dob?: string;  // "YYYY-MM-DD"
  nationality?: string;
  race?: string;
  blk?: string;
  street?: string;
  unit_no?: string;
  postcode?: string;
  role?: 'ADMIN' | 'INVESTIGATION OFFICER' | 'ANALYST';  
  permission?: Record<string, any>;  
};

// Type for sign-in credentials
export type SigninData = {
    email: string;
    password: string;
  };
  
  // Type for sign-in response (matches backend TokenJson)
  export type SigninResponse = {
    token: string;
    token_type: string;
  };

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';  // Use env var; fallback for dev.

export async function signup(newUser: SignupData): Promise<UserRead> {
  const body = {
    first_name: newUser.first_name,
    last_name: newUser.last_name,
    sex: newUser.sex || undefined,
    dob: newUser.dob || undefined,  // Already formatted as "YYYY-MM-DD" from frontend
    nationality: newUser.nationality || undefined,
    race: newUser.race || undefined,
    contact_no: newUser.contact_no,
    email: newUser.email,
    password: newUser.password,
    blk: newUser.blk || undefined,
    street: newUser.street || undefined,
    unit_no: newUser.unit_no || undefined,
    postcode: newUser.postcode || undefined,
    role: newUser.role || 'INVESTIGATION OFFICER',  // Default like backend
    permission: newUser.permission || {},  // Default empty object
  };

  const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = {};  // Fallback if not JSON
    }
    const detail = errorData.detail || `Failed to sign up: ${response.statusText}`;

    if (detail.includes('Email already registered')) {
      throw new Error('Email already registered. Please use a different email.');
    }
    throw new Error(detail);
  }

  const created = await response.json();
  return {
    email: created.email,
    first_name: created.first_name,
    last_name: created.last_name,
    contact_no: created.contact_no,
    role: created.role,
    status: created.status,
    permission: created.permission || {},
  };
}


export async function signin(credentials: SigninData): Promise<SigninResponse> {
    if (!credentials.email || !credentials.password) {
      throw new Error('Email and password are required.');
    }
  
    const response = await fetch(`${API_BASE_URL}/api/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
  
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = {};  // Fallback if not JSON
      }
      const detail = errorData.detail || `Failed to sign in: ${response.statusText}`;

      if (response.status === 401) {
        throw new Error('Incorrect email or password.');
      } else if (response.status === 403) {
        throw new Error('Account is inactive or pending approval. Please contact admin.');
      } else if (detail.includes('Incorrect')) {
        throw new Error('Incorrect email or password.');
      }
      throw new Error(detail);
    }
  
    const data = await response.json();
    return {
      token: data.token,
      token_type: data.token_type,
    };
  }