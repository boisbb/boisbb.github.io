// The front page does not need JavaScript, but album pages use the same shared
// asset bundle. The script exits quietly when no lightbox is present.
(function () {
  const lightbox = document.querySelector(".lightbox");
  if (!(lightbox instanceof HTMLDialogElement)) {
    return;
  }

  const lightboxImage = lightbox.querySelector(".lightbox-image");
  const photoButtons = document.querySelectorAll(".photo-button");

  // These guards keep the script resilient if markup changes during future
  // maintenance and one of the expected elements is removed.
  if (!(lightboxImage instanceof HTMLImageElement)) {
    return;
  }

  const openLightbox = (imageUrl, caption) => {
    lightboxImage.src = imageUrl;
    lightboxImage.alt = caption;
    document.body.classList.add("lightbox-open");
    lightbox.showModal();
  };

  const closeLightbox = () => {
    lightbox.close();
    lightboxImage.removeAttribute("src");
    document.body.classList.remove("lightbox-open");
  };

  const blockImageDownloadInteractions = (event) => {
    // This only deters casual saving. Any image delivered to the browser can
    // still be retrieved by a determined user through developer tools or a
    // screenshot workflow.
    event.preventDefault();
  };

  photoButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const imageUrl = button.getAttribute("data-lightbox-image");
      const caption = button.getAttribute("data-lightbox-caption") || "";

      if (!imageUrl) {
        return;
      }

      openLightbox(imageUrl, caption);
    });
  });

  document.querySelectorAll("img").forEach((image) => {
    image.addEventListener("contextmenu", blockImageDownloadInteractions);
    image.addEventListener("dragstart", blockImageDownloadInteractions);
  });

  document.addEventListener("contextmenu", (event) => {
    if (event.target instanceof HTMLImageElement) {
      blockImageDownloadInteractions(event);
    }
  });
  lightbox.addEventListener("click", (event) => {
    // Clicking the backdrop closes the dialog, while clicks on the content keep
    // the viewer open.
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.open) {
      closeLightbox();
    }
  });
})();
