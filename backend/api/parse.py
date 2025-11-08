import pdfplumber
import re
from uuid import uuid4
from typing import List, Dict, Any, Optional


def extract_date_range(text: str) -> str:
    """Extract date range from text using common patterns."""
    # Patterns: "May 2024 - Aug 2024", "2024-2025", "Jan 2024 - Present"
    date_patterns = [
        r'(\w+ \d{4}\s*-\s*\w+ \d{4})',  # May 2024 - Aug 2024
        r'(\w+ \d{4}\s*-\s*Present)',     # May 2024 - Present
        r'(\d{4}\s*-\s*\d{4})',           # 2024 - 2025
        r'(\w+\s*\d{4})',                  # May 2024 (single date)
    ]

    for pattern in date_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            return match.group(1)
    return ""


def extract_location(text: str) -> str:
    """Extract location from text (City, State/Province pattern)."""
    # Pattern: "Toronto, ON" or "San Francisco, CA"
    location_pattern = r'([A-Za-z\s]+,\s*[A-Z]{2,})'
    match = re.search(location_pattern, text)
    if match:
        return match.group(1)
    return ""


def is_bullet_point(line: str) -> bool:
    """Check if a line is a bullet point."""
    line = line.strip()
    # Check for bullet markers
    bullet_markers = ['•', '●', '○', '■', '▪', '-', '*']
    if any(line.startswith(marker) for marker in bullet_markers):
        return True

    # Check for indented lines (4+ spaces)
    if line and not line[0].isupper() and len(line) > 20:
        return True

    return False


def clean_bullet_text(text: str) -> str:
    """Remove bullet markers and clean up text."""
    text = text.strip()
    # Remove common bullet markers
    for marker in ['•', '●', '○', '■', '▪', '-', '*']:
        if text.startswith(marker):
            text = text[1:].strip()
    return text


def detect_section_type(line: str) -> Optional[str]:
    """Detect the type of resume section from a header line."""
    line_lower = line.lower().strip()

    section_keywords = {
        'experience': ['experience', 'employment', 'work history', 'professional experience'],
        'education': ['education', 'academic background', 'qualifications'],
        'skills': ['skills', 'technical skills', 'core competencies', 'proficiencies'],
        'projects': ['projects', 'personal projects', 'key projects'],
        'summary': ['summary', 'profile', 'objective', 'about me', 'professional summary'],
        'certifications': ['certifications', 'certificates', 'licenses'],
    }

    for section_type, keywords in section_keywords.items():
        if any(keyword in line_lower for keyword in keywords):
            return section_type

    return None


def extract_experience_blocks(lines: List[str], start_idx: int, end_idx: int) -> List[Dict[str, Any]]:
    """Extract work experience blocks from a section."""
    blocks = []
    current_job = None
    current_bullets = []

    for i in range(start_idx, end_idx):
        line = lines[i].strip()

        if not line:
            continue

        # Check if this might be a new job (all caps or bold indicators)
        if line.isupper() and len(line) > 5 and len(line) < 60:
            # Save previous job
            if current_job and current_bullets:
                current_job['bullets'] = current_bullets
                blocks.append(current_job)

            # Start new job
            current_job = {
                'id': str(uuid4()),
                'type': 'bullet',
                'company': line,
                'title': '',
                'location': '',
                'dateRange': '',
                'text': '',
                'bullets': []
            }
            current_bullets = []

        # Check for date range
        elif current_job and not current_job['dateRange']:
            date_range = extract_date_range(line)
            if date_range:
                current_job['dateRange'] = date_range

        # Check for location
        elif current_job and not current_job['location']:
            location = extract_location(line)
            if location:
                current_job['location'] = location

        # Check for job title (usually after company)
        elif current_job and not current_job['title'] and not is_bullet_point(line):
            if len(line) > 10 and len(line) < 80:
                current_job['title'] = line

        # Check for bullet points
        elif current_job and is_bullet_point(line):
            bullet_text = clean_bullet_text(line)
            if bullet_text and len(bullet_text) > 15:
                current_bullets.append({
                    'id': str(uuid4()),
                    'text': bullet_text
                })

    # Add last job
    if current_job and current_bullets:
        current_job['bullets'] = current_bullets
        # Create summary text from first bullet
        current_job['text'] = f"{current_job['title']} at {current_job['company']}"
        blocks.append(current_job)

    return blocks


def extract_education_blocks(lines: List[str], start_idx: int, end_idx: int) -> List[Dict[str, Any]]:
    """Extract education blocks from a section."""
    blocks = []
    current_edu = None
    current_bullets = []

    for i in range(start_idx, end_idx):
        line = lines[i].strip()

        if not line:
            continue

        # Check for university/school name (often in caps or bold)
        if (line.isupper() or len(line) > 15) and not is_bullet_point(line):
            # Save previous education
            if current_edu:
                if current_bullets:
                    current_edu['bullets'] = current_bullets
                blocks.append(current_edu)

            # Start new education
            current_edu = {
                'id': str(uuid4()),
                'type': 'bullet',
                'institution': line,
                'degree': '',
                'field': '',
                'dateRange': extract_date_range(line),
                'location': extract_location(line),
                'text': line,
                'bullets': []
            }
            current_bullets = []

        # Check for degree information
        elif current_edu and not current_edu['degree'] and ('bachelor' in line.lower() or 'master' in line.lower() or 'phd' in line.lower() or 'diploma' in line.lower()):
            current_edu['degree'] = line
            current_edu['text'] = f"{line} - {current_edu['institution']}"

        # Check for bullet points
        elif current_edu and is_bullet_point(line):
            bullet_text = clean_bullet_text(line)
            if bullet_text:
                current_bullets.append({
                    'id': str(uuid4()),
                    'text': bullet_text
                })

    # Add last education
    if current_edu:
        if current_bullets:
            current_edu['bullets'] = current_bullets
        blocks.append(current_edu)

    return blocks


def extract_skills_blocks(lines: List[str], start_idx: int, end_idx: int) -> List[Dict[str, Any]]:
    """Extract skills as individual blocks."""
    blocks = []
    skills_text = []

    for i in range(start_idx, end_idx):
        line = lines[i].strip()
        if line and not detect_section_type(line):
            skills_text.append(line)

    # Combine and split by common delimiters
    combined = ' '.join(skills_text)
    skills = re.split(r'[,;|•●]', combined)

    for skill in skills:
        skill = skill.strip()
        if skill and len(skill) > 2:
            blocks.append({
                'id': str(uuid4()),
                'type': 'skill-item',
                'text': skill,
                'bullets': []
            })

    return blocks


def extract_projects_blocks(lines: List[str], start_idx: int, end_idx: int) -> List[Dict[str, Any]]:
    """Extract project blocks from a section."""
    blocks = []
    current_project = None
    current_bullets = []

    for i in range(start_idx, end_idx):
        line = lines[i].strip()

        if not line:
            continue

        # Check for project name (often bold or standalone)
        if not is_bullet_point(line) and len(line) > 5 and not detect_section_type(line):
            # Save previous project
            if current_project and current_bullets:
                current_project['bullets'] = current_bullets
                blocks.append(current_project)

            # Start new project
            current_project = {
                'id': str(uuid4()),
                'type': 'bullet',
                'name': line,
                'dateRange': extract_date_range(line),
                'text': line,
                'bullets': []
            }
            current_bullets = []

        # Check for bullet points
        elif current_project and is_bullet_point(line):
            bullet_text = clean_bullet_text(line)
            if bullet_text:
                current_bullets.append({
                    'id': str(uuid4()),
                    'text': bullet_text
                })

    # Add last project
    if current_project:
        if current_bullets:
            current_project['bullets'] = current_bullets
        blocks.append(current_project)

    return blocks


def extract_summary_blocks(lines: List[str], start_idx: int, end_idx: int) -> List[Dict[str, Any]]:
    """Extract summary/profile text as blocks."""
    blocks = []
    summary_lines = []

    for i in range(start_idx, end_idx):
        line = lines[i].strip()
        if line and not detect_section_type(line):
            summary_lines.append(line)

    # Combine summary text
    if summary_lines:
        summary_text = ' '.join(summary_lines)
        # Split into sentences or paragraphs
        sentences = re.split(r'[.!?]\s+', summary_text)

        for sentence in sentences:
            sentence = sentence.strip()
            if sentence and len(sentence) > 20:
                blocks.append({
                    'id': str(uuid4()),
                    'type': 'bullet',
                    'text': sentence,
                    'bullets': []
                })

    return blocks


def parse_resume_sections(text: str) -> List[Dict[str, Any]]:
    """Parse resume text and extract all sections."""
    sections = []
    lines = text.split('\n')

    # Find all section headers
    section_indices = []
    for i, line in enumerate(lines):
        section_type = detect_section_type(line)
        if section_type:
            section_indices.append((i, section_type, line.strip()))

    # If no sections found, try to parse as experience only
    if not section_indices:
        blocks = extract_experience_blocks(lines, 0, len(lines))
        if blocks:
            sections.append({
                'id': str(uuid4()),
                'type': 'experience',
                'label': 'Work Experience',
                'blocks': blocks,
                'order': 0
            })
        return sections

    # Extract each section
    for idx, (start_idx, section_type, header) in enumerate(section_indices):
        end_idx = section_indices[idx + 1][0] if idx + 1 < len(section_indices) else len(lines)

        blocks = []
        if section_type == 'experience':
            blocks = extract_experience_blocks(lines, start_idx + 1, end_idx)
        elif section_type == 'education':
            blocks = extract_education_blocks(lines, start_idx + 1, end_idx)
        elif section_type == 'skills':
            blocks = extract_skills_blocks(lines, start_idx + 1, end_idx)
        elif section_type == 'projects':
            blocks = extract_projects_blocks(lines, start_idx + 1, end_idx)
        elif section_type == 'summary':
            blocks = extract_summary_blocks(lines, start_idx + 1, end_idx)
        elif section_type == 'certifications':
            blocks = extract_projects_blocks(lines, start_idx + 1, end_idx)  # Similar to projects

        if blocks:
            sections.append({
                'id': str(uuid4()),
                'type': section_type,
                'label': header,
                'blocks': blocks,
                'order': idx
            })

    return sections


def parse_resume(pdf_path: str) -> Dict[str, Any]:
    """
    Parse a PDF resume and extract all sections with blocks.

    Args:
        pdf_path: Path to the PDF file

    Returns:
        Dictionary with 'sections' containing list of resume sections
    """
    try:
        with pdfplumber.open(pdf_path) as pdf:
            # Extract text from all pages
            full_text = ""
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    full_text += page_text + "\n"

            # Parse sections from text
            sections = parse_resume_sections(full_text)

            # If no sections found, return sample data
            if not sections:
                sections = [
                    {
                        'id': str(uuid4()),
                        'type': 'experience',
                        'label': 'Work Experience',
                        'order': 0,
                        'blocks': [
                            {
                                'id': str(uuid4()),
                                'type': 'bullet',
                                'company': 'Could not parse resume',
                                'title': 'Please upload a different PDF',
                                'location': '',
                                'dateRange': '',
                                'text': 'PDF parsing failed',
                                'bullets': [
                                    {
                                        'id': str(uuid4()),
                                        'text': 'Unable to extract resume data. Please try a different PDF format.'
                                    }
                                ]
                            }
                        ]
                    }
                ]

            return {
                'sections': sections,
                'resumeId': str(uuid4()),
                'title': 'My Resume'
            }

    except Exception as e:
        print(f"Error parsing PDF: {str(e)}")
        return {
            'sections': [],
            'error': str(e)
        }


# Example usage
if __name__ == "__main__":
    result = parse_resume("example_resume.pdf")
    import json
    print(json.dumps(result, indent=2))

