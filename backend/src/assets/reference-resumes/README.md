# Reference Resumes Directory

This directory contains industry-standard reference resume PDFs used for comparison during resume critique.

## Purpose

Reference resumes are used to provide contextual feedback by comparing user resumes against successful, industry-standard examples. This helps identify specific gaps and provides concrete examples of what good resumes look like.

## Expected Files

Place anonymized, high-quality resume PDFs here with the following naming convention:

- `software-engineer.pdf` - Software Engineer reference resume
- `senior-engineer.pdf` - Senior Software Engineer reference resume
- `product-manager.pdf` - Product Manager reference resume
- `data-scientist.pdf` - Data Scientist reference resume
- `data-engineer.pdf` - Data Engineer reference resume
- `devops-engineer.pdf` - DevOps/SRE reference resume
- `general-example.pdf` - General high-quality resume example (fallback)

## Job Title Matching

The system automatically selects reference resumes based on the user's target job title:

- **Software Engineer/Developer/SWE** → Uses `software-engineer.pdf`, `senior-engineer.pdf`
- **Product Manager/PM** → Uses `product-manager.pdf`
- **Data Scientist** → Uses `data-scientist.pdf`
- **Data Engineer** → Uses `data-engineer.pdf`
- **DevOps/SRE** → Uses `devops-engineer.pdf`
- **Default/Other** → Uses `general-example.pdf`, `software-engineer.pdf`

## Adding New Reference Resumes

1. Ensure the PDF is anonymized (no personal information)
2. Use a clear, descriptive filename matching the naming convention above
3. Place the PDF file in this directory
4. The system will automatically detect and use it based on job title matching

## Notes

- PDF files should be text-selectable (not scanned images)
- Reference resumes should represent industry best practices
- Files are not tracked in git (add to `.gitignore` if needed)
- The system gracefully handles missing files (proceeds without comparison)

