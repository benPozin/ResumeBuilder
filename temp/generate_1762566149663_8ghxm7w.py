import sys
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

sys.path.insert(0, r'/Users/benpozin/Desktop/ResumeBuilder')

from resume_builder import Resume

# Load data from JSON file
with open(r'/Users/benpozin/Desktop/ResumeBuilder/temp/data_1762566149663_8ghxm7w.json', 'r') as f:
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
    resume.save(r'/Users/benpozin/Desktop/ResumeBuilder/temp/Benjamin_Pozin_1762566149663_8ghxm7w.docx')

# Convert to PDF if requested
if 'pdf' == 'pdf':
    try:
        with redirect_stdout(print_output):
            success = resume.save_as_pdf(r'/Users/benpozin/Desktop/ResumeBuilder/temp/Benjamin_Pozin_1762566149663_8ghxm7w.docx', r'/Users/benpozin/Desktop/ResumeBuilder/temp/Benjamin_Pozin_1762566149663_8ghxm7w.pdf')
        if success and os.path.exists(r'/Users/benpozin/Desktop/ResumeBuilder/temp/Benjamin_Pozin_1762566149663_8ghxm7w.pdf'):
            print(r'/Users/benpozin/Desktop/ResumeBuilder/temp/Benjamin_Pozin_1762566149663_8ghxm7w.pdf')
        else:
            # Fallback to DOCX if PDF conversion fails
            print('DOCX_FALLBACK:' + r'/Users/benpozin/Desktop/ResumeBuilder/temp/Benjamin_Pozin_1762566149663_8ghxm7w.docx')
    except Exception as e:
        # Fallback to DOCX on any error
        print('DOCX_FALLBACK:' + r'/Users/benpozin/Desktop/ResumeBuilder/temp/Benjamin_Pozin_1762566149663_8ghxm7w.docx')
else:
    print(r'/Users/benpozin/Desktop/ResumeBuilder/temp/Benjamin_Pozin_1762566149663_8ghxm7w.docx')
