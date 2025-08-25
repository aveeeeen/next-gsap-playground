export const utils = () => {
  const choose = (array: any[]) => {
    return array[Math.floor(Math.random() * array.length)]
  }

  return {
    choose,
  }
}