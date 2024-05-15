import React, { useEffect, useRef } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./index.scss";
import ImageResize from "quill-image-resize-module-react";
import ImageUploader from "quill-image-uploader";
import QuillImageDropAndPaste from "quill-image-drop-and-paste";
import ErrorMessage from "components/text/ErrorMessage";

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
};

const TextEditor: React.FC<Props> = ({ value, onChange, placeholder, readOnly, ...props }) => {
  const reactQuillRef: any = useRef(null);
  const { error } = props;
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
    reactQuillRef.current.getEditor().root.dataset.placeholder = placeholder || "";
  }, [reactQuillRef, placeholder]);

  return (
    <>
      <ReactQuill
        ref={reactQuillRef}
        theme={readOnly ? "bubble" : "snow"}
        readOnly={readOnly}
        value={value || ""}
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
        }`}
        {...props}
      />
    </>
  );
};

export default TextEditor;
