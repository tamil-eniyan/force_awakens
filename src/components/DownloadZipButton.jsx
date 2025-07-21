import React from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const DownloadZipButton = ({ pdfFiles }) => {
  const handleDownload = async () => {
    const zip = new JSZip();

    pdfFiles.forEach(({ name, blob }) => {
      zip.file(name, blob);
    });

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    saveAs(zipBlob, 'filled_pdfs.zip');
  };

  return (
    <button onClick={handleDownload} style={{ marginTop: 10 }}>
      📥 Download All as ZIP
    </button>
  );
};

export default DownloadZipButton;
