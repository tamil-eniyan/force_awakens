import React from 'react';
import Papa from 'papaparse';

const CsvUploader = ({ onCsvParsed }) => {
  const handleCsv = (e) => {
    const file = e.target.files[0];
    if (!file || !file.name.endsWith('.csv')) return;

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const headers = results.meta.fields;
        const rows = results.data;
        onCsvParsed(headers, rows);
      },
    });
  };

  return (
    <div>
      <label>Upload CSV: </label>
      <input type="file" accept=".csv" onChange={handleCsv} />
    </div>
  );
};

export default CsvUploader;
