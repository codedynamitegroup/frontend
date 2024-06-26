const standardlizeNumber = (number: number) => {
  if (typeof number == "number") {
    if (number.toString().length >= 7) {
      return (number / 1000000).toFixed(1).toString() + "M";
    } else if (number.toString().length >= 4) {
      return (number / 1000).toFixed(1).toString() + "K";
    } else {
      return number.toString();
    }
  }
};

const standardlizeDecimalNumber = (number: number, point = ".") => {
  if (typeof number == "number") {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, point);
  }
  return "0";
};

const roundedNumber = (number: number | undefined, scale: number): number | undefined => {
  const pow = Math.pow(10, scale);
  if (number === undefined) return number;
  return Math.round((number + Number.EPSILON) * pow) / pow;
};

const kiloByteToMegaByte = (number: number | undefined): number | undefined => {
  if (number === undefined) return number;
  return number / 1024;
};

const calcPercentageInHundred = (numerator: number, denominator: number): number => {
  if (denominator === 0) return 0;
  return Math.round((numerator / denominator) * 100);
};

export {
  standardlizeNumber,
  standardlizeDecimalNumber,
  roundedNumber,
  kiloByteToMegaByte,
  calcPercentageInHundred
};
