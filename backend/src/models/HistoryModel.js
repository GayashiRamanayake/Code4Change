// Very light validation; no extra libs to keep it simple.
export function validateHistoryInput(payload) {
  const errors = [];
  const required = ["date", "name", "category", "stock", "usage", "value"];

  for (const k of required) {
    if (payload[k] === undefined || payload[k] === null || payload[k] === "") {
      errors.push(`${k} is required`);
    }
  }

  if (payload.date && !/^\d{4}-\d{2}-\d{2}$/.test(payload.date)) {
    errors.push("date must be in YYYY-MM-DD format");
  }

  return { ok: errors.length === 0, errors };
}

export function toHistoryRecord(payload) {
  return {
    name: String(payload.name),
    category: String(payload.category),
    stock: String(payload.stock),
    usage: String(payload.usage),
    value: String(payload.value),
    lastUpdated: payload.date,
  };
}
