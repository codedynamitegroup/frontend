const cloudinaryPreset = process.env.REACT_APP_CLOUDINARY_PRESET || "";
const cloudinaryName = process.env.REACT_APP_CLOUDINARY_NAME || "";

export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", cloudinaryPreset);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryName}/upload`, {
    method: "POST",
    body: formData
  });
  const data = await res.json();
  const url = data.url;

  return url;
};
