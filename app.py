from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from resume_builder import Resume
import os
import tempfile
import json

app = Flask(__name__)
# Enable CORS for Next.js frontend - allow all origins in development
CORS(app, origins="*", methods=["GET", "POST", "OPTIONS"], allow_headers=["Content-Type"])

@app.after_request
def after_request(response):
    """Add CORS headers to all responses"""
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    return response

@app.route('/api/health', methods=['GET', 'OPTIONS'])
def health():
    """Health check endpoint"""
    if request.method == 'OPTIONS':
        return '', 200
    return jsonify({"status": "ok"})

@app.route('/api/generate-resume', methods=['POST', 'OPTIONS'])
def generate_resume():
    """Generate resume from JSON data"""
    if request.method == 'OPTIONS':
        return '', 200
    try:
        data = request.json
        
        # Create resume instance
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
        
        # Save to temporary file
        temp_dir = tempfile.gettempdir()
        filename = data.get('name', 'resume').replace(' ', '_').replace('/', '_')
        if not filename:
            filename = 'resume'
        docx_path = os.path.join(temp_dir, f"{filename}.docx")
        pdf_path = os.path.join(temp_dir, f"{filename}.pdf")
        
        resume.save(docx_path)
        
        # Try to generate PDF
        format_type = request.args.get('format', 'docx')
        if format_type == 'pdf':
            if resume.save_as_pdf(docx_path, pdf_path):
                return send_file(pdf_path, as_attachment=True, download_name=f"{filename}.pdf")
            else:
                # Fallback to DOCX if PDF conversion fails
                return send_file(docx_path, as_attachment=True, download_name=f"{filename}.docx")
        else:
            return send_file(docx_path, as_attachment=True, download_name=f"{filename}.docx")
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/sample-data', methods=['GET', 'OPTIONS'])
def get_sample_data():
    """Get sample resume data structure"""
    if request.method == 'OPTIONS':
        return '', 200
    from positions import work_experience_positions, skills_data, education_data
    
    return jsonify({
        "name": "Shimon Pozin",
        "contact_info": "shimon.pozin@gmail.com | (416) 276-7917 | www.linkedin.com/in/shimonpozin",
        "summary": "I am a Business & Systems Analyst with 8+ years of experience delivering enterprise solutions across finance, insurance, B2B, and multimedia domains. I hold a Master of Computer Science and a PMP certification (since 2010). I am skilled in the full BA/SA lifecycle, including requirements elicitation, workflow modeling (BPMN/UML), BRD/SRS creation, API definition (REST/SOAP), and SDLC support. Furthermore, I am an expert in user stories, use cases, and acceptance criteria, and collaborating with cross-functional teams to align systems with business goals.",
        "work_experience": work_experience_positions,
        "skills": skills_data,
        "education": education_data
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)

