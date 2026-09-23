export type Severity = 'low' | 'medium' | 'high' | 'critical';
export type Status = 'open' | 'in-progress' | 'resolved';

export interface User {
  id: number;
  email: string;
}

export interface Incident {
  id: number;
  title: string;
  description?: string;
  severity: Severity;
  status: Status;
  userId: number;
  createdAt: string;
  updatedAt?: string;
}

export interface State {
  user: User | null;
  token: string | null;
  incidents: Incident[];
  loading: boolean;
  error: string | null;
}

export type Action =
  | { type: 'AUTH_START' }
  | { type: 'SET_AUTH'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Incident[] }
  | { type: 'CREATE_SUCCESS'; payload: Incident }
  | { type: 'UPDATE_SUCCESS'; payload: Incident }
  | { type: 'DELETE_SUCCESS'; payload: number }
  | { type: 'SET_ERROR'; payload: string };