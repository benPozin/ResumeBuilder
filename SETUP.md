# Resume Builder - Setup Guide

This application consists of a **Flask backend API** and a **Next.js frontend** with Tailwind CSS. Follow these steps to get everything running.

## Prerequisites

- Python 3.7+ installed
- Node.js 18+ and npm installed

## Installation & Setup

### 1. Install Python Dependencies

```bash
# From the project root directory
python3 -m pip install -r requirements.txt
```

This installs:
- `flask` - Web framework for the API
- `flask-cors` - Enables CORS for Next.js frontend
- `python-docx` - For generating Word documents
- `pypdf` - For PDF manipulation
- `docx2pdf` - For converting DOCX to PDF

### 2. Install Frontend Dependencies

```bash
# Navigate to frontend directory
cd frontend
npm install
```

This installs:
- Next.js 16 (React framework)
- React 19
- TypeScript
- Tailwind CSS 4 (with @tailwindcss/postcss)
- ESLint

## Running the Application

### Start the Backend (Terminal 1)

```bash
# From the project root directory
python3 app.py
```

The Flask API will run on `http://localhost:5000`

### Start the Frontend (Terminal 2)

```bash
# From the frontend directory
cd frontend
npm run dev
```

The Next.js app will run on `http://localhost:3000`

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. The app will automatically load sample data from your `positions.py` file
3. Edit any section of the resume:
   - **Header**: Name and contact information
   - **Summary**: Professional summary paragraph
   - **Work Experience**: Add/edit work positions with bullet points
   - **Skills**: Add skill categories with comma-separated skills
   - **Education**: Add educational background
4. Preview your resume in real-time on the right side
5. Click **Generate DOCX** or **Generate PDF** to download your resume

## Project Structure

```
ResumeBuilder/
├── app.py                 # Flask backend API
├── resume_builder.py      # Resume generation logic
├── positions.py           # Sample resume data
├── requirements.txt       # Python dependencies
├── frontend/              # Next.js application
│   ├── app/
│   │   ├── page.tsx      # Main page component
│   │   ├── layout.tsx    # Root layout
│   │   └── globals.css   # Global styles with Tailwind
│   ├── components/        # React components
│   │   ├── HeaderForm.tsx
│   │   ├── SummaryForm.tsx
│   │   ├── WorkExperienceForm.tsx
│   │   ├── SkillsForm.tsx
│   │   ├── EducationForm.tsx
│   │   └── ResumePreview.tsx
│   ├── package.json      # Node.js dependencies
│   └── postcss.config.mjs # PostCSS config with Tailwind
└── SETUP.md              # This file
```

## Technologies Used

### Backend
- **Flask**: Lightweight Python web framework
- **Flask-CORS**: Handles cross-origin requests
- **python-docx**: Generates Microsoft Word documents
- **docx2pdf**: Converts DOCX to PDF (requires LibreOffice on Linux)

### Frontend
- **Next.js 16**: React framework with App Router
- **React 19**: Modern UI library
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS 4**: Utility-first CSS framework with new PostCSS plugin
- **@tailwindcss/postcss**: PostCSS plugin for Tailwind CSS v4

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/sample-data` - Returns sample resume data
- `POST /api/generate-resume?format=docx|pdf` - Generates and downloads resume

## Features

✅ **Real-time Preview**: See your resume as you type
✅ **Dynamic Forms**: Add/remove work experience, skills, and education entries
✅ **Multiple Formats**: Generate DOCX or PDF files
✅ **Modern UI**: Beautiful, responsive design with Tailwind CSS
✅ **Sample Data**: Pre-loaded with example resume data
✅ **TypeScript**: Full type safety for better development experience
✅ **Next.js App Router**: Modern React routing and server components

## Troubleshooting

### Backend Issues
- **Port 5000 already in use**: Change the port in `app.py` (last line)
- **PDF conversion fails**: Ensure LibreOffice is installed (for Linux) or use DOCX format

### Frontend Issues
- **Port 3000 already in use**: Next.js will automatically use the next available port (3001, 3002, etc.)
- **CORS errors**: Ensure Flask-CORS is installed and the backend is running
- **API connection fails**: Check that the backend is running on `http://localhost:5000`
- **TypeScript errors**: Run `npm run build` to check for type errors

### Build for Production

```bash
# Build the Next.js app
cd frontend
npm run build

# Start production server
npm start

# The built files will be optimized and ready for deployment
```

## Next Steps

- Add authentication for saving resumes
- Add resume templates
- Export to other formats (HTML, LaTeX)
- Add drag-and-drop reordering for sections
- Deploy to Vercel (Next.js) and Heroku/Railway (Flask)
