import { SOCIAL_LINKS } from "@/data/social";

// `className` styles the <a> (hit area + color); `iconClassName` sizes the
// glyph itself, so this can sit compact in a footer or larger on a contact
// page without two separate components.
export default function SocialLinks({ className = "", iconClassName = "h-[18px] w-[18px]" }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {SOCIAL_LINKS.map((s) => (
        <a
          key={s.name}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`FINAIW on ${s.name}`}
          className="text-[#34d399] transition hover:text-[#6ee7b7]"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className={iconClassName} aria-hidden="true">
            <path d={s.path} />
          </svg>
        </a>
      ))}
    </div>
  );
}
