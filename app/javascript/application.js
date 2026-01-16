// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"
const isLoggedIn = document.body.dataset.loggedIn === "true";

function getPixelData() {
  const pixels = document.querySelectorAll("#pixelCanvas .pixel");
  return Array.from(pixels).map(pixel =>
    getComputedStyle(pixel).backgroundColor
  );
}

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

async function saveToMyPage(imageData) {
  if (!imageData) {
    console.error("保存する画像データがありません");
    return;
  }

  const token = document.querySelector("meta[name='csrf-token']").content;
  const pixels = getPixelData();

  if (!pixels || pixels.length === 0) {
    console.error("ピクセルデータが取得できません");
    return;
  }

  try {
    const res = await fetch("/icons", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": token
      },
      body: JSON.stringify({
        image: imageData,
        grid_size: gridSize,
        pixels: pixels
      })
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error("マイページ保存に失敗しました",errorData);
    } else {
      console.log("マイページに保存されました");
    }
  } catch (e) {
    console.error("マイページ保存中にエラーが発生しました", e);
  }
}

document.addEventListener("turbo:load", () => {
  const saveBtn = document.getElementById("saveBtn");
  const popup = document.getElementById("Save-popup-overlay");
  const closeBtn = document.getElementById("Save-closePopup");
  const confirmSaveBtn = document.getElementById("confirmSave");
  const clipSaveBtn = document.getElementById("clipSave");

  if (!saveBtn || !popup) return;

  saveBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    console.log("保存ボタン押されました");
    popup.style.display ="flex";

    if (isLoggedIn) {
      const imageData = exportPixelCanvas();

      console.log("gridSize:", gridSize);
      console.log("pixels array:", getPixelData());
      console.log("imageData:", imageData);

      await saveToMyPage(imageData);
    }
  });

  closeBtn.addEventListener("click", () => {
    popup.style.display = "none";
  });

  confirmSaveBtn.addEventListener("click", async () => {
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

  if (window.editIconData) {
    const { gridSize } = window.editIconData;
    const pixels = JSON.parse(window.editIconData.pixels);

    createCanvas(gridSize);

    const pixelEls = document.querySelectorAll("#pixelCanvas .pixel");
    pixelEls.forEach((pixel, index) => {
      pixel.style.backgroundColor = pixels[index];
    });
  }
});

function downloadImage(dataUrl) {
  const a =document.createElement("a");
  a.href = dataUrl;
  a.download = "my_pixel_art.png";
  a.click();
}
