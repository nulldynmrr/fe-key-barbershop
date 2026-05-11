import Image from "next/image";

export default function SeparatorKey({ img = "/images/logo-transparent.png", height = 64 }) {
  return (
    <div className="mx-auto w-full max-w-6xl py-6">
      <div className="separator flex items-center justify-center gap-6">
        <div className="grow border-t border-[#442A26]/30"></div>
        <div className="sep-img-wrapper" aria-hidden="true">
          <Image 
            src={img} 
            alt="separator" 
            width={Math.round(height * 0.5)} 
            height={height} 
            className="sep-img transition-all duration-500 hover:animate-sway hover:drop-shadow-[0_15px_30px_rgba(74,26,26,0.3)] cursor-pointer" 
          />
        </div>

        <div className="grow border-t border-[#442A26]/30"></div>
      </div>
    </div>
  );
}
