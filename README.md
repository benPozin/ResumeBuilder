# Resume Parser

A Python tool that extracts and structures resume data from DOCX files, converting them into organized JSON and Markdown formats.

## Features

- **DOCX Text Extraction**: Extracts plain text from DOCX files using only Python standard library
- **Intelligent Parsing**: Automatically identifies and parses resume sections:
  - Header (name, contact info, summary)
  - Work Experience
  - Skills (categorized)
  - Education
- **Multiple Output Formats**: Generates JSON, Markdown, and plain text versions
- **Command Line Interface**: Easy-to-use CLI for batch processing
- **No External Dependencies**: Uses only Python standard library modules

## Installation

1. Clone or download this repository
2. Ensure you have Python 3.6+ installed
3. No additional dependencies required!

```bash
# Optional: Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

## Usage

### Command Line Usage

```bash
# Basic usage
python resume_parser.py path/to/resume.docx

# Specify output directory
python resume_parser.py path/to/resume.docx -o my_output_folder

# Help
python resume_parser.py --help
```

### Programmatic Usage

```python
from resume_parser import parse_resume

# Parse a resume and get structured data
resume_data = parse_resume("path/to/resume.docx", output_dir="output")

# Access parsed data
print(f"Name: {resume_data['name']}")
print(f"Experience entries: {len(resume_data['experience'])}")
```

## Output Files

For each processed resume, the tool generates:

1. **`{filename}_resume.json`** - Structured JSON data with all parsed information
2. **`{filename}_resume.md`** - Formatted Markdown version
3. **`{filename}_resume.txt`** - Plain text extraction

### JSON Structure

```json
{
  "name": "John Doe",
  "contacts": "john@example.com | (555) 123-4567 | linkedin.com/in/johndoe",
  "summary": "Experienced software engineer with 5+ years...",
  "experience": [
    {
      "company": "Tech Corp",
      "title": "Senior Software Engineer",
      "dates": "2020 to Present",
      "highlights": [
        "Led development of microservices architecture",
        "Improved system performance by 40%"
      ]
    }
  ],
  "skills": {
    "Programming": ["Python", "JavaScript", "Java"],
    "Tools": ["Git", "Docker", "AWS"],
    "Databases": ["PostgreSQL", "MongoDB"]
  },
  "education": [
    {
      "institution": "University of Technology",
      "details": "Bachelor of Science in Computer Science",
      "dates": "2015–2019"
    }
  ],
  "source_file": "resume.docx",
  "generated_at": "2024-01-15T10:30:00Z"
}
```

## How It Works

1. **Text Extraction**: Opens DOCX as ZIP file and extracts text from `document.xml`
2. **Section Detection**: Identifies headers using uppercase patterns and known keywords
3. **Content Parsing**: 
   - Header: Extracts name, contact info, and summary
   - Experience: Detects company names and parses job details
   - Skills: Categorizes skills by type (Programming, Tools, etc.)
   - Education: Extracts institution and degree information
4. **Output Generation**: Creates structured JSON, formatted Markdown, and plain text

## Supported Resume Formats

The parser works best with resumes that have:
- Clear section headers (uppercase or title case)
- Standard sections: Experience, Skills, Education
- Company names in uppercase or title case
- Date ranges in recognizable formats

## Limitations

- Designed for standard resume formats
- May require adjustment for non-standard layouts
- Relies on text patterns for section detection
- Does not preserve original formatting (fonts, colors, etc.)

## Examples

### Sample Input (DOCX)
```
JOHN DOE
john@example.com | (555) 123-4567 | linkedin.com/in/johndoe

Experienced software engineer with 5+ years of experience...

RELEVANT WORK EXPERIENCE

TECH CORP
Senior Software Engineer
2020 to Present
- Led development of microservices architecture
- Improved system performance by 40%

SKILLS
Programming: Python, JavaScript, Java
Tools: Git, Docker, AWS
Databases: PostgreSQL, MongoDB

EDUCATION
University of Technology
Bachelor of Science in Computer Science
2015–2019
```

### Sample Output (Markdown)
```markdown
# JOHN DOE

john@example.com | (555) 123-4567 | linkedin.com/in/johndoe

Experienced software engineer with 5+ years of experience...

## Experience
**TECH CORP**  
*Senior Software Engineer*  
2020 to Present
- Led development of microservices architecture
- Improved system performance by 40%

## Skills
**Programming:** Python, JavaScript, Java
**Tools:** Git, Docker, AWS
**Databases:** PostgreSQL, MongoDB

## Education
**University of Technology**
Bachelor of Science in Computer Science
2015–2019
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with sample resumes
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Troubleshooting

### Common Issues

1. **"File not found" error**: Ensure the DOCX file path is correct
2. **Empty output**: Check if the DOCX file is corrupted or has unusual formatting
3. **Missing sections**: The parser may not detect non-standard section headers

### Getting Help

If you encounter issues:
1. Check that your DOCX file is not corrupted
2. Verify the resume has standard section headers
3. Try with a simpler resume format first
4. Check the console output for parsing details



