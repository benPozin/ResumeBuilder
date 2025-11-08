import { NextRequest, NextResponse } from 'next/server'

// Sample data - no Python needed!
const sampleData = {
  name: "Shimon Pozin",
  contact_info: "shimon.pozin@gmail.com | (416) 276-7917 | www.linkedin.com/in/shimonpozin",
  summary: "I am a Business & Systems Analyst with 8+ years of experience delivering enterprise solutions across finance, insurance, B2B, and multimedia domains. I hold a Master of Computer Science and a PMP certification (since 2010). I am skilled in the full BA/SA lifecycle, including requirements elicitation, workflow modeling (BPMN/UML), BRD/SRS creation, API definition (REST/SOAP), and SDLC support. Furthermore, I am an expert in user stories, use cases, and acceptance criteria, and collaborating with cross-functional teams to align systems with business goals.",
  work_experience: [
    {
      company: "INVENT.US",
      title: "Sr. Business Systems Analyst, freelance",
      dates: "March 2023 - September 2025",
      items: [
        "Provided business and systems analysis for integrations in cloud-based data lake solution.",
        "Analyzed and documented requirements for CRM Systems (Salesforce, Hubspot, Wealthbox, Redtail), Custodian (Fidelity, Pershing, Schwab etc.), Portfolio Management Systems (Orion, Black Diamond, etc.) integrations.",
        "Bridged business and technical teams, while managing priorities, resolving roadblocks, and maintaining clear communication across engineering, QA, and support tiers.",
        "Used Salesforce integration for multiple tenants with different configurations and data models that resulted in generic Salesforce connector.",
        "Worked in Agile environment to adjust priorities and deliverables based on the ever changing business needs.",
        "Delivered end-to-end lifecycle oversight for sustaining projects - architecture reviews, data analytics, and reporting.",
        "Provided analytics dashboard based on Apache Superset for data insights, monitoring and business intelligence."
      ]
    },
    {
      company: "ORACLE",
      title: "Technical Project Manager / Business Systems Analyst",
      dates: "March 2005 - September 2025",
      items: [
        "Led multiple projects transitioning from on-prem environments to Oracle Cloud Infrastructure (OCI), including planning, risk management, and offshore coordination (Wipro, India).",
        "Gathered and translated business needs into functional requirements, user stories, and use cases for internal Oracle initiatives, ensuring stakeholder alignment and rapid iteration.",
        "Bridged business and technical teams, while managing priorities, resolving roadblocks, and maintaining clear communication across engineering, QA, and support tiers.",
        "Designed and implemented AI-driven automation with Oracle Digital Assistant (ODA) to detect and resolve system alerts proactively.",
        "Drove the shift from RUP to Agile, introducing escalation management, integrated change control, and continuous process auditing to enhance quality and delivery speed.",
        "Delivered end-to-end lifecycle oversight for sustaining projects - architecture reviews, EoSL policy implementation, and TOI (Transfer of Information) sessions across global teams."
      ]
    }
  ],
  skills: [
    {
      section_title: "Tools",
      skills: "Jira, Confluence, Draw.io, Swagger, Microsoft Office, Lucidchart, Postman, AI solutions"
    },
    {
      section_title: "Programming",
      skills: "Python, Java (J2EE), SQL, JavaScript, C++, C, HTML, CSS"
    },
    {
      section_title: "Framework and Tools",
      skills: "Oracle APEX, JDBC, JUnit, Maven, Git, WebLogic, OHS, Jenkins, Docker, Kubernetes, Helm, Ansible, Terraform, Chef"
    },
    {
      section_title: "Databases",
      skills: "Oracle (PL/SQL, APEX), MS SQL, MySQL, Sybase"
    }
  ],
  education: [
    {
      institution: "PROJECT MANAGEMENT INSTITUTE",
      degree: "Project Management Professional (PMP)",
      dates: "2015 - present"
    },
    {
      institution: "TEL AVIV UNIVERSITY",
      degree: "M.Sc., Computer Science and Mathematics",
      dates: "1991 - 1996"
    }
  ]
}

export async function GET(request: NextRequest) {
  try {
    // Use request.nextUrl for Next.js API routes
    const loadExample = request.nextUrl.searchParams.get('example') === 'true'
    
    console.log('Sample data request:', { loadExample, url: request.nextUrl.toString() })
    
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
    
    // Return sample data
    console.log('Returning sample data:', sampleData)
    return NextResponse.json(sampleData, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('Error loading sample data:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Full error:', errorMessage, error)
    
    // Return empty template on error
    return NextResponse.json({
      name: "",
      contact_info: "",
      summary: "",
      work_experience: [],
      skills: [],
      education: []
    }, { status: 200 }) // Return 200 even on error to prevent frontend issues
  }
}
