import { useI18n, Lang } from "@/lib/i18n";
import { Globe } from "lucide-react";

const langLabels: Record<Lang, string> = {
  en: "EN",
  hi: "हिं",
  gu: "ગુ",
};

export default function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { lang, setLang } = useI18n();

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <Globe className="w-3.5 h-3.5 text-muted-foreground" />
      {(Object.keys(langLabels) as Lang[]).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`px-2 py-1 rounded-md text-xs font-medium transition-all ${
            lang === l
              ? "gradient-calm text-primary-foreground"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
          }`}
        >
          {langLabels[l]}
        </button>
      ))}
    </div>
  );
}
