import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RichTextEditor from './RichTextEditor';

const EmailSender = ({ filledPdfs, csvRows }) => {
  const [status, setStatus] = useState(false);
  const [senderEmail, setSenderEmail] = useState('');
  const [appPassword, setAppPassword] = useState('');
  const [subjectTemplate, setSubjectTemplate] = useState('Dear {name}, here is your file');
  const [bodyTemplate, setBodyTemplate] = useState('<p>Hi {name},</p><p>Please find the PDF attached.</p>');
  const [emailColumn, setEmailColumn] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [preparedData, setPreparedData] = useState([]);
  const [statusLog, setStatusLog] = useState([]);
  const [sending, setSending] = useState(false);
  const [currentSendingTo, setCurrentSendingTo] = useState('');
  const [progress, setProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await axios.get('https://emailsender-te8v.onrender.com/status');
        setStatus(res.data.status === 'OK');
      } catch {
        setStatus(false);
      }
    };
    checkStatus();
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const parsePlaceholders = (template, row) =>
    template.replace(/{(.*?)}/g, (_, key) => row[key.trim()] || '');

  const handlePreparePreview = () => {
    const prepared = filledPdfs.map((file, index) => {
      const row = csvRows[index];
      return {
        to: row[emailColumn],
        name: file.name,
        subject: parsePlaceholders(subjectTemplate, row),
        body: parsePlaceholders(bodyTemplate, row),
        blob: file.blob,
      };
    });
    setPreparedData(prepared);
    setShowPreview(true);
    setStatusLog([]);
    setShowSuccess(false);
  };

  const blobToBase64 = (blob) =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });

  const handleSend = async () => {
    setSending(true);
    setStatusLog([]);
    setProgress(0);
    setShowSuccess(false);

    for (let i = 0; i < preparedData.length; i++) {
      const item = preparedData[i];
      setCurrentSendingTo(item.to);

      const base64 = await blobToBase64(item.blob);

      const payload = {
        sender_email: senderEmail,
        app_password: appPassword,
        subject: item.subject,
        body: item.body,
        pdf: {
          to: item.to,
          name: item.name,
          base64,
        }
      };

      try {
        await axios.post('https://emailsender-te8v.onrender.com/send-email', payload);
        setStatusLog((prev) => [...prev, `✅ Email sent to ${item.to}`]);
      } catch (err) {
        console.error(err);
        setStatusLog((prev) => [...prev, `❌ Failed to send to ${item.to}`]);
      }

      setProgress(Math.round(((i + 1) / preparedData.length) * 100));
    }

    setSending(false);
    setCurrentSendingTo('');
    setShowSuccess(true);
  };

  return (
    <div style={{ marginTop: '30px', padding: '20px', borderTop: '1px solid #ccc' }}>
      <h3>Email Configuration</h3>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: status ? 'green' : 'red',
            marginRight: 10,
          }}
        ></div>
        <span>Email Service: {status ? 'Available' : 'Offline'}</span>
      </div>

      <input type="email" placeholder="Sender Email" value={senderEmail} onChange={(e) => setSenderEmail(e.target.value)} style={{ display: 'block', marginBottom: 10, width: '100%' }} disabled={sending} />
      <input type="password" placeholder="App Password" value={appPassword} onChange={(e) => setAppPassword(e.target.value)} style={{ display: 'block', marginBottom: 10, width: '100%' }} disabled={sending} />
      <input type="text" placeholder="Subject (supports {name})" value={subjectTemplate} onChange={(e) => setSubjectTemplate(e.target.value)} style={{ display: 'block', marginBottom: 10, width: '100%' }} disabled={sending} />

      <label style={{ marginTop: 10, fontWeight: 'bold', display: 'block' }}>Choose Email Column from CSV:</label>
      <select value={emailColumn} onChange={(e) => setEmailColumn(e.target.value)} style={{ marginBottom: 10, width: '100%' }} disabled={sending}>
        <option value="">-- Select Column --</option>
        {csvRows.length > 0 && Object.keys(csvRows[0]).map((col) => (
          <option key={col} value={col}>{col}</option>
        ))}
      </select>

      <label style={{ fontWeight: 'bold', marginTop: 10, display: 'block' }}>Available Variables:</label>
      <div style={{ marginBottom: 10, display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {csvRows.length > 0 && Object.keys(csvRows[0]).map((col) => (
          <button
            key={col}
            onClick={() => setBodyTemplate((prev) => prev + ` {${col}} `)}
            style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #ccc', background: '#f9f9f9', color: 'black', cursor: 'pointer' }}
            type="button"
            disabled={sending}
          >
            {'{'}{col}{'}'}
          </button>
        ))}
      </div>

      <RichTextEditor value={bodyTemplate} onChange={setBodyTemplate} />

      <div style={{ marginTop: 10 }}>
        <button onClick={handlePreparePreview} disabled={!status || !filledPdfs.length || !emailColumn || sending}>
          Preview Emails
        </button>
      </div>

      {showPreview && (
        <>
          <h4 style={{ marginTop: 20 }}>Preview</h4>
          <table border="1" cellPadding="6" style={{ width: '100%', marginTop: 10 }}>
            <thead>
              <tr>
                <th>Email</th>
                <th>Subject</th>
                <th>Body (Raw HTML)</th>
                <th>PDF Name</th>
              </tr>
            </thead>
            <tbody>
              {preparedData.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.to}</td>
                  <td>{item.subject}</td>
                  <td><code>{item.body}</code></td>
                  <td>{item.name}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={handleSend} disabled={sending}>
              {sending ? 'Sending...' : 'Send Emails'}
            </button>
            {sending && (
              <div style={{ flex: 1 }}>
                <div style={{ width: '100%', height: 10, backgroundColor: '#eee', borderRadius: 4, overflow: 'hidden', marginBottom: 4 }}>
                  <div style={{ height: '100%', width: `${progress}%`, backgroundColor: '#4caf50', transition: 'width 0.3s ease' }} />
                </div>
                <div style={{ fontSize: 12 }}>{progress}% complete ({statusLog.length} of {preparedData.length})</div>
              </div>
            )}
          </div>

          {sending && (
            <div style={{ marginTop: 15 }}>
              <strong>📤 Sending to {currentSendingTo}...</strong>
              <p style={{ color: 'red' }}>Do not close or reload the page while sending emails.</p>
              <div className="spinner" style={{ width: 20, height: 20, border: '3px solid #ccc', borderTop: '3px solid #333', borderRadius: '50%', animation: 'spin 1s linear infinite', marginTop: 10 }}></div>
            </div>
          )}

          {showSuccess && (
            <div style={{ marginTop: 20, padding: '10px', backgroundColor: '#e6ffed', border: '1px solid #b5f3c8', color: '#2b7a4b', borderRadius: 6 }}>
              🎉 All emails have been successfully sent!
            </div>
          )}

          <ul style={{ marginTop: 20 }}>
            {statusLog.map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        </>
      )}

      <style>
        {`@keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }`}
      </style>
    </div>
  );
};

export default EmailSender;
