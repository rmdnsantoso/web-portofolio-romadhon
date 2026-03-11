"use client";

import { useState, useRef, useEffect } from "react";

interface HistoryLine {
  sender: "system" | "user";
  text: string;
}

export default function TerminalContact() {
  const [history, setHistory] = useState<HistoryLine[]>([
    { sender: "system", text: "INITIALIZING COMMUNICATION PROTOCOL..." },
    { sender: "system", text: "PLEASE IDENTIFY YOURSELF (ENTER NAME):" }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  
  const inputRef = useRef<HTMLInputElement>(null);
  
  // PERBAIKAN: Kita buat ref untuk kotak kontainer terminalnya, bukan bagian bawahnya
  const containerRef = useRef<HTMLDivElement>(null);

  // PERBAIKAN: Scroll internal khusus di dalam kotak terminal
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history]);

  const focusInput = () => {
    if (step < 4) inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputVal.trim() !== "") {
      const userText = inputVal.trim();
      setInputVal("");
      setHistory(prev => [...prev, { sender: "user", text: userText }]);

      setTimeout(() => {
        if (step === 1) {
          setFormData(prev => ({ ...prev, name: userText }));
          setHistory(prev => [...prev, { sender: "system", text: `GREETINGS, ${userText.toUpperCase()}. ENTER YOUR CONTACT EMAIL:` }]);
          setStep(2);
        } 
        else if (step === 2) {
          if (!userText.includes("@") || !userText.includes(".")) {
            setHistory(prev => [...prev, { sender: "system", text: "ERROR: INVALID EMAIL FORMAT. PLEASE TRY AGAIN:" }]);
            return;
          }
          setFormData(prev => ({ ...prev, email: userText }));
          setHistory(prev => [...prev, { sender: "system", text: "EMAIL VERIFIED. STATE YOUR MESSAGE:" }]);
          setStep(3);
        } 
        else if (step === 3) {
          setFormData(prev => ({ ...prev, message: userText }));
          setStep(4);
          setHistory(prev => [
            ...prev, 
            { sender: "system", text: "ENCRYPTING DATA..." },
            { sender: "system", text: "TRANSMISSION SUCCESSFUL. I WILL CONTACT YOU SHORTLY." }
          ]);
          console.log("Data Terkirim:", { ...formData, message: userText });
        }
      }, 400);
    }
  };

  return (
    <section id="contact" className="w-full pt-20 pb-32 px-6 md:px-12 max-w-4xl mx-auto relative z-10">
      <div className="flex items-center gap-6 mb-12">
        <h2 className="text-2xl md:text-3xl font-serif tracking-wider text-beige-100">Initiate Contact.</h2>
        <div className="h-[1px] bg-beige-200/20 flex-grow"></div>
      </div>

      <div 
        className="w-full bg-[#0a0f18] border border-beige-200/20 rounded-md overflow-hidden shadow-2xl cursor-text font-mono text-sm md:text-base"
        onClick={focusInput}
      >
        <div className="bg-[#121a28] px-4 py-3 border-b border-beige-200/10 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          <span className="ml-4 text-[10px] text-beige-200/50 tracking-widest uppercase">guest@romadhon-system:~</span>
        </div>

        {/* PERBAIKAN: Pasang ref di kontainer yang bisa di-scroll (overflow-y-auto) */}
        <div 
          ref={containerRef}
          className="p-6 md:p-8 h-80 overflow-y-auto custom-scrollbar flex flex-col gap-2 text-beige-200 scroll-smooth"
        >
          {history.map((line, idx) => (
            <div key={idx} className={`${line.sender === "system" ? "text-beige-100/70" : "text-beige-100 font-medium"}`}>
              <span className="mr-3 opacity-50">{line.sender === "system" ? ">" : "$"}</span>
              {line.text}
            </div>
          ))}

          {step < 4 && (
            <div className="flex items-center mt-2 text-beige-100">
              <span className="mr-3 opacity-50">$</span>
              <input 
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                className="bg-transparent outline-none flex-grow text-beige-100 font-mono"
                spellCheck="false"
                autoComplete="off"
              />
            </div>
          )}
          {/* Tag div bottomRef yang lama sudah dibuang dari sini */}
        </div>
      </div>
    </section>
  );
}