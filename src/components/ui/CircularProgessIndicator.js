// src/components/ui/CircularProgressIndicator.js
export default function CircularProgressIndicator({
  size = 100,
  strokeWidth = 10,
  progress = 0,
  isPageLoader = false, // New prop for page routing loader
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  // For page routing loader - full screen overlay
  if (isPageLoader) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-100 border-t-[#0096ff] rounded-full animate-spin mx-auto mb-4" />
        </div>
      </div>
    );
  }

  // Original component for inline loading
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div
        className={`w-${size / 10} h-${size / 10} border-${strokeWidth / 2} border-blue-100 border-t-[#0096ff] rounded-full animate-spin mx-auto`}
      />
    </div>
  );
}
