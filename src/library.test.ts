import {
  lowerBound,
  accumulate,
  weightedPicker,
  rescale,
  parseIfs,
} from "./library";
import "jest-extended";

test("test lower_bound", () => {
  expect(lowerBound([1, 3, 6], 2)).toEqual(1);
  expect(lowerBound([1, 3, 6], 6)).toEqual(2);
  expect(lowerBound([1, 3, 6], 0)).toEqual(0);
  expect(lowerBound([1, 3, 6], 8)).toEqual(3);
  expect(lowerBound([1, 3, 3, 6], 3)).toEqual(1);
});

test("test accumulate", () => {
  expect(accumulate([1, 2, 3])).toEqual([1, 3, 6]);
});

test("test weightedPicker", () => {
  const picker = weightedPicker([1, 8, 1]);
  let counter = [0, 0, 0];
  Array(1000)
    .fill(0)
    .map(() => {
      counter[picker()] += 1;
    });
  expect(counter[0]).toBeWithin(50, 150);
  expect(counter[1]).toBeWithin(700, 900);
  expect(counter[2]).toBeWithin(50, 150);
});

test("test rescale", () => {
  expect(
    rescale(101, 101, [
      [-1, -1],
      [0, 0],
      [3, 3],
    ])
  ).toEqual([
    [0, 0],
    [25, 25],
    [100, 100],
  ]);
});

test("test parseIfs", () => {
  const ifs_string = `
  0.00   0.00   0.00  0.16  0.0  0.00   0.01
  0.85   0.04  -0.04  0.85  0.0  1.60   0.85
  0.20  -0.26   0.23  0.22  0.0  1.60   0.07
 -0.15   0.28   0.26  0.24  0.0  0.44   0.07
 `;
  expect(parseIfs(ifs_string)).toEqual([
    [0.0, 0.0, 0.0, 0.16, 0.0, 0.0, 0.01],
    [0.85, 0.04, -0.04, 0.85, 0.0, 1.6, 0.85],
    [0.2, -0.26, 0.23, 0.22, 0.0, 1.6, 0.07],
    [-0.15, 0.28, 0.26, 0.24, 0.0, 0.44, 0.07],
  ]);
});
