# Accessibility & UX Design Guidelines

## Mission
Every page and component MUST meet WCAG 2.1 Level AA standards and follow UX best practices. Accessibility is not optional - it's a core requirement for all development.

---

## 1. Color Contrast (WCAG 2.1 AA)

### Required Contrast Ratios
- **Normal text (< 18pt)**: Minimum 4.5:1 contrast ratio
- **Large text (≥ 18pt or ≥ 14pt bold)**: Minimum 3:1 contrast ratio
- **UI components and graphics**: Minimum 3:1 contrast ratio
- **Focus indicators**: Minimum 3:1 contrast ratio

### Testing Tools
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Coolors Contrast Checker](https://coolors.co/contrast-checker)
- Browser DevTools accessibility panel

### Implementation Rules
1. **ALWAYS set explicit text color** when overriding background color
2. Never rely on browser defaults for text color
3. When using light backgrounds, use dark text (text-gray-900, text-gray-800)
4. When using dark backgrounds, use light text (text-gray-100, text-white)

### Example
```tsx
// ❌ BAD - Light background without explicit text color
<div className="bg-white">
  <p>Text inherits potentially light color from parent</p>
</div>

// ✅ GOOD - Explicit text color with light background
<div className="bg-white text-gray-900">
  <p>Dark text on light background (high contrast)</p>
</div>

// ✅ GOOD - Dark background with light text
<div className="bg-gray-900 text-white">
  <p>Light text on dark background (high contrast)</p>
</div>
```

---

## 2. Keyboard Navigation

### Requirements
- **All interactive elements** must be keyboard accessible
- **Tab order** must be logical and match visual order
- **Focus indicators** must be clearly visible (minimum 3:1 contrast)
- **Skip links** for bypassing repeated content
- **Escape key** closes modals, dropdowns, and dialogs
- **Enter/Space** activates buttons and links

### Focus Styles
```tsx
// ✅ Always include visible focus states
<button className="... focus:ring-2 focus:ring-green-500 focus:outline-none">
  Click me
</button>

<input className="... focus:ring-2 focus:ring-green-500 focus:border-transparent" />
```

### Keyboard Shortcuts
- `Tab` - Move forward through interactive elements
- `Shift+Tab` - Move backward
- `Enter` - Activate buttons/links
- `Space` - Activate buttons, toggle checkboxes
- `Esc` - Close modals/dropdowns
- `Arrow keys` - Navigate within components (dropdowns, tabs, sliders)

---

## 3. ARIA Labels and Semantic HTML

### Semantic HTML First
Always use semantic HTML before adding ARIA attributes:

```tsx
// ✅ GOOD - Semantic HTML
<nav>
  <ul>
    <li><a href="/home">Home</a></li>
  </ul>
</nav>

// ❌ BAD - Div soup with ARIA
<div role="navigation">
  <div role="list">
    <div role="listitem"><div role="link">Home</div></div>
  </div>
</div>
```

### Required ARIA Attributes

#### Inputs
```tsx
<input
  type="text"
  aria-label="Search for plants"  // Required if no visible label
  aria-describedby="search-help"  // Link to help text
/>
<p id="search-help" className="text-sm text-gray-600">
  Enter at least 2 characters
</p>
```

#### Buttons
```tsx
// Icon-only buttons MUST have aria-label
<button aria-label="Close dialog">
  <X className="h-4 w-4" />
</button>

// Text buttons don't need aria-label
<button>Save Changes</button>
```

#### Autocomplete/Combobox
```tsx
<input
  role="combobox"
  aria-label="Search plants"
  aria-expanded={isOpen}
  aria-autocomplete="list"
  aria-controls="results-listbox"
/>

<div
  id="results-listbox"
  role="listbox"
  aria-label="Search results"
>
  <button role="option" aria-selected={isSelected}>
    Result item
  </button>
</div>
```

#### Modals/Dialogs
```tsx
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="dialog-title"
  aria-describedby="dialog-description"
>
  <h2 id="dialog-title">Confirm Action</h2>
  <p id="dialog-description">Are you sure?</p>
</div>
```

---

## 4. Touch Targets (Mobile Accessibility)

### Minimum Sizes
- **Touch targets**: Minimum 44×44px (WCAG 2.5.5)
- **Spacing between targets**: Minimum 8px

```tsx
// ✅ GOOD - Large enough touch target
<button className="min-h-[44px] min-w-[44px] px-4 py-2">
  Click
</button>

// ❌ BAD - Too small for touch
<button className="p-1 text-xs">
  Tiny button
</button>
```

---

## 5. Form Accessibility

### Labels
```tsx
// ✅ GOOD - Explicit label association
<label htmlFor="email" className="block text-sm font-medium text-gray-900">
  Email Address
</label>
<input
  id="email"
  type="email"
  aria-required="true"
  aria-invalid={hasError}
  aria-describedby={hasError ? "email-error" : undefined}
/>
{hasError && (
  <p id="email-error" className="text-red-600 text-sm mt-1">
    Please enter a valid email
  </p>
)}
```

### Required Fields
- Mark with `aria-required="true"`
- Visual indicator (asterisk or text)
- Never use color alone to indicate required fields

### Error Messages
- `aria-invalid="true"` on invalid inputs
- `aria-describedby` to link error messages
- Error messages must be programmatically associated
- Use clear, actionable error text

---

## 6. Images and Media

### Alt Text
```tsx
// ✅ GOOD - Descriptive alt text
<img
  src="/plant-photo.jpg"
  alt="Betula pendula with silvery-white bark and delicate branches"
/>

// ✅ GOOD - Decorative image (empty alt)
<img
  src="/decorative-border.svg"
  alt=""
  role="presentation"
/>

// ❌ BAD - No alt text
<img src="/plant.jpg" />
```

### Videos
- Provide captions for all video content
- Provide transcripts for audio content
- Ensure media players are keyboard accessible

---

## 7. Headings and Document Structure

### Heading Hierarchy
- Use `<h1>` for page title (one per page)
- Use `<h2>` for major sections
- Use `<h3>`, `<h4>`, etc. for subsections
- **Never skip heading levels** (don't jump from h2 to h4)

```tsx
// ✅ GOOD - Logical hierarchy
<h1>Plant Search</h1>
<h2>Search Results</h2>
<h3>Betula pendula</h3>

// ❌ BAD - Skipped h2
<h1>Plant Search</h1>
<h3>Results</h3>
```

---

## 8. Color and Visual Design

### Don't Rely on Color Alone
```tsx
// ❌ BAD - Color-only indicator
<span className="text-red-600">Error</span>
<span className="text-green-600">Success</span>

// ✅ GOOD - Color + icon + text
<span className="text-red-600 flex items-center gap-1">
  <X className="h-4 w-4" aria-hidden="true" />
  Error: Invalid input
</span>

<span className="text-green-600 flex items-center gap-1">
  <Check className="h-4 w-4" aria-hidden="true" />
  Success: Saved
</span>
```

---

## 9. Loading States and Feedback

### Loading Indicators
```tsx
// ✅ GOOD - Accessible loading state
<button disabled={isLoading} aria-busy={isLoading}>
  {isLoading ? (
    <>
      <Loader2 className="animate-spin h-4 w-4 mr-2" aria-hidden="true" />
      <span>Loading...</span>
    </>
  ) : (
    'Submit'
  )}
</button>
```

### Status Messages
```tsx
// ✅ GOOD - Announce status to screen readers
<div role="status" aria-live="polite" className="sr-only">
  {statusMessage}
</div>
```

---

## 10. Responsive Design

### Mobile-First Approach
- Start with mobile design, enhance for larger screens
- Use responsive breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Test on real devices and screen sizes

### Text Sizing
- Minimum font size: 16px for body text
- Allow user to zoom up to 200% without breaking layout
- Use relative units (rem, em) instead of fixed pixels

---

## 11. Testing Checklist

### Before Every Deploy
- [ ] Run automated accessibility tests (axe DevTools, Lighthouse)
- [ ] Test keyboard navigation (Tab, Enter, Esc, Arrow keys)
- [ ] Test with screen reader (VoiceOver on Mac, NVDA on Windows)
- [ ] Check color contrast with WebAIM checker
- [ ] Test on mobile device (touch targets, zoom)
- [ ] Verify all form inputs have labels
- [ ] Verify all interactive elements have focus states
- [ ] Check heading hierarchy with browser DevTools
- [ ] Verify ARIA attributes are correct
- [ ] Test with browser zoom at 200%

### Automated Tools
- **axe DevTools** (browser extension)
- **Lighthouse** (Chrome DevTools)
- **WAVE** (browser extension)
- **pa11y** (command-line tool)

---

## 12. Common Patterns

### Card Component
```tsx
<article className="bg-white text-gray-900 border border-gray-200 rounded-lg p-6">
  <h3 className="text-xl font-bold text-gray-900">
    Card Title
  </h3>
  <p className="text-gray-600 mt-2">
    Card description
  </p>
  <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:outline-none">
    Action
  </button>
</article>
```

### Modal Dialog
```tsx
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="dialog-title"
  className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
  onClick={(e) => {
    if (e.target === e.currentTarget) onClose();
  }}
>
  <div className="bg-white text-gray-900 rounded-lg p-6 max-w-md">
    <h2 id="dialog-title" className="text-xl font-bold text-gray-900">
      Dialog Title
    </h2>
    <p className="text-gray-600 mt-2">Dialog content</p>
    <div className="flex gap-2 mt-6">
      <button
        onClick={onConfirm}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:outline-none"
      >
        Confirm
      </button>
      <button
        onClick={onClose}
        className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 focus:ring-2 focus:ring-gray-500 focus:outline-none"
      >
        Cancel
      </button>
    </div>
  </div>
</div>
```

---

## 13. Dark Mode Considerations

When implementing theme overrides:

```tsx
// ✅ GOOD - Explicit colors for light theme
<div className="bg-white text-gray-900">
  <p className="text-gray-600">Subtext</p>
</div>

// ✅ GOOD - Theme-aware with proper contrast
<div className="bg-background text-foreground">
  <p className="text-muted-foreground">Subtext</p>
</div>

// ❌ BAD - Mixed theme colors (light bg + dark text variable)
<div className="bg-white text-foreground">  {/* foreground might be light! */}
  <p>Invisible text</p>
</div>
```

---

## 14. Screen Reader Best Practices

### Hidden Content
```tsx
// Visually hidden but available to screen readers
<span className="sr-only">
  Screen reader only text
</span>

// Hidden from everyone including screen readers
<div aria-hidden="true">
  Decorative content
</div>
```

### Live Regions
```tsx
// Polite announcements (non-urgent)
<div role="status" aria-live="polite">
  5 new results
</div>

// Assertive announcements (urgent)
<div role="alert" aria-live="assertive">
  Error: Form submission failed
</div>
```

---

## 15. Quick Reference: Tailwind Accessibility Classes

```tsx
// Focus states
focus:ring-2 focus:ring-green-500 focus:outline-none

// Screen reader only
sr-only  // Visually hidden but accessible

// Touch targets (minimum 44×44px)
min-h-[44px] min-w-[44px]

// Text contrast on light backgrounds
text-gray-900 text-gray-800 text-gray-700

// Text contrast on dark backgrounds
text-white text-gray-100 text-gray-200

// Placeholder text
placeholder:text-gray-400 placeholder:text-gray-500
```

---

## 16. Resources

### Official Guidelines
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

### Testing Tools
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [Lighthouse](https://developer.chrome.com/docs/lighthouse)
- [WAVE Browser Extension](https://wave.webaim.org/extension/)

### Screen Readers
- **macOS**: VoiceOver (Cmd+F5)
- **Windows**: NVDA (free), JAWS (paid)
- **iOS**: VoiceOver (Settings > Accessibility)
- **Android**: TalkBack (Settings > Accessibility)

---

## Remember

> **Accessibility is not a feature - it's a fundamental requirement.**

Every page, component, and interaction MUST be:
1. **Perceivable** - Users can perceive the content
2. **Operable** - Users can operate the interface
3. **Understandable** - Users can understand the content and operation
4. **Robust** - Content works with current and future technologies

When in doubt, **test with real assistive technologies and ask real users**.
