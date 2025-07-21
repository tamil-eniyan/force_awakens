import React from 'react';

const PdfPreviewer = ({ pdfUrls }) => {
  return (
    <div>
      <h4>Filled PDF Previews</h4>
      {pdfUrls.map((url, index) => (
        <iframe
          key={index}
          src={url}
          width="100%"
          height="500px"
          title={`PDF Preview ${index}`}
          style={{ marginBottom: 30, border: '1px solid #ccc' }}
        />
      ))}
    </div>
  );
};

export default PdfPreviewer;
