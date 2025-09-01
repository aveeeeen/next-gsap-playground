import { CSSProperties } from "react";
import { ShapesContainer } from "../../../ui/components/Tutorial";
import { VerticalYearSelector } from "../../../ui/components/VerticalYearSelector";
import { RandomShapeCanvas } from "../../../ui/components/Canvas";
import { stringToBitmap } from "../../../utils/bitmap";

const text = `*hello**** *world**** ********** `;
const textBitMap = stringToBitmap(text, 3);

export const LayoutGallery = () => {
  const styles: { [key: string]: CSSProperties } = {
    pageLayout: {
      position: "absolute",
      top: "0%",
      left: "0%",
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      overflow: "hidden",
    },
    gallery: {
      width: '100%',
      height: 'fit-content',
      overflow: 'scroll',
      display: "flex",
      flexDirection: "row",
      gap: "12px",
      padding: '20px',
    },
    box: {
      width: "fit-content",
      height: "fit-content",
      borderRadius: "24px",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
      padding: "16px",
      overflow: "clip",
    },
  };

  return (
    <div style={styles.pageLayout}>
       <div style={styles.gallery}>
        <div style={styles.box}>
          <VerticalYearSelector
            years={[2023, 2024, 2025]}
            initialYear={2025}
          ></VerticalYearSelector>
        </div>
        <div style={styles.box}>
          <ShapesContainer
            w={600}
            h={400}
            subdiv={7 * 11}
            bitmap={textBitMap}
          ></ShapesContainer>
        </div>
        <div style={styles.box}>
          <ShapesContainer w={600} h={400} subdiv={24}></ShapesContainer>
        </div>
        <div style={styles.box}>
          <RandomShapeCanvas w={120 * 6} h={120 * 6 * 4 / 6} subdivs={12 * 3}></RandomShapeCanvas>
        </div>
      </div>
    </div>
  )
}