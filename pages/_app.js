import "../styles/tailwind.css";
import "../styles/slick.css";
import { BookingProvider } from "../context/BookingContext";
import { Toaster } from "react-hot-toast";

function MyApp({ Component, pageProps }) {
  return (
    <BookingProvider>
      <Toaster position="bottom-left" reverseOrder={false} />
      <Component {...pageProps} />;
    </BookingProvider>
  );
}

export default MyApp;
