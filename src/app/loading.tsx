export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-16 h-16">
          <div
            className="absolute inset-0 rounded-full border-4 border-[#f6e5c4]"
          />
          <div
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#32a569] animate-spin"
          />
        </div>
        <p
          className="text-gray-400 text-sm tracking-widest uppercase font-medium"
          style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}
        >
          Loading...
        </p>
      </div>
    </div>
  );
}
