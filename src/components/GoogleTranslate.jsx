import { useEffect } from "react";

let translatorLoaded = false;

export default function GoogleTranslate() {
  useEffect(() => {
    if (translatorLoaded) return;

    translatorLoaded = true;

    window.googleTranslateElementInit = () => {
      if (!window.google?.translate) return;

      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          autoDisplay: false,
          includedLanguages:
            "en,es,fr,de,it,pt,ru,ar,zh-CN,ja,ko,hi",
        },
        "google_translate_element"
      );
    };

    const script = document.createElement("script");
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;

    document.body.appendChild(script);
  }, []);

  return (
    <div
      id="google_translate_element"
      style={{
        minWidth: "140px",
        minHeight: "36px",
      }}
    />
  );
}