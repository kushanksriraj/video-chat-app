import App from "./App";
import { createRoot } from "react-dom/client";

// wake up the repl
fetch("https://translater.kushanksriraj.repl.co/health").catch((err) =>
  alert(err)
);

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(<App />);
