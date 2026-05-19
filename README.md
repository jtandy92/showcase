# Selected Retail Portfolio

Lightweight static portfolio site for a recruiter and live interview walkthrough.

## Structure

- `index.html` controls the page skeleton and navigation.
- `styles.css` controls the visual system, responsive layout, and image grids.
- `portfolio-data.js` contains all case study copy, labels, deliverables, and gallery image paths.
- `main.js` renders the project index, case studies, galleries, and image preview overlay.
- `assets/` contains the portfolio images, grouped by project.

## Updating Images

Add new matching-format images to the right folder inside `assets/`, then add a new image object to the relevant project in `portfolio-data.js`:

```js
{
  src: "assets/luma/new-image.jpg",
  alt: "Concise description of the image",
  caption: "Short gallery caption"
}
```

Keep project labels truthful:

- Body and Mind Beautiful: real retail / beauty-lifestyle / e-commerce work.
- Body and Mind Beautiful Concept Extension: concept extension based on existing brand work.
- Luma Atelier: self-directed fashion retail study.
