import App from "./App.svelte";
import random from "random";
import seedrandom from "seedrandom";
import { makeMaze } from "../scripts/mazer";

const search = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});

export let seed = search.seed || "asdasd";
export let rightProb = 1 - parseFloat(search.vProb || "0.3");
export let bottomProb = 1 - parseFloat(search.hProb || "0.5");
export let loopProb = parseFloat(search.lProb || "0.0");

export let size =
  Math.min(512, (Math.floor(window.visualViewport.width / 32.0) * 32) * 0.9) + 4;
	export let scale = size / 32;

const updateMaze = (seed, wallTrs, bottomTrs, loopTrs) => {
  random.use(seedrandom(seed));
  const uniformRandom = random.uniform();

  let maze = makeMaze(32, {
    random: uniformRandom,
    wallTrs,
    bottomTrs,
    loopTrs,
  });

  var canvas = document.getElementById("mazeCanvas");
  var ctx = canvas.getContext("2d");
  ctx.fillStyle = "#FFF";
  ctx.strokeStyle = "#FFF";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (const [x, row] of maze.entries()) {
    for (const [y, cell] of row.entries()) {
      const currX = x * scale + 2;
      const currY = y * scale + 2;
      ctx.strokeStyle = "#000";
			ctx.lineWidth = 2;
      ctx.strokeRect(currX, currY, scale, scale);
      ctx.strokeStyle = "#FFF";
			ctx.lineWidth = 4;
      if (!cell.top) {
        ctx.moveTo(currX, currY + 2);
        ctx.lineTo(currX, currY + (scale - 2));
        ctx.stroke();
      }
      if (!cell.left) {
        ctx.moveTo(currX + 2, currY);
        ctx.lineTo(currX + (scale - 2), currY);
        ctx.stroke();
      }
      if (!cell.bottom) {
        ctx.moveTo(currX + scale, currY + 2);
        ctx.lineTo(currX + scale, currY + (scale - 2));
        ctx.stroke();
      }
      if (!cell.right) {
        ctx.moveTo(currX + 2, currY + scale);
        ctx.lineTo(currX + (scale - 2), currY + scale);
        ctx.stroke();
      }
    }
  }
  ctx.strokeStyle = "#000";
	ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, canvas.width, canvas.height);
};

const app = new App({
  target: document.body,
  props: {
    seed,
    rightProb,
    bottomProb,
    loopProb,
    size,
    updateMaze,
  },
});

export default app;

updateMaze(seed, rightProb, bottomProb, loopProb);
