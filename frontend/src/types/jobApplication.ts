export type ApplicationStatus = 
  | "Not applied"
  | "Applied"
  | "OA" // Online Assessment
  | "R1 Interview"
  | "R2 Interview"
  | "R3 Interview"
  | "F Interview" // Final Interview
  | "Offer"
  | "Rejected"
  | "Withdrawn"

export type Position = 
  | "SWE"
  | "Frontend"
  | "Backend"
  | "Full Stack"
  | "Mobile"
  | "Data Engineer"
  | "Data Scientist"
  | "ML Engineer"
  | "DevOps"
  | "Product Manager"
  | "Designer"
  | "Other"

export interface JobApplication {
  id: string
  companyName: string
  position: Position
  location: string
  dateApplied: string // ISO date string or "m/d/yyyy"
  currentStatus: ApplicationStatus
  notes: string
  createdAt: string
  updatedAt: string
  userId: string
}

export interface JobApplicationInput {
  companyName: string
  position: Position
  location: string
  dateApplied: string
  currentStatus: ApplicationStatus
  notes: string
}

