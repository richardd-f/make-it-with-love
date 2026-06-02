import React from "react";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen relative z-10 w-full flex flex-col items-center py-16 px-4 sm:px-8 pb-32">
      
      {/* Decorative Blob */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#f6e5c4] rounded-full mix-blend-multiply filter blur-[80px] opacity-60 -z-10"></div>
      <div className="absolute bottom-40 left-0 w-[300px] h-[300px] bg-[#ea7c9d] rounded-full mix-blend-multiply filter blur-[80px] opacity-30 -z-10"></div>

      <div className="w-full max-w-4xl bg-white/80 backdrop-blur-xl p-8 sm:p-12 md:p-16 rounded-[3rem] shadow-xl border-4 border-white animate-fade-in">

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-family-papernotes text-5xl sm:text-6xl text-[#32a569] drop-shadow-sm mb-4">
            KEBIJAKAN PRIVASI<br/>(PRIVACY POLICY)
          </h1>
          <p className="text-2xl font-bold text-[#f79d1c] font-family-papernotes tracking-widest">
            MakeitwithLove
          </p>
        </div>

        {/* Content */}
        <div className="space-y-12" style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}>
          
          {/* Section 1 */}
          <section>
            <h2 className="flex items-center gap-4 text-2xl font-bold text-[#e4552c] mb-4">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-[#e4552c] text-white flex items-center justify-center text-xl">1</span>
              Pengumpulan Data
            </h2>
            <p className="text-gray-700 leading-relaxed pl-14">
              Kami mengumpulkan informasi yang Anda berikan saat melakukan pendaftaran, seperti nama orang tua, alamat email, dan informasi kontak untuk keperluan operasional kursus dan pengiriman kit.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="flex items-center gap-4 text-2xl font-bold text-[#32a569] mb-4">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-[#32a569] text-white flex items-center justify-center text-xl">2</span>
              Privasi dan Dokumentasi Kelas (Zoom)
            </h2>
            <div className="text-gray-700 leading-relaxed pl-14 space-y-4">
              <p>MakeitwithLove mungkin melakukan dokumentasi selama kelas online berlangsung untuk keperluan internal atau portofolio.</p>
              <ul className="list-disc marker:text-[#32a569] pl-6 space-y-2">
                <li>
                  <strong>Pilihan Privasi (Opt-Out):</strong> Kami menghargai privasi anak Anda. Saat melakukan pendaftaran kelas di website, Anda dapat memberikan penolakan dokumentasi dengan mencentang kotak persetujuan yang tersedia. Jika opsi ini dicentang, kami memastikan wajah anak Anda tidak akan masuk dalam materi publikasi kami.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="flex items-center gap-4 text-2xl font-bold text-[#ea7c9d] mb-4">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-[#ea7c9d] text-white flex items-center justify-center text-xl">3</span>
              Unggahan Karya Anak (User-Generated Content)
            </h2>
            <div className="text-gray-700 leading-relaxed pl-14 space-y-4">
              <p>Untuk merayakan kreativitas, orang tua dapat mengunggah hasil karya anak ke website kami. Untuk melindungi privasi anak:</p>
              <ul className="list-disc marker:text-[#ea7c9d] pl-6 space-y-2">
                <li>Foto yang diunggah wajib hanya berfokus pada hasil karya.</li>
                <li>Jika foto memperlihatkan anak, wajah anak wajib dipotong (crop) sebelum diunggah. Kami berhak menghapus atau menolak unggahan yang menampilkan wajah anak dengan jelas.</li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="flex items-center gap-4 text-2xl font-bold text-[#f79d1c] mb-4">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-[#f79d1c] text-white flex items-center justify-center text-xl">4</span>
              Keamanan Informasi
            </h2>
            <p className="text-gray-700 leading-relaxed pl-14">
              Kami tidak akan menjual, menyewakan, atau membagikan data pribadi Anda kepada pihak ketiga mana pun di luar kebutuhan operasional esensial (seperti layanan kurir).
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="flex items-center gap-4 text-2xl font-bold text-[#e4552c] mb-4">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-[#e4552c] text-white flex items-center justify-center text-xl">5</span>
              Hubungi Kami
            </h2>
            <div className="text-gray-700 leading-relaxed pl-14 space-y-4">
              <p>Jika Anda memiliki pertanyaan mengenai privasi atau layanan kami, silakan hubungi kami melalui:</p>
              <ul className="list-disc marker:text-[#e4552c] pl-6 space-y-2">
                <li><strong>Email:</strong> makeitwithlovestudio@gmail.com</li>
                <li><strong>Instagram:</strong> @makeitwithlove.studio</li>
              </ul>
            </div>
          </section>

        </div>

        {/* Back button */}
        <div className="mt-16 text-center">
          <Link href="/">
            <button className="px-10 py-4 bg-white text-[#32a569] border-2 border-[#32a569] hover:bg-[#32a569] hover:text-white font-bold rounded-full transition-all text-xl" style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}>
              Kembali ke Beranda
            </button>
          </Link>
        </div>

      </div>
    </main>
  );
}
