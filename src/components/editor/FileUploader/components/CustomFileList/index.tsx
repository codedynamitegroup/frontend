import * as React from "react";
import Box from "@mui/material/Box";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { TreeView } from "@mui/x-tree-view/TreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { ExtFile } from "@files-ui/react";
import { saveAs } from "file-saver";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import { standardlizeUTCStringToLocaleString } from "utils/moment";
import moment from "moment";

interface CustomFileListProps {
  files?: ExtFile[];
  treeView?: boolean;
}

export default function CustomFileList({ files = [], treeView = true }: CustomFileListProps) {
  const { t, i18n } = useTranslation();
  const [currentLang, setCurrentLang] = React.useState(() => {
    return i18next.language;
  });

  React.useEffect(() => {
    setCurrentLang(i18next.language);
  }, [i18next.language]);

  const handleDownload = async (fileId: string | number | undefined) => {
    if (fileId === undefined) return;
    const file = files.find((f) => f.id === fileId);
    if (!file) return;
    if (file.downloadUrl) {
      const response = await fetch(file.downloadUrl);
      const blob = await response.blob();
      saveAs(blob, file.name);
    } else {
      console.error("File not found");
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {treeView ? (
        <TreeView
          aria-label='file system navigator'
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
        >
          {files.length !== 0 && (
            <TreeItem nodeId='root' label='Files'>
              {files.map((file, index) => (
                <div className='thumbnail' key={index}>
                  <a
                    key={file.id}
                    href={file.downloadUrl}
                    style={{
                      display: "block",
                      wordBreak: "break-word",
                      whiteSpace: "normal"
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleDownload(file.id);
                    }}
                  >
                    {file.name}
                  </a>
                </div>
              ))}
            </TreeItem>
          )}
        </TreeView>
      ) : (
        <div className='thumbnail'>
          {files.map((file, index) => (
            <div style={{ display: "flex", gap: "15px" }}>
              <a
                key={file.id}
                href={file.downloadUrl}
                style={{
                  display: "block",
                  wordBreak: "break-word",
                  whiteSpace: "normal",
                  width: "50%"
                }}
                onClick={(e) => {
                  e.preventDefault();
                  handleDownload(file.id);
                }}
              >
                {file.name}
              </a>
              <p>
                {standardlizeUTCStringToLocaleString(
                  moment(file.file!!.lastModified).toString() as string,
                  currentLang
                )}
              </p>
            </div>
          ))}
        </div>
      )}
    </Box>
  );
}
