import React, { useContext } from "react";
// contexts
import { ThemeContext } from "@/core/providers/ThemeProvider";
// components
import { Switch } from "@heroui/react";
// icons
import { SunIcon, MoonIcon } from 'lucide-react';

const ThemeSwitcher: React.FC = () => {
    const themeContext = useContext(ThemeContext);

    return (
        <Switch
            defaultSelected = {themeContext?.theme.state.mode === "light"}
            color="primary"
            endContent={<MoonIcon />}
            size="sm"
            startContent={<SunIcon />}
            isDisabled
            onChange={() => {
                if (!themeContext) return;
                const { theme } = themeContext;
                const nextMode = theme.state.mode === "light" ? "dark" : "light";
                theme.actions.switchTheme(nextMode);
            }}
        />
    );
}

export default ThemeSwitcher;