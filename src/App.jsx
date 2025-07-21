import React, { useState } from 'react';
import PdfUploader from './components/PdfUploader';
import CsvUploader from './components/CsvUploader';
import FieldMapper from './components/FieldMapper';
import BulkFiller from './components/BulkFiller';
import PdfPreviewer from './components/PdfPreviewer';
import DownloadZipButton from './components/DownloadZipButton';
import EmailSender from './components/EmailSender'; // <- NEW

const App = () => {
  const [pdfBytes, setPdfBytes] = useState(null);
  const [pdfFields, setPdfFields] = useState([]);

  const [csvHeaders, setCsvHeaders] = useState([]);
  const [csvRows, setCsvRows] = useState([]);

  const [selectedFields, setSelectedFields] = useState([]);
  const [nameColumn, setNameColumn] = useState('');
  const [pdfFiles, setPdfFiles] = useState([]); // [{ name, blob }]

  const handleCsvParsed = (headers, rows) => {
    setCsvHeaders(headers);
    setCsvRows(rows);
    const matched = headers.filter((h) => pdfFields.includes(h));
    setSelectedFields(matched);
  };

  const toggleFieldSelection = (field) => {
    setSelectedFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  };

  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px', height: '100vh', boxSizing: 'border-box' }}>
      {/* LEFT SECTION - PDF */}
      <div style={{ flex: 1, overflow: 'auto', borderRight: '1px solid #ddd', paddingRight: '20px' }}>
        <h2>📄 Uploaded PDF</h2>
        <PdfUploader onPdfLoaded={setPdfBytes} onFieldNamesExtracted={setPdfFields} />
        {pdfBytes && (
          <iframe
            title="Uploaded PDF"
            src={URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' }))}
            width="100%"
            height="500px"
            style={{ border: '1px solid #ccc', borderRadius: 8 }}
          />
        )}
        {pdfFields.length > 0 && (
          <div style={{ marginTop: '10px' }}>
            <strong>Detected PDF Fields:</strong>
            <ul>
              {pdfFields.map((field, i) => (
                <li key={i}>{field}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* RIGHT SECTION - CSV + Email */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <h2>📥 CSV Upload & Field Matching</h2>
        <CsvUploader onCsvParsed={handleCsvParsed} />

        {csvHeaders.length > 0 && (
          <>
            <label style={{ fontWeight: 'bold' }}>Choose column for PDF filenames:</label>
            <select
              value={nameColumn}
              onChange={(e) => setNameColumn(e.target.value)}
              style={{ marginBottom: '10px' }}
            >
              <option value="">-- Select Column --</option>
              {csvHeaders.map((col) => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>

            <FieldMapper
              pdfFields={pdfFields}
              csvHeaders={csvHeaders}
              selectedFields={selectedFields}
              onSelectField={toggleFieldSelection}
            />
          </>
        )}

        {pdfBytes && csvRows.length > 0 && selectedFields.length > 0 && nameColumn && (
          <BulkFiller
            pdfBytes={pdfBytes}
            csvRows={csvRows}
            selectedFields={selectedFields}
            nameColumn={nameColumn}
            onAllPdfsFilled={setPdfFiles}
          />
        )}

        {pdfFiles.length > 0 && (
          <>
            <DownloadZipButton pdfFiles={pdfFiles} />
            <PdfPreviewer pdfUrls={pdfFiles.map(f => URL.createObjectURL(f.blob))} />
            <EmailSender filledPdfs={pdfFiles} csvRows={csvRows} /> {/* ← NEW */}
          </>
        )}
      </div>
    </div>
  );
};

export default App;
