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

interface CustomFileListProps {
  files?: ExtFile[];
  treeView?: boolean;
}

export default function CustomFileList({ files = [], treeView = true }: CustomFileListProps) {
  const { t, i18n } = useTranslation();

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

  function formatTimestamp(timestamp: number, language: "en" | "vi"): string {
    // Create a new Date object from the timestamp
    const date = new Date(timestamp);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      throw new Error("Invalid timestamp");
    }

    // Define arrays of month names and AM/PM for both languages
    const monthNames = {
      en: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ],
      vi: [
        "Tháng Một",
        "Tháng Hai",
        "Tháng Ba",
        "Tháng Tư",
        "Tháng Năm",
        "Tháng Sáu",
        "Tháng Bảy",
        "Tháng Tám",
        "Tháng Chín",
        "Tháng Mười",
        "Tháng Mười Một",
        "Tháng Mười Hai"
      ]
    };

    const ampmNames = {
      en: { AM: "AM", PM: "PM" },
      vi: { AM: "SA", PM: "CH" }
    };

    // Extract the date components
    const day = date.getUTCDate();
    const month = monthNames[language][date.getUTCMonth()];
    const year = date.getUTCFullYear();

    // Extract the time components
    let hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();

    // Determine AM/PM
    const ampm = hours >= 12 ? ampmNames[language].PM : ampmNames[language].AM;
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    // Format minutes to always have two digits
    const minutesStr = minutes < 10 ? "0" + minutes : minutes.toString();

    // Construct the formatted date string
    const formattedDate = `${day} ${month} ${year}, ${hours}:${minutesStr} ${ampm}`;

    return formattedDate;
  }

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
                {formatTimestamp(file.file!!.lastModified, i18next.language === "en" ? "en" : "vi")}
              </p>
            </div>
          ))}
        </div>
      )}
    </Box>
  );
}
