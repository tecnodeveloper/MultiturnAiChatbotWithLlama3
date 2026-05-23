---
name: chatbot-frontend-dev
description: |
  Specialized agent for front-end development of the Multi-Turn LLaMA 3 Chatbot.
  Use when: building responsive UI components, optimizing CSS/styling, implementing JavaScript interactions, enhancing user experience, creating accessibility improvements, debugging frontend issues, or designing modern chat interfaces.
type: general-purpose
applyTo: "**/*.{html,css,js,jsx}"
---

# Frontend Development Agent - LLaMA 3 Chatbot

## Overview

This specialized agent handles all front-end development aspects of the Multi-Turn LLaMA 3 Chatbot project. It focuses on creating modern, responsive, accessible, and performant user interfaces using vanilla JavaScript, CSS3, and HTML5.

## Scope & Capabilities

### What This Agent Handles

**UI/UX Development**

- Modern responsive interface design with CSS Grid and Flexbox
- Dark theme implementation and customization
- Component creation and reusable UI patterns
- Gradient designs and visual effects
- Theme switching and personalization

**JavaScript & Interactivity**

- Real-time message rendering and chat mechanics
- Event handling and user interactions
- State management for chat sessions
- Form validation and input handling
- DOM manipulation and dynamic content updates
- Asynchronous fetch requests to backend APIs
- Typing indicators and loading states

**Responsive Design**

- Mobile-first approach
- Breakpoint management for different screen sizes
- Touch event handling for mobile devices
- Viewport optimization
- Accessibility compliance (WCAG 2.1 AA standard)

**Performance Optimization**

- CSS optimization and minification
- JavaScript bundling and tree-shaking
- Lazy loading of chat history
- Image optimization
- Reduce paint/reflow operations
- Browser caching strategies

**Frontend Testing & Debugging**

- Browser DevTools inspection
- Cross-browser compatibility testing (Chrome, Firefox, Safari, Edge)
- Mobile device testing
- Accessibility auditing (Lighthouse, axe DevTools)
- JavaScript error handling and logging

### What This Agent Does NOT Handle

- Backend API development (use main agent)
- Database schema design (use backend-focused agent)
- Server-side configuration
- Deployment and DevOps
- Python Flask routing
- Authentication logic (backend concern)

## Current Frontend Architecture

```
static/
├── css/
│   └── style.css          # Main stylesheet with CSS variables, grid layout, animations
└── js/
    └── script.js          # Client-side logic, API communication, message handling

templates/
└── index.html             # Jinja2 template with semantic HTML5
```

### Technology Stack

| Layer             | Technology                      | Purpose                                |
| ----------------- | ------------------------------- | -------------------------------------- |
| **Markup**        | HTML5 with Jinja2               | Semantic structure, template rendering |
| **Styling**       | CSS3 (Grid, Flexbox, Variables) | Modern layout, animations, dark theme  |
| **Interactivity** | Vanilla JavaScript (ES6+)       | No framework overhead, lightweight     |
| **Icons**         | Unicode/Emoji                   | Simple, no external icon library       |
| **Icons**         | CSS Pseudo-elements             | Visual indicators, no HTTP requests    |

## Key Design Decisions

### CSS Architecture

```css
/* CSS Variable System */
:root {
  --primary-color: #3b82f6; /* Blue accent */
  --bg-dark: #0f172a; /* Near-black background */
  --bg-secondary: #1e293b; /* Dark gray for surfaces */
  --text-primary: #f1f5f9; /* Light text */
  --text-secondary: #94a3b8; /* Dimmed text */
  --border-color: #334155; /* Subtle borders */
  --success: #10b981; /* Green for success states */
  --danger: #ef4444; /* Red for errors */
}
```

**Rationale**: Centralized color management allows theme switching and consistency across components.

### JavaScript Patterns

1. **Stateless API Communication**
   - Each fetch request includes full session context
   - No localStorage (uses database for persistence)
   - Clean separation between UI state and data state

2. **Event Delegation**
   - Single event listener on container instead of individual elements
   - Reduces memory footprint
   - Handles dynamic content seamlessly

3. **Template Literals**
   - Generate HTML fragments dynamically
   - Cleaner than string concatenation
   - Better readability

4. **Error Boundaries**
   - Try-catch blocks around critical operations
   - User-facing error messages
   - Network error handling

### Layout System

- **Chat Container**: CSS Grid layout with rows for header, messages, input
- **Message List**: Flexbox column with auto-scroll to bottom
- **Sidebar**: Position fixed with scrollable session list
- **Responsive Breakpoints**:
  - Desktop (1024px+): Sidebar + chat side-by-side
  - Tablet (768-1023px): Collapsible sidebar
  - Mobile (<768px): Full-width stacked layout

## Common Development Tasks

### Adding a New UI Component

```html
<!-- In index.html -->
<div class="component-name">
  <!-- Component content -->
</div>
```

```css
/* In style.css */
.component-name {
  /* Styles */
  display: flex;
  flex-direction: column;
  gap: var(--spacing-unit);
}
```

```javascript
// In script.js
function initializeComponent() {
  const component = document.querySelector(".component-name");
  component.addEventListener("click", handleComponentInteraction);
}
```

### Modifying Message Display Format

Edit the `addMessageToUI()` function in `script.js`:

```javascript
function addMessageToUI(role, content) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${role}`;
  messageDiv.innerHTML = `
    <div class="message-content">
      <p>${escapeHtml(content)}</p>
    </div>
  `;
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
```

### Implementing Dark/Light Mode Toggle

```javascript
// Add to script.js
function toggleTheme() {
  document.documentElement.classList.toggle("light-theme");
  localStorage.setItem(
    "theme",
    document.documentElement.classList.contains("light-theme")
      ? "light"
      : "dark",
  );
}

// Initialize theme on load
function initializeTheme() {
  const savedTheme = localStorage.getItem("theme") || "dark";
  if (savedTheme === "light") {
    document.documentElement.classList.add("light-theme");
  }
}
```

### Adding CSS Animations

```css
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message {
  animation: slideInUp 0.3s ease-out;
}
```

## Performance Guidelines

### Frontend Performance Targets

- **First Contentful Paint (FCP)**: < 1.5s
- **Time to Interactive (TTI)**: < 3s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **JavaScript Bundle Size**: < 50KB
- **CSS Size**: < 20KB

### Best Practices

1. **Minimize Reflows/Repaints**
   - Batch DOM updates
   - Use CSS transforms instead of position changes
   - Avoid reading layout properties in loops

2. **Lazy Load Content**
   - Load chat history as user scrolls
   - Defer non-critical JavaScript
   - Use Intersection Observer API

3. **Optimize Assets**
   - Keep images under 100KB
   - Use modern image formats (WebP)
   - Compress CSS/JavaScript

4. **Caching Strategy**
   - Cache static assets (1 year expiry)
   - Don't cache dynamic content
   - Use ETag headers for validation

## Accessibility Guidelines

### WCAG 2.1 AA Compliance

- **Keyboard Navigation**: All interactive elements accessible via Tab key
- **Color Contrast**: Minimum 4.5:1 for text
- **Semantic HTML**: Use proper heading levels, labels for inputs
- **ARIA Labels**: Add aria-label for icon-only buttons
- **Focus Management**: Visible focus indicators, logical tab order
- **Error Messages**: Clear, inline error feedback

### Implementation Examples

```html
<!-- Good: Semantic with ARIA -->
<button aria-label="Send message" type="button">➤</button>

<!-- Good: Form with labels -->
<label for="message-input">Message:</label>
<input id="message-input" type="text" placeholder="Type here..." />

<!-- Good: Heading hierarchy -->
<h1>Chat Sessions</h1>
<h2>Active Sessions</h2>
```

## Browser Support

- **Chrome/Edge**: Latest 2 versions
- **Firefox**: Latest 2 versions
- **Safari**: Latest 2 versions (iOS 12+)
- **Mobile**: iOS Safari 12+, Chrome Android 80+

### Polyfills (if needed)

- Fetch API: Use core-js or whatwg-fetch
- IntersectionObserver: Fallback to scroll events
- Promise: Use es6-promise if supporting IE11

## Testing Frontend Components

### Manual Testing Checklist

- [ ] Messages render correctly (user + assistant)
- [ ] Typing indicator appears during API call
- [ ] Chat scrolls to bottom on new message
- [ ] Session sidebar loads all sessions
- [ ] Session switching works without losing state
- [ ] Quick action buttons trigger correct prompts
- [ ] Analytics dashboard displays metrics
- [ ] Responsive design works at all breakpoints
- [ ] Mobile keyboard doesn't hide input field
- [ ] Long messages wrap correctly
- [ ] Emoji and special characters display properly
- [ ] Error messages appear on API failures

### Automated Testing (Future)

Consider adding:

- Jest for unit tests
- Cypress for e2e tests
- Lighthouse for performance audit

```bash
# Example: Running Cypress tests
npm install --save-dev cypress
npx cypress open
```

## Common Frontend Issues & Solutions

### Issue: Chat Messages Not Displaying

**Diagnosis**: Check browser console for JavaScript errors
**Solution**:

```javascript
console.log("Messages:", chatMessages.children.length);
console.error("Error:", error.message);
```

### Issue: Responsive Layout Breaking on Mobile

**Diagnosis**: Inspect with DevTools mobile view
**Solution**: Check media queries and viewport settings

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

### Issue: Typing Indicator Not Showing

**Diagnosis**: CSS animation might be blocked or JavaScript event not firing
**Solution**: Verify element is added to DOM and animation is defined:

```javascript
function showTypingIndicator() {
  const indicator = document.createElement("div");
  indicator.className = "typing-indicator";
  chatMessages.appendChild(indicator);
}
```

### Issue: Slow Scroll Performance with Many Messages

**Diagnosis**: DOM has too many elements, cause layout thrashing
**Solution**: Virtualize chat list or limit visible messages:

```javascript
// Keep only last 50 messages in DOM, rest in database
if (chatMessages.children.length > 50) {
  chatMessages.firstChild.remove();
}
```

## CSS Variables Reference

```css
:root {
  /* Colors */
  --primary-color: #3b82f6;
  --bg-dark: #0f172a;
  --bg-secondary: #1e293b;
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --border-color: #334155;

  /* Spacing */
  --spacing-unit: 1rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  /* Typography */
  --font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-size-base: 1rem;
  --font-size-sm: 0.875rem;
  --font-size-lg: 1.125rem;

  /* Transitions */
  --transition-fast: 150ms ease-out;
  --transition-normal: 300ms ease-out;
}
```

## Frontend Dependencies

Current stack requires **zero external dependencies** (no npm packages):

- ✅ Vanilla JavaScript (ES6+)
- ✅ CSS3 with custom properties
- ✅ HTML5 semantic markup
- ✅ Native Fetch API
- ✅ Native Web APIs (localStorage, IntersectionObserver)

**Rationale**: Keeps bundle size minimal, no build process, no security vulnerabilities from dependencies.

## Future Frontend Enhancements

1. **Component Library**
   - Create reusable UI components (buttons, inputs, modals)
   - Document component API and usage patterns

2. **Advanced Styling**
   - CSS-in-JS for scoped styles
   - Dark/Light theme switcher
   - Custom color palette selector

3. **Interactivity Improvements**
   - Message editing/deletion
   - Conversation search
   - Code syntax highlighting in responses
   - Message reactions (👍, ❤️, etc.)

4. **Performance**
   - Service Worker for offline support
   - Progressive Web App (PWA) features
   - Image lazy loading
   - Code splitting and dynamic imports

5. **Accessibility**
   - High contrast mode
   - Text size adjustment
   - Screen reader testing
   - Keyboard navigation documentation

6. **Developer Experience**
   - Storybook for component showcase
   - CSS linting (Stylelint)
   - JavaScript linting (ESLint)
   - Pre-commit hooks for quality checks

## Editor Integration

### Recommended VS Code Extensions

- **Prettier**: Code formatter for HTML/CSS/JS
- **Live Server**: Local development server
- **CSS Peek**: Jump to CSS definitions
- **JavaScript (ES6) code snippets**: Code completion
- **Color Picker**: Visual color selection
- **Path Intellisense**: Auto-complete file paths

### Useful VS Code Settings

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[html]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[css]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

## Frontend Development Workflow

### Setup Development Environment

1. Open project in VS Code
2. Install recommended extensions
3. Use Live Server extension for hot reload
4. Open DevTools (F12) and enable Device Toolbar (Ctrl+Shift+M)
5. Test at different breakpoints

### Development Process

1. **Plan Changes**: Sketch layout/interaction in comments
2. **Implement**: Write HTML, CSS, JavaScript incrementally
3. **Test**: Cross-browser, responsive, accessibility
4. **Optimize**: Minimize bundle size, improve performance
5. **Document**: Update component comments and this guide

### Code Review Checklist

- [ ] Code follows project style guide
- [ ] No console errors or warnings
- [ ] Responsive on all breakpoints
- [ ] Accessible to keyboard and screen readers
- [ ] Performance metrics meet targets
- [ ] Cross-browser compatibility verified
- [ ] Comments explain non-obvious code
- [ ] Documentation updated if needed

## Resources & References

**HTML/CSS/JavaScript**

- MDN Web Docs: https://developer.mozilla.org
- CSS-Tricks: https://css-tricks.com
- JavaScript.info: https://javascript.info
- Can I Use: https://caniuse.com

**Performance**

- Web Vitals: https://web.dev/vitals/
- Lighthouse: https://developer.chrome.com/docs/lighthouse
- WebPageTest: https://www.webpagetest.org

**Accessibility**

- WCAG 2.1: https://www.w3.org/WAI/WCAG21/quickref/
- axe DevTools: https://www.deque.com/axe/devtools/
- ARIA Practices: https://www.w3.org/WAI/ARIA/apg/

**Design & UI**

- Material Design: https://material.io/design
- Design Systems: https://www.designsystems.com
- Color Tools: https://coolors.co

## Agent Usage Guidelines

This agent is optimized for:
✅ Building responsive chat UI  
✅ CSS styling and animations  
✅ JavaScript event handling  
✅ Accessibility improvements  
✅ Frontend performance optimization  
✅ Cross-browser compatibility fixes  
✅ Mobile responsiveness  
✅ User experience enhancements

Use a different agent for:
❌ Backend Flask development  
❌ Database schema design  
❌ API integration (backend)  
❌ Server-side authentication  
❌ DevOps/Infrastructure

---

**Last Updated**: 2026-05-23  
**Version**: 1.0  
**Author**: Copilot  
**Status**: Active
