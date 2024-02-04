import { FileCard } from "@files-ui/react";

interface CustomFileCardProps {
  file: any;
  handleDownload:
    | ((fileId: string | number | undefined, downloadUrl?: string | undefined) => void)
    | undefined;
  onDelete: ((fileId: string | number | undefined) => void) | undefined;
  handleSee: ((imageSource: string | undefined) => void) | undefined;
  handleWatch: ((videoSource: string | File | undefined) => void) | undefined;
  handleAbort: ((fileId: string | number | undefined) => void) | undefined;
  handleCancel: ((fileId: string | number | undefined) => void) | undefined;
}

export default function CustomFileCard({
  file,
  handleDownload,
  onDelete,
  handleSee,
  handleWatch,
  handleAbort,
  handleCancel
}: CustomFileCardProps) {
  return (
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
  );
}
