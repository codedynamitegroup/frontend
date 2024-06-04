import { parse as uuidParse } from "uuid";

export default function convertUuidToHashSlug(str: string) {
  const bytes = Array.from(uuidParse(str));
  const base64 = btoa(String.fromCharCode.apply(null, bytes));
  const slug = base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return slug;
}
