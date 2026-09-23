import styled from 'styled-components';
import type { Incident, Severity, Status } from '../types';
import { useIncidents } from '../context/useIncidents';
import { Select, type SelectOption } from './Select';

const statusOptions: SelectOption<Status>[] = [
  { value: 'open', label: 'Open' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
];

const severityOptions: SelectOption<Severity>[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

const severityColors: Record<Severity, { bg: string; fg: string }> = {
  low: { bg: '#ecfdf5', fg: '#047857' },
  medium: { bg: '#fffbeb', fg: '#b45309' },
  high: { bg: '#fef2f2', fg: '#b91c1c' },
  critical: { bg: '#fdf2f8', fg: '#9d174d' },
};

const statusColors: Record<Status, { bg: string; fg: string }> = {
  open: { bg: '#eff6ff', fg: '#1d4ed8' },
  'in-progress': { bg: '#f5f3ff', fg: '#6d28d9' },
  resolved: { bg: '#ecfdf5', fg: '#047857' },
};

const Card = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  background: white;
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1rem;
  color: #0f172a;
`;

const Badge = styled.span<{ $bg: string; $fg: string }>`
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  background: ${({ $bg }) => $bg};
  color: ${({ $fg }) => $fg};
  white-space: nowrap;
`;

const Description = styled.p`
  margin: 0;
  color: #475569;
  font-size: 0.9rem;
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.75rem;
  color: #94a3b8;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-top: 0.25rem;
`;

const DeleteButton = styled.button`
  margin-left: auto;
  padding: 0.35rem 0.75rem;
  border: 1px solid #fecaca;
  border-radius: 6px;
  background: #fef2f2;
  color: #b91c1c;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #fee2e2;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

function formatDate(value: string) {
  return new Date(value).toLocaleString();
}

export default function IncidentCard({ incident }: { incident: Incident }) {
  const { updateIncident, deleteIncident } = useIncidents();
  const severity = severityColors[incident.severity];
  const status = statusColors[incident.status];

  return (
    <Card>
      <Top>
        <Title>{incident.title}</Title>
        <Badge $bg={severity.bg} $fg={severity.fg}>
          {incident.severity}
        </Badge>
      </Top>
      {incident.description ? <Description>{incident.description}</Description> : null}
      <Meta>
        <Badge $bg={status.bg} $fg={status.fg}>
          {incident.status}
        </Badge>
        <span>Opened {formatDate(incident.createdAt)}</span>
      </Meta>
      <Controls>
        <Select
          size="small"
          label="Status"
          value={incident.status}
          options={statusOptions}
          onChange={(status) => void updateIncident(incident.id, { status })}
        />
        <Select
          size="small"
          label="Severity"
          value={incident.severity}
          options={severityOptions}
          onChange={(severity) => void updateIncident(incident.id, { severity })}
        />
        <DeleteButton
          disabled={incident.status !== 'resolved'}
          title={incident.status === 'resolved' ? 'Delete incident' : 'Only resolved incidents can be deleted'}
          onClick={() => void deleteIncident(incident.id)}
        >
          Delete
        </DeleteButton>
      </Controls>
    </Card>
  );
}