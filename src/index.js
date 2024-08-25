"use strict";

var current = 0;
var bgColors = [
  [0, 100, 72],
  [123, 100, 134],
  [209, 92, 41],
  [174, 197, 223],
  [201, 214, 94],
  [76, 108, 175],
  [213, 220, 213],
];
var txtColors = [
  [198, 187, 214],
  [175, 186, 64],
  [213, 220, 213],
  [209, 92, 41],
  [115, 77, 78],
  [218, 172, 203],
  [6, 101, 74],
];

(function () {
  window.addEventListener("load", main, false);
})();

function resize(canvas, ctx) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  draw(canvas, ctx);
}

function draw(canvas, ctx) {
  ctx.font = "26px Satoshi Bold";
  ctx.fillStyle = `rgba(${bgColors[current][0]}, ${bgColors[current][1]}, ${bgColors[current][2]}, 1)`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  lines(canvas, ctx);
  text(canvas, ctx);
}

function lines(canvas, ctx) {
  let margin = canvas.height / 20;
  let stroke = (canvas.height * canvas.width) / 400000;

  ctx.fillStyle = `rgba(${txtColors[current][0]}, ${txtColors[current][1]}, ${txtColors[current][2]}, 1)`;

  ctx.fillRect(margin, margin, canvas.width - margin * 2, stroke);
  ctx.fillRect(
    margin,
    canvas.height - margin,
    canvas.width - margin * 2,
    stroke
  );

  ctx.fillRect(margin, margin + stroke - 0.5, stroke, margin * 1.5);
  ctx.fillRect(margin, canvas.height - margin + 0.5, stroke, -margin * 11);

  ctx.fillRect(
    canvas.width - margin - stroke,
    margin + stroke - 0.5,
    stroke,
    margin * 11
  );
  ctx.fillRect(
    canvas.width - margin - stroke,
    canvas.height - margin + 0.5,
    stroke,
    -margin * 3
  );
}

function text(canvas, ctx) {
  let line_height = 32;
  let margin = canvas.height / 20;

  let dev = ["🚧"]
  ctx.textAlign = "end";
  ctx.textBaseline = "top";
  for (let i = 0; i < dev.length; i++) {
    ctx.fillText(
      dev[i],
      canvas.width - 1.5 * margin,
      margin + margin / 2 + i * line_height
    );
  }

  let nei = ["NÚCLEO", "ESTUDANTES", "INFORMÁTICA"];
  ctx.textAlign = "start";
  ctx.textBaseline = "bottom";
  for (let i = 0; i < nei.length; i++)
    ctx.fillText(
      nei[nei.length - i - 1],
      margin + margin / 2,
      canvas.height - 1.5 * margin - i * line_height
    );
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fade(canvas, ctx) {
  var op = 1;
  var out = true;
  await new Promise((r) => setTimeout(r, 2000));
  setInterval(async () => {
    if (op < 0.2) {
      current = (current + 1) % bgColors.length;
      draw(canvas, ctx);
      out = false;
    } else if (op > 1) {
      await new Promise((r) => setTimeout(r, 2000));
      out = true;
    }
    canvas.style.opacity = op;
    canvas.style.filter = "alpha(opacity=" + op * 100 + ")";
    op += (out ? -1 : 1) * 0.01;
  }, 50);
}

function main() {
  let canvas = document.getElementById("canvas");

  canvas.addEventListener(
    "keydown",
    function (e) {
      if (e.key == "Enter" || e.key == " ") {
        canvas.click();
      }
    },
    false
  );

  let ctx = canvas.getContext("2d");

  resize(canvas, ctx);

  fade(canvas, ctx);

  window.addEventListener("resize", () => resize(canvas, ctx), false);
  canvas.addEventListener(
    "click",
    () => {
      current = (current + 1) % bgColors.length;
      draw(canvas, ctx);
    },
    false
  );
}
