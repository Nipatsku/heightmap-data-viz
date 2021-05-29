# Height map data visualization using LCJS

Simple proof of concept / playground for visualizing a height map.

![chart](finish_chart.gif)

The height data was generated using a novel method for scanning a 3D geometry file with a `Node.js` script (`scan-heightmap.js`).

The 3D geometry was drawn with `Blender` (open source 3D modeling software):

![model](finish_blender.png)

The goal was to simulate a sonar data visualization application, where Y coordinate represents the horizontal plane around the boat and color represents depth.
