import App from "./App";
import { createRoot } from "react-dom/client";

const API = 'https://eca0e270-0495-4096-890e-b1886c36824e-00-1b9aao43odhlm.asia-b.replit.dev'

// wake up the repl
fetch(`API/health`).catch((err) =>
  alert(err)
);

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(<App />);
