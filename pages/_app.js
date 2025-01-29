import "../styles/tailwind.css";
import "../styles/slick.css";
import { BookingProvider } from "../context/BookingContext";

function MyApp({ Component, pageProps }) {
  return (
    <BookingProvider>
      <Component {...pageProps} />;
    </BookingProvider>
  );
}

export default MyApp;
