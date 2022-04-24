import Navbar from "../Navigation/Navbar";
import Footer from "../Navigation/Footer";
import { ClientProvider } from "../../contexts/Client.context";

export default function ClientLayout({ children }) {
  return (
    <ClientProvider>
      <Navbar />
      {children}
      <Footer />
    </ClientProvider>
  );
}
