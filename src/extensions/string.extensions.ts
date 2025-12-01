import {
  capitalizeFirstLetter,
  humanize,
  toSnakeKey,
  toTitleCase
} from '../config/utils/to-snake';

declare global {
  interface String {
    toSnakeKey(): string;
    humanize(): string;
    capitalizeFirstLetter(): string;
    toTitleCase(): string;
  }
}

Object.defineProperty(String.prototype, 'toSnakeKey', {
  value: function () {
    return toSnakeKey(this);
  },
  writable: true,
  configurable: true
});

Object.defineProperty(String.prototype, 'humanize', {
  value: function () {
    return humanize(this);
  },
  writable: true,
  configurable: true
});

Object.defineProperty(String.prototype, 'capitalizeFirstLetter', {
  value: function () {
    return capitalizeFirstLetter(this);
  },
  writable: true,
  configurable: true
});

Object.defineProperty(String.prototype, 'toTitleCase', {
  value: function () {
    return toTitleCase(this);
  },
  writable: true,
  configurable: true
});
