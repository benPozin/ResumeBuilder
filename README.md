# Resume Builder

A modern, full-stack resume builder application with a beautiful React/Next.js frontend and Python backend for generating professional DOCX and PDF resumes.

## Features

- 🎨 **Modern UI**: Beautiful, responsive interface built with Next.js, React, and Tailwind CSS
- 🌓 **Dark Mode**: Seamless dark/light theme switching
- 📝 **Live Preview**: Real-time preview of your resume as you type
- 📄 **Multiple Formats**: Generate resumes in both DOCX and PDF formats
- 🎯 **User-Friendly**: Intuitive forms for all resume sections
- ⚡ **Fast**: Built with Next.js 16 and React 19 for optimal performance

## Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **Theme Provider** - Dark/light mode support

### Backend
- **Python 3** - Core logic
- **python-docx** - DOCX generation
- **pypdf** - PDF manipulation
- **docx2pdf** - DOCX to PDF conversion

## Project Structure

```
ResumeBuilder/
├── frontend/              # Next.js application
│   ├── app/              # Next.js app directory
│   │   ├── api/          # API routes
│   │   ├── page.tsx      # Main page
│   │   └── layout.tsx    # Root layout
│   ├── components/       # React components
│   └── package.json      # Frontend dependencies
├── resume_builder.py     # Python resume generation logic
├── positions.py          # Sample data
├── requirements.txt      # Python dependencies
└── README.md            # This file
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- macOS (for PDF generation - requires Microsoft Word)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/benPozin/ResumeBuilder.git
   cd ResumeBuilder
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

1. **Fill out the form**: Enter your personal information, work experience, skills, and education
2. **Preview**: See your resume update in real-time in the preview panel
3. **Generate**: Click "Generate DOCX" or "Generate PDF" to create your resume file
4. **Download**: Your resume will be automatically downloaded

## Deployment

### Vercel (Frontend)

The frontend is configured to deploy on Vercel. The `vercel.json` file tells Vercel that the Next.js app is in the `frontend` directory.

**Important**: In your Vercel project settings, set:
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

Or simply connect your GitHub repository and Vercel will auto-detect the Next.js app.

### Backend API

The API routes in `frontend/app/api/` handle resume generation by calling the Python scripts. These work seamlessly on Vercel's serverless functions.

## Development

### Running Locally

```bash
# Terminal 1: Frontend
cd frontend
npm run dev

# Terminal 2: Backend (optional - only needed if using Flask)
cd ..
python3 app.py
```

### Building for Production

```bash
cd frontend
npm run build
npm start
```

## Configuration

### Theme Customization

The theme colors can be customized in `frontend/app/globals.css`:

```css
@theme {
  --color-dark-bg: #0a0a0a;
  --color-dark-surface: #111111;
  --color-dark-card: #1a1a1a;
  --color-dark-border: #2a2a2a;
  --color-dark-text: #e5e5e5;
  --color-dark-text-muted: #a3a3a3;
}
```

## Troubleshooting

### PDF Generation Issues

- **macOS**: PDF generation requires Microsoft Word to be installed
- **File Permissions**: You may be prompted to grant file access permissions
- **Alternative**: Generate DOCX and convert manually using Word or online tools

### Build Errors

- Ensure all dependencies are installed: `npm install` in the frontend directory
- Clear Next.js cache: `rm -rf frontend/.next`
- Check Node.js version: Requires Node.js 18+

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Author

**Ben Pozin**
- GitHub: [@benPozin](https://github.com/benPozin)
