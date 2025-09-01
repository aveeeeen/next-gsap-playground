import { Product, ProductDetail } from "../../mockDB";
import { useStyles } from "../../utils/utils";
import { useGSAP } from "@gsap/react";
import { useEffect, useRef } from "react";
import gsap from "gsap";

type DrawerProps = {
  isOpen: boolean;
  product?: Product;
  productDetails?: ProductDetail[];
  onClose: () => void;
}

export const Drawer = ({ isOpen, product, productDetails, onClose }: DrawerProps) => {
  const { contextSafe } = useGSAP();
  const drawerRef = useRef<HTMLDivElement>(null);

  const openDrawerAnimation = contextSafe(() => {
      gsap.to(drawerRef.current, {
        transform: "translateX(0%)",
        duration: 0.3,
      });
  });

  const closeDrawerAnimation = contextSafe(() => {
      gsap.to(drawerRef.current, {
        transform: "translateX(100%)",
        duration: 0.3,
      });
  });

  useEffect(() => {
    if (isOpen) {
      openDrawerAnimation();
    } else {
      closeDrawerAnimation();
    }
  }, [isOpen]);

  const styles = useStyles({
    drawer: {
      position: "absolute",
      top: 0,
      right: 0,
      width: "50%",
      height: "100svh",
      boxSizing: "border-box",
      backgroundColor: "white",
      boxShadow: "-2px 0 8px rgba(0, 0, 0, 0.1)",
      // transform: isOpen ? "translateX(0)" : "translateX(100%)",
      zIndex: 1000,
      overflowY: "auto",
      padding: "2rem",
    },
    closeButton: {
      position: "absolute",
      top: "1rem",
      right: "1rem",
      cursor: "pointer",
    },
    content: {
      marginTop: "2rem",
    }
  });

  // if (!product || !productDetails) return null;

  return (
    <div ref={drawerRef} style={styles.drawer}>
      <button style={styles.closeButton} onClick={onClose}>×</button>
      {
        product && productDetails && (
          <>
            <div style={styles.content}>
              <h2>{product.title}</h2>
              <p>{product.summary}</p>
              {productDetails.map((detail, index) => (
            <div key={index}>
              <h3>{detail.title}</h3>
              <p>{detail.description}</p>
            </div>
          ))}
        </div>
          </>
        )
      }
    </div>
  );
};