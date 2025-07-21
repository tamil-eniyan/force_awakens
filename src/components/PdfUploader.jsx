import React from 'react';
import { PDFDocument } from 'pdf-lib';

const PdfUploader = ({ onPdfLoaded, onFieldNamesExtracted }) => {
  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== 'application/pdf') {
      alert("Please upload a valid PDF file");
      return;
    }

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = async () => {
      const pdfBytes = reader.result;
      const pdfDoc = await PDFDocument.load(pdfBytes);

      // Extract field names
      const form = pdfDoc.getForm();
      const fields = form.getFields();
      const fieldNames = fields.map(field => field.getName());

      onPdfLoaded(pdfBytes);
      onFieldNamesExtracted(fieldNames);
    };
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <label>Upload Fillable PDF:</label>
      <input type="file" accept="application/pdf" onChange={handlePdfUpload} />
    </div>
  );
};

export default PdfUploader;
