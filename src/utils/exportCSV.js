/**
 * Utility to convert array of objects into CSV format and trigger browser download
 */
export const downloadCSV = (filename, headers, rows) => {
  if (!rows || !rows.length) {
    alert('No data to export.');
    return;
  }

  // Escape special CSV characters
  const escapeCell = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return `"${str}"`;
  };

  const headerLine = headers.map(h => escapeCell(h.label)).join(',');
  const rowLines = rows.map(row => {
    return headers.map(h => escapeCell(row[h.key])).join(',');
  });

  const csvContent = [headerLine, ...rowLines].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
