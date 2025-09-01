"use client"

import { CSSProperties } from "react";
import { TagButton } from "../atoms/components/TagButton";
import { useStyles } from "../../utils/utils";

type TagSelectorProps = {
  tags: string[];
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
}

export const TagSelector = ({ tags, selectedTags, onToggleTag }: TagSelectorProps) => {

  const styles = useStyles({
    tagSelector: {
      padding: "8px",
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      width: "100%",
      height: "300px",
      boxSizing: "border-box",
      position: "relative",
    },
    heading: {
      fontSize: "2rem",
      fontWeight: "bold",
    },
    tagContainer: {
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      gap: "8px"
    }
  })
  return (
    <div style={styles.tagSelector}>
      <div >
        <span style={styles.heading}>
          Topics
        </span>
      </div>

      <div style={styles.tagContainer}>
        {tags.map(tag => (
          <TagButton key={tag} isSelected={selectedTags.includes(tag)} onSelect={() => onToggleTag(tag)}>{tag}</TagButton>
        ))}
      </div>
    </div>
  )
}
