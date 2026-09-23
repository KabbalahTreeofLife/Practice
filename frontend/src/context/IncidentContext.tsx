import { useEffect, useReducer, type ReactNode } from 'react';
import { api } from '../api/client';
import type { Action, Severity, State, Status } from '../types';
import { IncidentContext, type IncidentContextValue } from './incidentContext';

const initialState: State = {
  user: null,
  token: localStorage.getItem('token'),
  incidents: [],
  loading: false,
  error: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, loading: true, error: null };
    case 'SET_AUTH':
      return { ...state, user: action.payload.user, token: action.payload.token, loading: false, error: null };
    case 'LOGOUT':
      return { ...state, user: null, token: null, incidents: [], loading: false, error: null };
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, incidents: action.payload, loading: false, error: null };
    case 'CREATE_SUCCESS':
      return { ...state, incidents: [action.payload, ...state.incidents], loading: false, error: null };
    case 'UPDATE_SUCCESS':
      return {
        ...state,
        incidents: state.incidents.map((incident) =>
          incident.id === action.payload.id ? action.payload : incident,
        ),
        loading: false,
        error: null,
      };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        incidents: state.incidents.filter((incident) => incident.id !== action.payload),
        loading: false,
        error: null,
      };
    case 'SET_ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

export function IncidentProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  };

  const fetchIncidents = async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const incidents = await api.fetchIncidents();
      dispatch({ type: 'FETCH_SUCCESS', payload: incidents });
    } catch (error) {
      if ((error as Error & { status: number }).status === 401) {
        return logout();
      }
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    }
  };

  const login = async (email: string, password: string) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const { token, user } = await api.login(email, password);
      localStorage.setItem('token', token);
      dispatch({ type: 'SET_AUTH', payload: { user, token } });
      await fetchIncidents();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    }
  };

  const register = async (email: string, password: string) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const { token, user } = await api.register(email, password);
      localStorage.setItem('token', token);
      dispatch({ type: 'SET_AUTH', payload: { user, token } });
      await fetchIncidents();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    }
  };

  const createIncident = async (data: { title: string; description?: string; severity: Severity }) => {
    try {
      const incident = await api.createIncident(data);
      dispatch({ type: 'CREATE_SUCCESS', payload: incident });
    } catch (error) {
      if ((error as Error & { status: number }).status === 401) {
        return logout();
      }
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    }
  };

  const updateIncident = async (id: number, data: { status?: Status; severity?: Severity }) => {
    try {
      const incident = await api.updateIncident(id, data);
      dispatch({ type: 'UPDATE_SUCCESS', payload: incident });
    } catch (error) {
      if ((error as Error & { status: number }).status === 401) {
        return logout();
      }
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    }
  };

  const deleteIncident = async (id: number) => {
    try {
      await api.deleteIncident(id);
      dispatch({ type: 'DELETE_SUCCESS', payload: id });
    } catch (error) {
      if ((error as Error & { status: number }).status === 401) {
        return logout();
      }
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    }
  };

  useEffect(() => {
    if (localStorage.getItem('token')) {
      void fetchIncidents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value: IncidentContextValue = {
    ...state,
    dispatch,
    login,
    register,
    logout,
    fetchIncidents,
    createIncident,
    updateIncident,
    deleteIncident,
  };

  return <IncidentContext.Provider value={value}>{children}</IncidentContext.Provider>;
}