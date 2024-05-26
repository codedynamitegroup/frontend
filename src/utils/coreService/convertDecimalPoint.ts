export const validDecimal = /^(?:0|[1-9]\d*)(?:\.\d+)?$/;

export function isValidDecimal(value: string) {
  const regex = validDecimal;
  const isMatch = regex.test(value);

  if (!isMatch) return false;

  return true;
}
