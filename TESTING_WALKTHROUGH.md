# Private Vault - Testing & Manual Walkthrough Guide

## Quick Start

1. **Start the dev server:**

   ```bash
   npm run dev
   ```

2. **Open in browser:**

   ```
   http://localhost:3000
   ```

3. **Enter the password gate:**
   - Default password: `password` (check with existing backend implementation)
   - You should be authenticated from previous session

---

## Complete Visual Walkthrough

### 🔓 Password Gate

**Status:** Currently working - uses secure backend verification

**What to expect:**

- Dark theme with minimal design
- Grid background pattern
- Input field with arrow submit button
- Error message on wrong password
- Smooth fade-out animation on success

**Test:**

- [ ] Type incorrect password → see error and shake animation
- [ ] Clear and retry with correct password → smooth fade to vault

---

### 📖 Intro Section

**Timeline:** Plays on first load, then disappears

**What to expect:**

- Fixed full-screen overlay
- "Private vault · 01" label
- Large "Our story" heading
- Animated rule (horizontal line)
- Subtitle: "A friendship worth remembering"
- Fades out after ~2.5 seconds

**Animations:**

- Kicker text fades up with motion
- Rule scales in from center
- Subtitle fades in from bottom
- Entire section fades out and disappears

**Test:**

- [ ] Intro plays smoothly on first load
- [ ] No flicker or jumping
- [ ] Fades out cleanly
- [ ] Can scroll while intro is still visible

---

### 🎬 Section 01: Our Beginning

**What to see:** First hero image full-screen

**Layout:**

- Full-viewport background image (Image 1)
- Dark overlay gradient
- Left-aligned text:
  - "01 / our beginning" label
  - "Our Story" heading (from image title)
  - Year (2019)
  - Quote/description

**Animations on scroll:**

- Image zoomed in (1.12x) at top, scales down to normal size
- Text fades in and slides up from below
- Parallax between image and text moves at different speeds

**Test:**

- [ ] Image visible and fills viewport
- [ ] Scroll down → image smoothly scales
- [ ] Text appears and moves with parallax
- [ ] No jank or stuttering
- [ ] Responsive: Image maintains aspect on mobile

---

### 🙏 Section 02: Thank You For Coming Into My Life

**What to see:** Emotional centerpiece with layered media

**Layout:**

- Background: Image 2 (full-screen, slightly faded)
- Foreground text on right: "Thank You / For Coming / Into My Life"
- Center text: Emotional message (4 stanzas)
- Transparent PNG cutout (person/object) floating in center

**The Cutout PNG:**

- **Critical:** Should NOT have white/black rectangle around it
- Should appear to float naturally
- Drop shadow creates depth
- Responsive scaling
- No background color visible

**Animations on scroll:**

- Background image moves slowly (parallax yPercent: 15)
- Cutout fades in and floats up with spring motion
- Cutout continues subtle bobbing (4-second loop)
- Text fades in and reveals from below

**Test:**

- [ ] Background image visible without harsh opacity
- [ ] Cutout.png renders with transparent background (not white box)
- [ ] Cutout looks like it's floating in front of text
- [ ] Subtle shadow under cutout
- [ ] Parallax on background is subtle and smooth
- [ ] Floating motion on cutout is gentle and repeating
- [ ] Mobile: Cutout scales down but stays visible

---

### 📷 Section 03: Our Memories

**What to see:** Grid of memory cards with images and metadata

**Layout:**

- Section heading: "Our Memories" (03)
- Subtitle: "A collection of moments that shaped us"
- 3-column grid on desktop (Images 3-12, 10 items)
- Each card contains:
  - Image
  - Date
  - Title
  - Description
  - Tags (comma-separated keywords)

**Responsive Behavior:**

- Desktop (1024px+): 3 columns
- Tablet (768-1023px): 2 columns
- Mobile (< 768px): 1 column full-width

**Animations:**

- Each card fades in on scroll (once per page load)
- Hover effect: image scales 1.04x smoothly
- Stagger timing (one at a time)

**Test:**

- [ ] All 10 images display correctly
- [ ] Grid responsive on different screen sizes
- [ ] Cards fade in when scrolling into view
- [ ] Hover effect smooth and subtle
- [ ] Images have proper aspect ratios
- [ ] Text readable on all devices
- [ ] Tags display in small badges

---

### 🎪 Section 04: Our Chaos

**What to see:** Second gallery with remaining images

**Layout:**

- Section heading: "Our Chaos" (04)
- Quote: "We were never particularly normal"
- Subquote: "And honestly, I wouldn't change a thing."
- 3-column grid (Images 13-22, 10 items)
- Same card format as Section 03

**Tone:** Still premium/cinematic but with playful vibe

**Animations:** Same as Section 03

**Test:**

- [ ] All 10 images display correctly
- [ ] Different images than Section 03
- [ ] Playful quote messaging visible
- [ ] Grid responsive
- [ ] Animations smooth

---

### 💭 Section 05: Our Words

**What to see:** Expandable diary/letter entries

**Layout:**

- Section heading: "Our Words" (05)
- Subtitle: "Some things are easier to write than to say"
- Stack of 3 letter entry cards
- Each card shows:
  - Category badge (Letter/Note/Future)
  - Title heading
  - Mood badge (optional)
  - Date
  - Preview text when closed

**Interaction:**

- Click any entry to expand/collapse
- Full content revealed when open
- Smooth transition

**Test:**

- [ ] All 3 diary entries visible
- [ ] Can click to expand first entry
- [ ] Full content displays
- [ ] Can collapse by clicking again
- [ ] Other entries unaffected
- [ ] Smooth expand/collapse animation
- [ ] Text readable and well-formatted

---

### 🔒 Section 06: Future Us

**What to see:** Time capsules with locked state

**Layout:**

- Section heading: "Future Us" (06)
- Subtitle: "Time capsules waiting for their moment"
- 3-column grid of capsule cards
- Each card shows:
  - "Written" date
  - "Opens" date
  - 🔒 Lock icon (centered)
  - Capsule content text
  - Status message (e.g., "Still waiting for its time")

**Visual Design:**

- Cards have subtle gradient background
- Lock icon is large and centered (no actual functionality)
- Content is visible (not actually locked in UI)
- Status displays unlock readiness

**Animations:**

- Cards stagger in on scroll (0.2s between each)
- Subtle floating motion

**Test:**

- [ ] All 3 capsules visible
- [ ] Lock icon displays clearly
- [ ] Dates show correctly
- [ ] Status text visible
- [ ] Cards stagger in smoothly
- [ ] Card styling consistent

---

### ➕ Section 07: Still Growing

**What to see:** Add new memory feature

**Layout:**

- Section heading: "Still Growing" (07)
- Quote: "Our story didn't end with the memories we already made"
- "+ Add a new memory" button
- Hidden form that appears when button clicked

**Form Fields (when visible):**

- Title (text input)
- Date (date picker)
- Story (textarea)
- Memory type (dropdown: Photo/Video)
- Tags (text input, comma-separated)
- Cancel button
- Save Memory button

**Interaction:**

- Click button → form appears
- Fill in fields
- Click Save → alert appears (frontend-only)
- Form resets and closes
- Click Cancel → form closes without saving

**Test:**

- [ ] Button visible and clickable
- [ ] Click shows form
- [ ] Form has all expected fields
- [ ] Can type in fields
- [ ] Date picker works
- [ ] Dropdown has Photo/Video options
- [ ] Save button shows alert
- [ ] Form clears after submission
- [ ] Cancel button closes form

---

### 🏺 Section 08: Our Vault

**What to see:** Grand finale with vault overview

**Layout:**

- Full viewport centered content
- Section heading: "Our Vault" (08)
- Stats grid (4 columns):
  - Memories: 22
  - Letters: 4
  - Time Capsules: 3
  - Videos: 4
- Final message: "Some stories are meant to be remembered. Some are meant to be continued."
- "Happy Birthday" heading
- "my favorite person." (in warmer color)
- "This little place will always be ours."
- "Our Story Continues →" button

**Animations:**

- Section heading fades in
- Stats cards stagger in (0.15s between each)
- Final messages cascade in (0.2s between each)
- Button is clickable

**Test:**

- [ ] All stats visible and correct
- [ ] Heading fades in smoothly
- [ ] Stats cascade reveal
- [ ] Final messages appear in order
- [ ] Button clickable
- [ ] Click button → smooth scroll to top

---

## Navigation Testing

### Progress Indicator (Top Right)

**What to see:**

- Two numbers with line: "01 / 08"
- "Menu" button below

**Behavior:**

- Numbers update as you scroll through sections
- Always shows current section / total sections

**Test:**

- [ ] Starts at "01"
- [ ] Updates to "02" when you scroll to Section 02
- [ ] Updates to "03" at Section 03
- Continue through all 8 sections
- [ ] Updates smoothly (not jumpy)

### Navigation Menu

**What to see:**

- "Menu" button in top-right
- Click to expand list of all sections

**Behavior:**

- Clicking "Menu" shows dropdown with 8 items
- Each item shows section number and title
- Clicking a section number scrolls to that section
- Menu closes after selection
- On mobile: only button shows, no list behind it

**Test:**

- [ ] Menu button visible
- [ ] Click opens dropdown
- [ ] All 8 sections listed
- [ ] Section titles match expected
- [ ] Click section 03 → scrolls to Section 03
- [ ] Progress indicator updates
- [ ] Menu closes after selection
- [ ] Menu button hidden on mobile (< 640px)

---

## Responsive Design Testing

### Mobile (< 640px)

**Expected changes:**

- Single-column memory grid
- Reduced padding/margins
- Larger touch targets
- Navigation menu hidden (button only)
- Cutout PNG scales smaller but visible
- All sections stack vertically
- Text remains readable

**Test on:**

- [ ] iPhone 12 (390px)
- [ ] iPhone SE (375px)
- [ ] Android (360px, 412px)
- [ ] Portrait orientation
- [ ] Landscape orientation

### Tablet (640px - 1023px)

**Expected changes:**

- 2-column memory grid
- Medium padding
- Centered layout
- Navigation visible

**Test on:**

- [ ] iPad mini (768px)
- [ ] iPad (834px, 1024px)
- [ ] Galaxy Tab (600px)

### Desktop (1024px+)

**Expected behavior:**

- 3-column memory grid
- Full navigation
- Generous whitespace
- Large typography
- Smooth animations

**Test on:**

- [ ] 1440px
- [ ] 1920px
- [ ] 2560px (ultra-wide)

---

## Performance Checklist

- [ ] Page loads without visual flicker
- [ ] Intro animation plays smoothly
- [ ] Scrolling is smooth (no jank)
- [ ] Hover effects are responsive
- [ ] Form toggle is instant
- [ ] Navigation menu opens instantly
- [ ] Images load quickly (check Network tab)
- [ ] No console errors
- [ ] No console warnings
- [ ] Animations smooth on slow device throttle

---

## Accessibility Testing

- [ ] Can tab through all interactive elements
- [ ] Focus indicators visible (blue outline)
- [ ] Menu button has focus state
- [ ] Form fields have labels
- [ ] Images have alt text (browser DevTools)
- [ ] Navigation menu keyboard accessible
- [ ] All text meets contrast requirements
- [ ] Animations respect prefers-reduced-motion

**Test prefers-reduced-motion:**

1. Open DevTools → Ren­der → Check "Emulate CSS media feature prefers-reduced-motion"
2. Animations should stop, content should be in final state
3. All interactive elements still work
4. Text still readable

---

## Known Good States

✅ If you see all of the following, everything works:

1. **At password gate:**
   - Dark UI with input field
   - Can type password
   - Can submit

2. **After unlocking:**
   - Intro animation plays
   - Smooth fade-out after ~2.5s
   - Section 01 visible
   - Can scroll

3. **While scrolling:**
   - Progress indicator updates
   - Sections animate in
   - Images load
   - No errors in console

4. **At each section:**
   - Content visible
   - Images display correctly
   - Text readable
   - Animations smooth

5. **At end:**
   - Section 08 shows stats
   - Button scrolls to top

---

## Troubleshooting

| Issue                     | Solution                                                                           |
| ------------------------- | ---------------------------------------------------------------------------------- |
| Password gate not working | Check browser devtools Network tab; verify `/api/auth/unlock` endpoint             |
| Images not showing        | Check public/ folder exists; verify file permissions; open Network tab to see 404s |
| Animations stuttering     | Disable browser extensions; try incognito mode; check GPU acceleration enabled     |
| Cutout.png has white box  | File might not be PNG with transparency; check with image editor                   |
| Menu not appearing        | Mobile? Menu hidden on < 640px; use regular scrolling                              |
| Text not readable         | Check zoom level (Ctrl+0 to reset); check contrast in DevTools accessibility tab   |
| Form not submitting       | It's frontend-only; should show alert; check console for errors                    |

---

## Screenshot Moments

Capture screenshots of:

1. **Password gate** - Shows security design
2. **Intro animation** - Shows animation capability
3. **Section 01** - Full-screen hero image
4. **Section 02 cutout** - Shows transparency and layering
5. **Section 03 grid** - Shows responsive design
6. **Section 05 open** - Shows expandable content
7. **Section 06 capsules** - Shows lock design
8. **Section 08 vault** - Shows grand finale
9. **Mobile view** - Shows responsive stacking
10. **Navigation menu** - Shows all section links

---

## Next Steps for User

After visual testing, to connect to backend:

1. **Replace hardcoded memories:**
   - In Section03, replace `storyMedia.slice(2, 12)` with API call
   - Add loading state
   - Handle errors

2. **Connect diary entries:**
   - Fetch from `/api/letters`
   - Show loading while fetching
   - Update state on success

3. **Connect form:**
   - Replace alert() with actual `/api/memories` POST
   - Show success/error toast
   - Refresh memories list on success

4. **Add time capsule validation:**
   - Backend checks `unlockAt` date
   - Only returns unlocked capsules or shows locked state
   - Update UI based on real unlock status

---
