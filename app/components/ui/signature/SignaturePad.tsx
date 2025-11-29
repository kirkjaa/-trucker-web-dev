import React, { useEffect, useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";

// Use RefAttributes to ensure ref typing is correct
const SignaturePad = React.forwardRef<
  SignatureCanvas,
  React.RefAttributes<SignatureCanvas>
>((_, ref) => {
  const sigPadRef = ref as React.MutableRefObject<SignatureCanvas | null>;
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 200 });

  // Adjust canvas width and height dynamically
  useEffect(() => {
    const resizeCanvas = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const containerHeight = containerRef.current.offsetHeight;
        setCanvasSize({ width: containerWidth, height: containerHeight });
      }
    };

    // Set the initial size
    resizeCanvas();

    // Add a resize event listener
    window.addEventListener("resize", resizeCanvas);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        padding: "16px 0",
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      <SignatureCanvas
        ref={sigPadRef}
        penColor="black"
        canvasProps={{
          width: canvasSize.width,
          height: canvasSize.height,
          style: {
            borderTop: "1px solid #000",
            borderBottom: "1px solid #000",
            height: "100%",
            width: "100%",
          },
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "0",
          width: "100%",
          height: "1px",
          borderTop: "2px dashed #DBDBDB",
          transform: "translateY(-50%)",
          pointerEvents: "none",
        }}
      ></div>
    </div>
  );
});

// Set the displayName to avoid ESLint warning
SignaturePad.displayName = "SignaturePad";

export default SignaturePad;
