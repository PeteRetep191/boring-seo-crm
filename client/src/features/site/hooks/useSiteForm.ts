import { useEffect } from "react";
import { useImmer } from "use-immer";
// repository
import { sessionIdRepo } from "@/entities/session-id";
// utils
import toast from 'react-hot-toast';

// ========================
// Constants
// ========================
const INITIAL_FORM_STATE: SiteFormState = {
    isSubmitting: false,
    isValid: true,
    formData: {
        name: "",
        description: "",
        url: "",
        tags: [],
        apiDocumentation: "",
        defaultOffersIds: [],
        assignedOffersIds: [],
        showcases: [],
    }
};

// ========================
// Hook
// ========================
const useSiteForm = (): SiteFormApi => {
    const [state, update] = useImmer<SiteFormState>(INITIAL_FORM_STATE);

    // --------------------------
    // Actions
    // --------------------------
    const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {

        e?.preventDefault();

        update(draft => {
            draft.isSubmitting = true;
        });
        try {
            await new Promise<void>(resolve => setTimeout(resolve, 2000));
            
            const fakeResponse = {
                
            };

            // sessionIdRepo.saveSessionId(fakeResponse.sessionId);
            toast.success("Login successful!");
        } catch (error) {
            toast.error("Login failed. Please try again.");
        } finally {
            update(draft => {
                draft.isSubmitting = false;
            });
        }
    };

    const validate = () => {
        const { name = "", url = "" } = state.formData;

        const isValid = name.trim().length > 0 && url.trim().length > 0

        update(draft => {
            draft.isValid = isValid;
        });
    };

    const resetForm = () => {
        update(draft => {
            draft.formData.name = "";
            draft.formData.url = "";
            draft.formData.tags = [];
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
            handleSubmit,
            update,
            validate,
            resetForm,
        }
    }
}

export default useSiteForm;

// ========================
// Types
// ========================
export type SiteFormState = {
    isSubmitting: boolean;
    isValid: boolean;
    formData: {
        name: string;
        description?: string;
        url: string;
        tags: string[];
        apiDocumentation: string;
        defaultOffersIds?: string[];
        assignedOffersIds?: string[];
        showcases: IShowcase[];
    }
}

export type IShowcase = {
    filter: IShowcaseFilter;
    offerIds: string[];
}

export type IDeviceType = "desktop" | "mobile" | "tablet";

export type IShowcaseFilter = {
    countriesCodes?: string[];
    ipAddresses?: string[];
    devicesTypes?: IDeviceType[];
    refferers?: string[];
}

export type SiteFormApi = {
    state: SiteFormState;
    actions: {
        handleSubmit: (e?: React.FormEvent<HTMLFormElement>) => Promise<void>;
        update: (updater: (draft: SiteFormState) => void) => void;
        validate: () => void;
        resetForm: () => void;
    }

}