import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AtlasApiClient, CohortEndpoints } from '@atlas-v3/api-v3-client';
import { CohortService } from '@atlas-v3/domain-core';
import type { CohortDefinition } from '@atlas-v3/domain-core';
import { Button, Card, Input, useTheme } from '@atlas-v3/ui-system';

// --- 3-layer wiring: API → Domain → UI ---

const apiClient = new AtlasApiClient({
  baseUrl: import.meta.env.VITE_WEBAPI_BASE_URL ?? '/WebAPI',
});
const cohortEndpoints = new CohortEndpoints(apiClient);
const cohortService = new CohortService(cohortEndpoints);

export function CohortDetailPage() {
  const theme = useTheme();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [cohort, setCohort] = useState<CohortDefinition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);


  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    cohortService
      .get(Number(id))
      .then((data) => {
        if (!cancelled) {
          setCohort(data);
          setName(data.name);
          setDescription(data.description);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [id]);

  const handleSave = () => {
    if (!id || !cohort) return;
    setSaving(true);
    setError(null);

    cohortService
      .update(Number(id), { name, description })
      .then((updated) => {
        setCohort(updated);
        setName(updated.name);
        setDescription(updated.description);
        setEditing(false);
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setSaving(false));
  };

  const handleDelete = () => {
    if (!id) return;
    cohortService
      .remove(Number(id))
      .then(() => navigate('/cohorts'))
      .catch((err: unknown) => setError(err instanceof Error ? err.message : String(err)));
  };

  if (loading) return <p>Loading cohort…</p>;

  if (error && !cohort) {
    return (
      <Card>
        <p style={{ color: theme.colors.error, margin: 0 }}>Error: {error}</p>
        <div style={{ marginTop: theme.spacing.md }}>
          <Link to="/cohorts" style={{ textDecoration: 'none' }}>
            <Button variant="outline" size="sm">← Back to List</Button>
          </Link>
        </div>
      </Card>
    );
  }

  if (!cohort) return null;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md, marginBottom: theme.spacing.lg }}>
        <Link to="/cohorts" style={{ textDecoration: 'none' }}>
          <Button variant="outline" size="sm">← Back</Button>
        </Link>
        <h1 style={{ margin: 0 }}>Cohort Detail</h1>
      </div>

      {error && (
        <Card>
          <p style={{ color: theme.colors.error, margin: 0 }}>Error: {error}</p>
        </Card>
      )}

      <Card title={editing ? 'Edit Cohort' : cohort.name}>
        {editing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
            <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Cohort name" />
            <Input label="Description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
            <div style={{ display: 'flex', gap: theme.spacing.sm }}>
              <Button variant="primary" size="sm" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : 'Save'}
              </Button>
              <Button variant="outline" size="sm" onClick={() => { setEditing(false); setName(cohort.name); setDescription(cohort.description); }}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <p><strong>ID:</strong> {cohort.id}</p>
            <p><strong>Name:</strong> {cohort.name}</p>
            <p><strong>Description:</strong> {cohort.description || '—'}</p>
            <p><strong>Expression Type:</strong> {cohort.expressionType}</p>
            <p><strong>Created:</strong> {cohort.createdDate || '—'}</p>
            <p><strong>Modified:</strong> {cohort.modifiedDate || '—'}</p>
            <div style={{ display: 'flex', gap: theme.spacing.sm, marginTop: theme.spacing.md }}>
              <Button variant="primary" size="sm" onClick={() => setEditing(true)}>Edit</Button>
              <Button variant="secondary" size="sm" onClick={handleDelete}>Delete</Button>
            </div>
          </div>
        )}
      </Card>

      <Card title="Expression (JSON)">
        <pre style={{ margin: 0, fontSize: theme.typography.fontSize.sm, overflow: 'auto', maxHeight: '300px' }}>
          {JSON.stringify(cohort.expression, null, 2)}
        </pre>
      </Card>
    </div>
  );
}
