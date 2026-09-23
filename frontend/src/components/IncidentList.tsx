import styled from 'styled-components';
import { useIncidents } from '../context/useIncidents';
import IncidentCard from './IncidentCard';

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const Empty = styled.p`
  color: #64748b;
  text-align: center;
  padding: 2rem 0;
`;

const Spinner = styled.div`
  border: 3px solid #e2e8f0;
  border-top-color: #3b82f6;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  margin: 2rem auto;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export default function IncidentList() {
  const { incidents, loading } = useIncidents();

  if (loading) {
    return <Spinner />;
  }

  if (incidents.length === 0) {
    return <Empty>No incidents reported yet.</Empty>;
  }

  return (
    <List>
      {incidents.map((incident) => (
        <li key={incident.id}>
          <IncidentCard incident={incident} />
        </li>
      ))}
    </List>
  );
}