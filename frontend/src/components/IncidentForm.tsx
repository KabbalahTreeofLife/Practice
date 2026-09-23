import styled from 'styled-components';
import { useState, type FormEvent } from 'react';
import { useIncidents } from '../context/useIncidents';
import { Select, type SelectOption } from './Select';
import type { Severity } from '../types';

const severityOptions: SelectOption<Severity>[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;
  margin-bottom: 1.5rem;
`;

const Row = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: #475569;
  flex: 1;
`;

const Input = styled.input`
  color-scheme: light;
  padding: 0.5rem 0.6rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.9rem;
  color: #0f172a;
  background: white;
`;

const TextArea = styled.textarea`
  color-scheme: light;
  padding: 0.5rem 0.6rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.9rem;
  font-family: inherit;
  resize: vertical;
  color: #0f172a;
  background: white;
`;

const Button = styled.button`
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 6px;
  background: #3b82f6;
  color: white;
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Title = styled.h2`
  font-size: 1.1rem;
  margin: 0;
  color: #0f172a;
`;

export default function IncidentForm() {
  const { createIncident } = useIncidents();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<Severity>('low');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return;
    await createIncident({ title, description, severity });
    setTitle('');
    setDescription('');
    setSeverity('low');
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Title>Report an incident</Title>
      <Field>
        Title
        <Input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="e.g. VPN not connecting"
          maxLength={200}
          required
        />
      </Field>
      <Field>
        Description
        <TextArea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Optional details…"
          rows={3}
        />
      </Field>
      <Row>
        <Select
          label="Severity"
          value={severity}
          options={severityOptions}
          onChange={(value) => setSeverity(value)}
        />
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <Button type="submit">Submit</Button>
        </div>
      </Row>
    </Form>
  );
}