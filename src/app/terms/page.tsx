import React from "react";
import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="min-h-screen relative z-10 w-full flex flex-col items-center py-16 px-4 sm:px-8 pb-32">
      
      {/* Decorative Blob */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#f6e5c4] rounded-full mix-blend-multiply filter blur-[80px] opacity-60 -z-10"></div>
      <div className="absolute bottom-40 left-0 w-[300px] h-[300px] bg-[#ea7c9d] rounded-full mix-blend-multiply filter blur-[80px] opacity-30 -z-10"></div>

      <div className="w-full max-w-4xl bg-white/80 backdrop-blur-xl p-8 sm:p-12 md:p-16 rounded-[3rem] shadow-xl border-4 border-white animate-fade-in">

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-family-papernotes text-5xl sm:text-6xl text-[#32a569] drop-shadow-sm mb-4">
            SYARAT & KETENTUAN<br/>(TERMS & CONDITIONS)
          </h1>
          <p className="text-2xl font-bold text-[#f79d1c] font-family-papernotes tracking-widest">
            MakeitWithLove
          </p>
        </div>

        {/* Content */}
        <div className="space-y-12" style={{ fontFamily: "var(--font-montserrat, Montserrat, sans-serif)" }}>
          
          {/* Section 1 */}
          <section>
            <h2 className="flex items-center gap-4 text-2xl font-bold text-[#e4552c] mb-4">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-[#e4552c] text-white flex items-center justify-center text-xl">1</span>
              Pendahuluan
            </h2>
            <p className="text-gray-700 leading-relaxed pl-14">
              Selamat datang di MakeitWithLove. Syarat & Ketentuan ini mengatur penggunaan situs, pembelian DIY Kit, dan partisipasi dalam kursus online kami. Dengan melakukan transaksi, Anda (sebagai orang tua/wali) dianggap telah membaca dan menyetujui ketentuan ini.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="flex items-center gap-4 text-2xl font-bold text-[#32a569] mb-4">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-[#32a569] text-white flex items-center justify-center text-xl">2</span>
              Penggunaan Layanan dan Pengawasan
            </h2>
            <ul className="space-y-4 text-gray-700 leading-relaxed pl-14 list-disc marker:text-[#32a569]">
              <li>
                <strong>Batas Usia:</strong> Layanan, transaksi, dan pendaftaran kelas hanya boleh dilakukan oleh orang dewasa (18 tahun ke atas).
              </li>
              <li>
                <strong>Penafian Keselamatan (Safety Disclaimer):</strong> DIY Kit kami dirancang untuk kreativitas anak. Namun, aktivitas pengerjaan wajib dilakukan di bawah pengawasan ketat orang tua/wali. MakeitWithLove tidak bertanggung jawab atas cedera, alergi, atau insiden yang terjadi akibat kelalaian pengawasan selama penggunaan produk.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="flex items-center gap-4 text-2xl font-bold text-[#ea7c9d] mb-4">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-[#ea7c9d] text-white flex items-center justify-center text-xl">3</span>
              Ketentuan Kursus Online (Zoom)
            </h2>
            <ul className="space-y-4 text-gray-700 leading-relaxed pl-14 list-disc marker:text-[#ea7c9d]">
              <li>
                <strong>Akses Pribadi:</strong> Tautan Zoom dan materi kursus hanya diberikan kepada peserta yang telah menyelesaikan pembayaran. Akses ini bersifat eksklusif dan dilarang keras untuk dibagikan kepada pihak lain.
              </li>
              <li>
                <strong>Pembatalan & Perubahan Jadwal (Reschedule):</strong> Jika Anda ingin membatalkan atau memindahkan jadwal kelas, konfirmasi wajib dilakukan maksimal 6 jam sebelum kelas dimulai.
              </li>
              <li>
                <strong>Kebijakan Penggantian Sesi:</strong> Tidak ada pengembalian dana (refund) untuk kelas yang dibatalkan. Jika Anda membatalkan kelas sesuai dengan batas waktu (minimal 6 jam sebelumnya), MakeitwithLove akan menyimpan dana tersebut sebagai &quot;deposit sesi&quot; (hutang sesi) yang dapat digunakan untuk menjadwalkan ulang kelas di lain waktu. Jika peserta tidak hadir tanpa pemberitahuan sebelumnya, sesi dianggap hangus.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="flex items-center gap-4 text-2xl font-bold text-[#f79d1c] mb-4">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-[#f79d1c] text-white flex items-center justify-center text-xl">4</span>
              Kebijakan Pembelian dan Retur Fisik
            </h2>
            <p className="text-gray-700 leading-relaxed pl-14">
              Pembelian DIY Kit fisik dilakukan melalui platform pihak ketiga (seperti Shopee, Tokopedia, dll). Segala bentuk keluhan terkait pengiriman, barang rusak, atau retur produk fisik akan tunduk pada kebijakan refund dan resolusi masing-masing platform e-commerce tersebut.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="flex items-center gap-4 text-2xl font-bold text-[#e4552c] mb-4">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-[#e4552c] text-white flex items-center justify-center text-xl">5</span>
              Hukum yang Berlaku
            </h2>
            <p className="text-gray-700 leading-relaxed pl-14">
              Syarat dan Ketentuan ini tunduk pada hukum yang berlaku di wilayah Surabaya, Jawa Timur.
            </p>
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
