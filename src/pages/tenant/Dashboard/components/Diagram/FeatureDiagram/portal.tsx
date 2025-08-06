import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom/client";

interface PortalProps {
  node?: HTMLElement;
  children: React.ReactNode;
}

const Portal: React.FC<PortalProps> = ({ node, children }) => {
  const defaultNodeRef = useRef<HTMLElement | null>(null);
  const rootRef = useRef<ReactDOM.Root | null>(null);

  useEffect(() => {
    // Create the default node if not provided
    if (!node && !defaultNodeRef.current) {
      defaultNodeRef.current = document.createElement("div");
      const containerNode = document.getElementById("myDiagram");
      containerNode?.appendChild(defaultNodeRef.current);

      // Initialize root for rendering
      rootRef.current = ReactDOM.createRoot(defaultNodeRef.current);
    }

    // Render the portal content
    let portalNode = node || defaultNodeRef.current;
    if (portalNode && rootRef.current) {
      rootRef.current.render(children);
    }

    return () => {
      // Cleanup on unmount
      rootRef.current?.unmount();
      defaultNodeRef.current?.remove();
      defaultNodeRef.current = null;
    };
  }, [node, children]);

  return null;
};

export default Portal;
