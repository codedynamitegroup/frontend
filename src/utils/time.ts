const millisToHoursAndMinutesString = (millis: number, currentLang = "en") => {
  const hours = Math.floor(millis / 3600000);
  const minutes = Math.floor((millis % 3600000) / 60000);
  const remainingSeconds = Math.floor((millis % 60000) / 1000);

  if (currentLang === "vi") {
    return `${hours} giờ ${minutes} phút ${remainingSeconds} giây`;
  }
  return `${hours}h ${minutes}m ${remainingSeconds}s`;
};

export { millisToHoursAndMinutesString };
