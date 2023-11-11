import { AspectRatio, Grid, Slider, Stack } from "@mantine/core";
import "./App.css";

import _ from "lodash";
import { useState } from "react";
import { Layer, Line, Rect, Stage } from "react-konva";

// used color picker: https://imagecolorpicker.com/
// picked from top left lighting
const COLORS = {
  WHITE_TILE: "#f0f0f0",
  BLUE_TILE: "#3e8a94",
  YELLOW_TILE: "#dcbd7e",
  ORANGE_TILE: "#bd6021",
  // VOGUE: "#4b5366",

  KITCHEN_UPPER_CABINET: "#eeeeee",
  KITCHEN_LOWER_CABINET: "#a0cccb",
  KITCHEN_RANGE_ARANCIO: "#f6681d", // ff6e00 // f6681d
  KITCHEN_RANGE_STAINLESS_STEEL: "#CFD4D9",
};

interface WallTileProps {
  x: number;
  y: number;
  flipY?: boolean;
  startColor?: string;
}

const GROUT_COLOR = "lightgray";
const GROUT_WIDTH = 4;

const TILE_WIDTH = 2;
const SCALE = 50;
const NUMTILEWIDTH = 40;
const NUMTILEHEIGHT = 25;

const CABINET_HEIGHT = 30;

let lastColor: string;

const WallTile = (props: WallTileProps) => {
  //      (1,0)
  // (0,2) (2,2)

  // (0,0) (2,0)
  //    (1,2)

  const baseLocation = props.flipY
    ? [
        (TILE_WIDTH / 2) * SCALE,
        0 * SCALE,
        0 * SCALE,
        TILE_WIDTH * SCALE,
        TILE_WIDTH * SCALE,
        TILE_WIDTH * SCALE,
      ]
    : [
        0 * SCALE,
        0 * SCALE,
        TILE_WIDTH * SCALE,
        0 * SCALE,
        (TILE_WIDTH / 2) * SCALE,
        TILE_WIDTH * SCALE,
      ];

  const offsetLocation = baseLocation.map((val, idx) => {
    return idx % 2 === 0 ? val + props.x * SCALE : val + props.y * SCALE;
  });

  return (
    <Line
      points={offsetLocation}
      fill={props.startColor}
      stroke={GROUT_COLOR}
      strokeWidth={GROUT_WIDTH}
      closed={true}
    />
  );
};

const App = () => {
  // Stage is a div container
  // Layer is actual canvas element (so you may have several canvases in the stage)
  // And then we have canvas shapes inside the Layer

  const [pWhite, setPWhite] = useState(0.6);

  const getColor = () => {
    let color = randomTileColor(pWhite);

    // don't repeat previous color
    while (color !== COLORS.WHITE_TILE && lastColor === color) {
      color = randomTileColor(pWhite);
    }
    lastColor = color;

    return color;
  };

  // color biasing -- consider adjacent tiles
  // TODO

  const positions: {
    x: number;
    y: number;
    flipY?: boolean;
    color: string;
  }[] = [];
  for (let xIdx = 0; xIdx < NUMTILEWIDTH; xIdx++) {
    for (let yIdx = 0; yIdx < NUMTILEHEIGHT; yIdx++) {
      positions.push({
        x: xIdx * TILE_WIDTH,
        y: yIdx * TILE_WIDTH,
        color: getColor(),
      });
      positions.push({
        x: xIdx * TILE_WIDTH + TILE_WIDTH / 2,
        y: yIdx * TILE_WIDTH,
        flipY: true,
        color: getColor(),
      });
    }
  }

  return (
    <Grid>
      <Grid.Col span={8}>
        <AspectRatio ratio={16 / 12}>
          <Stage width={1600} height={1200}>
            <Layer>
              {positions.map((p) => (
                <WallTile
                  x={p.x}
                  y={p.y}
                  flipY={p.flipY}
                  startColor={p.color}
                />
              ))}
              <Rect
                key="upper-cabinet"
                x={0}
                y={0}
                width={SCALE * TILE_WIDTH * NUMTILEWIDTH}
                height={SCALE * 5}
                fill={COLORS.KITCHEN_UPPER_CABINET}
              />
              <Rect
                key="lower-cabinet"
                x={0}
                y={SCALE * (50 - CABINET_HEIGHT)}
                width={SCALE * TILE_WIDTH * NUMTILEWIDTH}
                height={SCALE * CABINET_HEIGHT}
                fill={COLORS.KITCHEN_LOWER_CABINET}
              />
              <Rect
                key="range-base"
                x={SCALE * TILE_WIDTH * 5}
                y={SCALE * (50 - CABINET_HEIGHT)}
                width={SCALE * TILE_WIDTH * 4}
                height={SCALE * CABINET_HEIGHT}
                fill={COLORS.KITCHEN_RANGE_ARANCIO}
              />
              <Rect
                key="range-top"
                x={SCALE * TILE_WIDTH * 5}
                y={SCALE * (50 - CABINET_HEIGHT)}
                width={SCALE * TILE_WIDTH * 4}
                height={SCALE}
                fill={COLORS.KITCHEN_RANGE_STAINLESS_STEEL}
              />
            </Layer>
          </Stage>
        </AspectRatio>
      </Grid.Col>

      <Grid.Col span={4}>
        <Stack>
          Slider:
          <Slider
            value={_.round(pWhite, 2)}
            onChange={setPWhite}
            min={0}
            max={1.0}
            step={0.01}
          />
        </Stack>
      </Grid.Col>
    </Grid>
  );
};

export default App;

function randomTileColor(WHITE_VS_NOT: number) {
  // weighted random
  let color;
  if (_.random(0, 1, true) < WHITE_VS_NOT) {
    color = COLORS.WHITE_TILE;
  } else {
    const r = _.random(0, 1, true);
    if (r < 0.4) {
      color = COLORS.YELLOW_TILE;
    } else if (r < 0.8) {
      color = COLORS.ORANGE_TILE;
    } else {
      color = COLORS.BLUE_TILE;
    }
  }
  return color;
}
