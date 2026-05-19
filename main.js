const projectIndex = document.querySelector("#project-index");
const projectSections = document.querySelector("#project-sections");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxCaption = document.querySelector("#lightbox-caption");
const lightboxClose = document.querySelector(".lightbox-close");

const html = String.raw;

function listItems(items) {
  return items.map((item) => `<li>${item}</li>`).join("");
}

function renderProjectIndex(project) {
  const leadImage = project.indexImage || project.images[0];

  return html`
    <a class="index-card" href="#${project.id}">
      <figure>
        <img src="${leadImage.src}" alt="${leadImage.alt}" loading="lazy">
      </figure>
      <span class="meta-label">${project.label}</span>
      <h3>${project.title}</h3>
      <p>${project.indexSummary}</p>
    </a>
  `;
}

function renderGallery(project) {
  return project.images
    .map((image) => {
      return html`
        <button
          class="gallery-item"
          type="button"
          data-src="${image.src}"
          data-alt="${image.alt}"
          data-caption="${image.caption}"
          aria-label="Open larger preview: ${image.caption}"
        >
          <span class="gallery-media">
            <img src="${image.src}" alt="${image.alt}" loading="lazy">
          </span>
          <span class="gallery-caption">${image.caption}</span>
        </button>
      `;
    })
    .join("");
}

function getBottomEdgeColor(image) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", { willReadFrequently: true });
  const sampleHeight = Math.max(1, Math.round(image.naturalHeight * 0.015));

  canvas.width = image.naturalWidth;
  canvas.height = sampleHeight;
  context.drawImage(
    image,
    0,
    image.naturalHeight - sampleHeight,
    image.naturalWidth,
    sampleHeight,
    0,
    0,
    image.naturalWidth,
    sampleHeight
  );

  const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
  let red = 0;
  let green = 0;
  let blue = 0;
  let count = 0;

  for (let i = 0; i < pixels.length; i += 4) {
    red += pixels[i];
    green += pixels[i + 1];
    blue += pixels[i + 2];
    count += 1;
  }

  return `rgb(${Math.round(red / count)}, ${Math.round(green / count)}, ${Math.round(blue / count)})`;
}

function syncCaptionColor(image) {
  const galleryItem = image.closest(".gallery-item");

  if (!galleryItem || !image.naturalWidth || !image.naturalHeight) {
    return;
  }

  try {
    galleryItem.style.setProperty("--caption-bg", getBottomEdgeColor(image));
  } catch {
    galleryItem.style.removeProperty("--caption-bg");
  }
}

function renderProject(project) {
  return html`
    <section id="${project.id}" class="project-case${project.featured ? " featured" : ""}" aria-labelledby="${project.id}-title">
      <aside class="project-sidebar">
        <p class="meta-label">${project.label}</p>
        <h3 id="${project.id}-title">${project.title}</h3>
        <p class="project-overview">${project.overview}</p>

        <div class="project-facts">
          <div class="fact-block">
            <span class="meta-label">Role</span>
            <p>${project.role}</p>
          </div>
          <div class="fact-block">
            <span class="meta-label">Deliverables</span>
            <ul>${listItems(project.deliverables)}</ul>
          </div>
        </div>

        <div class="proof">
          <strong>Focus</strong>
          <p>${project.proof}</p>
        </div>
      </aside>

      <div class="gallery" aria-label="${project.title} gallery">
        ${renderGallery(project)}
      </div>
    </section>
  `;
}

projectIndex.innerHTML = portfolioProjects.map(renderProjectIndex).join("");
projectSections.innerHTML = portfolioProjects.map(renderProject).join("");

document.querySelectorAll(".gallery-item img").forEach((image) => {
  if (image.complete) {
    syncCaptionColor(image);
  } else {
    image.addEventListener("load", () => syncCaptionColor(image), { once: true });
  }
});

function openLightbox({ src, alt, caption }) {
  lightboxImage.src = src;
  lightboxImage.alt = alt;
  lightboxCaption.textContent = caption;
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
  document.body.style.overflow = "";
}

document.addEventListener("click", (event) => {
  const galleryButton = event.target.closest(".gallery-item");

  if (galleryButton) {
    openLightbox(galleryButton.dataset);
  }

  if (event.target === lightbox) {
    closeLightbox();
  }
});

lightboxClose.addEventListener("click", closeLightbox);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
    closeLightbox();
  }
});
