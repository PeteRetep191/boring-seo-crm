import { useEffect } from "react";
import { useImmer } from "use-immer";
import { useNavigate } from "react-router-dom";
// api
import { login } from "@/api/backend/routes/auth.api";
// repository
import { sessionIdRepo } from "@/entities/session-id";
// utils
import toast from 'react-hot-toast';

// ========================
// Constants
// ========================
const INITIAL_FORM_STATE: LoginFormState = {
    isSubmitting: false,
    isValid: true,
    formData: {
        email: "",
        password: "",
        rememberMe: false,
    }
};

// ========================
// Hook
// ========================
const useLoginForm = (): LoginFormApi => {
    const navigate = useNavigate();
    const [state, update] = useImmer<LoginFormState>(INITIAL_FORM_STATE);

    // --------------------------
    // Actions
    // --------------------------
    const handleLogin = async (e?: React.FormEvent<HTMLFormElement>) => {

        e?.preventDefault();

        update(draft => {
            draft.isSubmitting = true;
        });
        
        try {
            const response = await login({
                email: state.formData.email,
                password: state.formData.password,
                rememberMe: state.formData.rememberMe,
            });

            sessionIdRepo.saveSessionId(response.data.result.sessionId);
            toast.success("Login successful!");
            navigate("/");
        } catch (error) {
            console.error("Login error:", error);
            toast.error(`Login failed. ${(error as any).response?.data?.error || (error as Error).message || 'Please try again.'}`);
        } finally {
            update(draft => {
                draft.isSubmitting = false;
            });
        }
    };

    const validate = () => {
        const { email = "", password = "" } = state.formData;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

        const isEmailValid = emailRegex.test(email.trim());
        const isPasswordValid = typeof password === "string" && password.length > 6;

        const isValid = isEmailValid && isPasswordValid;

        update(draft => {
            draft.isValid = isValid;
        });
    };

    const resetForm = () => {
        update(draft => {
            draft.formData.email = "";
            draft.formData.password = "";
            draft.formData.rememberMe = false;
        });
    };

    // --------------------------
    // Effects
    // --------------------------
    useEffect(() => {
        validate();
    }, [state.formData]);

    // --------------------------
    // Return
    // --------------------------
    return {
        state,
        actions: {
            handleLogin,
            update,
            validate,
            resetForm,
        }
    }
}

export default useLoginForm;

// ========================
// Types
// ========================
export type LoginFormState = {
    isSubmitting: boolean;
    isValid: boolean;
    formData: {
        email: string;
        password: string;
        rememberMe: boolean;
    }
}

export type LoginFormApi = {
    state: LoginFormState;
    actions: {
        handleLogin: (e?: React.FormEvent<HTMLFormElement>) => Promise<void>;
        update: (updater: (draft: LoginFormState) => void) => void;
        validate: () => void;
        resetForm: () => void;
    }

}