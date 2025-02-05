import Feature from "../components/Feature";
import Pricing from "../components/Pricing";
import Hero from "../components/Hero";
import Layout from "../components/Layout/Layout";
import SeoHead from "../components/SeoHead";
import OurServices from "../components/OurServices";

export default function Home() {
  return (
    <>
      <SeoHead title="JFS Towing" />
      <Layout>
        <Hero />
        <Feature />
        <OurServices />
        <Pricing />
      </Layout>
    </>
  );
}
