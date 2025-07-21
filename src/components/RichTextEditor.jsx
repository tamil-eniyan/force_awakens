// src/components/RichTextEditor.jsx
import React, { useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './richtext.css';

const RichTextEditor = ({ value, onChange }) => {
  const quillRef = useRef(null);

  const handleInsertVariable = (variable) => {
    const editor = quillRef.current?.getEditor();
    if (!editor) return;

    const cursorPosition = editor.getSelection()?.index || 0;
    const text = `{${variable}}`;

    // Insert with custom span for styling
    editor.insertEmbed(cursorPosition, 'text', '', 'user');
    editor.clipboard.dangerouslyPasteHTML(
      cursorPosition,
      `<span class="var-highlight">${text}</span>`,
      'user'
    );
    editor.setSelection(cursorPosition + text.length);
  };

  const variableList = ['name', 'email', 'phoneno'];

  return (
    <div>
      <div style={{ marginBottom: 10 }}>
        <label><strong>Available Variables:</strong></label>{' '}
        {variableList.map((v) => (
          <button
            key={v}
            type="button"
            style={{
              marginRight: 6,
              padding: '4px 8px',
              fontSize: 12,
              background: '#f0f0f0',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer',
              color: 'black',
            }}
            onClick={() => handleInsertVariable(v)}
          >
            {`{${v}}`}
          </button>
        ))}
      </div>
      <ReactQuill
        ref={quillRef}
        value={value}
        onChange={onChange}
        theme="snow"
        modules={{
          toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline'],
            ['link'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['clean'],
          ]
        }}
        formats={[
          'header', 'bold', 'italic', 'underline', 'link', 'list', 'bullet'
        ]}
      />
    </div>
  );
};

export default RichTextEditor;
