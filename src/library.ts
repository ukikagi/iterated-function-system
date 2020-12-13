import { createImageData } from "canvas";

export const lowerBound = (arr: number[], x: number) => {
  const L = arr.length;
  if (x <= arr[0]) {
    return 0;
  }
  let lo = 0;
  let hi = L;
  while (hi - lo >= 2) {
    console.assert(arr[lo] < x && (hi === L || x <= arr[hi]));
    const mi = Math.floor((lo + hi) / 2);
    if (arr[mi] < x) {
      lo = mi;
    } else {
      hi = mi;
    }
  }
  return hi;
};

export const accumulate = (arr: number[]) => {
  return arr.map(((psum) => (val: number) => (psum += val))(0));
};

export const weightedPicker = (weights: number[]) => {
  console.assert(weights.every((w) => w > 0));
  const partial_sums = accumulate(weights);
  const total_sum = partial_sums.pop()!;
  return () => {
    const rand = Math.random() * total_sum;
    return lowerBound(partial_sums, rand);
  };
};

type point = number[];

export const generateSequenceFromIfs = (ifs: number[][], iteration: number) => {
  let points: point[] = [];
  let [x, y] = [0, 0];

  const weights = ifs.map((row) => row[6]);
  const picker = weightedPicker(weights);
  Array(iteration)
    .fill(0)
    .forEach(() => {
      points.push([x, y]);
      // eslint-disable-next-line
      const [a, b, c, d, e, f, _] = ifs[picker()];
      [x, y] = [a * x + b * y + e, c * x + d * y + f];
    });
  return points;
};

export const rescale = (width: number, height: number, sequence: point[]) => {
  const xs = sequence.map(([x, _]) => x);
  const ys = sequence.map(([_, y]) => y);
  const [xmin, xmax] = [Math.min(...xs), Math.max(...xs)];
  const [ymin, ymax] = [Math.min(...ys), Math.max(...ys)];
  const scale = Math.max(xmax - xmin, ymax - ymin);
  return sequence.map(([x, y]) => [
    Math.floor(((x - xmin) / scale) * (width - 1)),
    Math.floor(((y - ymin) / scale) * (height - 1)),
  ]);
};

export const sequenceToImageData = (
  width: number,
  height: number,
  sequence: point[]
) => {
  const resclaed: point[] = rescale(width, height, sequence);
  const board: number[][] = Array(height)
    .fill(0)
    .map(() => Array(width).fill(0));
  resclaed.forEach(([x, y]) => {
    board[y][x] = 1;
  });
  const arr = board.flatMap((row) =>
    row.flatMap((b) => [(1 - b) * 255, (1 - b) * 255, (1 - b) * 255, 255])
  );
  return createImageData(Uint8ClampedArray.from(arr), width);
};

export const parseIfs = (input: string) => {
  return input
    .split("\n")
    .map((s) =>
      s
        .split(/[\s,]+/)
        .filter((c) => c !== "")
        .map((c) => parseFloat(c))
    )
    .filter((r) => r.length > 0);
};

const largestEigenValueOfPositiveDefinite = ([a, b, c]: number[]) => {
  const [p, q] = [a + c, a * c - b * b];
  const D = p ** 2 - 4 * q;
  console.assert(p > 0 && q > 0 && D >= 0);
  return (p + Math.sqrt(D)) / 2;
};

export const operatorNorm = ([a, b, c, d]: number[]) => {
  const squared = [a ** 2 + b ** 2, a * c + b * d, c ** 2 + d ** 2];
  const lambda = largestEigenValueOfPositiveDefinite(squared);
  return Math.sqrt(lambda);
};

export const generateContractionMap = (norm: number) => {
  const [a, b, c, d, e, f] = Array(6)
    .fill(0)
    .map(() => Math.random() * 2 - 1);
  const sigma = operatorNorm([a, b, c, d]);
  return [a, b, c, d].map((x) => (x / sigma) * norm).concat([e, f]);
};
