import React, { useState } from 'react';
import { PDFDocument, StandardFonts } from 'pdf-lib';

const BulkFiller = ({ pdfBytes, csvRows, selectedFields, nameColumn, onAllPdfsFilled, fieldFonts }) => {
  const [loading, setLoading] = useState(false);

  const handleFill = async () => {
    setLoading(true);
    const files = [];

    for (const row of csvRows) {
      const rawName = row?.[nameColumn]?.toString().trim();
      if (!rawName) {
        console.warn("Skipping row with missing name column value");
        continue;
      }

      try {
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const form = pdfDoc.getForm();

        const fontCache = {};

        for (const field of selectedFields) {
          try {
            const value = row[field] || '';
            const textField = form.getTextField(field);
            textField.setText(value);

            const fontBuffer = fieldFonts?.[field];
            if (fontBuffer) {
              if (!fontCache[field]) {
                fontCache[field] = await pdfDoc.embedFont(fontBuffer);
              }
              textField.updateAppearances(fontCache[field]);
            }
          } catch (e) {
            console.warn(`Field ${field} not found in form`);
          }
        }

        form.flatten();
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
    <div style={{ marginTop: 10 }}>
      <button onClick={handleFill} disabled={loading || !nameColumn}>
        {loading ? 'Filling...' : 'Fill Forms'}
      </button>
    </div>
  );
};

export default BulkFiller;
