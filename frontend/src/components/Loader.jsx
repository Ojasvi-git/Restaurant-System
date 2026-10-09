
import { LoaderCircle } from "lucide-react";

function Loader({ text = "Loading...", fullScreen = false }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${
        fullScreen ? "min-h-screen bg-white" : "py-10"
      }`}
      role="status"
      aria-live="polite"
    >
      <LoaderCircle
        size={36}
        className="animate-spin text-gray-700"
      />

      <p className="text-sm font-medium text-gray-600">
        {text}
      </p>
    </div>
  );
}

export default Loader;