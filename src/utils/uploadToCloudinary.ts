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
    console.log("Uploaded to Cloudinary", url);
    return url;
  } catch (error) {
    console.error("Error uploading file to Cloudinary", error);
    throw error;
  }
};

// export const uploadToCloudinaryByObjectUrl = async (
//   objectUrl: string,
//   fileName: string
// ): Promise<string> => {
//   const file: File = await convertToFile(objectUrl, fileName);

//   const prest = "ml_default";
//   const cdnName = "dacvpgdfi";
//   const formData = new FormData();
//   formData.append("file", file);
//   formData.append("upload_preset", prest);

//   try {
//     const { data } = await axios.post(
//       `https://api.cloudinary.com/v1_1/${cdnName}/raw/upload`,
//       formData
//     );
//     const url = data.url;
//     return url;
//   } catch (error) {
//     console.error("Error uploading file to Cloudinary", error);
//     throw error;
//   }
// };
