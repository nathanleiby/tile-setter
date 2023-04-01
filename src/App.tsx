import "./App.css";

import Konva from "konva";
import { Component, useState } from "react";
import { Layer, Line, Stage } from "react-konva";

const FANDANGO = "#de8237";

interface WallTileProps {
  x: number;
  y: number;
  flipY?: boolean;
}

const WallTile = (props: WallTileProps) => {
  const SCALE = 50;
  const baseLocation = props.flipY
    ? [0, 75, 50, 125, 100, 75, 50, 0]
    : [0, 50, 50, 0, 100, 50, 50, 125];
  const offsetLocation = baseLocation.map((val, idx) => {
    return idx % 2 === 0 ? val + props.x * SCALE : val + props.y * SCALE;
  });

  const [color, setColor] = useState(FANDANGO);
  // .baseLocation.map((x, idx) => (x + ))
  return (
    <Line
      points={offsetLocation}
      fill={color}
      stroke="gray"
      strokeWidth={5}
      closed={true}
      // shadowBlur={5}
      onClick={() => setColor(Konva.Util.getRandomColor())}
    />
  );
};

class App extends Component {
  render() {
    // Stage is a div container
    // Layer is actual canvas element (so you may have several canvases in the stage)
    // And then we have canvas shapes inside the Layer
    return (
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <WallTile x={0} y={0} />
          <WallTile x={1} y={1} flipY />
          <WallTile x={2} y={0} />
          <WallTile x={3} y={1} flipY />
          <WallTile x={4} y={0} />
          <WallTile x={6} y={0} />
          <WallTile x={8} y={0} />
          <WallTile x={10} y={0} />
        </Layer>
      </Stage>
    );
  }
}

export default App;
