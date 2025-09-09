import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import logo from "@/assets/download.jpg";
import { Languages } from "lucide-react";
import { Button } from "./ui/button";

const HeaderSection = () => {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "ar" ? "en" : "ar";
    i18n.changeLanguage(newLang);
  };

  return (
    <header
      className={cn(
        "bg-white shadow-2xl shadow-black border-b border-gray-200"
      )}
    >
      <nav className={cn("sticky top-0 bg-white text-black z-20 py-4")}>
        <div
          className={cn(
            "max-w-7xl mx-auto px-5 flex justify-between items-center"
          )}
        >
          <div className={cn("flex items-center gap-5")}>
            <div className={cn("w-12 h-12")}>
              <img
                src={logo}
                className={cn("w-full h-full object-cover")}
                alt={t("actions.logo")}
              />
            </div>
            <div className={cn("flex flex-col justify-center ml-2")}>
              <h3
                className={cn("text-blue-600 m-0 mb-1 text-xl font-semibold")}
              >
                {t("header.heroTitle")}
              </h3>
              <p className={cn("text-gray-800 m-0")}>
                {t("header.heroDescription")}
              </p>
            </div>
          </div>

          {/* Language Switcher */}
          <div className={cn("flex items-center")}>
            <Button
              onClick={toggleLanguage}
              variant="outline"
              size="icon"
              title={t("language.selectLanguage")}
            >
              <Languages />
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default HeaderSection;
