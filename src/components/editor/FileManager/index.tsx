import {
  ChonkyActions,
  ChonkyFileActionData,
  FileAction,
  FileArray,
  FileBrowser,
  FileContextMenu,
  FileData,
  FileHelper,
  FileList,
  FileNavbar,
  FileToolbar,
  setChonkyDefaults
} from "chonky";
import { ChonkyIconFA } from "chonky-icon-fontawesome";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import JSZipUtils from "jszip-utils";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Nullable } from "tsdef";
import { uploadToCloudinary } from "utils/uploadToCloudinary";

declare global {
  interface Window {
    cloudinary: any;
  }
}

// @ts-ignore
setChonkyDefaults({ iconComponent: ChonkyIconFA });

// We define a custom interface for file data because we want to add some custom fields
// to Chonky's built-in `FileData` interface.
export interface CustomFileData extends FileData {
  parentId?: string;
  childrenIds?: string[];
}

export interface CustomFileMap {
  [fileId: string]: CustomFileData;
}

// Hook that sets up our file map and defines functions used to mutate - `deleteFiles`,
// `moveFiles`, and so on.
const useCustomFileMap = ({
  fileMap,
  // setFileMap
  onFileMapChange
}: {
  fileMap?: CustomFileMap;
  // setFileMap: React.Dispatch<React.SetStateAction<CustomFileMap>>;
  onFileMapChange: (fileMap: CustomFileMap) => void;
}) => {
  // Setup the React state for our file map and the current folder.
  fileMap = fileMap ?? {
    root: {
      id: "root",
      name: "Files",
      isDir: true,
      childrenIds: [],
      childrenCount: 0
    }
  };
  const [currentFolderId, setCurrentFolderId] = useState("root");

  // Setup logic to listen to changes in current folder ID without having to update
  // `useCallback` hooks. Read more about it here:
  // https://reactjs.org/docs/hooks-faq.html#is-there-something-like-instance-variables
  const currentFolderIdRef = React.useRef(currentFolderId);
  useEffect(() => {
    currentFolderIdRef.current = currentFolderId;
  }, [currentFolderId]);

  // Function that will be called when user deletes files either using the toolbar
  // button or `Delete` key.
  const deleteFiles = useCallback(
    (files: CustomFileData[]) => {
      // We use the so-called "functional update" to set the new file map. This
      // lets us access the current file map value without having to track it
      // explicitly. Read more about it here:
      // https://reactjs.org/docs/hooks-reference.html#functional-updates
      // setFileMap((currentFileMap) => {
      // Create a copy of the file map to make sure we don't mutate it.
      const newFileMap = { ...fileMap };

      files.forEach((file) => {
        // Delete file from the file map.
        // @ts-ignore
        delete newFileMap[file.id];

        // Update the parent folder to make sure it doesn't try to load the
        // file we just deleted.
        if (file.parentId) {
          // @ts-ignore
          const parent = newFileMap[file.parentId]!;
          const newChildrenIds = parent.childrenIds!.filter((id: string) => id !== file.id);
          // @ts-ignore
          newFileMap[file.parentId] = {
            ...parent,
            childrenIds: newChildrenIds,
            childrenCount: newChildrenIds.length
          };
        }
        onFileMapChange(newFileMap);
        // });

        return newFileMap;
      });
    },
    [fileMap, onFileMapChange]
  );

  // Function that will be called when files are moved from one folder to another
  // using drag & drop.
  const moveFiles = useCallback(
    (files: CustomFileData[], source: CustomFileData, destination: CustomFileData) => {
      // setFileMap((currentFileMap) => {
      const newFileMap = { ...fileMap };
      const moveFileIds = new Set(files.map((f) => f.id));

      // Delete files from their source folder.
      const newSourceChildrenIds = source.childrenIds!.filter((id) => !moveFileIds.has(id));
      // @ts-ignore
      newFileMap[source.id] = {
        ...source,
        childrenIds: newSourceChildrenIds,
        childrenCount: newSourceChildrenIds.length
      };

      // Add the files to their destination folder.
      const newDestinationChildrenIds = [...destination.childrenIds!, ...files.map((f) => f.id)];
      // @ts-ignore
      newFileMap[destination.id] = {
        ...destination,
        childrenIds: newDestinationChildrenIds,
        childrenCount: newDestinationChildrenIds.length
      };

      // Finally, update the parent folder ID on the files from source folder
      // ID to the destination folder ID.
      files.forEach((file) => {
        // @ts-ignore
        newFileMap[file.id] = {
          ...file,
          parentId: destination.id
        };
      });

      onFileMapChange(newFileMap);

      // return newFileMap;
      // });
    },

    [fileMap, onFileMapChange]
  );

  // Function that will be called when user creates a new folder using the toolbar
  // button. That that we use incremental integer IDs for new folder, but this is
  // not a good practice in production! Instead, you should use something like UUIDs
  // or MD5 hashes for file paths.
  const idCounter = React.useRef(0);
  const createFolder = useCallback(
    (folderName: string) => {
      // setFileMap((currentFileMap) => {
      const newFileMap = { ...fileMap };

      // Create the new folder
      const newFolderId = `new-folder-${idCounter.current++}`;
      // @ts-ignore
      newFileMap[newFolderId] = {
        id: newFolderId,
        name: folderName,
        isDir: true,
        modDate: new Date(),
        parentId: currentFolderIdRef.current,
        childrenIds: [],
        childrenCount: 0
      };

      // Update parent folder to reference the new folder.
      // @ts-ignore
      const parent = newFileMap[currentFolderIdRef.current];
      // @ts-ignore
      newFileMap[currentFolderIdRef.current] = {
        ...parent,
        childrenIds: [...parent.childrenIds!, newFolderId]
      };

      onFileMapChange(newFileMap);

      // return newFileMap;
      // });
    },
    [fileMap, onFileMapChange]
  );

  const uploadFiles = useCallback(
    (files: CustomFileData[]) => {
      // setFileMap((currentFileMap) => {
      const newFileMap = { ...fileMap };

      files.forEach((file) => {
        // @ts-ignore
        newFileMap[file.id] = {
          id: file.id,
          name: file.name,
          thumbnailUrl: file.thumbnailUrl,
          size: file.size,
          modDate: new Date(),
          parentId: file.parentId
        };

        // Update parent folder to reference the new file.
        // @ts-ignore
        const parent = newFileMap[file.parentId];
        // @ts-ignore
        newFileMap[file.parentId] = {
          ...parent,
          childrenIds: [...parent.childrenIds!, file.id],
          childrenCount: parent.childrenCount + 1
        };
      });

      onFileMapChange(newFileMap);

      //   return newFileMap;
      // });
    },
    [fileMap, onFileMapChange]
  );

  const downloadFiles = (
    selectedFiles: CustomFileData[] = [],
    fileName: string | undefined = undefined
  ) => {
    var zip = new JSZip();
    var count = 0;

    let downloadFileName = fileName;

    // if we don't have a name, we need to either use the name of the file or a timestamp for multiple files
    if (!downloadFileName) {
      if (selectedFiles.length === 1)
        downloadFileName = (selectedFiles[0] as { name: string }).name;
      else downloadFileName = `${getTimestamp()}.zip`;
    }

    selectedFiles.forEach(function (file) {
      var filename = file.name;
      // loading a file and add it in a zip file
      JSZipUtils.getBinaryContent(file.thumbnailUrl, function (err: string, data: string) {
        if (err) {
          throw err; // or handle the error
        }
        zip.file(filename, data, { binary: true });
        count++;
        if (count === selectedFiles.length) {
          zip.generateAsync({ type: "blob" }).then(function (content) {
            saveAs(content, downloadFileName);
          });
        }
      });
    });
  };

  return {
    fileMap,
    currentFolderId,
    setCurrentFolderId,
    deleteFiles,
    uploadFiles,
    downloadFiles,
    moveFiles,
    createFolder
  };
};

// used to create timestamp string for zip filename
export const zeroPad = (num: number) => ("0" + num).slice(-2);
export const getTimestamp = (timestamp: Date | undefined = undefined) => {
  if (!timestamp) timestamp = new Date();

  const month = zeroPad(timestamp.getUTCMonth() + 1),
    day = zeroPad(timestamp.getUTCDate()),
    year = timestamp.getUTCFullYear(),
    hour = zeroPad(timestamp.getUTCHours()),
    minute = zeroPad(timestamp.getUTCMinutes()),
    seconds = zeroPad(timestamp.getUTCSeconds());

  return `${year}${month}${day}_${hour}${minute}${seconds}`;
};

export const useFolderChain = (fileMap: CustomFileMap, currentFolderId: string): FileArray => {
  return useMemo(() => {
    if (!fileMap || !currentFolderId || !fileMap[currentFolderId]) return [];

    const currentFolder = fileMap[currentFolderId];
    const folderChain = [currentFolder];

    let parentId = currentFolder.parentId;
    while (parentId) {
      const parentFile = fileMap[parentId];
      if (parentFile) {
        folderChain.unshift(parentFile);
        parentId = parentFile.parentId;
      } else {
        break;
      }
    }

    return folderChain;
  }, [currentFolderId, fileMap]);
};

export const useFiles = (fileMap: CustomFileMap, currentFolderId: string): FileArray => {
  return useMemo(() => {
    if (!fileMap || !currentFolderId || !fileMap[currentFolderId]) return [];

    const currentFolder = fileMap[currentFolderId];
    const files = currentFolder.childrenIds
      ? currentFolder.childrenIds.map((fileId: string) => fileMap[fileId] ?? null)
      : [];
    return files;
  }, [currentFolderId, fileMap]);
};

const checkExistNameInFolder = (fileMap: CustomFileMap, folderId: string, name: string) => {
  const folder = fileMap[folderId];
  if (!folder || !folder.childrenIds) return false;

  return folder.childrenIds.some((fileId: string) => {
    const file = fileMap[fileId];
    if (!file) return false;
    return file.name === name;
  });
};

export const useFileActionHandler = (
  fileMap: CustomFileMap,
  currentFolderId: string,
  setCurrentFolderId: (folderId: string) => void,
  uploadFiles: (files: CustomFileData[]) => void,
  downloadFiles: (files: CustomFileData[], fileName: string | undefined) => void,
  deleteFiles: (files: CustomFileData[]) => void,
  moveFiles: (files: FileData[], source: FileData, destination: FileData) => void,
  createFolder: (folderName: string) => void
) => {
  return useCallback(
    (data: ChonkyFileActionData) => {
      if (data.id === ChonkyActions.OpenFiles.id) {
        const { targetFile, files } = data.payload;
        const fileToOpen = targetFile ?? files[0];
        if (fileToOpen && FileHelper.isDirectory(fileToOpen)) {
          setCurrentFolderId(fileToOpen.id);
          return;
        }
      } else if (data.id === ChonkyActions.DeleteFiles.id) {
        deleteFiles(data.state.selectedFilesForAction!);
      } else if (data.id === ChonkyActions.DownloadFiles.id) {
        const selectedFiles = data.state.selectedFilesForAction!;
        const fileName = selectedFiles.length === 1 ? selectedFiles[0].name : undefined;
        downloadFiles(selectedFiles, fileName);
      } else if (data.id === ChonkyActions.MoveFiles.id) {
        moveFiles(data.payload.files, data.payload.source!, data.payload.destination);
      } else if (data.id === ChonkyActions.CreateFolder.id) {
        const folderName = prompt("Provide the name for your new folder:");
        if (folderName) createFolder(folderName);
      } else if (data.id === ChonkyActions.UploadFiles.id) {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("multiple", "true");
        input.click();
        input.onchange = async () => {
          if (input !== null && input.files !== null) {
            const uploadedFiles: CustomFileData[] = [];
            for (let i = 0; i < input.files.length; i++) {
              const file = input.files[i];
              const url = await uploadToCloudinary(file);

              const name = checkExistNameInFolder(fileMap, currentFolderId, file.name)
                ? `${file.name}_(${getTimestamp()})`
                : file.name;

              uploadedFiles.push({
                id: url,
                name: name,
                thumbnailUrl: url,
                size: file.size,
                modDate: new Date(),
                parentId: currentFolderId
              });
            }

            uploadFiles(uploadedFiles);
          }
        };
      }

      console.log("File action dispatched:", data);
    },
    [
      createFolder,
      deleteFiles,
      moveFiles,
      setCurrentFolderId,
      currentFolderId,
      fileMap,
      uploadFiles,
      downloadFiles
    ]
  );
};

interface FileManagerProps extends React.HTMLAttributes<HTMLDivElement> {
  fileMap?: CustomFileMap;
  // setFileMap?: React.Dispatch<React.SetStateAction<CustomFileMap>>;
  onFileMapChange?: (fileMap: CustomFileMap) => void;
  defaultFileViewActionId?: string;
  disableDragAndDrop?: boolean;
  disableDefaultFileActions?: boolean;
  disableDragAndDropProvider?: boolean;
  allowedActions?: Nullable<FileAction[]> | undefined;
}

const FileManager = (props: FileManagerProps) => {
  // specify the actions we want including any custom ones that we define
  const rootActions = props.allowedActions ?? [
    ChonkyActions.CreateFolder,
    ChonkyActions.UploadFiles,
    ChonkyActions.DownloadFiles,
    ChonkyActions.DeleteFiles,
    ChonkyActions.MoveFiles
  ];

  const {
    fileMap,
    currentFolderId,
    setCurrentFolderId,
    deleteFiles,
    moveFiles,
    createFolder,
    uploadFiles,
    downloadFiles
  } = useCustomFileMap({
    fileMap: props.fileMap,
    onFileMapChange: props.onFileMapChange ?? (() => {})
  });

  const files = useFiles(fileMap, currentFolderId);
  const folderChain = useFolderChain(fileMap, currentFolderId);

  const handleFileAction = useFileActionHandler(
    fileMap,
    currentFolderId,
    setCurrentFolderId,
    uploadFiles,
    downloadFiles,
    deleteFiles,
    moveFiles,
    createFolder
  );

  return (
    <div style={{ height: 300 }} {...props}>
      {/* @ts-ignore */}
      <FileBrowser
        files={files}
        folderChain={folderChain}
        fileActions={rootActions}
        onFileAction={handleFileAction}
        defaultFileViewActionId={props.defaultFileViewActionId ?? ChonkyActions.EnableGridView.id}
        disableDragAndDrop={props.disableDragAndDrop}
        disableDefaultFileActions={props.disableDefaultFileActions}
        disableDragAndDropProvider={props.disableDragAndDropProvider}
      >
        <FileNavbar />
        <FileToolbar />
        <FileList />
        <FileContextMenu />
      </FileBrowser>
    </div>
  );
};

export default FileManager;
