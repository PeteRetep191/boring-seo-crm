// Hooks
import { useEffect } from "react";
import { useImmer } from "use-immer";
// Libs
import { generatePlacementId } from "../libs";
// Types
import { IPlacement } from "../types";

const INITIAL_STATE: IPlacementsManagerState = {
  isValid: true,
  placements: [],
};

const usePlacementsManager = ({
  placements,
  onChange,
}: {
  placements: IPlacement[];
  onChange: (placements: IPlacement[]) => void;
}): IUsePlacementsManagerApi => {
  const [state, updateState] = useImmer<IPlacementsManagerState>({
    ...INITIAL_STATE,
    placements,
  });

  const validate = () => {
    let invalidCount = 0;
    state.placements.forEach((placement) => {
      if (!placement.id || !placement.type) {
        invalidCount++;
      }
    });

    updateState((draft) => {
      draft.isValid = invalidCount === 0;
    });
  };

  // -------------------------
  // Actions
  // -------------------------
  const addPlacement = (placement: IPlacement) => {
    updateState((draft) => {
      draft.placements.push(placement);
    });
  };

  const addEmptyPlacement = () => {
    updateState((draft) => {
      draft.placements.push({
        id: generatePlacementId(),
        name: "",
        type: null,
        // description: "",
      });
    });
  };

  const removePlacement = (id: string) => {
    updateState((draft) => {
      draft.placements = draft.placements.filter((p) => p.id !== id);
    });
  };

  const updatePlacement = (id: string, updatedPlacement: IPlacement) => {
    updateState((draft) => {
      draft.placements = draft.placements.map((p) =>
        p.id === id ? updatedPlacement : p,
      );
    });
  };

  // -------------------------
  // Effects
  // -------------------------
  useEffect(() => {
    validate();
    onChange(state.placements);
  }, [state.placements]);

  return {
    state,
    actions: {
      addPlacement,
      addEmptyPlacement,
      removePlacement,
      updatePlacement,
    },
  };
};

export default usePlacementsManager;

// =================================
// Types
// =================================
interface IUsePlacementsManagerApi {
  state: IPlacementsManagerState;
  actions: {
    addPlacement: (placement: IPlacement) => void;
    addEmptyPlacement: () => void;
    removePlacement: (id: string) => void;
    updatePlacement: (id: string, updatedPlacement: IPlacement) => void;
  };
}

interface IPlacementsManagerState {
  isValid: boolean;
  placements: IPlacement[];
}
