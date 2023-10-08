import React from "react";
import cookie from "react-cookies";

//This is the language helper function which can be imported and used in other classes.
export const LanguageHelper = (WrappedComponent) => {
  let languageHelper = {
    translation: async (fileName, loadAll = false) => {
      let language = cookie.load("language");

      const configJsonData = await import("./../languages/config.json");

      let config = configJsonData.config;

      if (language === undefined) {
        language = config.defaultLanguage.language;
      }
      const jsonData = await import(
        "./../languages/" + language + "/" + fileName + ".json"
      );
      if (!loadAll) {
        return jsonData.translation;
      }
      return jsonData;
    },
    changeLanguage: (changeLanguageTo) => {
      cookie.save("language", changeLanguageTo);

      //window.location.reload();

      const currentPath = window.location.pathname;
      const currentQuery = window.location.search;
      if (currentQuery) {
        const newQuery = `?${currentQuery.replace(
          /language=[^&]+/,
          `language=${changeLanguageTo}`
        )}`;
        const newUrl = `${currentPath}${newQuery}`;
        window.location.href = newUrl;
      } else {
        window.location.href = currentPath;
      }
    },
    loadSupoortLanguage: async () => {
      const supportLanguage = await import("./../languages/config.json");
      let config = supportLanguage.config;
      let supported = config.supportedLanguages;

      let language = cookie.load("language");

      if (language === undefined) {
        language = config.defaultLanguage.language;
      }

      return {
        supported: supported,
        default: language,
      };
    },
  };

  class LanguageHelper extends React.Component {
    render() {
      return (
        <WrappedComponent languageHelper={languageHelper} {...this.props} />
      );
    }
  }

  return LanguageHelper;
};
