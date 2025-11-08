import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'
import fs from 'fs'
import { writeFile, unlink } from 'fs/promises'

const execAsync = promisify(exec)

export async function GET(request: NextRequest) {
  try {
    // Safely get search params
    const loadExample = request.nextUrl?.searchParams?.get('example') === 'true' || false
    
    // Return empty template by default - users start fresh
    if (!loadExample) {
      return NextResponse.json({
        name: "",
        contact_info: "",
        summary: "",
        work_experience: [],
        skills: [],
        education: []
      })
    }
    
    // Only load example data if explicitly requested
    const projectRoot = path.join(process.cwd(), '..')
    const tempDir = path.join(projectRoot, 'temp')
    const scriptPath = path.join(tempDir, `sample_data_${Date.now()}.py`)
    
    // Create temp directory if it doesn't exist
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true })
    }
    
    // Load example data from positions.py
    const pythonScript = `import sys
import json
sys.path.insert(0, r'${projectRoot.replace(/\\/g, '/')}')

from positions import work_experience_positions, skills_data, education_data

data = {
    "name": "Shimon Pozin",
    "contact_info": "shimon.pozin@gmail.com | (416) 276-7917 | www.linkedin.com/in/shimonpozin",
    "summary": "I am a Business & Systems Analyst with 8+ years of experience delivering enterprise solutions across finance, insurance, B2B, and multimedia domains. I hold a Master of Computer Science and a PMP certification (since 2010). I am skilled in the full BA/SA lifecycle, including requirements elicitation, workflow modeling (BPMN/UML), BRD/SRS creation, API definition (REST/SOAP), and SDLC support. Furthermore, I am an expert in user stories, use cases, and acceptance criteria, and collaborating with cross-functional teams to align systems with business goals.",
    "work_experience": work_experience_positions,
    "skills": skills_data,
    "education": education_data
}
print(json.dumps(data))
`
    
    await writeFile(scriptPath, pythonScript)
    
    const { stdout } = await execAsync(
      `cd "${projectRoot}" && python3 "${scriptPath}"`
    )
    
    // Clean up script file
    setTimeout(() => {
      if (fs.existsSync(scriptPath)) {
        unlink(scriptPath).catch(console.error)
      }
    }, 1000)
    
    return NextResponse.json(JSON.parse(stdout))
  } catch (error) {
    console.error('Error loading sample data:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Full error details:', errorMessage)
    // Return empty template on error instead of failing
    return NextResponse.json({
      name: "",
      contact_info: "",
      summary: "",
      work_experience: [],
      skills: [],
      education: []
    })
  }
}
