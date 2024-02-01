import { useLayoutEffect, useRef } from "react";

export default function PdfViewer(props: any) {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    const container = containerRef.current; // This `useRef` instance will render the PDF.

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let PSPDFKit: any, instance;

    (async function () {
      PSPDFKit = await import("pspdfkit");
      // @ts-ignore
      PSPDFKit.unload(container); // Ensure that there's only one PSPDFKit instance.
      // @ts-ignore
      instance = await PSPDFKit.load({
        // Container where PSPDFKit should be mounted.
        container,
        // The document to open.
        document: props.document,
        // Use the public directory URL as a base URL. PSPDFKit will download its library assets from here.
        baseUrl: `${window.location.protocol}//${window.location.host}/${process.env.PUBLIC_URL}`
      });
    })();

    return () => PSPDFKit && PSPDFKit.unload(container);
  }, []);

  // This div element will render the document to the DOM.
  return <div ref={containerRef} style={{ width: "100%", height: "100vh" }} />;
}
