"use strict";

const state = {
  currentColorIndex: 0,
  bgColors: [
    [0, 100, 72],
    [123, 100, 134],
    [209, 92, 41],
    [174, 197, 223],
    [201, 214, 94],
    [76, 108, 175],
    [213, 220, 213],
  ],
  txtColors: [
    [198, 187, 214],
    [175, 186, 64],
    [213, 220, 213],
    [209, 92, 41],
    [115, 77, 78],
    [218, 172, 203],
    [6, 101, 74],
  ],
};

window.addEventListener("load", main, false);

function drawCanvas(canvas, ctx) {
  const { currentColorIndex, bgColors } = state;
  ctx.fillStyle = `rgba(${bgColors[currentColorIndex].join(", ")}, 1)`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawLines(canvas, ctx);
  drawText(canvas, ctx);
}

function resizeCanvas(canvas, ctx) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  drawCanvas(canvas, ctx);
}

function drawLines(canvas, ctx) {
  const { currentColorIndex, txtColors } = state;
  const margin = canvas.height / 20;
  const stroke = (canvas.height * canvas.width) / 400000;

  ctx.fillStyle = `rgba(${txtColors[currentColorIndex].join(", ")}, 1)`;

  ctx.fillRect(margin, margin, canvas.width - margin * 2, stroke);
  ctx.fillRect(margin, canvas.height - margin, canvas.width - margin * 2, stroke);

  ctx.fillRect(margin, margin + stroke - 0.5, stroke, margin * 1.5);
  ctx.fillRect(margin, canvas.height - margin + 0.5, stroke, -margin * 11);

  ctx.fillRect(canvas.width - margin - stroke, margin + stroke - 0.5, stroke, margin * 11);
  ctx.fillRect(canvas.width - margin - stroke, canvas.height - margin + 0.5, stroke, -margin * 3);
}

function drawText(canvas, ctx) {
  const margin = canvas.height / 20;

  const year = new Date().getFullYear();
  const text = `© ${year} NEI/AAC`;
  const size = window.innerWidth < 500 ? 20 : 25;
  ctx.font = `${size}px Satoshi Bold`;
  ctx.textAlign = "start";
  ctx.textBaseline = "bottom";

  ctx.fillText(text, margin + margin / 2, canvas.height - (1.5 * margin));
}

async function fadeCanvas(canvas, ctx) {
  let op = 1;
  let out = true;
  await sleep(2000);

  setInterval(async () => {
    if (op < 0.2) {
      state.currentColorIndex = (state.currentColorIndex + 1) % state.bgColors.length;
      drawCanvas(canvas, ctx);
      out = false;
    } else if (op > 1) {
      await sleep(2000);
      out = true;
    }
    canvas.style.opacity = op;
    op += (out ? -1 : 1) * 0.01;
  }, 50);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function main() {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  const font = new FontFace("Satoshi Bold", "url(./assets/fonts/satoshi-bold.otf)");

  font.load().then((loadedFont) => {
    document.fonts.add(loadedFont);
    drawCanvas(canvas, ctx);
    resizeCanvas(canvas, ctx);
    fadeCanvas(canvas, ctx);
  });

  window.addEventListener("resize", () => resizeCanvas(canvas, ctx), false);

  canvas.addEventListener("click", () => {
    state.currentColorIndex = (state.currentColorIndex + 1) % state.bgColors.length;
    drawCanvas(canvas, ctx);
  }, false);
  canvas.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      canvas.click();
    }
  }, false);
}
