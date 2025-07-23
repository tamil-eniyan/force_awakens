import React from 'react';

const FieldMapper = ({ pdfFields, csvHeaders, selectedFields, onSelectField, fieldFonts, onFontUpload }) => {
  return (
    <div>
      <h4>Match CSV Headers to PDF Fields</h4>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {csvHeaders.map((header, i) => {
          const isMatch = pdfFields.includes(header);
          const hasFont = fieldFonts[header];

          return (
            <li key={i} style={{ color: isMatch ? 'green' : 'red', marginBottom: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  disabled={!isMatch}
                  checked={selectedFields.includes(header)}
                  onChange={() => onSelectField(header)}
                />
                {header} {isMatch ? '✅' : '❌ (not in PDF)'}

                {isMatch && (
                  <>
                    <input
                      type="file"
                      accept=".ttf"
                      onChange={(e) => {
                        if (e.target.files.length > 0) {
                          onFontUpload(header, e.target.files[0]);
                        }
                      }}
                      style={{ fontSize: '0.9rem' }}
                    />
                    {hasFont && <span style={{ fontSize: '0.9rem', color: '#555' }}>🎨 Font selected</span>}
                  </>
                )}
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default FieldMapper;
