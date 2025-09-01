"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { CSSProperties, useRef } from "react"


export const TagButton = ({children, isSelected, onSelect}) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const buttonTextRef = useRef<HTMLSpanElement>(null);

  const { contextSafe } = useGSAP();

  const handleHover = contextSafe(() => {
    if (isSelected) {
      gsap.to(buttonRef.current, {
        backgroundColor: "transparent",
        duration: 0.3,
      })

      gsap.to(buttonTextRef.current, {
        color: "#000000",
        duration: 0.3,
      })
    } else {
      gsap.to(buttonRef.current, {
        backgroundColor: "#017bff",
        duration: 0.3,
      })
  
      gsap.to(buttonTextRef.current, {
        color: "#ffffff",
        duration: 0.3,
      })
    }
  });

  const handleMouseLeave = contextSafe(() => {
    if (isSelected) {
      gsap.to(buttonRef.current, {
        backgroundColor: "#017bff",
        duration: 0.3,
      })
  
      gsap.to(buttonTextRef.current, {
        color: "#ffffff",
        duration: 0.3,
      })
    } else {
      gsap.to(buttonRef.current, {
        backgroundColor: "transparent",
        duration: 0.3,
      })
  
      gsap.to(buttonTextRef.current, {
        color: "#000000",
        duration: 0.3,
      })
    }
      
  });

  const buttonStyle: CSSProperties = {
    borderRadius: "5em",
    border: "2px solid #000000",
    backgroundColor: isSelected ? "#017bff" : "transparent",
    width: "fit-content",
    padding: "8px",
    height: "auto",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }

  const buttonTextStyle: CSSProperties = {
    color: isSelected ? "#ffffff" : "#000000",
    fontSize: "1rem",
    fontWeight: "bold"
  }

  return (
    <div 
      style={buttonStyle} 
      ref={buttonRef} 
      onMouseEnter={handleHover} 
      onMouseLeave={handleMouseLeave}
      onClick={onSelect}
    >
      <span style={buttonTextStyle} ref={buttonTextRef} >{children}</span>
    </div>
  )
}