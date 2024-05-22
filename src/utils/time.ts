const millisToFormatTimeString = (millis: number, currentLang = "en") => {
  if (millis < 0) {
    return "0h 0m 0s";
  }
  const years = Math.floor(millis / 31536000000);
  const months = Math.floor((millis % 31536000000) / 2592000000);
  const days = Math.floor((millis % 2592000000) / 86400000);
  const hours = Math.floor((millis % 86400000) / 3600000);
  const minutes = Math.floor((millis % 3600000) / 60000);
  const remainingSeconds = Math.floor((millis % 60000) / 1000);
  let result = "";
  if (currentLang === "vi") {
    if (years > 0) {
      result += `${years} năm `;
    }
    if (months > 0) {
      result += `${months} tháng `;
    }
    if (days > 0) {
      result += `${days} ngày `;
    }
    if (hours > 0) {
      result += `${hours} giờ `;
    }
    result += `${minutes} phút ${remainingSeconds} giây `;
  } else {
    if (years > 0) {
      result += `${years} years `;
    }
    if (months > 0) {
      result += `${months} months `;
    }
    if (days > 0) {
      result += `${days} days `;
    }
    if (hours > 0) {
      result += `${hours}h `;
    }
    result += `${minutes}m ${remainingSeconds}s `;
  }
  return result.trim();
};

export { millisToFormatTimeString };
