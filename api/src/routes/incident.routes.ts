import { Router } from "express";
import { pool } from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import { HttpError } from "../middleware/errorHandler.js";
import { validate } from "../middleware/validate.js";
import {
  createIncidentSchema,
  updateIncidentSchema,
} from "../schemas/incident.zod.js";

interface IncidentRow {
  id: number;
  title: string;
  description: string;
  severity: string;
  status: string;
  user_id: number;
  created_at: Date;
  updated_at: Date;
}

function toIncident(row: IncidentRow) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    severity: row.severity,
    status: row.status,
    userId: row.user_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const incidentRouter = Router();

incidentRouter.use(requireAuth);

incidentRouter.post("/incidents", validate(createIncidentSchema), async (req, res) => {
  const { title, description, severity } = req.body;

  const { rows } = await pool.query<IncidentRow>(
    `INSERT INTO incidents (title, description, severity, status, user_id)
     VALUES ($1, $2, $3, 'open', $4)
     RETURNING *`,
    [title, description ?? "", severity, req.userId],
  );

  res.status(201).json(toIncident(rows[0]));
});

incidentRouter.get("/incidents", async (req, res) => {
  const { rows } = await pool.query<IncidentRow>(
    "SELECT * FROM incidents WHERE user_id = $1 ORDER BY created_at DESC",
    [req.userId],
  );

  res.json(rows.map(toIncident));
});

incidentRouter.patch("/incidents/:id", validate(updateIncidentSchema), async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    throw new HttpError(400, "Invalid incident id");
  }

  const updates: string[] = [];
  const params: unknown[] = [id, req.userId];

  for (const key of ["severity", "status"] as const) {
    if (req.body[key] !== undefined) {
      params.push(req.body[key]);
      updates.push(`${key} = $${params.length}`);
    }
  }

  if (updates.length === 0) {
    throw new HttpError(400, "Nothing to update");
  }

  updates.push("updated_at = now()");

  const { rows, rowCount } = await pool.query<IncidentRow>(
    `UPDATE incidents
     SET ${updates.join(", ")}
     WHERE id = $1 AND user_id = $2
     RETURNING *`,
    params,
  );

  if (rowCount === 0) {
    throw new HttpError(404, "Incident not found");
  }

  res.json(toIncident(rows[0]));
});

incidentRouter.delete("/incidents/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    throw new HttpError(400, "Invalid incident id");
  }

  const { rowCount } = await pool.query(
    "DELETE FROM incidents WHERE id = $1 AND user_id = $2",
    [id, req.userId],
  );

  if (rowCount === 0) {
    throw new HttpError(404, "Incident not found");
  }

  res.status(204).end();
});