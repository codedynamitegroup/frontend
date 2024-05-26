import { timezone } from "constants/timezone";
import moment from "moment-timezone";

const standardlizeUTCStringToLocaleString = (utcString: string, currentLang = "en") => {
  const format = currentLang === "vi" ? "dddd DD/MM/YYYY hh:mm A z" : "dddd MM/DD/YYYY hh:mm A z";
  return moment(utcString)
    .locale(currentLang)
    .tz(timezone.ASIA_HO_CHI_MINH)
    .format(format)
    .replace(/^\w/, (c) => c.toUpperCase());
};

export { standardlizeUTCStringToLocaleString };
