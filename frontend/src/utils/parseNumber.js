// Safely parse numbers — handles strings, nulls, undefined
export const parseNumber = (val) => {
  const n = parseFloat(val);
  return isNaN(n) ? 0 : n;
};