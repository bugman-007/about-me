# Testing the Contact Section Editor

## Quick Start

### 1. Add Sample Data to Supabase

In your Supabase SQL Editor, run:

```sql
-- Insert contact settings
INSERT INTO site_settings (key, value) VALUES
  ('contact_email', 'john.doe@example.com'),
  ('github_url', 'https://github.com/johndoe'),
  ('linkedin_url', 'https://linkedin.com/in/johndoe')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
```

### 2. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

### 3. Test as Non-Owner (Public View)

✅ You should see:
- Contact section with 3 cards (Email, GitHub, LinkedIn)
- Each card is clickable
- **NO edit button** visible

### 4. Activate Owner Mode

Press **Shift+O** three times quickly (within 1 second)

This opens the login modal.

### 5. Log In as Owner

Use the email/password you created in Supabase Auth

After successful login, you'll see:
- ✅ Small pencil icon appears in Contact section header

### 6. Edit Contact Information

1. Click the **pencil icon** (✏️)
2. Form appears inline with 4 fields
3. Edit any field (e.g., change email)
4. Click **Save Changes**
5. Watch for success toast (green notification)
6. Form closes, new values display immediately

### 7. Verify Persistence

1. Refresh the page
2. Contact section shows updated values
3. Check Supabase dashboard → `site_settings` table → values are updated

---

## Testing Checklist

### Public User Experience
- [ ] Contact section displays with data
- [ ] Cards are styled correctly (icons, hover effects)
- [ ] Links work (email opens mail client, URLs open in new tab)
- [ ] NO edit controls visible
- [ ] Empty state shows if no data exists

### Owner Experience
- [ ] Login modal appears with Shift+O×3
- [ ] Login works with valid credentials
- [ ] Edit button (pencil icon) appears after login
- [ ] Clicking edit shows inline form
- [ ] All 4 fields are editable
- [ ] Cancel button closes form without saving
- [ ] Save button shows "Saving..." during request
- [ ] Success toast appears after save
- [ ] Form closes after successful save
- [ ] New values display immediately
- [ ] Values persist after page refresh

### Security Tests
- [ ] Try editing without logging in → No edit button
- [ ] Try POST to API without auth → Returns 403
- [ ] Log in with non-owner account → Edit button doesn't appear
- [ ] Only owner ID can update settings

### Edge Cases
- [ ] Empty email field → Saves successfully (field becomes hidden)
- [ ] Invalid URL format → Still saves (validation is basic)
- [ ] Network error during save → Shows error toast
- [ ] Multiple rapid saves → Only one request at a time
- [ ] Edit, cancel, edit again → Form resets properly

---

## Expected Behavior

### Display Mode (Default)
```
╔═══════════════════════════════════════╗
║ Get in Touch                     [✏️] ║ ← Pencil icon (owner only)
║ Interested in working together?       ║
║                                        ║
║ ┌────────────────────────────────┐   ║
║ │ 📧 Email                       │   ║
║ │ john.doe@example.com           │   ║ ← Clickable (mailto:)
║ └────────────────────────────────┘   ║
║                                        ║
║ ┌────────────────────────────────┐   ║
║ │ 🔗 GitHub                      │   ║
║ │ github.com/johndoe             │   ║ ← Opens in new tab
║ └────────────────────────────────┘   ║
║                                        ║
║ ┌────────────────────────────────┐   ║
║ │ 💼 LinkedIn                    │   ║
║ │ linkedin.com/in/johndoe        │   ║
║ └────────────────────────────────┘   ║
╚═══════════════════════════════════════╝
```

### Edit Mode (Owner)
```
╔═══════════════════════════════════════╗
║ Get in Touch                           ║
║ Interested in working together?        ║
║                                         ║
║ ┌─────────────────────────────────┐   ║
║ │ Email Address                   │   ║
║ │ ┌─────────────────────────────┐ │   ║
║ │ │john.doe@example.com         │ │   ║
║ │ └─────────────────────────────┘ │   ║
║ │                                 │   ║
║ │ GitHub URL                      │   ║
║ │ ┌─────────────────────────────┐ │   ║
║ │ │https://github.com/johndoe   │ │   ║
║ │ └─────────────────────────────┘ │   ║
║ │                                 │   ║
║ │ LinkedIn URL                    │   ║
║ │ ┌─────────────────────────────┐ │   ║
║ │ │https://linkedin.com/in/...  │ │   ║
║ │ └─────────────────────────────┘ │   ║
║ │                                 │   ║
║ │ X / Twitter URL (Optional)      │   ║
║ │ ┌─────────────────────────────┐ │   ║
║ │ │                             │ │   ║
║ │ └─────────────────────────────┘ │   ║
║ │ ───────────────────────────────│   ║
║ │              [Cancel] [Save ✓] │   ║
║ └─────────────────────────────────┘   ║
╚═══════════════════════════════════════╝
```

---

## API Request Examples

### What Happens When You Click Save

**Request:**
```http
POST /api/settings/update HTTP/1.1
Content-Type: application/json
Cookie: sb-access-token=...

{
  "updates": {
    "contact_email": "john.doe@example.com",
    "github_url": "https://github.com/johndoe",
    "linkedin_url": "https://linkedin.com/in/johndoe",
    "x_url": ""
  }
}
```

**Successful Response:**
```json
{
  "success": true,
  "updated": 4,
  "data": [
    {
      "id": "...",
      "key": "contact_email",
      "value": "john.doe@example.com",
      "updated_at": "2026-02-03T..."
    },
    // ... 3 more objects
  ]
}
```

**Error Response (Not Authenticated):**
```json
{
  "error": "Unauthorized"
}
```
Status: `403 Forbidden`

---

## Troubleshooting

### "No contact information available" shows up

**Cause:** No data in `site_settings` table

**Fix:**
1. Go to Supabase SQL Editor
2. Run the INSERT query from step 1 above
3. Refresh page

---

### Edit button doesn't appear

**Cause:** Not logged in as owner

**Fix:**
1. Press Shift+O three times quickly
2. Log in with owner credentials
3. Check that your user ID matches `OWNER_ID` in `.env.local`

---

### Save button shows error toast

**Possible causes:**
- Network error (check browser console)
- Supabase connection issue
- RLS policy blocking update

**Debug:**
1. Open browser DevTools → Network tab
2. Click Save and watch for request to `/api/settings/update`
3. Check response status and body
4. Check browser console for errors

**Common fixes:**
- Verify RLS policy allows owner to update
- Check Supabase credentials in `.env.local`
- Ensure you're logged in (session active)

---

### Values don't persist after refresh

**Cause:** Database write failed silently

**Check:**
1. Supabase dashboard → Table Editor → `site_settings`
2. See if `updated_at` timestamp changed
3. Check API response in Network tab

**Fix:**
- Verify RLS policy allows updates for owner
- Check Supabase logs for errors

---

## Next: Extend to Projects

Once contact editing works, apply the same pattern to projects:

1. Create `ProjectsSection` with `initialProjects` prop
2. Add edit mode with form for project details
3. POST to `/api/projects/update` (already exists!)
4. Use same toast notifications
5. Same owner-only controls

**The pattern is proven and reusable! 🎉**
