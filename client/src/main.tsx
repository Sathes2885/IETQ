import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { gsap } from 'gsap';

// Set up GSAP
window.gsap = gsap;

createRoot(document.getElementById("root")!).render(<App />);
