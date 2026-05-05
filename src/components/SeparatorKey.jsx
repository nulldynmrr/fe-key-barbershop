import Image from "next/image";

export default function SeparatorKey({ img = "/images/logo-transparent.png", height = 64 }) {
  return (
    <div className="mx-auto w-full max-w-6xl py-6">
      <div className="separator flex items-center justify-center gap-6">
        <div className="grow border-t border-[#442A26]/30"></div>
        <div className="sep-img-wrapper" aria-hidden="true">
          <Image src={img} alt="separator" width={Math.round(height * 0.5)} height={height} className="sep-img" />
        </div>
        <div className="grow border-t border-[#442A26]/30"></div>
      </div>
    </div>
  );
}
