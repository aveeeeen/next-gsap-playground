import { Header } from "./page-layouts/components/Header"
import { Content } from "./page-layouts/components/Content"
import { CSSProperties } from "react";

const MainPage = () => {
  const rootStyle: CSSProperties = {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: "0%",
    left: "0%",
  }

  return (
    <main style={rootStyle}>
      <Header></Header>
      <Content></Content>
    </main>
  );
}

export default MainPage;
