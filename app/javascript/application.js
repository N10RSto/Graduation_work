// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"


function exportPixelCanvas({ clipCircle = false } = {}) {
  const canvas = document.createElement("canvas");
  const size = gridSize;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  if (clipCircle) {
    const center = size / 2;
    const radius = size * 0.35;
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI *2);
    ctx.closePath();
    ctx.clip();
  }

  const pixels = document.querySelectorAll("#pixelCanvas .pixel");

  pixels.forEach((pixel, index) => {
    const x = index % size;
    const y = Math.floor(index / size);
    ctx.fillStyle = getComputedStyle(pixel).backgroundColor;
    ctx.fillRect(x, y, 1, 1);
  });

  return canvas.toDataURL("image/png");
}

document.addEventListener("turbo:load", () => {
  const saveBtn = document.getElementById("saveBtn");
  const popup = document.getElementById("popup-overlay");
  const closeBtn = document.getElementById("closePopup");
  const confirmSaveBtn = document.getElementById("confirmSave");
  const clipSaveBtn = document.getElementById("clipSave");

  if (!saveBtn || !popup) return;

  saveBtn.addEventListener("click", (e) => {
    e.preventDefault();
    popup.style.display ="flex";
  });

  closeBtn.addEventListener("click", () => {
    popup.style.display = "none";
  });

  confirmSaveBtn.addEventListener("click", () => {
    const imageData = exportPixelCanvas();
    downloadImage(imageData);
    popup.style.display = "none";
  });

  if (clipSaveBtn) {
    clipSaveBtn.addEventListener("click", () => {
      const imageData = exportPixelCanvas({ clipCircle: true });
      downloadImage(imageData);
      popup.style.display = "none";
    });
  }
});

function downloadImage(dataUrl) {
  const a =document.createElement("a");
  a.href = dataUrl;
  a.download = "my_pixel_art.png";
  a.click();
}
