import React from 'react';

const FieldMapper = ({ pdfFields, csvHeaders, selectedFields, onSelectField }) => {
  return (
    <div>
      <h4>Match CSV Headers to PDF Fields</h4>
      <ul>
        {csvHeaders.map((header, i) => {
          const isMatch = pdfFields.includes(header);
          return (
            <li key={i} style={{ color: isMatch ? 'green' : 'red' }}>
              <input
                type="checkbox"
                disabled={!isMatch}
                checked={selectedFields.includes(header)}
                onChange={() => onSelectField(header)}
              />
              {header}
              {isMatch ? ' ✅' : ' ❌ (not in PDF)'}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default FieldMapper;
