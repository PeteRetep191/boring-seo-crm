import { useEffect } from "react";
import { useImmer } from "use-immer";
import { useNavigate } from "react-router-dom";
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
            await new Promise<void>(resolve => setTimeout(resolve, 2000));
            
            const fakeResponse = {
                sessionId: "123456",
                user: {
                    email: state.formData.email,
                    name: "John Doe"
                }
            };

            sessionIdRepo.saveSessionId(fakeResponse.sessionId);
            toast.success("Login successful!");
            navigate("/");
        } catch (error) {
            toast.error("Login failed. Please try again.");
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