import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import { generateSequenceFromIfs, sequenceToImageData, parseIfs } from './library'

const DEFAULT_IFS_STRING = `0.00   0.00   0.00  0.16  0.0  0.00   0.01
0.85   0.04  -0.04  0.85  0.0  1.60   0.85
0.20  -0.26   0.23  0.22  0.0  1.60   0.07
-0.15   0.28   0.26  0.24  0.0  0.44   0.07`

const SIZE = 256;
const MARGIN = 20;

interface CanvasProps {
  ifs: number[][];
  iteration: number;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}

const Canvas = (props: CanvasProps) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas: HTMLCanvasElement = canvasRef.current!;
    const context = canvas.getContext('2d')!;

    const sequence = generateSequenceFromIfs(props.ifs, props.iteration);
    const imageData = sequenceToImageData(SIZE, SIZE, sequence);
    context.putImageData(imageData, MARGIN, MARGIN);
  }, [props.ifs]);
  return <canvas ref={canvasRef} {...props} />;
}

const IfsForm = () => {
  const [ifsString, setIfsString] = useState(DEFAULT_IFS_STRING);
  const [iterationString, setIterationString] = useState("50000");

  const [ifs, setIfs] = useState(parseIfs(ifsString));
  const [iteration, setIteration] = useState(parseInt(iterationString));

  const handleIfsChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setIfsString(event.target.value);
  };

  const handleIterationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIterationString(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    setIfs(parseIfs(ifsString));
    setIteration(parseInt(iterationString));
    event.preventDefault();
  };

  return (
    <div>
      <Canvas
        ifs={ifs}
        iteration={iteration}
        width={SIZE + MARGIN * 2}
        height={SIZE + MARGIN * 2}
        style={{ border: "1px solid #000000" }}
      />
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Iteration:
          <input
              type="text"
              value={iterationString}
              onChange={handleIterationChange}
            />
          </label>
        </div>
        <div>
          <label>
            IFS:
          <textarea
              value={ifsString}
              onChange={handleIfsChange}
              rows={10}
              cols={60}
            />
          </label>
        </div>
        <input type="submit" value="Refresh" />
      </form>
    </div>
  );
}

function App() {
  return (
    <IfsForm />
  );
}

export default App;
