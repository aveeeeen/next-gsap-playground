import { CSSProperties } from "react"

export const utils = () => {
  const choose = (array: any[]) => {
    return array[Math.floor(Math.random() * array.length)]
  }

  return {
    choose,
  }
}


export const useStyles = (styles: {[key: string]: CSSProperties}): { [key: string]: CSSProperties } => {
  return Object.keys(styles).reduce((acc, key) => {
    acc[key] = { ...styles[key] }
    return acc
  }, {} as {[key: string]: CSSProperties})
}