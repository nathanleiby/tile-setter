import "./App.css";

import * as _ from "lodash";
import { useState } from "react";
import { Layer, Line, Rect, Stage } from "react-konva";
import { Button } from "@mantine/core";

// used color picker: https://imagecolorpicker.com/
// picked from top left lighting
const COLORS = {
  FANDANGO: "#e69553",
  TWIST: "#b8c170",
  JETSETTER: "#00a6b6",
  UPTOWN: "#f0f0f0",
  VOGUE: "#4b5366",
};

const colorMapping: { [name: string]: string } = {
  "orange": COLORS.FANDANGO,
  "lime": COLORS.TWIST,
  "cyan": COLORS.JETSETTER,
  "white": COLORS.UPTOWN,
  "dark": COLORS.VOGUE,
}

interface WallTileProps {
  x: number;
  y: number;
  flipY?: boolean;
  startColor?: string;
}

const GROUT_COLOR = "lightgray";
const GROUT_WIDTH = 5;

const TILE_WIDTH = 2;
const TILE_HEIGHT = 2.5;
const SCALE = 25;
const NUMTILEWIDTH = 40;
const NUMTILEHEIGHT = 25;

let currentPaintColor = COLORS.FANDANGO;

const WallTile = (props: WallTileProps) => {
  const baseLocation = props.flipY
    ? [
        0,
        SCALE * 1.5,
        SCALE,
        SCALE * TILE_HEIGHT,
        SCALE * TILE_WIDTH,
        SCALE * 1.5,
        SCALE,
        0,
      ]
    : [
        0,
        SCALE,
        SCALE,
        0,
        SCALE * TILE_WIDTH,
        SCALE,
        SCALE,
        SCALE * TILE_HEIGHT,
      ];
  const offsetLocation = baseLocation.map((val, idx) => {
    return idx % 2 === 0 ? val + props.x * SCALE : val + props.y * SCALE;
  });

  // const startColor =
  //   _.random() > 0.8
  //     ? COLORS.UPTOWN
  //     : _.sample([COLORS.FANDANGO, COLORS.VOGUE, COLORS.TWIST]);
  const [color, setColor] = useState<string>(props.startColor || COLORS.UPTOWN);
  // .baseLocation.map((x, idx) => (x + ))

  // const randomNewColor = (currentColor: string) => {
  //   let result;
  //   while (result === undefined || result === currentColor) {
  //     result = _.sample(Object.values(COLORS));
  //   }
  //   return result;
  // };

  return (
    <Line
      points={offsetLocation}
      fill={color}
      stroke={GROUT_COLOR}
      strokeWidth={GROUT_WIDTH}
      closed={true}
      // Konva.Util.getRandomColor()
      onClick={() => setColor(currentPaintColor)}
    />
  );
};

const ColorPickerButtons = () => {
  const availColors = ["orange", "lime", "cyan", "dark", "white"];
  const [currentColor, setCurrentColor] = useState<string>("orange");
  const colorButtons:any[] = [];
  availColors.forEach(function (color) {
    colorButtons.push(
    <Button
      variant={currentColor === color ? "filled" : "outline"} 
      color={color}
      onClick={() => {
        setCurrentColor(color);
        currentPaintColor = colorMapping[color];
      }
      }
    >
      {color.toUpperCase()}
    </Button>);
  })

  return (
    <Button.Group>
      {colorButtons}
    </Button.Group>
  )
}

const App = () => {
  const simulateLight = false;
  // Stage is a div container
  // Layer is actual canvas element (so you may have several canvases in the stage)
  // And then we have canvas shapes inside the Layer

  const positions: { x: number; y: number; flipY?: boolean; startColor?: string}[] = [];
  for (let xIdx = 0; xIdx < NUMTILEWIDTH; xIdx++) {
    for (let yIdx = 0; yIdx < NUMTILEHEIGHT; yIdx++) {
      positions.push({ x: xIdx * 2, y: yIdx * 2.5 });
      positions.push({ x: xIdx * 2 + 1, y: yIdx * 2.5 - 1.5, flipY: true });
    }
  }

  const clearGrid = () => {

  }

  return (
    <div>
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          {positions.map((p) => (
            <WallTile x={p.x} y={p.y} flipY={p.flipY} startColor={p.startColor}/>
          ))}
          {/* TODO: figure out how to ignore clicks on the overlay */}
          {!simulateLight ? null : (
            <Rect
              x={0}
              y={0}
              width={SCALE * 20}
              height={SCALE * 50}
              fillPriority="linear-gradient"
              fillLinearGradientStartPoint={{ x: 0, y: 0 }}
              fillLinearGradientEndPoint={{ x: SCALE * 20, y: 0 }}
              fillLinearGradientColorStops={[0, "#FFF", 1, "#000"]}
              opacity={0.01}
            />
          )}
        </Layer>
      </Stage>
      <ColorPickerButtons />
      <Button variant="outline" color="white" onClick={()=> clearGrid()}>Clear</Button>
    </div>
  );
};

export default App;
