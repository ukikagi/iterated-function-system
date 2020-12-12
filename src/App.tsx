import React, { useRef, useEffect } from 'react';
import './App.css';
import { generateSequenceFromIfs, sequenceToImageData } from './library'

const IFS = [
  [0.00, 0.00, 0.00, 0.16, 0.0, 0.00, 0.01],
  [0.85, 0.04, -0.04, 0.85, 0.0, 1.60, 0.85],
  [0.20, -0.26, 0.23, 0.22, 0.0, 1.60, 0.07],
  [-0.15, 0.28, 0.26, 0.24, 0.0, 0.44, 0.07]
]

const Canvas = (props: any) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas: HTMLCanvasElement = canvasRef.current!;
    const context = canvas.getContext('2d')!;

    const sequence = generateSequenceFromIfs(IFS, 50000);
    const imageData = sequenceToImageData(256, 256, sequence);
    context.putImageData(imageData, 20, 20);
  }, []);
  return <canvas ref={canvasRef} {...props} />;
}

function App() {
  return (
    <Canvas
      width="1000px"
      height="1000px"
    />
  );
}

export default App;
