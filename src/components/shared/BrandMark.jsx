/**
 * Site brand mark — wordmark + yarn loop mark
 * @param {{ compact?: boolean, titleAs?: 'h1' | 'p' }} props
 */
export default function BrandMark({ compact = false, titleAs = 'h1' }) {
  const TitleTag = titleAs === 'h1' ? 'h1' : 'p'

  return (
    <div className={compact ? 'py-0.5' : 'py-0'}>
      <div className="flex items-start gap-3">
        <svg
          width={compact ? 34 : 44}
          height={compact ? 34 : 44}
          viewBox="0 0 44 44"
          fill="none"
          aria-hidden
          className="shrink-0 mt-0.5 text-yarn-blue"
        >
          <circle cx="22" cy="22" r="11" stroke="currentColor" strokeWidth="1.75" />
          <path
            d="M14 18c4 2 12 2 16 0M13 22c5 2.5 13 2.5 18 0M15 26c3.5 1.5 10.5 1.5 14 0"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            opacity="0.7"
          />
          <path
            d="M31 14c6 1 9 7 7 13"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            opacity="0.9"
          />
          <circle cx="38" cy="28" r="2.25" fill="currentColor" />
        </svg>

        <div className="min-w-0">
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-charcoal/45 mb-0.5">
            Computational Crochet Lab
          </p>
          <TitleTag
            className={`font-display text-charcoal leading-[0.95] tracking-tight ${
              compact ? 'text-[1.55rem] sm:text-[1.75rem]' : 'text-[2rem] lg:text-[2.35rem]'
            }`}
          >
            <span className="block font-normal">The Algorithmic</span>
            <span className="block italic text-yarn-blue">Loop</span>
          </TitleTag>
          <div
            className="mt-1.5 mb-1 h-px w-12 bg-gradient-to-r from-yarn-blue/80 to-transparent"
            aria-hidden
          />
          <p
            className={`font-display italic text-charcoal/55 leading-snug ${
              compact ? 'text-xs sm:text-sm' : 'text-sm'
            }`}
          >
            Where craft meets computation
          </p>
        </div>
      </div>
    </div>
  )
}
