PROJECT: ResuBlocks

TAGLINE: "Build Your Resume Like Building with Blocks"

ELEVATOR PITCH:
ResuBlocks is a drag-and-drop resume builder for students that makes creating tailored resumes as intuitive as Scratch made coding. Upload a job description, get AI-powered critique, drag and drop optimized bullet points, and export a professional resume—all in minutes.

TARGET AUDIENCE:
University students and recent graduates applying for internships, co-ops, and entry-level positions who struggle with resume writing and tailoring applications.

CORE PROBLEM WE SOLVE:
- Resume writing is intimidating and time-consuming
- Students don't know how to tailor resumes for specific jobs
- No easy way to see what works for similar job postings
- Traditional resume builders lack intelligence and personalization

KEY FEATURES:

1. BLOCK-BASED EDITOR (Main Innovation)
   - Visual drag-and-drop interface inspired by Scratch
   - Each resume section (experience, skills, projects) is a "block"
   - Drag blocks to reorder, swap alternatives with satisfying snap animations
   - Color-coded blocks for different resume sections

2. AI-POWERED CRITIQUE (Caffeine AI Integration)
   - Upload job description + your resume
   - Real-time analysis comparing your resume to job requirements
   - Before/after score (0-100)
   - Specific feedback: missing skills, weak bullets, ATS optimization

3. SMART SUGGESTIONS
   - For each bullet point, AI generates 2-3 alternative phrasings
   - Drag to swap between options instantly
   - Based on analysis of successful resumes in our database

4. JOB POSTING DATABASE
   - Web-scraped data from 100+ real job postings
   - Aggregated insights: "84% of Software Engineer postings mention React"
   - Personalized recommendations: "Add these skills for this role"

5. INSTANT PDF EXPORT
   - One-click professional PDF generation
   - ATS-friendly formatting
   - Multiple template options

TECHNICAL STACK:
- Frontend: Next.js 14, React, TypeScript, Tailwind CSS
- Drag-and-Drop: @hello-pangea/dnd library
- Backend: Next.js API Routes
- Database: Supabase (PostgreSQL)
- AI: Caffeine AI (primary) + OpenAI (fallback)
- PDF Generation: @react-pdf/renderer
- Animations: Framer Motion

UNIQUE DIFFERENTIATORS:
1. Block-based UI (no other resume builder does this)
2. Real-time AI critique against actual job postings
3. Database of aggregated job market insights
4. Student-focused with simple, visual UX
5. Built specifically for quick job application customization

USER FLOW:
1. Land on homepage → "Get Started"
2. Upload existing resume (optional) OR start from template
3. Upload job description you're applying to
4. AI analyzes and shows critique score + feedback
5. Drag-and-drop blocks to build/edit resume
6. For each bullet point, see AI-generated alternatives
7. Swap alternatives with drag-and-drop
8. Real-time preview updates
9. Export to PDF with one click

HACKATHON POSITIONING:
- Primary Track: General Category + Caffeine AI Track
- Secondary: MLH "Best Use of AI powered by Reach Capital"
- Pitch Angle: "Making career success accessible like Scratch made coding accessible"

MVP SCOPE (24 hours):
MUST HAVE:
- Upload resume/job description
- Drag-and-drop block editor (2-3 sections)
- AI critique showing score and key feedback
- Generate 2-3 alternative bullet points per block
- PDF export

NICE TO HAVE:
- Multiple resume templates
- Save/load functionality
- Web scraping live demo

DEMO STRATEGY:
- Show before/after of poorly written resume → optimized resume
- Live drag-and-drop with smooth animations
- Real-time score improvement as user swaps blocks
- Export to PDF in <5 seconds

KEY METRICS TO HIGHLIGHT:
- "Analyzed 100+ job postings"
- "Generated 500+ AI-optimized bullet points"
- "Average score improvement: 35 points"
- "Resume tailored in under 5 minutes"

INSPIRATION/REFERENCES:
- Scratch (MIT) - block-based coding for beginners
- Canva - drag-and-drop design simplicity
- Grammarly - real-time AI feedback
- Resume.io - professional PDF export

SUCCESS CRITERIA:
Judges should think: "This is the Scratch of resume building - intuitive, visual, and powered by AI. Students will actually use this."

TEAM CONTEXT:
- Building for HackTrent 2025 (24-hour hackathon)
- Team of students with React/TypeScript experience
- Focus on impressive demo over perfect functionality
- Prioritizing visual polish and smooth UX