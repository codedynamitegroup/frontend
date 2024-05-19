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

export { standardlizeNumber, standardlizeDecimalNumber };
