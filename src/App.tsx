import {
  Alert,
  AspectRatio,
  ColorInput,
  ColorSwatch,
  Flex,
  Grid,
  List,
  Slider,
  Space,
  Stack,
} from "@mantine/core";
import "./App.css";

import _ from "lodash";
import { useState } from "react";
import { Layer, Line, Rect, Stage } from "react-konva";

const COLORS = {
  WHITE_TILE: "#f0f0f0",
  BLUE_TILE: "#3e8a94",
  YELLOW_TILE: "#dcbd7e",
  ORANGE_TILE: "#bd6021",

  COUNTER_TOP: "#ebebe9",
  KITCHEN_UPPER_CABINET: "#ebebe9",
  KITCHEN_LOWER_CABINET: "#a0cccb",
  KITCHEN_RANGE_ARANCIO: "#f6681d", // ff6e00 // f6681d
  KITCHEN_RANGE_STAINLESS_STEEL: "#CFD4D9",
};

interface WallTileProps {
  x: number;
  y: number;
  flipY?: boolean;
  startColor?: string;
  groutColor: string;
}

const GROUT_WIDTH = 4;

const TILE_WIDTH_UNITS = 2;
const TILE_HEIGHT = 42;
const NUMTILEWIDTH = 40;
const NUMTILEHEIGHT = 10;

const LOWER_CABINET_HEIGHT = 30;
const UPPER_CABINET_HEIGHT = 5;

const WallTile = (props: WallTileProps) => {
  //      (1,0)
  // (0,2) (2,2)

  // (0,0) (2,0)
  //    (1,2)

  const baseLocation = props.flipY
    ? [
        (TILE_WIDTH_UNITS / 2) * TILE_HEIGHT,
        0 * TILE_HEIGHT,
        0 * TILE_HEIGHT,
        TILE_WIDTH_UNITS * TILE_HEIGHT,
        TILE_WIDTH_UNITS * TILE_HEIGHT,
        TILE_WIDTH_UNITS * TILE_HEIGHT,
      ]
    : [
        0 * TILE_HEIGHT,
        0 * TILE_HEIGHT,
        TILE_WIDTH_UNITS * TILE_HEIGHT,
        0 * TILE_HEIGHT,
        (TILE_WIDTH_UNITS / 2) * TILE_HEIGHT,
        TILE_WIDTH_UNITS * TILE_HEIGHT,
      ];

  const offsetLocation = baseLocation.map((val, idx) => {
    return idx % 2 === 0
      ? val + props.x * TILE_HEIGHT
      : val + props.y * TILE_HEIGHT;
  });

  return (
    <Line
      points={offsetLocation}
      fill={props.startColor}
      stroke={props.groutColor}
      strokeWidth={GROUT_WIDTH}
      closed={true}
    />
  );
};

const createBagOfTiles = (
  pWhiteOrNot: number,
  pYellow: number,
  pOrange: number,
  pBlue: number
): string[] => {
  const tileCount = 420;

  const whiteTileCount = Math.ceil(tileCount * pWhiteOrNot);
  const remainingTiles = tileCount - whiteTileCount;

  const bag = [];
  // add white tiles
  for (let i = 0; i < whiteTileCount; i++) {
    bag.push(COLORS.WHITE_TILE);
  }

  // add yellow tiles
  const yellowTileCount = Math.ceil(remainingTiles * pYellow);
  for (let i = 0; i < yellowTileCount; i++) {
    bag.push(COLORS.YELLOW_TILE);
  }

  // add orange tiles
  const orangeTileCount = Math.ceil(remainingTiles * pOrange);
  for (let i = 0; i < orangeTileCount; i++) {
    bag.push(COLORS.ORANGE_TILE);
  }

  // add blue tiles
  const blueTileCount = Math.ceil(remainingTiles * pBlue);
  for (let i = 0; i < blueTileCount; i++) {
    bag.push(COLORS.BLUE_TILE);
  }

  return _.shuffle(bag);
};

const App = () => {
  // Stage is a div container
  // Layer is actual canvas element (so you may have several canvases in the stage)
  // And then we have canvas shapes inside the Layer

  const [pWhite, setPWhite] = useState(0.6);

  const [pYellow, setPYellow] = useState(0.2);
  const [pOrange, setPOrange] = useState(0.2);
  const [pBlue, setPBlue] = useState(0.2);
  const [groutColor, setGroutColor] = useState("#D3D3D3");

  const CANVAS_VIRTUAL_WIDTH = 1200;
  const CANVAS_VIRTUAL_HEIGHT = 1000;

  // now you may want to make it visible even on small screens
  // we can just scale it
  const scale = Math.min(
    window.innerWidth / CANVAS_VIRTUAL_WIDTH,
    window.innerHeight / CANVAS_VIRTUAL_HEIGHT
  );

  // use "bag of tiles" randomization to make sure we actually get #s right
  const bagOfTiles = createBagOfTiles(pWhite, pYellow, pOrange, pBlue);

  const getColor = () => {
    let color = bagOfTiles.pop();
    if (!color) {
      return "black";
    }
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
        x:
          yIdx % 2 === 0
            ? xIdx * TILE_WIDTH_UNITS
            : xIdx * TILE_WIDTH_UNITS - TILE_WIDTH_UNITS / 2,
        y: yIdx * TILE_WIDTH_UNITS,
        color: getColor(),
      });
      positions.push({
        x:
          yIdx % 2 === 0
            ? xIdx * TILE_WIDTH_UNITS - TILE_WIDTH_UNITS / 2
            : xIdx * TILE_WIDTH_UNITS,
        y: yIdx * TILE_WIDTH_UNITS,
        flipY: true,
        color: getColor(),
      });
    }
  }

  return (
    <Grid>
      <Grid.Col span={8}>
        <AspectRatio ratio={12 / 10}>
          <Stage
            width={CANVAS_VIRTUAL_WIDTH}
            height={CANVAS_VIRTUAL_HEIGHT}
            scaleX={scale}
            scaleY={scale}
          >
            <Layer>
              {positions.map((p) => (
                <WallTile
                  x={p.x}
                  y={p.y}
                  flipY={p.flipY}
                  startColor={p.color}
                  groutColor={groutColor}
                />
              ))}
              <Rect
                key="upper-cabinet"
                x={0}
                y={0}
                width={TILE_HEIGHT * TILE_WIDTH_UNITS * NUMTILEWIDTH}
                height={TILE_HEIGHT * UPPER_CABINET_HEIGHT}
                fill={COLORS.KITCHEN_UPPER_CABINET}
              />
              <Rect
                key="lower-cabinet"
                x={0}
                y={TILE_HEIGHT * (50 - LOWER_CABINET_HEIGHT)}
                width={TILE_HEIGHT * TILE_WIDTH_UNITS * NUMTILEWIDTH}
                height={TILE_HEIGHT * LOWER_CABINET_HEIGHT}
                fill={COLORS.KITCHEN_LOWER_CABINET}
              />
              <Rect
                key="countertop"
                x={0}
                y={TILE_HEIGHT * (50 - LOWER_CABINET_HEIGHT)}
                width={TILE_HEIGHT * TILE_WIDTH_UNITS * NUMTILEWIDTH}
                height={TILE_HEIGHT / 2}
                fill={COLORS.COUNTER_TOP}
              />
              <Rect
                key="range-base"
                x={TILE_HEIGHT * TILE_WIDTH_UNITS * 5}
                y={TILE_HEIGHT * (50 - LOWER_CABINET_HEIGHT)}
                width={TILE_HEIGHT * TILE_WIDTH_UNITS * 4}
                height={TILE_HEIGHT * LOWER_CABINET_HEIGHT}
                fill={COLORS.KITCHEN_RANGE_ARANCIO}
              />
              <Rect
                key="range-top"
                x={TILE_HEIGHT * TILE_WIDTH_UNITS * 5}
                y={TILE_HEIGHT * (50 - LOWER_CABINET_HEIGHT)}
                width={TILE_HEIGHT * TILE_WIDTH_UNITS * 4}
                height={TILE_HEIGHT}
                fill={COLORS.KITCHEN_RANGE_STAINLESS_STEEL}
              />
            </Layer>
          </Stage>
        </AspectRatio>
      </Grid.Col>

      <Grid.Col span={4}>
        <Stack>
          <div>
            <h3>White</h3>
            <Stack>
              <Flex align={"center"} gap={"sm"}>
                <ColorSwatch color={COLORS.WHITE_TILE} /> Blanco
              </Flex>
              <Slider
                value={_.round(pWhite, 2)}
                onChange={setPWhite}
                min={0}
                max={1.0}
                step={0.01}
                label={(v) => `${_.round(v * 100, 1)}%`}
              />
            </Stack>
          </div>
          <div>
            <h3>Colors</h3>
            <Stack>
              <Flex align={"center"} gap={"sm"}>
                <ColorSwatch color={COLORS.YELLOW_TILE} /> Limone
              </Flex>
              <Slider
                value={_.round(pYellow, 2)}
                onChange={setPYellow}
                min={0}
                max={1.0}
                step={0.01}
                label={null}
              />
              <Flex align={"center"} gap={"sm"}>
                <ColorSwatch color={COLORS.ORANGE_TILE} /> Hermes
              </Flex>
              <Slider
                value={_.round(pOrange, 2)}
                onChange={setPOrange}
                min={0}
                max={1.0}
                step={0.01}
                label={null}
              />
              <Flex align={"center"} gap={"sm"}>
                <ColorSwatch color={COLORS.BLUE_TILE} /> Bora Bora
              </Flex>
              <Slider
                value={_.round(pBlue, 2)}
                onChange={setPBlue}
                min={0}
                max={1.0}
                step={0.01}
                label={null}
              />
            </Stack>
          </div>
          <Space h="md" />
          <Alert title="Percent of Tile (overall)">
            <List>
              <List.Item>White = {_.round(pWhite * 100, 1)}%</List.Item>
              <List.Item>
                Yellow ={" "}
                {_.round(
                  (pYellow / (pYellow + pBlue + pOrange)) * (1 - pWhite) * 100,
                  1
                )}
                %
              </List.Item>
              <List.Item>
                Orange={" "}
                {_.round(
                  (pOrange / (pYellow + pBlue + pOrange)) * (1 - pWhite) * 100,
                  1
                )}
                %
              </List.Item>
              <List.Item>
                Blue={" "}
                {_.round(
                  (pBlue / (pYellow + pBlue + pOrange)) * (1 - pWhite) * 100,
                  1
                )}
                %
              </List.Item>
            </List>
          </Alert>
          <div>
            <h4>Other</h4>
            <Stack>
              <ColorInput
                label={"Grout Color"}
                value={groutColor}
                onChange={setGroutColor}
              />
              <Flex align={"center"} gap={"sm"}>
                <ColorSwatch color={COLORS.KITCHEN_RANGE_ARANCIO} /> Bertazonni
                Range (Arancino)
              </Flex>
              <Flex align={"center"} gap={"sm"}>
                <ColorSwatch color={COLORS.KITCHEN_LOWER_CABINET} /> Lower
                Cabinets
              </Flex>
            </Stack>
          </div>
        </Stack>
      </Grid.Col>
    </Grid>
  );
};

export default App;
