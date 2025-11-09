import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { ContactHeader } from "@/types/resume"

interface HeaderEditorProps {
  header: ContactHeader
  onUpdate: (updates: Partial<ContactHeader>) => void
}

export default function HeaderEditor({ header, onUpdate }: HeaderEditorProps) {
  return (
    <Card className="mb-4 border-2 border-[#8B6F47]/30 bg-[#221410]/90 backdrop-blur-xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-[#F5F1E8]">Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <Label htmlFor="name" className="text-sm text-[#C9B896]">Full Name</Label>
            <Input
              id="name"
              value={header.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
              placeholder="John Doe"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-sm text-[#C9B896]">Email</Label>
            <Input
              id="email"
              type="email"
              value={header.email}
              onChange={(e) => onUpdate({ email: e.target.value })}
              placeholder="john@example.com"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="phone" className="text-sm text-[#C9B896]">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={header.phone}
              onChange={(e) => onUpdate({ phone: e.target.value })}
              placeholder="(555) 123-4567"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="location" className="text-sm text-[#C9B896]">Location</Label>
            <Input
              id="location"
              value={header.location || ""}
              onChange={(e) => onUpdate({ location: e.target.value })}
              placeholder="City, State"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="linkedin" className="text-sm text-[#C9B896]">LinkedIn</Label>
            <Input
              id="linkedin"
              value={header.linkedin || ""}
              onChange={(e) => onUpdate({ linkedin: e.target.value })}
              placeholder="linkedin.com/in/username"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="github" className="text-sm text-[#C9B896]">GitHub</Label>
            <Input
              id="github"
              value={header.github || ""}
              onChange={(e) => onUpdate({ github: e.target.value })}
              placeholder="github.com/username"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="website" className="text-sm text-[#C9B896]">Website</Label>
            <Input
              id="website"
              value={header.website || ""}
              onChange={(e) => onUpdate({ website: e.target.value })}
              placeholder="yourwebsite.com"
              className="mt-1"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

