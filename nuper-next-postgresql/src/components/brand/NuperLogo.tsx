import React from 'react';

export type NuperEmblemVariant = 'arch' | 'nexus' | 'meridian' | 'apex' | 'matrix' | 'pulsar';

interface NuperLogoProps {
  className?: string;
  size?: number | string;
  showText?: boolean;
  variant?: NuperEmblemVariant;
  centerCore?: 'eye' | 'circle';
  fontFamily?: 'heading' | 'sans';
  tracking?: 'anduril' | 'tight' | 'normal' | 'wide';
  subtitle?: string;
}

/**
 * NUPER Defense-Grade Logo & Wordmark Lockup
 *
 * Anduril Oranları (Gold Standard):
 * - İkon Yüksekliği ile Yazı Yüksekliği neredeyse başa baştır (Metin cap-height / İkon = ~%82-85).
 * - Harf Aralığı (Tracking): Geniş ve kopuk DEĞİL; kompakt, kaslı ve blok gibidir (tracking-[0.03em]).
 * - Boşluk (Gap): 10px (gap-2.5).
 * - Amblem: 1:1 merkezli, sıfır ölü boşluk, eşkenar yamuk + ikiz üçgen + yere bakan keskin göz çekirdeği.
 */
export const NuperLogo: React.FC<NuperLogoProps> = ({
  className = '',
  size = 28,
  showText = true,
  variant = 'nexus',
  centerCore = 'eye',
  fontFamily = 'heading',
  tracking = 'anduril',
  subtitle,
}) => {
  // Sayısal boyut hesabı (Anduril 82% metin oranı için)
  const numericSize = typeof size === 'number' ? size : parseInt(size as string, 10) || 28;
  const textFontSize = Math.round(numericSize * 0.82);

  // Tracking sınıfları (Anduril = kompakt ve tok)
  const trackingClasses = {
    anduril: 'tracking-[0.03em]',
    tight: 'tracking-tight',
    normal: 'tracking-normal',
    wide: 'tracking-[0.16em]',
  }[tracking];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* 100% Saf Beyaz Vektörel Amblem (Kusursuz Merkezli & Sıfır Ölü Boşluk) */}
      <svg
        width={numericSize}
        height={numericSize}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-200 hover:opacity-90"
      >
        {/* VARYANT 2: NUPER MASTER EMBLEM (ÜSTTE EŞKENAR YAMUK + ALTTA 2 DIŞA BAKAN ÜÇGEN + MERKEZDE YERE BAKAN GÖZ) */}
        {variant === 'nexus' && (
          <g id="nuper-master-emblem">
            {/* Üst İkiz Kanat (Eşkenar Yamuk, Dış Kenar Eğim Açısı: -0.35 dX/dY) */}
            <polygon points="39,7 47,7 47,44 26,44" fill="white" />
            <polygon points="53,7 61,7 74,44 53,44" fill="white" />

            {/* Sağ Alt Dışa Bakan Üçgen (Dış Kenar: 74,44 -> 76,50 -> 91,93 Kusursuz Koliner Çizgi) */}
            <polygon points="53,67 76,50 91,93" fill="white" />

            {/* Sol Alt Dışa Bakan Üçgen (Dış Kenar: 26,44 -> 24,50 -> 9,93 Kusursuz Koliner Çizgi) */}
            <polygon points="47,67 24,50 9,93" fill="white" />

            {/* Merkez Çekirdek: Yere Bakan Keskin Üçgen Göz vs Dairesel Singularity */}
            {centerCore === 'eye' ? (
              <polygon points="43,49 57,49 50,64" fill="white" />
            ) : (
              <circle cx="50" cy="56" r="6" fill="white" />
            )}
          </g>
        )}

        {/* VARYANT 1: SOVEREIGN ARCH (Anıtsal Mimari Kemer) */}
        {variant === 'arch' && (
          <g id="nuper-arch" stroke="white" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round">
            <path
              d="M 22 84 L 22 42 C 22 24, 35 15, 50 15 C 65 15, 78 24, 78 42 L 78 84"
              fill="none"
              strokeWidth="5.5"
            />
            <line x1="36" y1="84" x2="36" y2="48" strokeWidth="4.5" />
            <line x1="64" y1="84" x2="64" y2="48" strokeWidth="4.5" />
            <circle cx="50" cy="34" r="5" fill="white" stroke="none" />
          </g>
        )}

        {/* VARYANT 3: KINETIC MERIDIAN (Optik Hassasiyet Çemberi) */}
        {variant === 'meridian' && (
          <g id="nuper-meridian" stroke="white" strokeLinecap="round">
            <path d="M 28 20 A 38 38 0 0 1 84 48" fill="none" strokeWidth="6" />
            <path d="M 72 80 A 38 38 0 0 1 16 52" fill="none" strokeWidth="6" />
            <polygon points="50,32 66,64 34,64" fill="white" stroke="none" />
            <circle cx="50" cy="53" r="3" fill="#080B11" stroke="none" />
          </g>
        )}

        {/* VARYANT 4: MONOLITH APEX */}
        {variant === 'apex' && (
          <g id="nuper-apex" fill="white">
            <polygon points="22,86 36,86 44,34 30,34" />
            <polygon points="78,86 64,86 56,34 70,34" />
            <polygon points="50,14 59,26 50,38 41,26" />
            <line x1="36" y1="80" x2="64" y2="80" stroke="white" strokeWidth="3" />
          </g>
        )}

        {/* VARYANT 5: HEXAGONAL MATRIX */}
        {variant === 'matrix' && (
          <g id="nuper-matrix" fill="white">
            <polygon points="50,16 77,31 50,45 23,31" />
            <polygon points="53,49 80,34 80,64 53,79" />
            <polygon points="47,49 47,79 20,64 20,34" />
          </g>
        )}

        {/* VARYANT 6: CARDINAL PULSAR */}
        {variant === 'pulsar' && (
          <g id="nuper-pulsar">
            <circle cx="50" cy="50" r="36" stroke="white" strokeWidth="2" strokeDasharray="8 6" fill="none" opacity="0.6" />
            <polygon points="50,10 55,30 45,30" fill="white" />
            <polygon points="50,90 55,70 45,70" fill="white" />
            <polygon points="90,50 70,55 70,45" fill="white" />
            <polygon points="10,50 30,55 30,45" fill="white" />
            <polygon points="50,42 58,50 50,58 42,50" fill="white" />
          </g>
        )}
      </svg>

      {/* Anduril Orantılı Wordmark (İkon ile Birebir Boyut Uyumu, Tok ve Kompakt) */}
      {showText && (
        <div className="flex flex-col justify-center">
          <span
            style={{ fontSize: `${textFontSize}px` }}
            className={`font-black leading-none uppercase text-white ${trackingClasses} ${
              fontFamily === 'heading' ? 'font-heading' : 'font-sans'
            }`}
          >
            NUPER
          </span>
          {subtitle && (
            <span className="text-[8px] font-mono tracking-[0.18em] text-gray-400 uppercase mt-0.5">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default NuperLogo;
