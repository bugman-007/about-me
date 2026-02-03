# Architecture: Contact Section Edit Feature

## Component Hierarchy

```
app/page.tsx (Server Component)
  ├─ await getSettings() → Supabase query
  └─ ContactSection (Client Component)
      ├─ props: initialSettings
      ├─ useOwner() → { isOwner, ... }
      ├─ Display Mode (default)
      │   ├─ Section header with edit button (owner only)
      │   ├─ Contact cards (Email, GitHub, LinkedIn, X)
      │   └─ Empty state (if no data)
      └─ Edit Mode (when editing)
          ├─ Inline form
          │   ├─ Input fields (4x)
          │   ├─ Save button → POST /api/settings/update
          │   └─ Cancel button
          └─ Toast notifications
```

---

## Data Flow Diagram

### Read Flow (Page Load)
```
┌─────────────────────┐
│  User visits /      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────────┐
│  app/page.tsx (Server)      │
│  - Runs on server           │
│  - Async function           │
└──────────┬──────────────────┘
           │
           │ await getSettings()
           ▼
┌─────────────────────────────┐
│  lib/data/settings.ts       │
│  - createClient() (server)  │
│  - SELECT * FROM settings   │
└──────────┬──────────────────┘
           │
           │ Supabase query
           ▼
┌─────────────────────────────┐
│  Supabase Database          │
│  Table: site_settings       │
│  Columns: key, value        │
└──────────┬──────────────────┘
           │
           │ Returns: { contact_email: "...", ... }
           ▼
┌─────────────────────────────┐
│  ContactSection             │
│  props: initialSettings     │
│  - Maps to display cards    │
└─────────────────────────────┘
```

### Write Flow (Owner Edit)
```
┌─────────────────────┐
│  Owner clicks Edit  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────────┐
│  ContactSection             │
│  - setIsEditing(true)       │
│  - Show inline form         │
└──────────┬──────────────────┘
           │
           │ User edits & saves
           ▼
┌─────────────────────────────┐
│  fetch("/api/settings/...")  │
│  POST { updates: {...} }    │
│  Headers: Cookie (session)  │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│  API Route (Server)         │
│  /api/settings/update       │
└──────────┬──────────────────┘
           │
           │ 1. Read session from cookies
           ▼
┌─────────────────────────────┐
│  verifyOwner()              │
│  - Get user from session    │
│  - Compare with OWNER_ID    │
└──────────┬──────────────────┘
           │
           │ isOwner === true?
           ├─ NO ──→ Return 403 Forbidden
           │
           │ YES
           ▼
┌─────────────────────────────┐
│  createServerClient()       │
│  - Session-aware client     │
│  - RLS policies enforced    │
└──────────┬──────────────────┘
           │
           │ Bulk upsert
           ▼
┌─────────────────────────────┐
│  Supabase Database          │
│  UPSERT site_settings       │
│  WHERE key = $1             │
└──────────┬──────────────────┘
           │
           │ Success: { data, updated: 4 }
           ▼
┌─────────────────────────────┐
│  Return JSON to client      │
│  { success: true, ... }     │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│  ContactSection             │
│  - Update local state       │
│  - Close edit form          │
│  - Show success toast       │
└─────────────────────────────┘
```

---

## Security Layers

```
┌──────────────────────────────────────┐
│  Layer 1: UI (Client-Side)           │
│  ────────────────────────────────    │
│  • Edit button only renders if       │
│    isOwner === true                  │
│  • Form only accessible to owner     │
│  • No OWNER_ID in client code        │
└────────────┬─────────────────────────┘
             │
             │ POST request
             ▼
┌──────────────────────────────────────┐
│  Layer 2: Session (Cookies)          │
│  ────────────────────────────────    │
│  • Supabase auth cookie required     │
│  • HttpOnly, Secure, SameSite        │
│  • Automatic session validation      │
└────────────┬─────────────────────────┘
             │
             │ Session validated
             ▼
┌──────────────────────────────────────┐
│  Layer 3: Owner Check (Server)       │
│  ────────────────────────────────    │
│  • verifyOwner() function            │
│  • Compares session.user.id with     │
│    process.env.OWNER_ID (server)     │
│  • Returns 403 if not owner          │
└────────────┬─────────────────────────┘
             │
             │ Owner verified
             ▼
┌──────────────────────────────────────┐
│  Layer 4: RLS Policies (Supabase)    │
│  ────────────────────────────────    │
│  • Row Level Security enforced       │
│  • Policy: auth.uid() = OWNER_ID     │
│  • Database-level protection         │
└──────────────────────────────────────┘
```

**Result:** Four independent security layers ensure only the owner can modify settings.

---

## State Management

### ContactSection State
```typescript
// Display state (permanent)
const [settings, setSettings] = useState({
  contact_email: initialSettings.contact_email || "",
  github_url: initialSettings.github_url || "",
  linkedin_url: initialSettings.linkedin_url || "",
  x_url: initialSettings.x_url || "",
});

// Edit mode state
const [isEditing, setIsEditing] = useState(false);
const [isSaving, setIsSaving] = useState(false);

// Form state (temporary, only during edit)
const [formData, setFormData] = useState(settings);
```

### State Transitions
```
Initial Load
  ↓
Display Mode
  settings: { ... } from server
  isEditing: false
  isSaving: false
  
Click Edit
  ↓
Edit Mode
  formData: Copy of settings
  isEditing: true
  isSaving: false
  
Click Save
  ↓
Saving State
  isSaving: true
  (buttons disabled)
  
API Success
  ↓
Back to Display Mode
  settings: Updated from formData
  isEditing: false
  isSaving: false
  Toast: Success message
  
API Error
  ↓
Still in Edit Mode
  isSaving: false
  Toast: Error message
  
Click Cancel
  ↓
Back to Display Mode
  formData: Discarded
  isEditing: false
  settings: Unchanged
```

---

## API Contract

### Endpoint
```
POST /api/settings/update
```

### Authentication
```
Cookie: sb-access-token=...; sb-refresh-token=...
```

### Request Body (Bulk Update)
```typescript
{
  "updates": {
    "contact_email": string,
    "github_url": string,
    "linkedin_url": string,
    "x_url": string
  }
}
```

### Request Body (Single Update)
```typescript
{
  "key": string,
  "value": string
}
```

### Success Response (200)
```typescript
{
  "success": true,
  "updated": number,        // For bulk updates
  "data": SiteSetting[]     // Array of updated records
}
```

### Error Responses

**403 Forbidden (Not Owner)**
```json
{
  "error": "Unauthorized"
}
```

**400 Bad Request (Validation)**
```json
{
  "error": "No updates provided"
}
```

**500 Internal Server Error**
```json
{
  "error": "Failed to update settings",
  "details": "Database error message"
}
```

---

## File Dependencies

### ContactSection.tsx Dependencies
```typescript
// React
import { useState } from "react";

// Layout & Animations
import { Container } from "@/components/layout";
import { FadeIn } from "@/components/animations";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Context & Utils
import { useOwner } from "@/context/OwnerContext";
import { toast } from "@/lib/toast";

// Icons
import { Pencil, Mail, Github, Linkedin, Twitter, X, Save } from "lucide-react";
```

### API Route Dependencies
```typescript
// Next.js
import { NextRequest, NextResponse } from "next/server";

// Auth & Database
import { verifyOwner } from "@/lib/supabase/auth";
import { createClient as createServerClient } from "@/lib/supabase/server";
```

### Page Component Dependencies
```typescript
// Sections
import {
  HeroSection,
  SystemCapabilities,
  FeaturedProjects,
  ExperienceSection,
  ContactSection,
} from "@/components/sections";

// Data Layer
import { getSettings } from "@/lib/data/settings";
```

---

## Database Schema

### site_settings Table
```sql
CREATE TABLE site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE UNIQUE INDEX idx_site_settings_key ON site_settings(key);
CREATE INDEX idx_site_settings_updated ON site_settings(updated_at DESC);
```

### RLS Policies
```sql
-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can read site settings"
  ON site_settings
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- Owner-only write access
CREATE POLICY "Only owner can modify site settings"
  ON site_settings
  FOR ALL
  TO authenticated
  USING (auth.uid() = 'YOUR_OWNER_ID_HERE'::uuid)
  WITH CHECK (auth.uid() = 'YOUR_OWNER_ID_HERE'::uuid);
```

### Sample Data
```sql
-- Contact settings
INSERT INTO site_settings (key, value) VALUES
  ('contact_email', 'your.email@example.com'),
  ('github_url', 'https://github.com/yourusername'),
  ('linkedin_url', 'https://linkedin.com/in/yourusername'),
  ('x_url', 'https://x.com/yourusername')
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = now();
```

---

## Toast System Architecture

### Implementation
```typescript
// lib/toast.ts
interface ToastOptions {
  duration?: number;
  type?: "success" | "error" | "info";
}

export function toast(message: string, options?: ToastOptions) {
  // 1. Get/create container (fixed top-right)
  const container = getToastContainer();
  
  // 2. Create toast element
  const toastEl = document.createElement("div");
  toastEl.className = getToastStyles(type);
  toastEl.textContent = message;
  
  // 3. Animate in (slide from right)
  toastEl.style.transform = "translateX(100%)";
  container.appendChild(toastEl);
  requestAnimationFrame(() => {
    toastEl.style.transform = "translateX(0)";
  });
  
  // 4. Auto-dismiss (fade out after duration)
  setTimeout(() => {
    toastEl.style.opacity = "0";
    setTimeout(() => container.removeChild(toastEl), 300);
  }, duration);
}
```

### Usage
```typescript
// Success
toast.success("Settings saved!");

// Error
toast.error("Failed to save settings");

// Info
toast.info("Loading...");

// Custom
toast("Custom message", { type: "success", duration: 5000 });
```

---

## Performance Considerations

### Server-Side Rendering
- ✅ Data fetched on server (fast first load)
- ✅ No client-side loading spinner needed
- ✅ SEO-friendly (contact info in HTML)
- ✅ Works without JavaScript

### Client-Side Optimization
- ✅ Minimal state updates
- ✅ Form only rendered when editing
- ✅ Local state refresh (no full page reload)
- ✅ Debounced input (if needed, not implemented)

### Bundle Size
- Input/Label: ~2KB (shadcn/ui minimal)
- Toast system: ~1KB (no dependencies)
- Icons: Tree-shaken from lucide-react
- Total addition: ~11KB

### Network Requests
- **Page load:** 1 request (SSR data fetch)
- **Edit save:** 1 request (bulk update)
- **No polling:** Updates only on user action

---

## Error Handling

### Client-Side Errors
```typescript
try {
  const response = await fetch("/api/settings/update", {...});
  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.error || "Failed to save");
  }
  
  // Success handling
} catch (error) {
  console.error("Save error:", error);
  toast.error(error.message);
}
```

### Server-Side Errors
```typescript
try {
  // Validation, auth, database operations
} catch (error) {
  console.error("Server error:", error);
  return NextResponse.json(
    { error: "Internal server error" },
    { status: 500 }
  );
}
```

### Error Display
- **Network errors:** Toast with error message
- **Validation errors:** Toast with specific issue
- **Auth errors:** 403 response + toast
- **Database errors:** Logged + generic message to user

---

## Testing Strategy

### Unit Tests (Future)
- Test state transitions
- Test validation logic
- Test error handling
- Mock API responses

### Integration Tests (Future)
- Test full edit flow
- Test API endpoint
- Test RLS policies
- Test auth verification

### Manual Testing (Current)
- Public view (no edit button)
- Owner view (edit button appears)
- Edit and save flow
- Cancel without saving
- Error handling (network, auth, validation)

---

## Extension Points

### Add More Contact Methods
1. Add key to `SETTING_KEYS` in `lib/data/settings.ts`
2. Add input field to edit form
3. Add card to display mode
4. Icon from lucide-react

### Add Validation
```typescript
const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validateUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
```

### Add Real-Time Updates
```typescript
// In ContactSection
useEffect(() => {
  const supabase = createClient();
  
  const subscription = supabase
    .channel("settings-changes")
    .on("postgres_changes", 
      { event: "*", schema: "public", table: "site_settings" },
      (payload) => {
        // Update local state with new values
      }
    )
    .subscribe();
    
  return () => subscription.unsubscribe();
}, []);
```

---

**This architecture is production-ready and designed for extension! 🚀**
