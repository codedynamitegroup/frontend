const millisToHoursAndMinutesString = (examLimit: number) => {
  let result = "";
  if (examLimit > 0) {
    const hours = Math.floor((examLimit % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((examLimit % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((examLimit % (1000 * 60)) / 1000);
    result =
      (hours > 0 ? hours + " giờ " : "") +
      (minutes > 0 ? minutes + " phút " : "") +
      (seconds > 0 ? seconds + " giây" : "");
  }
  return result;
};

export { millisToHoursAndMinutesString };
