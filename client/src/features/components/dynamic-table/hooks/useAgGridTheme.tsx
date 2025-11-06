import { useContext, useMemo } from "react";
import { ThemeContext } from "@/core/providers/ThemeProvider";
import {
  themeQuartz,
  iconSetMaterial,
  colorSchemeDark,
  colorSchemeLight,
  type Theme,
} from "ag-grid-community";

const darkParams = {
  backgroundColor: "#17171A",
  foregroundColor: "#ABABBA",
  borderColor: "#202027",
  accentColor: "#e20d1c",

  checkboxCheckedBackgroundColor: "hsl(var(--heroui-primary) / 1)",

  headerBackgroundColor: "#1C1C20",
  headerRowBorder: false,
  headerColumnBorder: false,

  oddRowBackgroundColor: "#17171A",
  rowHoverColor: "#202027",
  selectedRowBackgroundColor: "#292932",

  inputBackgroundColor: "#1C1C20",
  inputTextColor: "#ABABBA",
};

const lightParams = {
  backgroundColor: "#ffffff",
  foregroundColor: "#2f2f3a",
  borderColor: "#e7e7ef",
  accentColor: "#e20d1c",

  checkboxCheckedBackgroundColor: "hsl(var(--heroui-primary) / 1)",

  headerBackgroundColor: "#fbfbfe",
  headerRowBorder: false,
  headerColumnBorder: false,

  oddRowBackgroundColor: "#ffffff",
  rowHoverColor: "#f4f6fb",
  selectedRowBackgroundColor: "#eef2ff",

  inputBackgroundColor: "#ffffff",
  inputTextColor: "#2f2f3a",
};

const useAgGridTheme = (): Theme => {
  const themeContext = useContext(ThemeContext);

  return useMemo(() => {
    const scheme =
      themeContext?.theme.state.mode === "dark"
        ? colorSchemeDark
        : colorSchemeLight;
    const params =
      themeContext?.theme.state.mode === "dark" ? darkParams : lightParams;

    return themeQuartz
      .withPart(iconSetMaterial)
      .withPart(scheme)
      .withParams(params);
  }, [themeContext?.theme.state.mode]);
};

export default useAgGridTheme;
