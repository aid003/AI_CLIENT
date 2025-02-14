import Header from "@/components/Base/Header";
import MainContainer from "@/components/Main/MainContainer";
// import styles from "./page.module.css";

export const metadata = {
  title: "Консультирую  |  Главная",
};

export default function Home() {
  return (
    <Header>
      <MainContainer />
    </Header>
  );
}
