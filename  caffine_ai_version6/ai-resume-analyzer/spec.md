# AI Resume Analyzer

## Overview
A single-page application that allows users to upload their resume PDF, edit resume sections directly in the app with AI-suggested content as interactive chips, analyze it against a specific job description to get tailored insights with visual scoring, and export the enhanced resume to PDF with both AI-generated content and original static sections preserved.

## Frontend Features
- Single-page layout with large header "AI Resume & Job Analyzer" using coffee-inspired brown color palette
- Card-based form with three input sections:
  1. PDF file upload that accepts only .pdf files and displays the selected filename
  2. Text input field for "Job Level" with placeholder "e.g., Internship, Full-Time, Senior Engineer"
  3. Multi-line textarea for "Job Description" with placeholder "Paste the full job description here..."
- Prominent, centered "Get Insights" button that shows "Loading..." state during processing
- Side-by-side horizontal split layout after analysis:
  - Left panel: AI suggestions panel displaying all AI-suggested content (skills, summaries, etc.) as draggable items with coffee-inspired brown styling
  - Right panel: Live, real-time resume preview that visually matches the final exported PDF exactly, including layout, fonts, section spacing, and coffee-themed styling
- Drag-and-drop functionality allowing users to drag elements from the left suggestions panel into the right resume preview panel
- Real-time resume updates that reflect all edits and changes instantly in the live preview with PDF-accurate formatting
- Resume editing interface with inline editing capabilities for each section:
  - Education section with add/edit/remove controls and individual element scoring, displaying both original parsed content and AI suggestions
  - Experience section with add/edit/remove controls and individual element scoring, displaying both original parsed content and AI suggestions
  - Projects section with add/edit/remove controls and individual element scoring, displaying both original parsed content and AI suggestions
  - Skills section with add/edit/remove controls, individual element scoring, and AI-suggested skills displayed as interactive chips that can be dragged, dropped, or deleted
  - Professional summary section with add/edit/remove controls, individual element scoring, and AI-suggested summary content displayed as selectable chips or draggable items
  - Extracurricular/Volunteer Experience section with add/edit/remove controls and individual element scoring, displaying original parsed content
- Interactive AI suggestions displayed as chips or draggable items within the left suggestions panel
- Individual scoring and color-coding for each resume element in both panels (green for high scores, yellow for medium, red for low scores)
- Live resume preview that renders all resume sections (professional summary, skills, education, experience, projects, extracurricular/volunteer experience) with identical formatting, color-coded scores, and structure as the PDF export
- Enhanced results section with sub-header "Your Tailored Insights" that displays:
  - Visual scoring system using color indicators for overall sections
  - Individual element scoring within each section with clear color-coded indicators
  - Each component (summary, keywords, education, experience, projects, extracurricular/volunteer experience) displayed with section-level and element-level scoring
  - Analysis results in a structured, visually appealing format with coffee-inspired brown color scheme
- ResultsDisplay component that immediately renders analysis results upon completion of backend processing, with proper loading state management that clears promptly when results are available
- Error handling display for parsing failures with clear user feedback messages when resume sections cannot be extracted or are missing
- Fallback messaging system that informs users when specific resume sections are not found during parsing
- Prominent "Export to PDF" button that generates a downloadable PDF containing the analyzed and edited resume with all insights, color-coded scores, and original static sections preserved

## Backend Features
- Enhanced get_insights function with bulletproof JSON response structure that guarantees complete, valid JSON format matching the exact frontend schema requirements
- Mandatory JSON response validation that ensures all required fields are present with correct data types before returning to frontend
- Comprehensive default value system that provides complete structured objects for all resume sections when parsing fails or data is missing:
  - Empty arrays for education, work_experience, projects, and extracurricular sections
  - Empty strings for professional_summary and other text fields
  - Default scoring objects with zero values for all elements
  - Complete suggestions objects with empty arrays for all suggestion types
- Robust error handling with graceful degradation that never breaks the JSON structure:
  - PDF parsing failures return complete default structure with error messages
  - Missing sections populate with empty but valid data structures
  - Malformed content triggers fallback responses with proper JSON format
- Schema validation layer that verifies response structure matches frontend expectations before sending
- Enhanced resume parsing logic that accurately extracts static sections including education, work experience, and extracurricular/volunteer experience from uploaded PDF resumes
- Robust PDF content parsing with advanced text extraction algorithms to identify and separate different resume sections
- Function to parse resume PDF content into editable sections including static sections (education, experience, projects, skills, extracurricular/volunteer experience) with improved accuracy
- Function to extract and preserve original formatting information from static resume sections
- Function to generate AI-suggested skills and professional summary content based on job description and resume analysis
- Function to generate job suggestions based on job level and description
- Function to score individual resume elements within each section, including both original and AI-suggested content
- Function to generate PDF export containing the edited resume with analysis insights, visual scoring, and original static sections preserved with formatting as close as possible to the original
- Function to provide PDF formatting specifications (fonts, spacing, layout dimensions, styling) to ensure frontend preview matches PDF output exactly
- Comprehensive error handling for PDF parsing failures with detailed error messages and fallback responses that maintain JSON structure integrity
- Validation logic to detect missing or incomplete resume sections during parsing with proper default value assignment
- Returns guaranteed valid JSON response containing analysis insights with individual element scoring data, AI suggestions, parsed static sections with original formatting data, PDF formatting specifications, and error/warning messages for parsing issues
- Fallback mechanisms that provide complete structured results when some sections cannot be parsed, ensuring users always receive actionable feedback with consistent JSON structure
- Placeholder integration points for external AI API calls and job suggestion services

## Data Flow
- User uploads PDF resume file, enters job level, and pastes job description
- Backend parses PDF content into editable sections including static sections using enhanced parsing logic and returns guaranteed valid structured data with AI suggestions, original content, PDF formatting specifications, and any parsing error messages
- Backend ensures bulletproof JSON response format with all required fields populated using validated default empty values when parsing fails or data is missing
- Frontend displays parsing errors or warnings to users with clear feedback about missing or incomplete sections
- User can edit resume sections directly in the interface using inline editing controls in the right panel, working with both original parsed content and AI suggestions
- User can drag AI-suggested content from the left panel to the right panel, with real-time updates to the resume preview that match PDF formatting exactly
- Frontend sends all inputs (original data, edits, job level, job description, AI suggestion interactions) to backend for analysis
- Backend processes the data and returns guaranteed valid JSON-formatted insights with individual element scoring information, preserved static sections, PDF formatting data, and error handling information
- Frontend immediately displays results with color-coded visual scoring system for both sections and individual elements once backend processing completes, ensuring no stuck loading states or placeholder content
- Frontend shows appropriate error messages or fallback content when parsing issues occur
- Live preview updates in real-time to show exactly how the final PDF will appear with identical formatting and styling, including original static sections
- User can export enhanced resume with insights to PDF format, preserving both AI-generated content and original static sections with formatting maintained

## Technical Requirements
- Frontend built with React, TypeScript, and Tailwind CSS with coffee-inspired brown color palette
- Side-by-side horizontal split layout with left suggestions panel and right live preview panel
- Real-time resume preview that updates instantly with all changes and edits, matching PDF export formatting exactly
- PDF-accurate preview rendering with identical fonts, spacing, layout dimensions, and coffee-themed styling as the final export
- Drag-and-drop functionality for moving AI-suggested content from left panel to right panel
- Interactive chip components for AI suggestions with selection and deletion capabilities
- Enhanced backend PDF processing with improved parsing algorithms for accurate section extraction
- Bulletproof JSON response structure with mandatory validation and complete field coverage, including comprehensive error handling and guaranteed default values
- Schema validation system that ensures backend responses always match frontend expectations
- Comprehensive error handling UI components for displaying parsing failures and missing section warnings
- Backend handles PDF file processing as byte arrays, content parsing with formatting preservation, and PDF generation for export
- Guaranteed valid JSON response format for structured analysis results with individual element scoring data, AI suggestions, parsed static sections with formatting data, PDF formatting specifications, and error handling information
- File upload restricted to PDF format only
- PDF export functionality for the enhanced resume with visual scoring and preserved static sections
- Inline editing interface for resume sections with add/edit/remove capabilities for both original and AI-suggested content
- Individual element scoring and color-coding system (green/yellow/red) for granular visual feedback in both panels
- Intuitive UI for managing AI-suggested content through drag-and-drop interactions between panels
- Reliable state management in ResultsDisplay component to ensure immediate rendering of analysis results without getting stuck in loading states
- Live preview component that renders all resume sections with PDF-identical formatting and responsive updates to real-time edits
- Error boundary components and fallback UI for graceful handling of parsing failures

## Data Storage
- Backend stores user resume data and edits for PDF generation
- Original parsed static sections from uploaded resume with formatting information and parsing metadata
- AI-suggested content and user interactions with suggestions
- Individual element scores and analysis results temporarily stored for export functionality
- PDF formatting specifications and styling data for consistent preview-to-export rendering
- Error logs and parsing status information for debugging and user feedback
