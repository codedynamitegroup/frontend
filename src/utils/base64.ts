const encodeBase64 = (str: string): string => {
  return btoa(str);
};
const decodeBase64 = (str: string): string => {
  try {
    return atob(str);
  } catch (e) {
    console.log("can note decode str: ", str);
    return str;
  }
};
export { encodeBase64, decodeBase64 };
