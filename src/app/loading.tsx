export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes dot-wave {
              0%, 60%, 100% { transform: translateY(0) scale(1); }
              30% { transform: translateY(-12px) scale(1.2); }
            }
          `,
        }}
      />
      <div className="flex gap-2.5">
        {[
          { color: "#32a569", delay: "0s" },
          { color: "#f79d1c", delay: "0.15s" },
          { color: "#ea7c9d", delay: "0.3s" },
          { color: "#e4552c", delay: "0.45s" },
          { color: "#f6e5c4", delay: "0.6s" },
        ].map((dot, i) => (
          <div
            key={i}
            className="w-3.5 h-3.5 rounded-full shadow-md"
            style={{
              backgroundColor: dot.color,
              animation: "dot-wave 1.2s ease-in-out infinite",
              animationDelay: dot.delay,
            }}
          />
        ))}
      </div>
    </div>
  );
}
