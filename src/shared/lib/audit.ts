import { query } from "./db";

export async function logAudit(params: {
  actorId: string | null;
  action: string;
  entityType: string;
  entityId: string;
  changes?: Record<string, unknown> | object | null;
}) {
  const { actorId, action, entityType, entityId, changes } = params;
  await query(
    "insert into audit_logs (actor_id, action, entity_type, entity_id, changes) values ($1, $2, $3, $4, $5)",
    [actorId, action, entityType, entityId, changes ? JSON.stringify(changes) : null]
  );
}

export async function logAvailabilityChange(params: {
  kotId: string;
  oldStatus: string;
  newStatus: string;
  changedBy: string | null;
}) {
  const { kotId, oldStatus, newStatus, changedBy } = params;
  await query(
    "insert into availability_history (kot_id, old_status, new_status, changed_by) values ($1, $2, $3, $4)",
    [kotId, oldStatus, newStatus, changedBy]
  );
}

