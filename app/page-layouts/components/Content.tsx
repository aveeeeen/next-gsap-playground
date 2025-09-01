import { CSSProperties } from "react";
import { LayoutGallery } from "./variants/LayoutGallery";
import { LayoutGrid } from "./variants/LayoutGrid";


export const Content = () => {
  const styles: { [key: string]: CSSProperties } = {
    main: {
      position: "relative",
      width: "100%",
      height: "100%",
    },
  };

  return (
    <>
      <div style={styles.main}>
        <LayoutGallery></LayoutGallery>
      </div>
      <div style={styles.main}>
        <LayoutGrid></LayoutGrid>
      </div>
    </>
  );
};
