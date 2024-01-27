import React, { useRef } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageResize from "quill-image-resize-module-react";
import ImageUploader from "quill-image-uploader";
import QuillImageDropAndPaste from "quill-image-drop-and-paste";

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
  value: string;
  placeholder?: string;
  onChange: OnChangeHandler;
  [key: string]: any;
};

const TextEditor: React.FC<Props> = ({ value, onChange, placeholder = "", ...props }) => {
  const reactQuillRef: any = useRef(null);

  const modules = React.useMemo(
    () => ({
      toolbar: {
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

            fetch("https://api.imgbb.com/1/upload?key=334ecea9ec1213784db5cb9a14dac265", {
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
                // const blob = miniImageData.toBlob();
                const file = miniImageData.toFile("my_cool_image.png");

                // console.log(`type: ${type}`);
                // console.log(`dataUrl: ${dataUrl}`);
                // console.log(`blob: ${blob}`);
                // console.log(`file: ${file}`);

                const formData = new FormData();
                formData.append("image", file);
              });
          });
        }
      }
    }),
    []
  );

  return (
    <>
      <ReactQuill
        ref={reactQuillRef}
        theme='snow'
        value={value || ""}
        modules={modules}
        formats={formats}
        onChange={onChange}
        placeholder={placeholder}
        {...props}
      />
    </>
  );
};

export default TextEditor;
