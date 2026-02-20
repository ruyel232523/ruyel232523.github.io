# Miah Md. Ruyel — Personal Portfolio Website

A clean, animated, and personalized portfolio website for a Geotechnical Engineer pursuing an M.Sc. at Politecnico di Milano.

## Features

- **Animated Hero** with topographic contour line background, typewriter effect, and floating geological shapes
- **About Section** with stats counter animation and personal bio
- **Qualifications** with interactive timeline, skill bars, and software proficiency grid
- **Experience Timeline** with scroll-driven line animation and alternating cards
- **Projects Showcase** with category filter, 3D tilt hover effect, and overlay actions
- **Documents Section** for downloadable PDFs (CV, transcripts, certifications, reports)
- **Contact Form** with floating labels, validation, and success animation
- **Custom Cursor** with magnetic button effects
- **Scroll Progress Bar** and back-to-top button
- **Fully Responsive** design for all screen sizes
- **Earth-Toned Theme** reflecting geotechnical engineering aesthetics

## Tech Stack

- **HTML5** — Semantic markup
- **CSS3** — Custom properties, Grid, Flexbox, animations
- **Vanilla JavaScript** — Intersection Observer, requestAnimationFrame
- **Google Fonts** — Playfair Display + Inter
- **Font Awesome 6** — Icons

## Getting Started

1. Open `index.html` in any modern web browser
2. No build tools or dependencies required

## Customization

### Adding Your Photo
Replace the placeholder in the About section with an `<img>` tag:
```html
<div class="about-image-container">
  <img src="your-photo.jpg" alt="MIAH, MD RUYEL" style="width:100%;height:100%;object-fit:cover;" />
  ...
</div>
```

### Adding Project Images
Replace the placeholder icons in project cards with actual images:
```html
<div class="project-image">
  <img src="images/project-name.jpg" alt="Project Name" style="width:100%;height:100%;object-fit:cover;" />
  ...
</div>
```

### Uploading Documents
Place PDF files in the `documents/` folder and ensure filenames match the `href` values in the HTML.

### Contact Form
The form currently simulates submission. To make it functional:
- Use [Formspree](https://formspree.io) — add `action="https://formspree.io/f/your-id"` to the form
- Or use [Web3Forms](https://web3forms.com) — add your access key
- Or connect to your own backend

### Updating Content
All content is in `index.html`. Edit text, links, and details directly.

## File Structure

```
Ruyel's Portfolio/
├── index.html          # Main HTML file
├── styles.css          # All styles and animations
├── script.js           # Interactions and animations
├── documents/          # PDF documents folder
│   └── README.txt      # Instructions for adding documents
└── README.md           # This file
```

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

---

*Designed and built with precision — just like a good foundation.*
