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
      <nav className={cn("sticky top-0 bg-white text-black z-20 py-2 sm:py-4")}>
        <div
          className={cn(
            "max-w-7xl mx-auto px-2 sm:px-4 lg:px-5 flex justify-between items-center"
          )}
        >
          <div className={cn("flex items-center gap-2 sm:gap-4 lg:gap-5")}>
            <div className={cn("w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12")}>
              <img
                src={logo}
                className={cn("w-full h-full object-cover")}
                alt={t("actions.logo")}
              />
            </div>
            <div className={cn("flex flex-col justify-center ml-1 sm:ml-2")}>
              <h3
                className={cn(
                  "text-blue-600 m-0 mb-1 text-sm sm:text-lg lg:text-xl font-semibold"
                )}
              >
                {t("header.heroTitle")}
              </h3>
              <p
                className={cn(
                  "text-gray-800 m-0 text-xs sm:text-sm hidden sm:block"
                )}
              >
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
              className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10"
              title={t("language.selectLanguage")}
            >
              <Languages className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default HeaderSection;
