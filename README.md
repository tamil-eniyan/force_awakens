# force_awakens
something in the on the side for a friend
# PDF Mailer Frontend

A React.js frontend that allows users to:

* Upload a fillable PDF and display its fields.
* Upload a CSV file containing recipient data.
* Match CSV columns with PDF fields.
* Fill PDFs dynamically for each row.
* Compose personalized emails using `{placeholders}` based on CSV data.
* Preview emails with subject, body, and attached PDFs.
* Send emails one by one using a FastAPI backend via SMTP.
* Monitor sending status with progress and success feedback.

---

## 🧰 Tech Stack

* **React** + **Vite**
* **Quill** (rich text editor)
* **Axios** (for HTTP requests)
* **CSV parser**
* **FastAPI** (for backend)
* **SMTP** (Gmail app password)

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/pdf-mailer-frontend.git
cd pdf-mailer-frontend
```

### 2. Install Dependencies

```bash
npm install
```

If you see errors about `axios`, make sure it's installed:

```bash
npm install axios
```

### 3. Start the App

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 📝 Features

* **Form Matching**: Match CSV headers with PDF form fields.
* **Variable Insertion**: Insert variables like `{name}` into subject or body.
* **HTML Email Support**: Use rich text with inline placeholders.
* **Email Column Selection**: Select which CSV column contains recipient emails.
* **Live Status**: Ping backend every 5 seconds to check availability.
* **Progress + Logs**: View sending progress, errors, and live status messages.
* **Do Not Reload Warning**: Safe sending mechanism with feedback UI.

---

## ⚙️ Backend Setup (FastAPI)

Make sure the FastAPI server is running on `https://emailsender-te8v.onrender.com`.

See [backend README](../backend/README.md) for setup instructions.

---

## 📦 Folder Structure

```
src/
├── components/
│   ├── EmailSender.jsx
│   ├── RichTextEditor.jsx
│   └── ...
├── App.jsx
├── main.jsx
└── ...
```

---

## 📁 Example Files

Sample CSV and fillable PDF examples are included in the `test_DF/` folder.

```
test_DF/
├── sample.csv        # Sample CSV file with data
└── sample_form.pdf   # Fillable PDF file with form fields
```

---

## 🛂 Gmail App Password

To send emails via Gmail:

1. Enable 2-Step Verification: [https://myaccount.google.com/security](https://myaccount.google.com/security)
2. Generate an App Password under "Security > App passwords"
3. Use that app password instead of your regular password.

---

## ✅ Future Improvements

* Drag & drop file upload
* Email sending scheduler
* Analytics dashboard
* File saving options

---

## 📄 License

MIT License. Free to use with attribution.
