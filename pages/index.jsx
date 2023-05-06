import dynamic from "next/dynamic.js";

const Home = dynamic(() => import("../components/Home"), {
  ssr: false,
});
const Index = () => {
  return <Home/>
}

export default Index