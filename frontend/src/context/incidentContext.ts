import { createContext, type Dispatch } from 'react';
import type { Action, Severity, State, Status } from '../types';

export interface IncidentContextValue extends State {
  dispatch: Dispatch<Action>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchIncidents: () => Promise<void>;
  createIncident: (data: { title: string; description?: string; severity: Severity }) => Promise<void>;
  updateIncident: (id: number, data: { status?: Status; severity?: Severity }) => Promise<void>;
  deleteIncident: (id: number) => Promise<void>;
}

export const IncidentContext = createContext<IncidentContextValue | null>(null);