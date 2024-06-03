import React, { useEffect, useRef, useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./index.scss";
import ImageResize from "quill-image-resize-module-react";
import ImageUploader from "quill-image-uploader";
import QuillImageDropAndPaste from "quill-image-drop-and-paste";
import { IconButton, Dialog, DialogContent, DialogTitle, Grid, Box } from "@mui/material";
import FullscreenIcon from "@mui/icons-material/ZoomOutMap";
import CloseIcon from "@mui/icons-material/Close";

declare global {
  interface Window {
    Quill: any;
  }
}

window.Quill = Quill;

Quill.register("modules/imageResize", ImageResize);
Quill.register("modules/imageUploader", ImageUploader);
Quill.register("modules/imageDropAndPaste", QuillImageDropAndPaste);

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "code",
  "color",
  "background",
  "code-block",
  "align"
];

interface OnChangeHandler {
  (e: any): void;
}

type Props = {
  value?: string;
  placeholder?: string;
  noToolbar?: boolean;
  onChange?: OnChangeHandler;
  readOnly?: boolean;
  error?: boolean;
  [key: string]: any;
  roundedBorder?: boolean;
  openDialog?: boolean;
  title?: string;
  submitCount?: number;
  maxLines?: number;
  width?: string;
};

const TextEditor: React.FC<Props> = ({
  value,
  onChange,
  placeholder,
  readOnly,
  roundedBorder,
  width,
  ...props
}) => {
  const reactQuillRef: any = useRef(null);
  const dialogQuillRef: any = useRef(null);
  const { error, openDialog, title, submitCount, maxLines } = props;
  const modules = React.useMemo(
    () => ({
      toolbar: props?.noToolbar
        ? false
        : {
            container: [
              // [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
              [{ header: [1, 2, 3, 4, 5, 6, false] }],
              ["bold", "italic", "underline", "strike", "blockquote", "code-block"],
              [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
              ["link", "image"],
              [{ color: [] }, { background: [] }, { align: [] }],
              ["clean"]
            ]
          },
      imageUploader: {
        upload: (file: Blob) => {
          return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append("image", file);

            fetch("https://api.imgbb.com/1/upload?key=b063ca6690752179df86e2b5f2f5a786", {
              method: "POST",
              body: formData
            })
              .then((response) => response.json())
              .then((result) => {
                resolve(result.data.url);
              })
              .catch((error) => {
                reject("Upload failed");
                console.error("Error:", error);
              });
          });
        }
      },
      imageResize: {
        parchment: Quill.import("parchment"),
        modules: ["Resize", "DisplaySize"]
      },
      imageDropAndPaste: {
        handler: (
          dataUrl: string,
          type: string,
          imageData: {
            toBlob: () => Blob;
            toFile: (fileName: string) => File;
            minify: (options: {
              maxWidth: number;
              maxHeight: number;
              quality: number;
            }) => Promise<any>;
          }
        ) => {
          return new Promise((resolve, reject) => {
            imageData
              .minify({
                maxWidth: 320,
                maxHeight: 320,
                quality: 0.7
              })
              .then((miniImageData) => {
                const file = miniImageData.toFile("my_cool_image.png");

                const formData = new FormData();
                formData.append("image", file);
              });
          });
        }
      }
    }),
    []
  );
  useEffect(() => {
    if (reactQuillRef.current)
      reactQuillRef.current.getEditor().root.dataset.placeholder = placeholder || "";
  }, [reactQuillRef, placeholder]);

  useEffect(() => {
    if (dialogQuillRef.current)
      dialogQuillRef.current.getEditor().root.dataset.placeholder = placeholder || "";
  }, [dialogQuillRef, placeholder]);

  useEffect(() => {
    if (error && reactQuillRef.current) {
      reactQuillRef.current.focus();
    }
  }, [error, reactQuillRef, submitCount]);

  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {openDialog && (
        <>
          <div style={{ position: "relative", height: "100%" }}>
            <ReactQuill
              style={{
                height: maxLines ? `${maxLines * 24}px` : undefined // Maximum height equivalent to maxRows
              }}
              ref={reactQuillRef}
              theme={readOnly ? "bubble" : "snow"}
              readOnly={readOnly}
              value={convertQuillValue(value)}
              modules={modules}
              formats={formats}
              onChange={onChange}
              className={`text-editor ${
                props?.noToolbar
                  ? error
                    ? "text-editor-no-toolbar-error"
                    : "text-editor-no-toolbar"
                  : error
                    ? "text-editor-error"
                    : ""
              } ${roundedBorder ? `rounded-border` : ""}`}
              {...props}
            />
            <IconButton
              onClick={() => setOpen(true)}
              size='small'
              color='primary'
              className='zoomIcon'
            >
              <FullscreenIcon />
            </IconButton>
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth='xl'>
              <DialogTitle sx={{ m: 0, p: 2 }}>{title || ""}</DialogTitle>
              <IconButton
                aria-label='close'
                onClick={handleClose}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500]
                }}
              >
                <CloseIcon />
              </IconButton>
              <DialogContent
                onKeyDown={(event) => event.stopPropagation()}
                className='dialogContent'
                dividers
              >
                <Grid container>
                  <Grid item xs={12}>
                    <ReactQuill
                      ref={dialogQuillRef}
                      theme={readOnly ? "bubble" : "snow"}
                      readOnly={readOnly}
                      value={convertQuillValue(value)}
                      modules={modules}
                      formats={formats}
                      onChange={onChange}
                      className={`dialog-editor text-editor ${
                        props?.noToolbar ? "text-editor-no-toolbar" : ""
                      } ${roundedBorder ? `rounded-border` : ""}`}
                      {...props}
                      onKeyDown={(event) => {
                        if (dialogQuillRef && event.key === " " && dialogQuillRef.current) {
                          const editor = dialogQuillRef.current.getEditor();
                          const { index } = editor.getSelection(true);
                          if (index === editor.getLength() - 1) {
                            editor.insertText(index, "\u200B", "user");
                          }
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </DialogContent>
            </Dialog>
          </div>
        </>
      )}
      {!openDialog && (
        <Box width={width || "100%"}>
          <ReactQuill
            style={{
              height: maxLines ? `${maxLines * 24}px` : undefined
            }}
            ref={reactQuillRef}
            theme={readOnly ? "bubble" : "snow"}
            readOnly={readOnly}
            value={convertQuillValue(value)}
            modules={modules}
            formats={formats}
            onChange={onChange}
            // placeholder={placeholder}
            className={`text-editor ${
              props?.noToolbar
                ? error
                  ? "text-editor-no-toolbar-error"
                  : "text-editor-no-toolbar"
                : error
                  ? "text-editor-error"
                  : ""
            } ${roundedBorder ? `rounded-border` : ""}`}
            {...props}
          />
        </Box>
      )}
    </>
  );
};

export default TextEditor;

function convertQuillValue(value: string | undefined) {
  if (typeof value === "undefined" || value?.replace(/<(.|\n)*?>/g, "").trim().length === 0) {
    return "";
  }
  return value;
}
