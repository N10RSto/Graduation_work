// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"


function exportPixelCanvas() {
  const canvas = document.createElement("canvas");
  const size = gridSize;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

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

  if (!saveBtn) return;

  saveBtn.addEventListener("click", () => {
    const imageData = exportPixelCanvas();

    const a = document.createElement("a");
    a.href = imageData;
    a.download = "my_pixel_art.png";
    a.click();
  });
});