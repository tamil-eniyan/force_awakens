import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';

const BulkFiller = ({ pdfBytes, csvRows, selectedFields, nameColumn, onAllPdfsFilled }) => {
  const [loading, setLoading] = useState(false);

  const handleFill = async () => {
    setLoading(true);
    const files = [];

    for (const row of csvRows) {
      // ✅ Skip rows that don't have a valid name column
      const rawName = row?.[nameColumn]?.toString().trim();
      if (!rawName) {
        console.warn("Skipping row with missing name column value");
        continue;
      }

      try {
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

        form.flatten(); // 🔐 Make fields uneditable
        const pdfBytesFilled = await pdfDoc.save();
        const blob = new Blob([pdfBytesFilled], { type: 'application/pdf' });

        files.push({ name: `${rawName}.pdf`, blob });
      } catch (e) {
        console.error(`Error processing row for ${rawName}:`, e);
      }
    }

    onAllPdfsFilled(files);
    setLoading(false);
  };

  return (
    <div>
      <button onClick={handleFill} disabled={loading || !nameColumn}>
        {loading ? 'Filling...' : 'Fill Forms'}
      </button>
    </div>
  );
};

export default BulkFiller;
