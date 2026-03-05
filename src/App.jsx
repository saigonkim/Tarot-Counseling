import React, { useState, useEffect, useRef } from 'react';
import tarotData from './data/tarotData.json';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import { Share, MessageCircle, Sparkles, RefreshCw } from 'lucide-react';
import './index.css';

export default function App() {
  const [drawnCard, setDrawnCard] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [step, setStep] = useState(0);
  const captureRef = useRef(null);

  // Use preload for images
  useEffect(() => {
    tarotData.forEach(card => {
      const img = new Image();
      img.src = card.image_url;
    });
  }, []);

  const handleDrawCard = () => {
    setIsDrawing(true);
    setDrawnCard(null);
    setStep(0);
    // shuffle effect time
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * tarotData.length);
      setDrawnCard(tarotData[randomIndex]);
      setIsDrawing(false);

      // Buttons delay
      setTimeout(() => setStep(3), 800);
    }, 1500);
  };

  const handleShare = async () => {
    if (!captureRef.current) return;
    try {
      const canvas = await html2canvas(captureRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null
      });
      const image = canvas.toDataURL('image/png');

      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      // Attempt native share (mostly works on mobile)
      if (navigator.share && isMobile) {
        try {
          const blob = await (await fetch(image)).blob();
          const file = new File([blob], 'tarot_card.png', { type: 'image/png' });

          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: '오늘의 수호 카드',
              text: '나만의 타로 수호 카드를 뽑아보세요! 🔮',
              files: [file]
            });
            return;
          } else {
            // Fallback if file sharing is not supported by the browser but text/url is
            await navigator.share({
              title: '오늘의 수호 카드 🔮',
              text: '저의 수호 카드를 확인해보세요!',
              url: window.location.href
            });
            // Still download the image since they can't share it natively
          }
        } catch (e) {
          if (e.name === 'AbortError') return; // User cancelled share explicitly
          console.log("Native share failed:", e);
        }
      }

      // Fallback: Download image (PC and unsupported mobile browsers)
      const link = document.createElement('a');
      link.download = 'my-tarot-card.png';
      link.href = image;
      link.click();

      if (!isMobile) {
        alert("이미지가 기기에 저장되었습니다! \n다운로드된 이미지를 인스타그램 스토리에 올려보세요 📸");
      }
    } catch (err) {
      console.error("Capture failed", err);
      alert("이미지 처리 중 오류가 발생했습니다.");
    }
  };

  const handleConsult = () => {
    alert("준비 중인 프리미엄(유료) 기능입니다. \n조금만 기다려주세요! 🔮✨");
  };

  return (
    <div className="w-full max-w-md mx-auto min-h-screen flex flex-col items-center hide-scrollbar relative">
      {!drawnCard && !isDrawing ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-14"
          >
            <div className="w-16 h-16 mx-auto mb-6 opacity-80">
              <Sparkles size={64} className="text-indigo-300" strokeWidth={1} />
            </div>
            <h1 className="serif text-3xl font-semibold mb-4 text-white tracking-tight">수호 카드 뽑기</h1>
            <p className="text-indigo-200 text-[15px] leading-relaxed font-light">
              마음의 창을 열고,<br />당신의 오늘을 밝혀줄 1장의 카드를 확인하세요.
            </p>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDrawCard}
            className="glass-panel px-10 py-4 rounded-2xl text-indigo-100 font-medium text-lg flex items-center gap-3 transition-colors hover:bg-white/10"
          >
            <div className="relative flex items-center justify-center">
              <img src="/vite.svg" alt="shuffle" className="w-5 h-5 opacity-40 mix-blend-multiply" />
            </div>
            무작위 1장 뽑기
          </motion.button>
        </div>
      ) : isDrawing ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center w-full">
          <motion.div
            animate={{ rotateY: [0, 180, 360] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-32 h-48 bg-indigo-950/40 rounded-xl card-shadow border border-white/10 flex items-center justify-center"
          >
            <div className="serif text-indigo-200/40 text-2xl">?</div>
          </motion.div>
          <p className="mt-8 text-indigo-200/60 tracking-widest text-sm animate-pulse">
            운명을 섞는 중...
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto w-full flex flex-col items-center pt-6 pb-12 hide-scrollbar">

          {/* Capture Container (9:16) */}
          <div
            ref={captureRef}
            className="w-[88%] max-w-[380px] aspect-[9/16] relative flex flex-col items-center justify-between p-6 pb-4 rounded-[2rem] shadow-xl overflow-hidden bg-gradient-to-b from-[#1B1432] to-[#0A0710]"
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 15px rgba(167, 139, 250, 0.2) inset'
            }}
          >
            {/* Header */}
            <div className="text-center mt-2 z-10 w-full relative">
              <div className="absolute top-[10px] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-400/30 to-transparent"></div>
              <h2 className="serif text-[13px] bg-[#1B1432] px-4 inline-block relative text-indigo-200/50 tracking-[0.2em] font-light">오늘의 수호 카드</h2>
              <h3 className="serif text-[17px] text-indigo-100 mt-1.5 font-medium tracking-wide">{drawnCard.name}</h3>
            </div>

            {/* Card Content Container */}
            <div className="flex-1 flex flex-col items-center justify-center w-full relative z-10 py-3 min-h-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative w-full h-full max-h-full flex items-center justify-center"
              >
                <img
                  src={encodeURI(drawnCard.image_url)}
                  alt={drawnCard.name}
                  className="max-w-full max-h-full w-auto h-auto rounded-xl card-shadow object-contain border border-white/10"
                />
              </motion.div>
            </div>



            {/* Footer Watermark */}
            <div className="text-[10px] text-indigo-200/30 tracking-widest mb-1 z-10 w-full text-center border-t border-white/10 pt-3">
              tarot-counseling.vercel.app
            </div>
          </div>

          {/* Action Buttons */}
          <AnimatePresence>
            {step >= 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.8 }}
                className="mt-8 flex flex-col gap-3 w-[88%] max-w-[380px]"
              >
                <button
                  onClick={handleShare}
                  className="w-full py-[1.125rem] rounded-[1rem] bg-gradient-to-r from-indigo-500 to-purple-600 shadow-[0_8px_20px_rgba(99,102,241,0.25)] flex items-center justify-center gap-2 text-white font-medium transition-transform hover:scale-[1.02] text-[15px]"
                >
                  <Share size={18} /> 화면 저장 & 인스타그램 공유
                </button>

                <button
                  onClick={handleConsult}
                  className="w-full py-[1.125rem] rounded-[1rem] bg-white/5 border border-white/10 shadow-lg flex items-center justify-center gap-2 text-indigo-100 font-medium transition-colors hover:bg-white/10 text-[14px]"
                >
                  <MessageCircle size={18} className="text-indigo-300/80" /> 전문가에게 심층 상담 요청
                </button>

                <button
                  onClick={() => { setDrawnCard(null); setStep(0); }}
                  className="mt-4 text-[14px] text-indigo-300/50 underline decoration-indigo-300/30 underline-offset-4 hover:text-indigo-100 transition flex items-center justify-center gap-1 w-max mx-auto"
                >
                  <RefreshCw size={14} /> 다시 뽑아보기
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
