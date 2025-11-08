import pdfplumber
import re
from uuid import uuid4
from typing import List, Dict, Any


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


def extract_jobs_from_text(text: str) -> List[Dict[str, Any]]:
    """Parse text and extract job blocks."""
    blocks = []
    lines = text.split('\n')
    
    # Find experience section
    exp_section_start = -1
    for i, line in enumerate(lines):
        if re.search(r'(?i)(experience|employment|work history)', line):
            exp_section_start = i
            break
    
    if exp_section_start == -1:
        # No experience section found, try parsing the whole document
        exp_section_start = 0
    
    # Parse jobs from experience section
    current_job = None
    current_bullets = []
    
    for i in range(exp_section_start + 1, len(lines)):
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
                'company': line,
                'title': '',
                'location': '',
                'dateRange': '',
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
        blocks.append(current_job)
    
    return blocks


def parse_resume(pdf_path: str) -> Dict[str, Any]:
    """
    Parse a PDF resume and extract job blocks.
    
    Args:
        pdf_path: Path to the PDF file
        
    Returns:
        Dictionary with 'blocks' containing list of job blocks
    """
    try:
        with pdfplumber.open(pdf_path) as pdf:
            # Extract text from all pages
            full_text = ""
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    full_text += page_text + "\n"
            
            # Parse jobs from text
            blocks = extract_jobs_from_text(full_text)
            
            # If no blocks found, return sample data
            if not blocks:
                blocks = [
                    {
                        'id': str(uuid4()),
                        'company': 'Could not parse company name',
                        'title': 'Please review and edit manually',
                        'location': 'Location not found',
                        'dateRange': 'Date range not found',
                        'bullets': [
                            {
                                'id': str(uuid4()),
                                'text': 'PDF parsing failed. Please enter your experience manually.'
                            }
                        ]
                    }
                ]
            
            return {'blocks': blocks}
            
    except Exception as e:
        print(f"Error parsing PDF: {str(e)}")
        return {
            'blocks': [],
            'error': str(e)
        }


# Example usage
if __name__ == "__main__":
    result = parse_resume("example_resume.pdf")
    print(result)

