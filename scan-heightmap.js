// Node.js script that takes OBJ file and scans it into a height map JSON file.

const fs = require("fs");

const tStart = Date.now();
const data = fs.readFileSync("surface.obj", "utf8");
const lines = data.split("\n");
let vertices = lines
  .filter((line) => line.startsWith("v "))
  .map((line) => {
    const split = line.split(" ");
    try {
      const x = Number(split[1]);
      const y = Number(split[2]);
      const z = Number(split[3]);
      return { x, y, z };
    } catch (e) {
      console.error(e.message);
      process.exit(-1);
    }
  });

console.log("vertices count", vertices.length);

let xMin = Number.MAX_SAFE_INTEGER;
let xMax = -Number.MAX_SAFE_INTEGER;
let zMin = Number.MAX_SAFE_INTEGER;
let zMax = -Number.MAX_SAFE_INTEGER;
let yMin = Number.MAX_SAFE_INTEGER;
let yMax = -Number.MAX_SAFE_INTEGER;
vertices.forEach((vertex) => {
  xMin = Math.min(xMin, vertex.x);
  xMax = Math.max(xMax, vertex.x);
  zMin = Math.min(zMin, vertex.z);
  zMax = Math.max(zMax, vertex.z);
  yMin = Math.min(yMin, vertex.y);
  yMax = Math.max(yMax, vertex.y);
});
const xInterval = xMax - xMin;
const zInterval = zMax - zMin;

console.log(
  "xMin",
  xMin,
  "zMin",
  zMin,
  "xMax",
  xMax,
  "zMax",
  zMax,
  "yMin",
  yMin,
  "yMax",
  yMax
);

const scanResolution = 500;
const heightMap = new Array(scanResolution)
  .fill(0)
  .map((_) => new Array(scanResolution).fill(yMin));
vertices.forEach((vertex, iVertex) => {
  const exactColumnX = ((scanResolution - 1) * (vertex.x - xMin)) / xInterval;
  const exactRowZ = ((scanResolution - 1) * (vertex.z - zMin)) / zInterval;

  const cellCoords = [
    [Math.floor(exactColumnX), Math.floor(exactRowZ)],
    [Math.ceil(exactColumnX), Math.floor(exactRowZ)],
    [Math.floor(exactColumnX), Math.ceil(exactRowZ)],
    [Math.ceil(exactColumnX), Math.ceil(exactRowZ)],
  ];

  cellCoords.forEach((coord) => {
    const iX = coord[0];
    const iZ = coord[1];
    heightMap[iX][iZ] = Math.max(heightMap[iX][iZ], vertex.y);
  });
});
console.log("ready after", ((Date.now() - tStart) / 1).toFixed(1), "ms");

// console.log(heightMap);

fs.writeFileSync(
  "heightmap.json",
  JSON.stringify({
    yMin,
    yMax,
    columns: scanResolution,
    rows: scanResolution,
    heightMap,
  }),
  "utf8"
);
