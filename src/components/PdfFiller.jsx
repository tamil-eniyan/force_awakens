import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';

const PdfFiller = ({ csvData, pdfBytes }) => {
  const [pdfUrl, setPdfUrl] = useState(null);

  const fillPdf = async () => {
    if (!csvData || !pdfBytes) {
      alert('Please upload both CSV and PDF.');
      return;
    }

    try {
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const form = pdfDoc.getForm();

      Object.keys(csvData).forEach((key) => {
        try {
          const field = form.getTextField(key);
          field.setText(csvData[key]);
        } catch {
          console.warn(`Field "${key}" not found in PDF`);
        }
      });

      const filledBytes = await pdfDoc.save();
      const blob = new Blob([filledBytes], { type: 'application/pdf' });
      setPdfUrl(URL.createObjectURL(blob));
    } catch (err) {
      alert('Could not parse the PDF. Make sure it’s fillable.');
      console.error(err);
    }
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <button onClick={fillPdf}>Fill PDF</button>
      {pdfUrl && (
        <iframe
          src={pdfUrl}
          width="100%"
          height="600px"
          title="Filled PDF Preview"
        />
      )}
    </div>
  );
};

export default PdfFiller;
