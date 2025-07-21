import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';

const BulkFiller = ({ pdfBytes, csvRows, selectedFields, onAllPdfsFilled }) => {
  const [loading, setLoading] = useState(false);

  const handleFill = async () => {
  setLoading(true);
  const filledPdfUrls = [];

  for (const row of csvRows) {
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const form = pdfDoc.getForm();

    selectedFields.forEach((field) => {
      try {
        const value = row[field] || '';
        form.getTextField(field).setText(value);
      } catch (e) {
        console.warn(`Field ${field} not found in form`);
      }
    });

    // 🧊 FLATTEN the form to make fields uneditable
    form.flatten();

    const pdfData = await pdfDoc.save();
    const blob = new Blob([pdfData], { type: 'application/pdf' });
    filledPdfUrls.push(URL.createObjectURL(blob));
  }

  onAllPdfsFilled(filledPdfUrls);
  setLoading(false);
};

  return (
    <div>
      <button onClick={handleFill} disabled={loading}>
        {loading ? 'Filling PDFs...' : 'Fill Forms'}
      </button>
    </div>
  );
};

export default BulkFiller;
