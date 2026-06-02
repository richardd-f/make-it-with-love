export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes logo-breathe {
              0%, 100% { transform: scale(1) rotate(0deg); }
              50% { transform: scale(1.1) rotate(3deg); }
            }
            @keyframes orbit {
              0% { transform: rotate(0deg) translateX(72px) rotate(0deg); opacity: 0.8; }
              50% { opacity: 1; }
              100% { transform: rotate(360deg) translateX(72px) rotate(-360deg); opacity: 0.8; }
            }
            @keyframes dot-wave {
              0%, 60%, 100% { transform: translateY(0); }
              30% { transform: translateY(-6px); }
            }
            .loading-logo { animation: logo-breathe 2s ease-in-out infinite; }
            .orbit-item { animation: orbit 3s linear infinite; }
            .orbit-item:nth-child(2) { animation-delay: -0.75s; }
            .orbit-item:nth-child(3) { animation-delay: -1.5s; }
            .orbit-item:nth-child(4) { animation-delay: -2.25s; }
            .dot-wave-1 { animation: dot-wave 1.4s ease-in-out infinite; }
            .dot-wave-2 { animation: dot-wave 1.4s ease-in-out 0.2s infinite; }
            .dot-wave-3 { animation: dot-wave 1.4s ease-in-out 0.4s infinite; }
          `,
        }}
      />

      <div className="flex flex-col items-center gap-8">
        {/* Orbiting ring with logo center */}
        <div className="relative w-40 h-40 flex items-center justify-center">
          {/* Orbiting craft blobs */}
          {[
            { color: "#32a569" },
            { color: "#f79d1c" },
            { color: "#ea7c9d" },
            { color: "#e4552c" },
          ].map((item, i) => (
            <div
              key={i}
              className="absolute inset-0 flex items-center justify-center orbit-item"
            >
              <div
                className="w-4 h-4 rounded-full shadow-md"
                style={{ backgroundColor: item.color }}
              />
            </div>
          ))}

          {/* Center logo */}
          <img
            src="/images/logo/logo_main.webp"
            alt=""
            className="loading-logo w-20 h-20 object-contain drop-shadow-lg"
            draggable={false}
          />
        </div>

        {/* Text with bouncing dots */}
        <div className="flex items-center gap-1">
          <span
            className="text-gray-400 text-sm tracking-widest uppercase font-medium"
            style={{
              fontFamily: "var(--font-montserrat, Montserrat, sans-serif)",
            }}
          >
            Crafting magic
          </span>
          <span className="flex gap-0.5 ml-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#32a569] dot-wave-1" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#f79d1c] dot-wave-2" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#ea7c9d] dot-wave-3" />
          </span>
        </div>
      </div>
    </div>
  );
}
