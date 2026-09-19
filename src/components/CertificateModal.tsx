import React, { useState, useRef } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { AwardItem } from '../types/portfolio';
import {
  X,
  Trophy,
  ChevronLeft,
  ChevronRight,
  Upload,
  Download,
  FileText,
  Image as ImageIcon,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Trash2,
  Calendar,
  Building,
  CheckCircle2,
  ShieldCheck,
  Lock
} from 'lucide-react';

export const CertificateModal: React.FC = () => {
  const {
    activeAwardModal,
    setActiveAwardModal,
    data,
    updateAward,
    showToast,
    processCertificateFile,
    isAdminUnlocked
  } = usePortfolio();

  const [zoomLevel, setZoomLevel] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!activeAwardModal) return null;

  const awardsList = data.awards;
  const currentIndex = awardsList.findIndex(a => a.id === activeAwardModal.id);
  const currentAward: AwardItem = currentIndex !== -1 ? awardsList[currentIndex] : activeAwardModal;

  const certificateUrl = currentAward.certificateUrl || currentAward.certificateImage;
  const isPdf = currentAward.certificateType === 'pdf' || (certificateUrl && certificateUrl.startsWith('data:application/pdf'));

  const handlePrev = () => {
    setZoomLevel(1);
    if (currentIndex > 0) {
      setActiveAwardModal(awardsList[currentIndex - 1]);
    } else {
      setActiveAwardModal(awardsList[awardsList.length - 1]);
    }
  };

  const handleNext = () => {
    setZoomLevel(1);
    if (currentIndex < awardsList.length - 1) {
      setActiveAwardModal(awardsList[currentIndex + 1]);
    } else {
      setActiveAwardModal(awardsList[0]);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      showToast('Memproses file sertifikat...', 'warning');
      const processed = await processCertificateFile(file);
      const updated: AwardItem = {
        ...currentAward,
        certificateUrl: processed.url,
        certificateType: processed.type,
        certificateFileName: processed.name
      };
      updateAward(updated);
      setActiveAwardModal(updated);
      showToast(`File ${processed.name} berhasil diunggah!`, 'success');
    } catch {
      showToast('Gagal memproses file sertifikat!', 'error');
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveFile = () => {
    if (confirm('Hapus file sertifikat ini?')) {
      const updated: AwardItem = {
        ...currentAward,
        certificateUrl: undefined,
        certificateImage: undefined,
        certificateType: undefined,
        certificateFileName: undefined
      };
      updateAward(updated);
      setActiveAwardModal(updated);
      showToast('File sertifikat dihapus.', 'warning');
    }
  };

  const handleDownload = () => {
    if (!certificateUrl) return;
    const a = document.createElement('a');
    a.href = certificateUrl;
    a.download = currentAward.certificateFileName || `Sertifikat_${currentAward.title.replace(/\s+/g, '_')}.${isPdf ? 'pdf' : 'jpg'}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    showToast('Download dimulai...', 'success');
  };

  const handleOpenNewTab = () => {
    if (!certificateUrl) return;
    const newTab = window.open();
    if (newTab) {
      newTab.document.write(
        isPdf
          ? `<title>${currentAward.title}</title><iframe src="${certificateUrl}" frameborder="0" style="border:0; top:0; left:0; bottom:0; right:0; width:100%; height:100%;" allowfullscreen></iframe>`
          : `<title>${currentAward.title}</title><body style="margin:0; background:#0b0b0e; display:flex; justify-content:center; align-items:center; min-height:100vh;"><img src="${certificateUrl}" style="max-width:100%; max-height:100vh; object-fit:contain;" /></body>`
      );
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-md animate-fade-in">
      {/* Click outside backdrop */}
      <div className="fixed inset-0 -z-10" onClick={() => setActiveAwardModal(null)} />

      {/* Modal Container */}
      <div className="relative w-full max-w-6xl bg-[#0e0e14] border border-[#d4af37]/40 rounded-sm shadow-2xl overflow-hidden flex flex-col my-auto max-h-[95vh]">
        {/* Top Gold Gradient Accent Line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-f1-red via-[#d4af37] to-f1-red"></div>

        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-[#14141f] border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#d4af37] flex items-center justify-center">
              <Trophy size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-f1 font-bold tracking-widest text-[#d4af37] uppercase">
                  DOKUMEN SERTIFIKAT // OFFICIAL CERTIFICATES
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-f1-red/20 text-f1-red border border-f1-red/30 rounded font-f1 font-bold">
                  {currentAward.position || '1ST PLACE GOLD'}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-f1 font-black text-white tracking-wide truncate max-w-sm sm:max-w-xl">
                {currentAward.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Pagination Navigator */}
            <div className="flex items-center gap-1 bg-black/50 border border-white/10 rounded px-2 py-1 text-xs font-f1 font-bold text-f1-gray mr-1">
              <button
                onClick={handlePrev}
                className="hover:text-white transition p-0.5"
                title="Sertifikat Sebelumnya"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="px-1 text-white text-[11px]">
                {currentIndex + 1} / {awardsList.length}
              </span>
              <button
                onClick={handleNext}
                className="hover:text-white transition p-0.5"
                title="Sertifikat Selanjutnya"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setActiveAwardModal(null)}
              className="w-8 h-8 rounded bg-white/5 hover:bg-f1-red hover:text-white text-f1-gray flex items-center justify-center transition"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body: Split into Document Stage (Left) and Detail Explanation (Right) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* ============================================================ */}
            {/* LEFT / CENTER: PDF / JPG CERTIFICATE DOCUMENT VIEWER (8 COLS) */}
            {/* ============================================================ */}
            <div className="lg:col-span-8 flex flex-col space-y-3">
              {/* Document Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-2 bg-[#14141f] border border-white/10 px-3 py-2 rounded text-xs font-f1 font-bold">
                <div className="flex items-center gap-2 max-w-full truncate">
                  <span className="text-f1-gray uppercase flex items-center gap-1.5 truncate">
                    {isPdf ? <FileText size={15} className="text-f1-red shrink-0" /> : <ImageIcon size={15} className="text-[#d4af37] shrink-0" />}
                    <span className="text-white truncate">
                      {currentAward.certificateFileName || (isPdf ? 'Dokumen_Sertifikat.pdf' : certificateUrl ? 'Foto_Sertifikat.jpg' : 'Belum Ada File')}
                    </span>
                  </span>
                  {certificateUrl && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-[#00ff66] font-mono shrink-0">
                      {isPdf ? 'PDF' : 'IMAGE'}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  {certificateUrl && !isPdf && (
                    <div className="flex items-center gap-1 bg-black/40 border border-white/10 rounded px-1.5 py-0.5">
                      <button
                        onClick={() => setZoomLevel(prev => Math.max(0.6, prev - 0.2))}
                        className="p-1 hover:text-white text-f1-gray transition"
                        title="Perkecil"
                      >
                        <ZoomOut size={13} />
                      </button>
                      <span className="text-[10px] font-mono text-white px-1">
                        {Math.round(zoomLevel * 100)}%
                      </span>
                      <button
                        onClick={() => setZoomLevel(prev => Math.min(2.5, prev + 0.2))}
                        className="p-1 hover:text-white text-f1-gray transition"
                        title="Perbesar"
                      >
                        <ZoomIn size={13} />
                      </button>
                    </div>
                  )}

                  {certificateUrl && (
                    <>
                      <button
                        onClick={handleOpenNewTab}
                        className="p-1.5 hover:bg-white/10 rounded text-f1-gray hover:text-white transition"
                        title="Buka Layar Penuh di Tab Baru"
                      >
                        <Maximize2 size={14} />
                      </button>
                      <button
                        onClick={handleDownload}
                        className="p-1.5 hover:bg-white/10 rounded text-f1-gray hover:text-white transition"
                        title="Download File"
                      >
                        <Download size={14} />
                      </button>
                      {isAdminUnlocked && (
                        <button
                          onClick={handleRemoveFile}
                          className="p-1.5 hover:bg-f1-red/20 rounded text-f1-gray hover:text-f1-red transition"
                          title="Hapus File Sertifikat (Admin)"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </>
                  )}

                  {/* Upload / Replace File Button (Admin Only) */}
                  {isAdminUnlocked && (
                    <label className="cursor-pointer bg-[#d4af37] hover:bg-white text-black px-2.5 py-1 rounded text-xs font-f1 font-bold flex items-center gap-1 transition shadow">
                      <Upload size={12} />
                      <span>{certificateUrl ? 'Ganti' : 'Upload'}</span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,image/jpeg,image/png,image/webp"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Document Stage */}
              <div className="flex-1 min-h-[300px] sm:min-h-[440px] md:min-h-[520px] bg-[#07070a] border border-white/10 rounded flex items-center justify-center relative overflow-hidden">
                {certificateUrl ? (
                  isPdf ? (
                    /* PDF Viewer Frame */
                    <iframe
                      src={certificateUrl}
                      title={`Sertifikat PDF ${currentAward.title}`}
                      className="w-full h-full min-h-[300px] sm:min-h-[500px] border-0 rounded"
                    />
                  ) : (
                    /* High-Res Image Viewer with Zoom */
                    <div className="w-full h-full flex items-center justify-center overflow-auto p-2 sm:p-4">
                      <img
                        src={certificateUrl}
                        alt={`Sertifikat ${currentAward.title}`}
                        style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
                        className="max-h-[320px] sm:max-h-[500px] w-auto object-contain rounded shadow-2xl transition-transform duration-200"
                      />
                    </div>
                  )
                ) : isAdminUnlocked ? (
                  /* Admin-only Upload Dropzone when no file uploaded yet */
                  <div className="text-center p-8 max-w-md space-y-4">
                    <div className="w-16 h-16 rounded-full bg-[#d4af37]/10 border-2 border-dashed border-[#d4af37]/40 text-[#d4af37] flex items-center justify-center mx-auto">
                      <Upload size={28} />
                    </div>
                    <div>
                      <h3 className="text-base font-f1 font-bold text-white uppercase tracking-wider">
                        Upload File Sertifikat (Mode Admin)
                      </h3>
                      <p className="text-xs text-f1-gray font-sans mt-1">
                        Format yang didukung: <strong>PDF, JPG, PNG</strong>. File akan langsung tersimpan dan ditampilkan di portofolio.
                      </p>
                    </div>

                    <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#d4af37] to-[#f3cf65] text-black font-f1 font-black text-xs tracking-wider uppercase rounded shadow-lg hover:brightness-110 cursor-pointer transition">
                      <Upload size={14} />
                      <span>Pilih File PDF / JPG</span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,image/jpeg,image/png,image/webp"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  /* Clean Public Placeholder for Visitors when no file is uploaded yet */
                  <div className="text-center p-8 max-w-md space-y-4">
                    <div className="w-16 h-16 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/40 text-[#d4af37] flex items-center justify-center mx-auto shadow-inner">
                      <ShieldCheck size={32} />
                    </div>
                    <div>
                      <h3 className="text-base font-f1 font-bold text-white uppercase tracking-wider">
                        ARSIP DOKUMEN FISIK
                      </h3>
                      <p className="text-xs text-f1-gray font-sans mt-2 leading-relaxed">
                        Dokumen fisik sertifikat ini telah tercatat dan terverifikasi secara resmi. File scan digital belum dipublikasikan oleh pemilik portofolio.
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-white/5 border border-white/10 text-f1-lightGray text-[11px] font-mono">
                      <Lock size={12} className="text-[#d4af37]" />
                      <span>VERIFIED CREDENTIAL // ID #{currentAward.id}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ============================================================ */}
            {/* RIGHT: PENJELASAN & DETAIL PRESTASI (4 COLS) */}
            {/* ============================================================ */}
            <div className="lg:col-span-4 flex flex-col justify-between space-y-4 bg-[#14141f] border border-white/10 p-5 rounded-sm">
              <div className="space-y-4">
                <div className="border-b border-white/10 pb-3 flex items-center justify-between">
                  <span className="text-xs font-f1 font-bold text-[#d4af37] tracking-widest uppercase flex items-center gap-1.5">
                    <CheckCircle2 size={14} />
                    <span>PENJELASAN PRESTASI</span>
                  </span>
                  <span className="text-[11px] font-mono text-f1-gray">
                    #{currentIndex + 1}
                  </span>
                </div>

                {/* Award Title */}
                <div>
                  <h3 className="text-base sm:text-lg font-f1 font-black text-white leading-snug">
                    {currentAward.title}
                  </h3>
                  <span className="text-xs font-sans text-f1-gray block mt-1">
                    {currentAward.subtitle}
                  </span>
                </div>

                {/* Key Metadata Cards */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2.5 p-2.5 bg-white/5 rounded border border-white/5">
                    <Trophy size={16} className="text-[#d4af37] shrink-0" />
                    <div>
                      <span className="text-[10px] font-f1 font-bold text-f1-gray block uppercase">Peringkat / Medali</span>
                      <span className="text-white font-f1 font-black">{currentAward.position || '1ST PLACE (GOLD)'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 p-2.5 bg-white/5 rounded border border-white/5">
                    <Building size={16} className="text-f1-red shrink-0" />
                    <div>
                      <span className="text-[10px] font-f1 font-bold text-f1-gray block uppercase">Penyelenggara</span>
                      <span className="text-white font-sans font-medium">{currentAward.issuer || 'IPSI / Organisasi Terkait'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 p-2.5 bg-white/5 rounded border border-white/5">
                    <Calendar size={16} className="text-[#00ff66] shrink-0" />
                    <div>
                      <span className="text-[10px] font-f1 font-bold text-f1-gray block uppercase">Tahun Perolehan</span>
                      <span className="text-white font-f1 font-bold">{currentAward.year}</span>
                    </div>
                  </div>
                </div>

                {/* Full Explanation */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[10px] font-f1 font-bold text-f1-gray tracking-wider uppercase block">
                    DESKRIPSI & RINGKASAN KEJUARAAN:
                  </span>
                  <p className="text-xs text-f1-lightGray font-sans leading-relaxed bg-black/30 p-3 rounded border border-white/5">
                    {currentAward.description ||
                      `${currentAward.title} merupakan pencapaian kejuaraan resmi yang berhasil diraih dengan torehan ${currentAward.position || 'Juara 1 Medali Emas'}, membuktikan kemampuan kompetitif, ketahanan fisik, fokus mental, dan kedisiplinan tingkat tinggi.`}
                  </p>
                </div>
              </div>

              {/* Bottom Nav / Other Awards Selector */}
              <div className="pt-4 border-t border-white/10 space-y-2">
                <span className="text-[10px] font-f1 font-bold text-f1-gray tracking-wider uppercase block">
                  PILIH SERTIFIKAT LAINNYA ({awardsList.length}):
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {awardsList.map((item, idx) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setZoomLevel(1);
                        setActiveAwardModal(item);
                      }}
                      className={`p-2 rounded border text-left transition text-xs ${
                        item.id === currentAward.id
                          ? 'bg-[#d4af37]/20 border-[#d4af37] text-white'
                          : 'bg-white/5 border-white/10 text-f1-gray hover:text-white'
                      }`}
                    >
                      <span className="text-[10px] font-f1 font-black text-[#d4af37] block">
                        #{idx + 1}
                      </span>
                      <span className="text-[11px] font-f1 font-bold truncate block">
                        {item.year}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
