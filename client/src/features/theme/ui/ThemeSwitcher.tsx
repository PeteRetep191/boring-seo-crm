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
            // isDisabled
            defaultSelected = {themeContext?.theme.state.mode === "dark"}
            color="primary"
            endContent={<MoonIcon />}
            size="sm"
            startContent={<SunIcon />}
            onChange={(event) => {
                if (!themeContext) return;
                const nextMode = event.target.checked ? "dark" : "light";
                themeContext.theme.actions.setTheme(nextMode);
            }}
        />
    );
}

export default ThemeSwitcher;