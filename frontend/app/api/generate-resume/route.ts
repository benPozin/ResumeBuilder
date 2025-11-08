import { NextRequest, NextResponse } from 'next/server'
import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, TabStopType, TabStopPosition } from 'docx'
import fs from 'fs'
import { writeFile, unlink } from 'fs/promises'

// Helper function to create a paragraph with bottom border
function createParagraphWithBottomBorder(text: string, fontSize: number = 14): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: text.toUpperCase(),
        bold: true,
        size: fontSize * 2, // docx uses half-points
        font: 'Times New Roman',
      }),
    ],
    border: {
      bottom: {
        color: '000000',
        size: 6,
        space: 1,
        style: 'single' as const,
      },
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const format = request.nextUrl.searchParams.get('format') || 'docx'
    
    // In Vercel/serverless environments, use /tmp (only writable directory)
    const isVercel = process.env.VERCEL === '1' || !fs.existsSync(process.cwd() + '/../temp')
    const tempDir = isVercel ? '/tmp' : process.cwd() + '/../temp'
    
    // Create temp directory if it doesn't exist (only needed for local dev)
    if (!isVercel && !fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true })
    }
    
    // Generate a unique filename
    const baseName = (data.name || 'resume').replace(/[^a-zA-Z0-9]/g, '_') || 'resume'
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(2, 9)
    const uniqueId = `${timestamp}_${randomId}`
    const filename = `${baseName}_${uniqueId}`
    const docxPath = `${tempDir}/${filename}.docx`
    const pdfPath = `${tempDir}/${filename}.pdf`
    
    // Create document sections
    const children: Paragraph[] = []
    
    // Header: Name (centered, bold, large)
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: data.name || 'Your Name',
            bold: true,
            size: 60, // 30pt in half-points
            font: 'Times New Roman',
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 0 },
      })
    )
    
    // Header: Contact info (centered)
    if (data.contact_info) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: data.contact_info,
              size: 22, // 11pt in half-points
              font: 'Times New Roman',
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        })
      )
    }
    
    // Summary
    if (data.summary) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: data.summary,
              size: 22, // 11pt
              font: 'Times New Roman',
            }),
          ],
          spacing: { after: 400 },
        })
      )
    }
    
    // Work Experience
    if (data.work_experience && data.work_experience.length > 0) {
      children.push(createParagraphWithBottomBorder('RELEVANT WORK EXPERIENCE', 14))
      
      for (const exp of data.work_experience) {
        // Company name (bold)
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: exp.company || 'Company Name',
                bold: true,
                size: 26, // 13pt
                font: 'Times New Roman',
              }),
            ],
            spacing: { after: 0 },
          })
        )
        
        // Role and dates (with tab for right alignment)
        const roleText = exp.title || 'Job Title'
        const datesText = exp.dates || 'Date Range'
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: roleText,
                bold: true,
                italics: true,
                size: 22, // 11pt
                font: 'Times New Roman',
              }),
              new TextRun({
                text: '\t' + datesText,
                size: 22,
                font: 'Times New Roman',
              }),
            ],
            tabStops: [
              {
                type: TabStopType.RIGHT,
                position: TabStopPosition.MAX,
              },
            ],
            spacing: { after: 0 },
          })
        )
        
        // Bullet points
        if (exp.items && exp.items.length > 0) {
          for (const item of exp.items.filter((i: string) => i.trim())) {
            children.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: '• ' + item,
                    size: 22,
                    font: 'Times New Roman',
                  }),
                ],
                indent: { left: 400 },
                spacing: { after: 100 },
              })
            )
          }
        }
      }
    }
    
    // Skills
    if (data.skills && data.skills.length > 0) {
      children.push(createParagraphWithBottomBorder('SKILLS', 14))
      
      for (const skill of data.skills) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: (skill.section_title || 'Category') + ': ',
                bold: true,
                size: 22,
                font: 'Times New Roman',
              }),
              new TextRun({
                text: skill.skills || 'Skills list',
                size: 22,
                font: 'Times New Roman',
              }),
            ],
            spacing: { after: 0 },
          })
        )
      }
    }
    
    // Education
    if (data.education && data.education.length > 0) {
      children.push(createParagraphWithBottomBorder('EDUCATION', 14))
      
      for (const edu of data.education) {
        // Institution (bold)
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: edu.institution || 'Institution Name',
                bold: true,
                size: 26, // 13pt
                font: 'Times New Roman',
              }),
            ],
            spacing: { after: 0 },
          })
        )
        
        // Degree and dates
        const degreeText = edu.degree || 'Degree'
        const datesText = edu.dates || 'Date Range'
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: degreeText,
                bold: true,
                italics: true,
                size: 22,
                font: 'Times New Roman',
              }),
              new TextRun({
                text: '\t' + datesText,
                size: 22,
                font: 'Times New Roman',
              }),
            ],
            tabStops: [
              {
                type: TabStopType.RIGHT,
                position: TabStopPosition.MAX,
              },
            ],
            spacing: { after: 200 },
          })
        )
      }
    }
    
    // Create document
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 1440, // 1 inch in twips (20 * 72)
                right: 720, // 0.5 inch
                bottom: 1440,
                left: 720, // 0.5 inch
              },
            },
          },
          children,
        },
      ],
      styles: {
        default: {
          document: {
            run: {
              font: 'Times New Roman',
              size: 22, // 11pt
            },
          },
        },
      },
    })
    
    // Generate DOCX file
    const buffer = await Packer.toBuffer(doc)
    await writeFile(docxPath, buffer)
    
    // For PDF, we'll return DOCX for now (PDF conversion requires additional setup)
    // In a production environment, you might want to use a service like CloudConvert API
    const actualFormat = format === 'pdf' ? 'docx' : format
    const outputPath = actualFormat === 'pdf' ? pdfPath : docxPath
    
    // If PDF was requested but we're returning DOCX, note it
    if (format === 'pdf' && actualFormat === 'docx') {
      console.warn('PDF generation not available on Vercel. Returning DOCX instead.')
    }
    
    // Read the file
    const fileBuffer = fs.readFileSync(docxPath)
    const contentType = actualFormat === 'pdf' 
      ? 'application/pdf' 
      : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    const extension = actualFormat === 'pdf' ? 'pdf' : 'docx'
    
    // Clean up temp files after a delay
    setTimeout(async () => {
      try {
        if (fs.existsSync(docxPath)) await unlink(docxPath)
        if (actualFormat === 'pdf' && fs.existsSync(pdfPath)) await unlink(pdfPath)
      } catch (e) {
        console.error('Error cleaning up temp files:', e)
      }
    }, 5000)
    
    // Generate download filename
    const downloadBaseName = (data.name || 'resume').replace(/[^a-zA-Z0-9]/g, '_') || 'resume'
    const now = new Date()
    const month = now.toLocaleString('en-US', { month: 'short' })
    const day = String(now.getDate()).padStart(2, '0')
    const year = now.getFullYear()
    const hours = now.getHours()
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const hour12 = hours % 12 || 12
    const downloadTimestamp = `${month}-${day}-${year}_${hour12}-${minutes}${ampm}`
    const downloadFilename = `${downloadBaseName}_${downloadTimestamp}.${extension}`
    
    const response = new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${downloadFilename}"`,
      },
    })
    
    if (format === 'pdf' && actualFormat === 'docx') {
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
