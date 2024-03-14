import {
  Dropzone,
  ExtFile,
  FileCard,
  FileMosaicProps,
  FullScreen,
  ImagePreview,
  VideoPreview
} from "@files-ui/react";
import { saveAs } from "file-saver";
import React from "react";
import { useTranslation } from "react-i18next";
import { uploadToCloudinary } from "utils/uploadToCloudinary";

export default function AdvancedDropzoneDemo() {
  const { t } = useTranslation();
  const [extFiles, setExtFiles] = React.useState<ExtFile[]>([]);
  const [imageSrc, setImageSrc] = React.useState<File | string | undefined>(undefined);
  const [videoSrc, setVideoSrc] = React.useState<File | string | undefined>(undefined);
  const updateFiles = async (incommingFiles: ExtFile[]) => {
    console.log("change to uploading", incommingFiles);
    // change the upload status to uploading
    setExtFiles(
      incommingFiles.map((ef) =>
        ef.uploadStatus === "success" ? ef : { ...ef, uploadStatus: "uploading" }
      )
    );
    console.log("advanced upload start", incommingFiles);
    for (let i = 0; i < incommingFiles.length; i++) {
      if (incommingFiles[i].uploadStatus === "success") continue;
      const file = incommingFiles[i].file;
      if (!file) throw new Error("File not found");
      try {
        const url = await uploadToCloudinary(file);
        console.log("advanced upload success", url);
        // change the upload status to success
        setExtFiles((files) => {
          const newFiles = [...files];
          newFiles[i] = {
            ...newFiles[i],
            uploadStatus: "success",
            downloadUrl: url
          };
          return newFiles;
        });
      } catch (error: any) {
        console.error("advanced upload error", error);
        // change the upload status to error
        setExtFiles((files) => {
          const newFiles = [...files];
          newFiles[i] = {
            ...newFiles[i],
            uploadStatus: "error",
            uploadMessage: error.message
          };
          return newFiles;
        });
      }
    }
  };

  const onDelete = (id: FileMosaicProps["id"]) => {
    setExtFiles(extFiles.filter((x) => x.id !== id));
  };
  const handleSee = (imageSource: File | string | undefined) => {
    setImageSrc(imageSource);
  };
  const handleWatch = (videoSource: File | string | undefined) => {
    setVideoSrc(videoSource);
  };
  const handleStart = (filesToUpload: ExtFile[]) => {
    console.log("advanced demo start upload", filesToUpload);
  };
  const handleFinish = (uploadedFiles: ExtFile[]) => {
    console.log("advanced demo finish upload", uploadedFiles);
  };
  const handleAbort = (id: FileMosaicProps["id"]) => {
    setExtFiles(
      extFiles.map((ef) => {
        if (ef.id === id) {
          return { ...ef, uploadStatus: "aborted" };
        } else return { ...ef };
      })
    );
  };
  const handleCancel = (id: FileMosaicProps["id"]) => {
    setExtFiles(
      extFiles.map((ef) => {
        if (ef.id === id) {
          return { ...ef, uploadStatus: undefined };
        } else return { ...ef };
      })
    );
  };
  const handleDownload = async (fileId: string | number | undefined) => {
    if (fileId === undefined) return;
    const file = extFiles.find((f) => f.id === fileId);
    if (!file) return;
    if (file.downloadUrl) {
      const response = await fetch(file.downloadUrl);
      const blob = await response.blob();
      saveAs(blob, file.name);
    } else {
      console.error("File not found");
    }
  };
  const customFooter = { customMessage: "sds" };

  return (
    <>
      <Dropzone
        minHeight='195px'
        value={extFiles}
        // maxFiles={3}
        maxFileSize={2998000 * 20}
        label={t("drag_drop_file_placeholder")}
        // accept=".png,image/*, video/*"
        // uploadConfig={{
        //   autoUpload: true,
        //   url: `https://api.cloudinary.com/v1_1/${cloudinaryName}/upload`,
        //   method: "POST",
        //   cleanOnUpload: true
        // }}
        onUploadStart={handleStart}
        onUploadFinish={handleFinish}
        onChange={updateFiles}
        onClean={() => setExtFiles([])}
        translation-key={["drag_drop_file_placeholder"]}
        // footerConfig={customFooter}
      >
        {extFiles.map((file) => (
          <FileCard
            {...file}
            key={file.id}
            onDownload={handleDownload}
            onDelete={onDelete}
            onSee={handleSee}
            onWatch={handleWatch}
            onAbort={handleAbort}
            onCancel={handleCancel}
            resultOnTooltip
            alwaysActive
            preview
            info
          />
        ))}
      </Dropzone>
      <FullScreen open={imageSrc !== undefined} onClose={() => setImageSrc(undefined)}>
        <ImagePreview src={imageSrc} />
      </FullScreen>
      <FullScreen open={videoSrc !== undefined} onClose={() => setVideoSrc(undefined)}>
        <VideoPreview src={videoSrc} autoPlay controls />
      </FullScreen>
    </>
  );
}
