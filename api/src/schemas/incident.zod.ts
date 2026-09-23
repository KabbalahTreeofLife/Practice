import { z } from "zod";

const severityEnum = z.enum(["low", "medium", "high", "critical"]);
const statusEnum = z.enum(["open", "in-progress", "resolved"]);

export const createIncidentSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().max(2000).optional(),
  severity: severityEnum,
});

export const updateIncidentSchema = z.object({
  severity: severityEnum.optional(),
  status: statusEnum.optional(),
});