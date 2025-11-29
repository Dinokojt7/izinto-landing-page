// src/components/ui/CircularProgessIndicator.js
export default function CircularProgressIndicator({
  size = 100,
  strokeWidth = 10,
  progress = 0,
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-400 rounded-full animate-spin mx-auto" />
    </div>
  );
}
