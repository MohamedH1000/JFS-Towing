import React from "react";
import Layout from "../components/Layout/Layout";

const about = () => {
  return (
    <>
      <Layout>
        <div className="w-full h-[100px] mt-[90px] bg-orange-500 flex items-center justify-center">
          <h2 className="text-3xl font-bold text-[white]">About</h2>
          <section></section>
        </div>
      </Layout>
    </>
  );
};

export default about;
