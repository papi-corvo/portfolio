# Changelog

All notable changes to this portfolio are listed here, newest version first.

## v0.1.0 — Initial development release

First version of the portfolio system. Some content is original and some is placeholder.

### Interface and atmosphere
- Dark cinematic theme with a deep black and navy palette and soft ambient glow
- Animated film grain, faint grid overlay, vignette and floating particles
- Corner indicators on all four screen corners
- Frosted glass panels with thin borders, rounded corners and soft reflections
- Silver gradient headings and pill-style labels

### Boot sequence
- Initialization screen with a thin progress line, pulsing dots and a status readout
- "SYSTEM ONLINE" confirmation before the page is revealed

### Cursor and scanner (desktop)
- Custom reticle cursor with a fast signal dot and a slower, smoother frame
- Reticle reacts to buttons, cards and project entries, with small status labels (ACTIVE, OPEN, ANALYZE, ACCESS)
- Scanner effect that intensifies grain, reveals the grid and brightens glass panels near the cursor
- Scanner redrawn with lightweight layers for better performance

### Sections
- **Hero:** name, role, typing line ("I make video games / websites / applications"), and four floating status cards
- **Skill database:** ten skill cards with level bars and animated hover borders
- **Project archive:** three project cards with technology stack, description and action buttons
- **Journey log:** filterable timeline with a scroll-filling spine, lock-on nodes, a current-entry marker and image frames
- **Profile dashboard:** education, interests, technical areas, career goals and certifications
- **Contact terminal:** email, LinkedIn, GitHub and location in a command-line style panel

### System details
- Top bar with navigation, status chip and round icon buttons
- Footer status bar with live dev time (PHT), last update date and build version
- Development notice shown shortly after the page loads, with a "Got it" button and Esc to close

### Mobile
- Separate rules for touch devices: no cursor effects, grain stays
- Lighter blur and still background animation for smoother performance
- Layout adapts for tablet and phone screens

### Fixed
- Boot sequence crash caused by a negative progress value
- Typing line starting before the page finished loading
- Duplicate links in the top navigation
- "Last update" now shows the release date instead of the visitor's current date

### Known gaps
- Several links still point to placeholders
- Navigation menu is hidden on phones
- Some Journey, profile and certification entries are placeholders

### Planned
- Working links, mobile menu, favicon and share preview
- Patch notes panel opened from the version label
- Resume download button and project detail view