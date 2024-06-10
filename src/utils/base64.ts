const encodeBase64 = (str: string): string => {
  return btoa(str);
};
const decodeBase64 = (str: string): string => {
  try {
    return decodeURIComponent(
      Array.prototype.map
        .call(atob(str), function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
  } catch (e) {
    console.log("can note decode str: ", str);
    return str;
  }
};
const removeNewLine = (str: string): string => {
  let newStr = str.replace(/(\r\n|\n|\r)/gm, "");
  return newStr;
};

export { encodeBase64, decodeBase64, removeNewLine };
