import React from "react";
// UI
import { Card, CardHeader, CardBody, Input, Checkbox, Button, Divider, Tooltip } from "@heroui/react";
// Hooks
import { useLoginForm } from "@/features/auth/hooks";

const LoginForm: React.FC = () => {
    // ------------------------------
    // Hooks
    // ------------------------------
    const loginForm  = useLoginForm();
    // ------------------------------
    // Render
    // ------------------------------
    return (
        <Card className="max-w-md w-full mx-auto p-1">
            <CardHeader className="flex items-center justify-between gap-1">
                <div className="flex flex-col items-start gap-1">
                    <h1 className="text-2xl font-semibold">Login</h1>
                    <p className="text-sm text-foreground-500">{`{We will replace it by CRM name}`}</p>
                </div>
                <img src="https://placehold.co/400x400?text=Logo" alt="Company Logo" className="h-[55px] object-cover rounded" />
            </CardHeader>
            <CardBody>
                <form className="flex flex-col gap-4" onSubmit={loginForm.actions.handleLogin} noValidate>
                    <Input
                        type="email"
                        label="E-mail"
                        variant="bordered"
                        placeholder="you@example.com"
                        value={loginForm.state.formData.email}
                        onValueChange={(v) => loginForm.actions.update((d) => void (d.formData.email = v))}
                        autoComplete="email"
                        aria-label="field e‑mail"
                        validationBehavior="aria"
                    />

                    <Input
                        type="password"
                        label="Password"
                        variant="bordered"
                        placeholder="••••••••"
                        value={loginForm.state.formData.password}
                        onValueChange={(v) => loginForm.actions.update((d) => void (d.formData.password = v))}
                        autoComplete="current-password"
                        aria-label="field password"
                    />

                    <div className="flex items-center justify-between gap-2">
                        <span>Remember me</span>
                        <Divider className="flex-1"/>
                        <Tooltip content="Stay logged in on this device for 30 days." placement="top">
                            <Checkbox
                                isSelected={loginForm.state.formData.rememberMe}
                                onValueChange={(v) => loginForm.actions.update((d) => void (d.formData.rememberMe = v))}
                            />
                        </Tooltip>
                    </div>

                    <Button type="submit" color="primary" isDisabled={!loginForm.state.isValid} isLoading={loginForm.state.isSubmitting} className="w-full">
                        Login
                    </Button>
                </form>
            </CardBody>
        </Card>
    );
}

export default LoginForm;