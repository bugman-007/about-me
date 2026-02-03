# Owner Edit Mode - Implementation Guide

## ✅ Feature Complete: Inline Editable Contact Section

This implementation demonstrates the **first end-to-end owner edit feature** for the portfolio. The pattern established here can be reused for projects, experience, and other editable content.

---

## 🎯 What's Implemented

### 1. **Contact Section with Live Data**
- Location: `components/sections/ContactSection.tsx`
- Data fetched from `site_settings` table on server
- Displays contact information with beautiful card UI
- Shows: Email, GitHub, LinkedIn, X/Twitter (optional)

### 2. **Owner-Only Edit Controls**
- Edit button appears ONLY when `isOwner === true`
- Minimal, unobtrusive pencil icon in section header
- No edit controls visible to non-owner users

### 3. **Inline Edit Form**
- Toggles inline (no navigation, no modal)
- Clean form with labeled inputs
- Save and Cancel buttons with loading states
- Form validation and error handling

### 4. **Protected Write API**
- Endpoint: `POST /api/settings/update`
- Session validation with Supabase server client
- Owner verification: `session.user.id === OWNER_ID`
- Supports both single and bulk updates
- Proper HTTP status codes and error messages

### 5. **Client Save Flow**
- POST to `/api/settings/update` with bulk updates
- Toast notifications (success/error)
- Local state refresh on success
- Optimistic UI updates

---

## 📁 Files Created/Modified

### New Files
```
components/ui/input.tsx          → Input component (shadcn/ui)
components/ui/label.tsx          → Label component (shadcn/ui)
lib/toast.ts                     → Simple toast notification system
```

### Modified Files
```
components/sections/ContactSection.tsx   → Complete rewrite with inline editing
app/api/settings/update/route.ts        → Added bulk update support
app/page.tsx                            → Now async, fetches settings
lib/data/settings.ts                    → Already existed (unchanged)
```

### Dependencies Added
```json
"@radix-ui/react-label": "^2.x.x"
```

---

## 🔒 Security Model

### Server-Side Validation
```typescript
// 1. Verify session exists
const { isOwner, error } = await verifyOwner();

// 2. Check OWNER_ID match (server-side only)
if (session.user.id !== process.env.OWNER_ID) {
  return 403 Forbidden
}

// 3. Use authenticated server client (respects RLS)
const supabase = await createServerClient();
```

### Client-Side Safety
- ✅ `OWNER_ID` NEVER sent to client
- ✅ Edit UI only rendered when `isOwner === true`
- ✅ All mutations require server-side auth check
- ✅ Toast system has no external dependencies

---

## 🎨 UI/UX Features

### Display Mode (Non-Editing)
```
┌─────────────────────────────────────┐
│ Get in Touch                   [✏️] │ ← Edit button (owner only)
│ Interested in working together?     │
│                                      │
│ ┌──────────────────────────────┐   │
│ │ 📧 Email                     │   │
│ │ your.email@example.com       │   │
│ └──────────────────────────────┘   │
│                                      │
│ ┌──────────────────────────────┐   │
│ │ 🔗 GitHub                    │   │
│ │ github.com/username          │   │
│ └──────────────────────────────┘   │
└─────────────────────────────────────┘
```

### Edit Mode (Owner)
```
┌─────────────────────────────────────┐
│ Get in Touch                         │
│ Interested in working together?      │
│                                       │
│ ┌───────────────────────────────┐   │
│ │ Email Address                 │   │
│ │ [your.email@example.com     ] │   │
│ │                               │   │
│ │ GitHub URL                    │   │
│ │ [https://github.com/...     ] │   │
│ │                               │   │
│ │ LinkedIn URL                  │   │
│ │ [https://linkedin.com/...   ] │   │
│ │                               │   │
│ │ X / Twitter URL (Optional)    │   │
│ │ [https://x.com/...          ] │   │
│ │ ──────────────────────────────│   │
│ │              [Cancel] [Save]  │   │
│ └───────────────────────────────┘   │
└─────────────────────────────────────┘
```

### Toast Notifications
- **Success**: Green toast, 3s duration
- **Error**: Red toast, 3s duration
- Slide in from right, fade out
- No external dependencies (pure CSS + DOM)

---

## 🔄 Data Flow

### Read Flow (Server-Side Rendering)
```
Page Component (Server)
  ↓
getSettings() from lib/data/settings.ts
  ↓
Supabase Server Client (session-aware)
  ↓
SELECT * FROM site_settings
  ↓
Return as Record<string, string>
  ↓
Pass to ContactSection as initialSettings
  ↓
ContactSection renders with data
```

### Write Flow (Owner Edit)
```
User clicks Edit
  ↓
Form shown with current values
  ↓
User edits, clicks Save
  ↓
POST /api/settings/update
  Body: { updates: { key1: value1, ... } }
  ↓
Server: verifyOwner()
  ↓
Server: Bulk upsert to site_settings
  ↓
Response: { success: true, updated: 4 }
  ↓
Client: Update local state
  ↓
Client: Show success toast
  ↓
Form closes, display mode shows new values
```

---

## 🧪 Testing Checklist

### As Non-Owner (Not Logged In)
- [ ] Visit homepage
- [ ] Contact section displays properly
- [ ] NO edit button visible
- [ ] Links work (mailto, external URLs)
- [ ] Empty state shows if no data

### As Owner (Logged In)
- [ ] Press `Shift+O` 3 times to trigger login modal
- [ ] Log in with owner credentials
- [ ] Edit button (pencil icon) appears in Contact section
- [ ] Click edit → Form appears inline
- [ ] Edit fields → Click Save
- [ ] Success toast appears
- [ ] New values display immediately
- [ ] Refresh page → Values persist

### API Security
- [ ] Try POST to `/api/settings/update` without auth → 403
- [ ] Try with non-owner user → 403
- [ ] Try with owner session → 200 success
- [ ] Invalid payload → 400 error
- [ ] Missing required fields → 400 error

---

## 📝 API Usage Examples

### Single Update
```typescript
POST /api/settings/update
Content-Type: application/json

{
  "key": "contact_email",
  "value": "new.email@example.com"
}

// Response
{
  "success": true,
  "data": { "key": "contact_email", "value": "...", ... }
}
```

### Bulk Update (Used by ContactSection)
```typescript
POST /api/settings/update
Content-Type: application/json

{
  "updates": {
    "contact_email": "your@email.com",
    "github_url": "https://github.com/username",
    "linkedin_url": "https://linkedin.com/in/username",
    "x_url": "https://x.com/username"
  }
}

// Response
{
  "success": true,
  "updated": 4,
  "data": [ {...}, {...}, {...}, {...} ]
}
```

### Error Response
```typescript
// 403 Forbidden (not owner)
{
  "error": "Unauthorized"
}

// 400 Bad Request (validation error)
{
  "error": "No updates provided"
}

// 500 Internal Server Error
{
  "error": "Failed to update settings",
  "details": "Database error message"
}
```

---

## 🔄 Reusable Pattern for Projects

To implement the same pattern for projects:

### 1. Create ProjectsSection Component
```tsx
"use client";

interface ProjectsSectionProps {
  initialProjects?: Project[];
}

export function ProjectsSection({ initialProjects = [] }: ProjectsSectionProps) {
  const { isOwner } = useOwner();
  const [isEditing, setIsEditing] = useState(false);
  const [projects, setProjects] = useState(initialProjects);
  
  // Similar edit/save logic
  // POST to /api/projects/update
}
```

### 2. Fetch in Page Component
```tsx
import { getProjects } from "@/lib/data/projects";

export default async function HomePage() {
  const projects = await getProjects();
  
  return <ProjectsSection initialProjects={projects} />;
}
```

### 3. API Route Already Exists
- `app/api/projects/update/route.ts` already implemented
- Uses same `verifyOwner()` pattern
- Supports upsert operations

### 4. Add Edit UI
- Follow same pattern as ContactSection
- Edit button when `isOwner === true`
- Inline form or modal
- Save/Cancel with loading states

---

## 🚀 Next Steps

### Immediate (Ready to Use)
1. **Test with real data**
   - Add settings to Supabase `site_settings` table
   - Log in as owner (Shift+O × 3)
   - Edit and save contact info

2. **Customize styling**
   - Adjust colors in ContactSection
   - Change card layout
   - Modify toast appearance

### Future Enhancements
1. **Projects Section**
   - Reuse this pattern for inline project editing
   - Add image upload for project thumbnails
   - Rich text editor for descriptions

2. **Experience Section**
   - Timeline editor with drag-and-drop
   - Add/remove experience entries
   - Date range picker

3. **Hero Section**
   - Edit headline, subheading, CTA text
   - Upload profile image
   - Edit background visuals

4. **Advanced Features**
   - Real-time updates (Supabase subscriptions)
   - Optimistic UI updates
   - Undo/redo functionality
   - Draft/publish workflow

---

## 🛠️ Troubleshooting

### Edit Button Not Showing
- Check: Are you logged in? (Shift+O × 3)
- Check: Is `isOwner` true in OwnerContext?
- Check: Does `session.user.id` match `OWNER_ID`?

### Save Button Not Working
- Check browser console for errors
- Check Network tab → POST to `/api/settings/update`
- Check response status code and body
- Verify Supabase connection

### Toast Not Appearing
- Check: Is `toast()` function imported?
- Check: Browser console for errors
- Try: `toast.success("Test")` in component

### Data Not Persisting
- Check: Supabase table `site_settings` exists
- Check: RLS policies allow authenticated updates
- Check: Session cookie is valid
- Try: Query directly in Supabase SQL editor

---

## 📊 Database Schema Reference

### `site_settings` Table
```sql
CREATE TABLE site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Policies
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read
CREATE POLICY "Public read access"
  ON site_settings FOR SELECT
  TO authenticated, anon
  USING (true);

-- Only owner can write
CREATE POLICY "Owner can update"
  ON site_settings FOR ALL
  TO authenticated
  USING (auth.uid() = 'YOUR_OWNER_ID'::uuid);
```

### Sample Data
```sql
INSERT INTO site_settings (key, value) VALUES
  ('contact_email', 'your.email@example.com'),
  ('github_url', 'https://github.com/yourusername'),
  ('linkedin_url', 'https://linkedin.com/in/yourusername'),
  ('x_url', 'https://x.com/yourusername');
```

---

## ✅ Success Criteria Met

- [x] Data read from Supabase `site_settings` table
- [x] Server-side rendering with `getSettings()`
- [x] Owner-only edit controls (no visibility for non-owners)
- [x] Inline edit form (no new page/modal)
- [x] Protected API with session validation + owner check
- [x] Bulk update support for efficiency
- [x] Toast notifications (success/error)
- [x] Clean UI consistent with dark theme
- [x] No OWNER_ID exposure to client
- [x] Minimal dependencies (no heavy validation libraries)
- [x] Reusable pattern for other sections

---

**The ContactSection is production-ready and demonstrates the full owner edit workflow!**

Use this as the template for implementing editable Projects, Experience, and other content sections.
