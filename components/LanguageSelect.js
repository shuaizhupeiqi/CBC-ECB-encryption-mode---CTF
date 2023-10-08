import React, { useEffect } from "react";
import { withRouter } from "next/router";
import { Select } from "antd";
import { atom, useRecoilState, useRecoilValue, selector, useSetRecoilState } from "recoil";
import { LanguageHelper } from "../helpers/languageHelper";

// identify the basic state  unit
export const loadingState = atom({
  key: 'loadingState',
  default: true
});

export const supportedLanguagesState = atom({
  key: 'supportedLanguagesState',
  default: []
});

export const defaultLanguageState = atom({
  key: 'defaultLanguageState',
  default: 'English'
});

// Selector是派生的数据，它可以计算、处理或转换状态
export const languagesForSelect = selector({
  key: 'languagesForSelect',
  get: ({get}) => {
    const languages = get(supportedLanguagesState);
    return languages.map(item => ({
      key: item.language,
      label: item.label,
      value: item.language,
    }));
  }
});

function LanguageSelect(props) {
  // 使用Recoil的hooks来管理状态
  const [loading, setLoading] = useRecoilState(loadingState);
  const setSupportedLanguages = useSetRecoilState(supportedLanguagesState);
  const [defaultLanguage, setDefaultLanguage] = useRecoilState(defaultLanguageState);
  const items = useRecoilValue(languagesForSelect);
  //loading language list, update related state
  useEffect(() => {
    async function loadSupportedLanguage() {
      const { languageHelper } = props;
      let res = await languageHelper.loadSupoortLanguage();
      setSupportedLanguages(res.supported);
      setDefaultLanguage(res.default);
      setLoading(false);
    }
    loadSupportedLanguage();
  }, [props, setSupportedLanguages, setDefaultLanguage, setLoading]);

  const onChange = (value) => {
    const { languageHelper } = props;
    languageHelper.changeLanguage(value);
  };

  // 如果加载中则显示一个空 div，否则显示主要内容
  if (loading) return <div />;

  return (
    <div>
      <Select
        showSearch
        style={{ width: "100%" }}
        placeholder="Select a Language"
        optionFilterProp="children"
        onChange={onChange}
        defaultValue={defaultLanguage}
        filterOption={(input, option) =>
          (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
        }
        options={items}
      />
    </div>
  );
}

// 保留withRouter和LanguageHelper的高阶函数
export default withRouter(LanguageHelper(LanguageSelect));