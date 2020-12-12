import { lowerBound, accumulate, weightedPicker, rescale } from './library'
import 'jest-extended'

test('test lower_bound', () => {
  expect(lowerBound([1, 3, 6], 2)).toEqual(1);
  expect(lowerBound([1, 3, 6], 6)).toEqual(2);
  expect(lowerBound([1, 3, 6], 0)).toEqual(0);
  expect(lowerBound([1, 3, 6], 8)).toEqual(3);
  expect(lowerBound([1, 3, 3, 6], 3)).toEqual(1);
})

test('test accumulate', () => {
  expect(accumulate([1, 2, 3])).toEqual([1, 3, 6]);
})

test('test weightedPicker', () => {
  const picker = weightedPicker([1, 8, 1]);
  let counter = [0, 0, 0];
  Array(1000).fill(0).map(() => {
    counter[picker()] += 1;
  });
  expect(counter[0]).toBeWithin(50, 150);
  expect(counter[1]).toBeWithin(700, 900);
  expect(counter[2]).toBeWithin(50, 150);
})

test('test rescale', () => {
  expect(rescale(101, 101, [[-1, -1], [0, 0], [3, 3]])).toEqual([[0, 0], [25, 25], [100, 100]]);
})