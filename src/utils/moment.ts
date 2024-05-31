import { timezone } from "constants/timezone";
import moment from "moment-timezone";

const standardlizeUTCStringToLocaleString = (utcString: string, currentLang = "en") => {
  const format = currentLang === "vi" ? "dddd DD/MM/YYYY hh:mm A" : "dddd MM/DD/YYYY hh:mm A";
  return moment(utcString)
    .locale(currentLang)
    .tz(timezone.ASIA_HO_CHI_MINH)
    .format(format)
    .replace(/^\w/, (c) => c.toUpperCase());
};

const convertUTCMomentToLocalMoment = (utcMoment: moment.Moment, currentLang = "en") => {
  return utcMoment.locale(currentLang).tz(timezone.ASIA_HO_CHI_MINH);
};

const convertLocalMomentToUTCMoment = (localMoment: moment.Moment) => {
  return localMoment.clone().utc();
};

export {
  standardlizeUTCStringToLocaleString,
  convertUTCMomentToLocalMoment,
  convertLocalMomentToUTCMoment
};
