import Link from "next/link";
import Layout from "../components/Layout/Layout";
import { useRouter } from "next/router";

const Success = () => {
  const router = useRouter();

  return (
    <Layout>
      <div className="min-h-screen flex justify-center items-center flex-col">
        <h1 className="text-3xl font-bold">Payment Successful!</h1>
        <p className="mt-10 font-semibold text-xl">
          you will get a message about the details of this booking
        </p>
        <Link href={"/"}>
          <button className="text-lg font-semibold bg-orange-500 rounded-md p-4 text-[white] mt-10">
            Back to the main page
          </button>
        </Link>
      </div>
    </Layout>
  );
};

export default Success;
