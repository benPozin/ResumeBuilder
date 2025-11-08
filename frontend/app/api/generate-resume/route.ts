import { NextRequest, NextResponse } from 'next/server'
import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, TabStopType, TabStopPosition } from 'docx'
import fs from 'fs'
import { writeFile, unlink } from 'fs/promises'
import puppeteer from 'puppeteer-core'
import chromium from '@sparticuz/chromium'

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

// Helper function to generate HTML from resume data
function generateResumeHTML(data: any): string {
  const escapeHtml = (text: string) => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }

  let html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @page {
      margin: 1in 0.5in;
    }
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 11pt;
      line-height: 1.5;
      color: #000;
      margin: 0;
      padding: 0;
    }
    .header {
      text-align: center;
      margin-bottom: 20px;
    }
    .name {
      font-size: 30pt;
      font-weight: bold;
      margin-bottom: 5px;
    }
    .contact {
      font-size: 11pt;
      margin-bottom: 20px;
    }
    .section {
      margin-bottom: 20px;
    }
    .section-title {
      font-size: 14pt;
      font-weight: bold;
      text-transform: uppercase;
      border-bottom: 1px solid #000;
      padding-bottom: 2px;
      margin-bottom: 10px;
    }
    .company {
      font-size: 13pt;
      font-weight: bold;
      margin-bottom: 2px;
    }
    .role {
      font-size: 11pt;
      font-weight: bold;
      font-style: italic;
      display: inline-block;
    }
    .dates {
      font-size: 11pt;
      float: right;
    }
    .bullet-point {
      margin-left: 20px;
      margin-bottom: 5px;
      font-size: 11pt;
    }
    .skill-category {
      font-size: 11pt;
      margin-bottom: 5px;
    }
    .skill-label {
      font-weight: bold;
    }
    .institution {
      font-size: 13pt;
      font-weight: bold;
      margin-bottom: 2px;
    }
    .degree {
      font-size: 11pt;
      font-weight: bold;
      font-style: italic;
      display: inline-block;
    }
    .clearfix::after {
      content: "";
      display: table;
      clear: both;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="name">${escapeHtml(data.name || 'Your Name')}</div>
    <div class="contact">${escapeHtml(data.contact_info || 'your.email@example.com | (555) 123-4567')}</div>
  </div>`

  if (data.summary) {
    html += `  <div class="section">
    <p>${escapeHtml(data.summary)}</p>
  </div>`
  }

  if (data.work_experience && data.work_experience.length > 0) {
    html += `  <div class="section">
    <div class="section-title">Relevant Work Experience</div>`
    
    for (const exp of data.work_experience) {
      html += `    <div style="margin-bottom: 15px;">
      <div class="company">${escapeHtml(exp.company || 'Company Name')}</div>
      <div class="clearfix">
        <span class="role">${escapeHtml(exp.title || 'Job Title')}</span>
        <span class="dates">${escapeHtml(exp.dates || 'Date Range')}</span>
      </div>`
      
      if (exp.items && exp.items.length > 0) {
        for (const item of exp.items.filter((i: string) => i.trim())) {
          html += `      <div class="bullet-point">• ${escapeHtml(item)}</div>`
        }
      }
      
      html += `    </div>`
    }
    
    html += `  </div>`
  }

  if (data.skills && data.skills.length > 0) {
    html += `  <div class="section">
    <div class="section-title">Skills</div>`
    
    for (const skill of data.skills) {
      html += `    <div class="skill-category">
      <span class="skill-label">${escapeHtml(skill.section_title || 'Category')}:</span> ${escapeHtml(skill.skills || 'Skills list')}
    </div>`
    }
    
    html += `  </div>`
  }

  if (data.education && data.education.length > 0) {
    html += `  <div class="section">
    <div class="section-title">Education</div>`
    
    for (const edu of data.education) {
      html += `    <div style="margin-bottom: 10px;">
      <div class="institution">${escapeHtml(edu.institution || 'Institution Name')}</div>
      <div class="clearfix">
        <span class="degree">${escapeHtml(edu.degree || 'Degree')}</span>
        <span class="dates">${escapeHtml(edu.dates || 'Date Range')}</span>
      </div>
    </div>`
    }
    
    html += `  </div>`
  }

  html += `</body>
</html>`

  return html
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
    
    let fileBuffer: Buffer
    let contentType: string
    let extension: string
    
    if (format === 'pdf') {
      // Generate PDF using Puppeteer
      const html = generateResumeHTML(data)
      
      // Configure Chromium for Vercel/serverless
      const launchOptions: any = {
        args: isVercel ? chromium.args : [],
        defaultViewport: { width: 1920, height: 1080 },
        headless: true,
      }
      
      if (isVercel) {
        // Use Chromium binary for Vercel
        launchOptions.executablePath = await chromium.executablePath()
      } else {
        // Use system Chrome in local dev - try to find it automatically
        // Try common Chrome paths on macOS, Linux, and Windows
        const possiblePaths = [
          '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', // macOS
          '/usr/bin/google-chrome', // Linux
          '/usr/bin/chromium-browser', // Linux (Chromium)
          'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', // Windows
          'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe', // Windows 32-bit
        ]
        
        // Try to find Chrome executable
        let chromePath: string | undefined
        for (const path of possiblePaths) {
          if (fs.existsSync(path)) {
            chromePath = path
            break
          }
        }
        
        if (chromePath) {
          launchOptions.executablePath = chromePath
        } else {
          // Fallback: try channel option (works if Chrome is in PATH)
          launchOptions.channel = 'chrome'
        }
      }
      
      const browser = await puppeteer.launch(launchOptions)
      
      try {
        const page = await browser.newPage()
        await page.setContent(html, { waitUntil: 'networkidle0' })
        
        // Generate PDF
        const pdfBuffer = await page.pdf({
          format: 'Letter',
          margin: {
            top: '1in',
            right: '0.5in',
            bottom: '1in',
            left: '0.5in',
          },
          printBackground: true,
        })
        
        await browser.close()
        
        // Convert Uint8Array to Buffer
        fileBuffer = Buffer.from(pdfBuffer)
        contentType = 'application/pdf'
        extension = 'pdf'
      } catch (error) {
        await browser.close()
        throw error
      }
    } else {
      // Generate DOCX file
      const buffer = await Packer.toBuffer(doc)
      await writeFile(docxPath, buffer)
      fileBuffer = fs.readFileSync(docxPath)
      contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      extension = 'docx'
    }
    
    // Clean up temp files after a delay (only for DOCX)
    if (format !== 'pdf') {
      setTimeout(async () => {
        try {
          if (fs.existsSync(docxPath)) await unlink(docxPath)
        } catch (e) {
          console.error('Error cleaning up temp files:', e)
        }
      }, 5000)
    }
    
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
    
    const response = new NextResponse(new Uint8Array(fileBuffer), {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${downloadFilename}"`,
      },
    })
    
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
