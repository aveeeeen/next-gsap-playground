import { CSSProperties } from "react"
import { ThreeFundamentals } from "../../3d-tutorial/fundamentals"

export const Header = () => {
  
  const headerStyle: CSSProperties = {
    position: "relative",
    width: "100%",
    height: "100%",
    backgroundColor: "#ffffff",
  }

  return (
    <div style={headerStyle}>
      <ThreeFundamentals></ThreeFundamentals>
    </div>
  )
}