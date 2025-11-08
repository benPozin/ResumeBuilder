import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'
import fs from 'fs'
import { writeFile, unlink } from 'fs/promises'

const execAsync = promisify(exec)

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const format = request.nextUrl.searchParams.get('format') || 'docx'
    
    // process.cwd() in Next.js API routes is the frontend directory
    // Go up one level to get to ResumeBuilder root
    const projectRoot = path.join(process.cwd(), '..')
    const tempDir = path.join(projectRoot, 'temp')
    
    // Create temp directory if it doesn't exist
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true })
    }
    
    // Generate a unique filename with timestamp and random component
    const baseName = (data.name || 'resume').replace(/[^a-zA-Z0-9]/g, '_') || 'resume'
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(2, 9) // Add random component for uniqueness
    const uniqueId = `${timestamp}_${randomId}`
    const filename = `${baseName}_${uniqueId}`
    const docxPath = path.join(tempDir, `${filename}.docx`)
    const pdfPath = path.join(tempDir, `${filename}.pdf`)
    const scriptPath = path.join(tempDir, `generate_${uniqueId}.py`)
    const dataPath = path.join(tempDir, `data_${uniqueId}.json`)
    
    // Write data to JSON file
    await writeFile(dataPath, JSON.stringify(data))
    
    // Create Python script file
    const pythonScript = `import sys
import json
import os
import contextlib
from io import StringIO

# Redirect print statements to stderr so they don't interfere with stdout
print_output = StringIO()
@contextlib.contextmanager
def redirect_stdout(stream):
    old_stdout = sys.stdout
    sys.stdout = stream
    try:
        yield
    finally:
        sys.stdout = old_stdout

sys.path.insert(0, r'${projectRoot.replace(/\\/g, '/')}')

from resume_builder import Resume

# Load data from JSON file
with open(r'${dataPath.replace(/\\/g, '/')}', 'r') as f:
    data = json.load(f)

# Create resume
resume = Resume()

# Add header
resume.add_header(
    data.get('name', ''),
    data.get('contact_info', '')
)

# Add summary
if data.get('summary'):
    resume.add_summary(data['summary'])

# Add work experience
if data.get('work_experience'):
    resume.add_work_experience_title()
    for position in data['work_experience']:
        resume.add_work_experience(
            position.get('company', ''),
            position.get('title', ''),
            position.get('dates', ''),
            position.get('items', [])
        )

# Add skills
if data.get('skills'):
    resume.add_skills_title()
    for skill_section in data['skills']:
        skill_para = resume.doc.add_paragraph()
        skill_title = skill_para.add_run(f"{skill_section.get('section_title', '')}: ")
        skill_title.bold = True
        skill_para.add_run(skill_section.get('skills', ''))

# Add education
if data.get('education'):
    resume.add_education_title()
    for edu_item in data['education']:
        resume.add_work_experience(
            edu_item.get('institution', ''),
            edu_item.get('degree', ''),
            edu_item.get('dates', ''),
            []
        )

# Save resume (redirect print to stderr)
with redirect_stdout(print_output):
    resume.save(r'${docxPath.replace(/\\/g, '/')}')

# Convert to PDF if requested
if '${format}' == 'pdf':
    try:
        with redirect_stdout(print_output):
            success = resume.save_as_pdf(r'${docxPath.replace(/\\/g, '/')}', r'${pdfPath.replace(/\\/g, '/')}')
        if success and os.path.exists(r'${pdfPath.replace(/\\/g, '/')}'):
            print(r'${pdfPath.replace(/\\/g, '/')}')
        else:
            # Fallback to DOCX if PDF conversion fails
            print('DOCX_FALLBACK:' + r'${docxPath.replace(/\\/g, '/')}')
    except Exception as e:
        # Fallback to DOCX on any error
        print('DOCX_FALLBACK:' + r'${docxPath.replace(/\\/g, '/')}')
else:
    print(r'${docxPath.replace(/\\/g, '/')}')
`
    
    await writeFile(scriptPath, pythonScript)
    
    // Execute Python script
    const { stdout, stderr } = await execAsync(
      `cd "${projectRoot}" && python3 "${scriptPath}"`
    )
    
    if (stderr && !stderr.includes('Ignoring wrong pointing object')) {
      console.error('Python stderr:', stderr)
    }
    
    // Extract the file path from stdout (should be just the path now)
    let outputPath = stdout.trim()
    let actualFormat = format
    
    // Check if PDF generation failed and fell back to DOCX
    if (outputPath.startsWith('DOCX_FALLBACK:')) {
      outputPath = outputPath.replace('DOCX_FALLBACK:', '').trim()
      actualFormat = 'docx'
      console.warn('PDF generation failed, falling back to DOCX')
    }
    
    if (!outputPath) {
      throw new Error(`No output from Python script. Stderr: ${stderr}`)
    }
    
    if (!fs.existsSync(outputPath)) {
      throw new Error(`Generated file not found: ${outputPath}. Output was: ${stdout}`)
    }
    
    // Read the file and return it
    const fileBuffer = fs.readFileSync(outputPath)
    const contentType = actualFormat === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    const extension = actualFormat === 'pdf' ? 'pdf' : 'docx'
    
    // Clean up temp files after a delay (non-blocking)
    setTimeout(async () => {
      try {
        if (fs.existsSync(outputPath)) await unlink(outputPath)
        if (actualFormat === 'pdf' && fs.existsSync(docxPath)) await unlink(docxPath)
        if (fs.existsSync(scriptPath)) await unlink(scriptPath)
        if (fs.existsSync(dataPath)) await unlink(dataPath)
      } catch (e) {
        console.error('Error cleaning up temp files:', e)
      }
    }, 5000)
    
    // Generate a clean download filename (without the unique ID for user-facing name)
    const downloadBaseName = (data.name || 'resume').replace(/[^a-zA-Z0-9]/g, '_') || 'resume'
    const now = new Date()
    const month = now.toLocaleString('en-US', { month: 'short' }) // Nov, Dec, etc.
    const day = String(now.getDate()).padStart(2, '0') // 08, 15, etc.
    const year = now.getFullYear()
    const hours = now.getHours()
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const hour12 = hours % 12 || 12 // Convert to 12-hour format
    const downloadTimestamp = `${month}-${day}-${year}_${hour12}-${minutes}${ampm}`
    const downloadFilename = `${downloadBaseName}_${downloadTimestamp}.${extension}`
    
    // If PDF generation failed, return DOCX with a note
    const response = new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${downloadFilename}"`,
      },
    })
    
    if (format === 'pdf' && actualFormat === 'docx') {
      // Add a header to indicate fallback
      response.headers.set('X-PDF-Fallback', 'true')
    }
    
    return response
  } catch (error) {
    console.error('Error generating resume:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate resume'
    const errorStack = error instanceof Error ? error.stack : undefined
    console.error('Full error details:', { errorMessage, errorStack, error })
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? errorStack : undefined
      },
      { status: 500 }
    )
  }
}

