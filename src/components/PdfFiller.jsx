import React, { useState } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const PdfFiller = ({ csvData, pdfBytes }) => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [fontFile, setFontFile] = useState(null);

  const fillPdf = async () => {
    if (!csvData || !pdfBytes) {
      alert('Please upload both CSV and PDF.');
      return;
    }

    try {
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const form = pdfDoc.getForm();

      // Load custom font if provided
      let customFont = null;
      if (fontFile) {
        const fontBytes = await fontFile.arrayBuffer();
        customFont = await pdfDoc.embedFont(fontBytes);
      }

      // Fill all matching fields
      Object.keys(csvData).forEach((key) => {
        try {
          const field = form.getTextField(key);
          field.setText(csvData[key]);
          if (customFont) {
            field.updateAppearances(customFont);
          }
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
      {/* Custom Font Upload */}
      <div style={{ margin: '20px 0', padding: '10px', border: '1px solid #ccc', borderRadius: 8 }}>
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: 5 }}>
          Optional: Upload Custom Font (.ttf or .otf)
        </label>
        <input
          type="file"
          accept=".ttf,.otf"
          onChange={(e) => setFontFile(e.target.files[0] || null)}
          style={{ display: 'block', marginTop: 5 }}
        />
        {fontFile && (
          <div style={{ marginTop: 5, color: 'green' }}>
            Selected Font: <strong>{fontFile.name}</strong>
          </div>
        )}
      </div>

      {/* Fill Button */}
      <button onClick={fillPdf} style={{ padding: '8px 16px', fontSize: 16 }}>
        Fill PDF
      </button>

      {/* Preview PDF */}
      {pdfUrl && (
        <iframe
          src={pdfUrl}
          width="100%"
          height="600px"
          title="Filled PDF Preview"
          style={{ marginTop: '20px', border: '1px solid #ccc' }}
        />
      )}
    </div>
  );
};

export default PdfFiller;
