/**
 * Sanitizes a value against CSV formula injection (CSV injection / formula injection attacks)
 * If the value starts with =, +, -, @, \t, or \r, prefix with a single quote.
 */
export function sanitizeCsvValue(val) {
  if (val === null || val === undefined) return '';
  let str = String(val);

  // If text starts with risky formula triggers
  if (/^[=+\-@\t\r]/.test(str)) {
    str = `'${str}`;
  }

  // Escape double quotes by doubling them
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    str = `"${str.replace(/"/g, '""')}"`;
  }

  return str;
}

export function generateCsv(headers, rows) {
  const headerLine = headers.map(h => sanitizeCsvValue(h.label)).join(',');
  const rowLines = rows.map(row => {
    return headers.map(h => sanitizeCsvValue(row[h.key])).join(',');
  });

  return [headerLine, ...rowLines].join('\r\n');
}
