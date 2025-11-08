from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Bullet
from reportlab.lib.enums import TA_LEFT, TA_CENTER
import tempfile
from typing import Dict, Any


def generate_resume_pdf(data: Dict[str, Any]) -> str:
    """
    Generate a professional PDF resume from job blocks.
    
    Args:
        data: Dictionary containing 'blocks' with job information
        
    Returns:
        Path to generated PDF file
    """
    # Create temporary file for PDF
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf')
    pdf_path = temp_file.name
    temp_file.close()
    
    # Create PDF document
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        rightMargin=0.75*inch,
        leftMargin=0.75*inch,
        topMargin=0.75*inch,
        bottomMargin=0.75*inch
    )
    
    # Container for PDF elements
    elements = []
    
    # Styles
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor='#2D2D2D',
        spaceAfter=6,
        alignment=TA_CENTER,
    )
    
    company_style = ParagraphStyle(
        'CompanyStyle',
        parent=styles['Heading2'],
        fontSize=14,
        textColor='#2D2D2D',
        spaceAfter=3,
        bold=True,
    )
    
    job_title_style = ParagraphStyle(
        'JobTitleStyle',
        parent=styles['Normal'],
        fontSize=12,
        textColor='#4A7C2C',  # Primary green
        italic=True,
        spaceAfter=3,
    )
    
    meta_style = ParagraphStyle(
        'MetaStyle',
        parent=styles['Normal'],
        fontSize=10,
        textColor='#6B5D47',  # Muted foreground
        spaceAfter=6,
    )
    
    bullet_style = ParagraphStyle(
        'BulletStyle',
        parent=styles['Normal'],
        fontSize=11,
        textColor='#2D2D2D',
        leftIndent=20,
        spaceAfter=4,
        leading=14,
    )
    
    # Add header
    elements.append(Paragraph("PROFESSIONAL EXPERIENCE", title_style))
    elements.append(Spacer(1, 0.3*inch))
    
    # Add job blocks
    blocks = data.get('blocks', [])
    for i, block in enumerate(blocks):
        # Company name
        elements.append(Paragraph(block['company'], company_style))
        
        # Job title
        elements.append(Paragraph(block['title'], job_title_style))
        
        # Location and date
        meta_text = f"{block['location']} | {block['dateRange']}"
        elements.append(Paragraph(meta_text, meta_style))
        
        # Bullets
        for bullet in block['bullets']:
            bullet_text = f"• {bullet['text']}"
            elements.append(Paragraph(bullet_text, bullet_style))
        
        # Add space between jobs (except after last one)
        if i < len(blocks) - 1:
            elements.append(Spacer(1, 0.2*inch))
    
    # Build PDF
    doc.build(elements)
    
    return pdf_path


# Example usage
if __name__ == "__main__":
    sample_data = {
        'blocks': [
            {
                'company': 'Tech Company',
                'title': 'Software Engineer',
                'location': 'San Francisco, CA',
                'dateRange': 'Jan 2024 - Present',
                'bullets': [
                    {'text': 'Developed full-stack applications'},
                    {'text': 'Led team of 5 engineers'},
                ]
            }
        ]
    }
    
    pdf_path = generate_resume_pdf(sample_data)
    print(f"PDF generated at: {pdf_path}")

