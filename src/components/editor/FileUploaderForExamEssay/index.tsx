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
import { random } from "lodash";
import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { uploadToCloudinary } from "utils/uploadToCloudinary";

interface PropsData {
  maxFiles?: number;
  maxFileSize?: number;
  accept?: string;
  stopAutoUpload?: boolean;
  disableDownload?: boolean;

  // related object {id: string, fileUrl: string, fileName: string}
  relatedId?: string; // id of the related object for dispatch
  relatedDispatch?: any; // dispatch function for adding file to related object
  relatedRemoveDispatch?: any; // dispatch function for removing file from related object
  filesFromUrl?: { fileUrl: string; fileName: string }[]; // files from redux thats about to be modified (delete, ...)
  relatedRemoveAllDispatch?: any; // dispatch function for removing all files from related object
}

export default function AdvancedDropzoneForEssayExam(props: PropsData) {
  const {
    maxFiles,
    maxFileSize,
    accept,
    stopAutoUpload,
    disableDownload,
    relatedDispatch,
    relatedRemoveDispatch,
    relatedId,
    filesFromUrl,
    relatedRemoveAllDispatch
  } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [extFiles, setExtFiles] = React.useState<ExtFile[]>([]);
  const [imageSrc, setImageSrc] = React.useState<File | string | undefined>(undefined);
  const [videoSrc, setVideoSrc] = React.useState<File | string | undefined>(undefined);

  // handle file update
  const updateFiles = async (incommingFiles: ExtFile[]) => {
    // check if uploading or deleting operation (cleaning, remove,...)
    if (incommingFiles.length !== 0) {
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
          let url = "";
          console.log("file uploader file", file);

          // upload to object storage if auto upload is disabled
          // (remember to revoke to cleanup after upload to CDN)
          // else upload to cloudinary if auto upload is enabled
          // if (stopAutoUpload) url = URL.createObjectURL(file);
          url = await uploadToCloudinary(file);

          // if using related object, dispatch the file to the related object
          if (relatedId) {
            dispatch(
              relatedDispatch({
                id: relatedId,
                fileUrl: url, // slice blob: from url
                fileName: incommingFiles[i].name
              })
            );
          }
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
    } else {
      // clean up files operation
      setExtFiles([]);
      if (relatedRemoveAllDispatch) {
        dispatch(relatedRemoveAllDispatch(relatedId));
      }
    }
  };

  const onDelete = (id: FileMosaicProps["id"]) => {
    // get the file url to be deleted
    let deletingFileUrl = extFiles.find((f) => f.id === id)?.downloadUrl;

    // remove from redux
    dispatch(relatedRemoveDispatch({ id: relatedId, fileUrl: deletingFileUrl }));
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

  // check if there are files from redux that
  // needs to be converted and added to ExtFile
  React.useEffect(() => {
    const checkExist = setInterval(function () {
      if (filesFromUrl) {
        (async () => {
          const newFiles = await Promise.all(
            filesFromUrl.map((f) => convertToFile(f.fileUrl, f.fileName))
          );

          setExtFiles(newFiles);
        })();
        clearInterval(checkExist);
      }
    }, 500); // check every 100ms
  }, []);

  React.useEffect(() => {
    console.log("extFiles", extFiles);
  }, [extFiles]);

  return (
    <>
      <Dropzone
        accept={accept}
        minHeight='195px'
        value={extFiles}
        maxFileSize={maxFileSize ? maxFileSize : 2998000 * 20}
        maxFiles={maxFiles === -1 ? undefined : maxFiles}
        label={t("drag_drop_file_placeholder")}
        onUploadStart={handleStart}
        onUploadFinish={handleFinish}
        onChange={updateFiles}
        onClean={() => setExtFiles([])}
        translation-key={["drag_drop_file_placeholder"]}
        clickable={
          // disable clickable if maxFiles is reached
          // if maxFiles is -1 or undefined, clickable is always enabled
          maxFiles === -1 || maxFiles === undefined
            ? true
            : maxFiles !== undefined && extFiles.length >= maxFiles
              ? false
              : true
        }
      >
        {extFiles.map((file) => (
          <FileCard
            {...file}
            key={file.id}
            onDownload={disableDownload ? undefined : handleDownload}
            downloadUrl={disableDownload ? undefined : file.downloadUrl}
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

// fetch file from url of current site and convert to ExtFile
const convertToFile = async (url: string, filename: string) => {
  const response = await fetch(url, { method: "HEAD" });
  const mimeType = response.headers.get("content-type");

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const blob = await response.blob();
  const file = new File([blob], filename, { type: blob.type });

  const newExtFile: ExtFile = {
    file,
    uploadStatus: "success",
    errors: undefined,
    name: filename,
    size: file.size,
    type: file.type,
    id: `${filename}${random(0, 1000)}`,
    downloadUrl: url
  };

  return newExtFile;
};
