import * as React from "react";
import Box from "@mui/material/Box";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { TreeView } from "@mui/x-tree-view/TreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { ExtFile } from "@files-ui/react";
import { saveAs } from "file-saver";

interface CustomFileListProps {
  files?: ExtFile[];
  treeView?: boolean;
}

export default function CustomFileList({ files = [], treeView = true }: CustomFileListProps) {
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
    <Box sx={{ flexGrow: 1, maxWidth: 300 }}>
      {treeView ? (
        <TreeView
          aria-label='file system navigator'
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
        >
          {files.length != 0 && (
            <TreeItem nodeId='root' label='Files'>
              {files.map((file, index) => (
                <div className='thumbnail' key={index}>
                  <a
                    key={file.id}
                    href={file.downloadUrl}
                    style={{
                      display: "block"
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
            <a
              key={file.id}
              href={file.downloadUrl}
              style={{
                display: "block"
              }}
              onClick={(e) => {
                e.preventDefault();
                handleDownload(file.id);
              }}
            >
              {file.name}
            </a>
          ))}
        </div>
      )}
    </Box>
  );
}
