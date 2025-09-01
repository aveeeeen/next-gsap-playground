"use client"

import { Product } from "../../../mockDB"
import { useStyles } from "../../../utils/utils"
import { TagButton } from "./TagButton"

type CardProps = {
  product: Product,
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
  onClick: () => void;
}

export const Card = ({ product, onClick, onToggleTag, selectedTags }: CardProps) => {

  const styles = useStyles({
    card: {
      position: "relative",
      height: "300px",
      width: "100%",
      overflow: "hidden",
    },
    image: {
      position: "absolute",
      objectFit: "cover",
      height: "auto",
      width: "100%",
      top: "0",
      left: "0",
      zIndex: 0,
    },
    details: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      width: "400px",
      height: "auto",
      padding: "1em",
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      borderRadius: "2em",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      zIndex: 2,
    },
    detailsContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "end",
      padding: "16px",
      alignItems: "end",
      zIndex: 1,
      boxSizing: "border-box",
    },
    clickBoundary: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
    },
    productTitle: {
      fontWeight: "bold",
      fontSize: "2rem",
    },
    productSummary: {
      fontSize: "1rem",
      display: "inline",
    },
    tagContainer: {
      display: "flex",
      flexDirection: "row",
      gap: "8px",
      flexWrap: "wrap",
    }
  })

  return (
    <div style={styles.card}>
      <img style={styles.image} src={product.imageData.url}></img>
      <div style={styles.detailsContainer}>
        <div style={styles.clickBoundary} onClick={onClick}></div>
        <div style={styles.details}>
            <span style={styles.productTitle}>{product.title}</span>
            <span style={styles.productSummary}>{product.summary}</span>
            <div style={styles.tagContainer}>
              {product.tags.map(tag => (
                <TagButton key={tag} isSelected={selectedTags.includes(tag)} onSelect={() => onToggleTag(tag)}>{tag}</TagButton>
              ))}
            </div>
        </div>
      </div>
    </div>
  )
}