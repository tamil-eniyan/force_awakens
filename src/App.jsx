import React, { useState } from 'react';
import PdfUploader from './components/PdfUploader';
import CsvUploader from './components/CsvUploader';
import FieldMapper from './components/FieldMapper';
import BulkFiller from './components/BulkFiller';
import PdfPreviewer from './components/PdfPreviewer';

const App = () => {
  const [pdfBytes, setPdfBytes] = useState(null);
  const [pdfFields, setPdfFields] = useState([]);

  const [csvHeaders, setCsvHeaders] = useState([]);
  const [csvRows, setCsvRows] = useState([]);

  const [selectedFields, setSelectedFields] = useState([]);
  const [filledPdfUrls, setFilledPdfUrls] = useState([]);

  const handleCsvParsed = (headers, rows) => {
    setCsvHeaders(headers);
    setCsvRows(rows);
    const matched = headers.filter((h) => pdfFields.includes(h));
    setSelectedFields(matched);
  };

  const toggleFieldSelection = (field) => {
    setSelectedFields((prev) =>
      prev.includes(field)
        ? prev.filter((f) => f !== field)
        : [...prev, field]
    );
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: '20px',
        padding: '20px',
        height: '100vh',
        boxSizing: 'border-box'
      }}
    >
      {/* Left: PDF Panel */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          borderRight: '1px solid #ddd',
          paddingRight: '20px'
        }}
      >
        <h2>📄 Uploaded PDF</h2>
        <PdfUploader
          onPdfLoaded={setPdfBytes}
          onFieldNamesExtracted={setPdfFields}
        />
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

      {/* Right: CSV & Actions */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <h2>📥 CSV Upload & Field Matching</h2>
        <CsvUploader onCsvParsed={handleCsvParsed} />

        {csvHeaders.length > 0 && (
          <FieldMapper
            pdfFields={pdfFields}
            csvHeaders={csvHeaders}
            selectedFields={selectedFields}
            onSelectField={toggleFieldSelection}
          />
        )}

        {pdfBytes && csvRows.length > 0 && selectedFields.length > 0 && (
          <BulkFiller
            pdfBytes={pdfBytes}
            csvRows={csvRows}
            selectedFields={selectedFields}
            onAllPdfsFilled={setFilledPdfUrls}
          />
        )}

        {filledPdfUrls.length > 0 && (
          <div style={{ marginTop: '30px' }}>
            <h4>Preview Filled PDFs</h4>
            <PdfPreviewer pdfUrls={filledPdfUrls} />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
