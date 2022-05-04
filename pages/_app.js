import "../styles/globals.scss";
import { SWRConfig } from "swr";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function MyApp({ Component, pageProps }) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <SWRConfig
      value={{
        // refreshInterval: 3000,
        revalidateOnFocus: false,
        fetcher: (resource, init) =>
          fetch(resource, init).then((res) => res.json()),
      }}
    >
      <ToastContainer
        // position="bottom-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        transition={Slide}
        theme="dark"
        style={{ fontSize: "0.875rem" }}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {getLayout(<Component {...pageProps} />)}
    </SWRConfig>
  );
}
