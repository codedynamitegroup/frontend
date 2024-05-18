import { timezone } from "constants/timezone";
import moment from "moment-timezone";

const standardlizeUTCStringToLocaleString = (utcString: string, currentLang = "en") => {
  return moment(utcString)
    .locale(currentLang)
    .tz(timezone.ASIA_HO_CHI_MINH)
    .format("dddd DD/MM/YYYY hh:mm A z")
    .replace(/^\w/, (c) => c.toUpperCase());
};

export { standardlizeUTCStringToLocaleString };
