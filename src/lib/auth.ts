"use client";  

export type UserRead = {
  email: string;
  first_name: string;
  last_name: string;
  contact_no: string;
  role: string;
  status: string;
};

export type SignupData = {
  first_name: string;
  last_name: string;
  contact_no: string;
  email: string;
  password: string;
  sex?: string; 
  dob?: string;  
  nationality?: string;
  race?: string;
  blk?: string;
  street?: string;
  unit_no?: string;
  postcode?: string;
  role?: 'ADMIN' | 'INVESTIGATION OFFICER' | 'ANALYST';  
};

export type SigninData = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export type SigninResponse = {
  token: string;
  token_type: string;
};

export async function signup(newUser: SignupData): Promise<UserRead> {
  const body = {
    first_name: newUser.first_name,
    last_name: newUser.last_name,
    sex: newUser.sex || undefined,
    dob: newUser.dob || undefined,  
    nationality: newUser.nationality || undefined,
    race: newUser.race || undefined,
    contact_no: newUser.contact_no,
    email: newUser.email,
    password: newUser.password,
    blk: newUser.blk || undefined,
    street: newUser.street || undefined,
    unit_no: newUser.unit_no || undefined,
    postcode: newUser.postcode || undefined,
    role: newUser.role || 'INVESTIGATION OFFICER',  
  };

  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = {};
    }
    const detail = errorData.error || `Failed to sign up: ${response.statusText}`;  
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
  };
}

export async function signin(credentials: SigninData): Promise<SigninResponse> {
  if (!credentials.email || !credentials.password) {
    throw new Error('Email and password are required.');
  }

  const response = await fetch('/api/auth/signin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = {};
    }
    const detail = errorData.error || `Failed to sign in: ${response.statusText}`;  
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

export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    const response = await fetch(url, {
      ...options,
      credentials: 'include',
    });
  
    if (response.status === 401) {
      throw new Error('Session expired - please sign in again'); // UI handles
    }
  
    return response;
  }

  export async function logout(): Promise<void> {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to log out');
    }
  }