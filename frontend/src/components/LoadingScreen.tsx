import { Settings } from "lucide-react";
import "./LoadingScreen.css";

export default function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-icon">
          <Settings size={42} strokeWidth={1.5} />
        </div>

        <h2>
          Light<span>Research</span>
        </h2>

        <p>Preparing your workspace...</p>
      </div>
    </div>
  );
}