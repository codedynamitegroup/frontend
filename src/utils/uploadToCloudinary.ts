import axios from "axios";

const cloudinaryPreset = process.env.REACT_APP_CLOUDINARY_PRESET || "";
const cloudinaryName = process.env.REACT_APP_CLOUDINARY_NAME || "";

export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", cloudinaryPreset);
  try {
    const { data } = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudinaryName}/upload`,
      formData
    );
    const url = data.url;
    return url;
  } catch (error) {
    console.error("Error uploading file to Cloudinary", error);
    throw error;
  }
};

export const uploadToCloudinaryByObjectUrl = async (objectUrl: string): Promise<string> => {
  // Convert the object URL to a Blob
  const response = await fetch(objectUrl);
  const blob = await response.blob();

  const formData = new FormData();
  formData.append("file", blob);
  formData.append("upload_preset", cloudinaryPreset);
  try {
    const { data } = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudinaryName}/upload`,
      formData
    );
    const url = data.url;
    return url;
  } catch (error) {
    console.error("Error uploading file to Cloudinary", error);
    throw error;
  }
};