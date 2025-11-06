import { useEffect } from "react";
import { useImmer } from "use-immer";
// Types
import { ISite, ISiteDetailsFormState, SiteFormProps } from "../types";
import { IPlacement } from "@/features/placement/types";
// utils
import toast from "react-hot-toast";

// ========================
// Constants
// ========================
const INITIAL_FORM: ISite = {
  name: "",
  description: "",
  url: "",
  tags: [],
  placements: [],
  webhookUrl: "",
  showcases: [],
};

const STATE: ISiteDetailsFormState = {
  isSubmitting: false,
  isValid: true,
};

// ========================
// Hook
// ========================
const useSiteForm = ({ siteId, onClose }: SiteFormProps): SiteFormApi => {
  const [form, updateForm] = useImmer<ISite>(INITIAL_FORM);
  const [state, updateState] = useImmer<ISiteDetailsFormState>(STATE);

  // --------------------------
  // Actions
  // --------------------------
  const handleSubmit = async (args?: {
    onSuccess?: () => void;
    onError?: () => void;
  }) => {
    updateState((draft) => {
      draft.isSubmitting = true;
    });

    try {
      await new Promise<void>((resolve) => setTimeout(resolve, 500));

      console.log("Form values:", form);

      if (siteId) {
        // TODO add logic here
        toast.success("Site was changed successfully.");
      } else {
        // TODO add logic here
        toast.success("Site was created successfully.");
      }

      // args && args.onSuccess && args.onSuccess();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");

      args && args.onError && args.onError();
    } finally {
      resetForm();
      updateState((draft) => {
        draft.isSubmitting = false;
      });
    }
  };

  const validate = () => {
    const { name = "", url = "" } = form;

    const isValid = name.trim().length > 0 && url.trim().length > 0;

    updateState((draft) => {
      draft.isValid = isValid;
    });
  };

  const resetForm = () => {
    updateState(() => INITIAL_FORM);
  };

  // --------------------------
  // Effects
  // --------------------------
  useEffect(() => {
    validate();
    console.log("Form values:", form);
  }, [form]);

  // --------------------------
  // Return
  // --------------------------
  return {
    state,
    form,
    actions: {
      handleSubmit,
      updateForm,
      validate,
      resetForm,
    },
  };
};

export default useSiteForm;

// ========================
// Types
// ========================
export type SiteFormApi = {
  state: ISiteDetailsFormState;
  form: ISite;
  actions: {
    handleSubmit: ({
      onSuccess,
      onError,
    }: {
      onSuccess?: () => void;
      onError?: () => void;
    }) => Promise<void>;
    updateForm: (updater: (draft: ISite) => void) => void;
    validate: () => void;
    resetForm: () => void;
  };
};
