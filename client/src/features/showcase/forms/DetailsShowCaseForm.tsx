import { useEffect } from "react";
import { useImmer } from "use-immer";
// UI
import { ShowcasePlacement } from "@/features/showcase/ui";
import { Button, Tab, Tabs } from "@heroui/react";
import { DeviceTypeMultiSelector } from "@/shared/components/multiselector/variants";
import { MultiInput } from "@/shared/components/multiinput";
// Icons
import { InboxIcon } from "lucide-react";
// Types
import { IPlacement } from "@/features/placement/types";
import { IShowcase } from "@/features/showcase/types";

const INITIAL_FORM: IShowcase = {
  filter: {
    ipAddresses: [],
    devicesTypes: [],
    countriesCodes: [],
    refferers: [],
  },
  placements: [],
};

const INITIAL_STATE = {
  isValid: false,
};

// =============================
// DetailsShowCaseForm
// =============================
const DetailsShowCaseForm: React.FC<IDetailsShowCaseFormProps> = ({
  placementsStructure,
}) => {
  const [form, updateForm] = useImmer<IShowcase>(INITIAL_FORM);
  const [state, updateState] = useImmer(INITIAL_STATE);

  // ------------------------
  // Actions
  // ------------------------
  const validate = () => {
    const errors = [];

    if (!form?.filter?.ipAddresses?.length) errors.push("IP Addresses");
    if (!form?.filter?.devicesTypes?.length) errors.push("Devices Types");
    if (!form?.filter?.countriesCodes?.length) errors.push("Countries Codes");
    if (!form?.filter?.refferers?.length) errors.push("Refferers");

    if (!form?.placements.length) errors.push("Placements");

    if (errors.length > 0) {
      updateState((draft) => {
        draft.isValid = false;
      });
    }
  };

  // ------------------------
  // Helpers
  // ------------------------
  const handleChangePlacement = (id: string, value: any) => {
    updateForm((draft) => {
      draft.placements = draft.placements.map((p) =>
        p.id === id
          ? { ...p, value: Array.isArray(value) ? [...value] : value }
          : p,
      );
    });
  };

  const handleSave = () => {
    console.log("Save", form);
  };

  // ------------------------
  // Helpers
  // ------------------------
  const buildPlacements = () => {
    const placements = placementsStructure.map((placement) => ({
      id: placement.id,
      type: placement.type,
      name: placement.name,
      value: form.placements.find((p) => p.id === placement.id)?.value || null,
    }));
    return placements;
  };

  // ------------------------
  // Effects
  // ------------------------
  useEffect(() => {
    const placements = buildPlacements();
    updateForm((draft) => {
      draft.placements = placements;
    });
  }, [placementsStructure]);

  useEffect(() => {
    validate();
  }, [state]);
  // ------------------------
  // Render
  // ------------------------
  return (
    <div>
      <Tabs aria-label="Options">
        <Tab key="details" title="Filters">
          <div className="flex flex-col gap-3">
            <DeviceTypeMultiSelector
              value={form.filter?.devicesTypes || []}
              onChange={(keys, _) => {
                updateForm((draft) => {
                  if (draft.filter) {
                    draft.filter.devicesTypes = keys;
                  }
                });
              }}
            />
            <MultiInput
              value={form.filter?.ipAddresses || []}
              onChange={(keys) => {
                updateForm((draft) => {
                  if (draft.filter) {
                    draft.filter.ipAddresses = keys;
                  }
                });
              }}
              inputProps={{
                label: "Ip addresses",
                labelPlacement: "outside",
                placeholder: "Enter IP address",
              }}
            />
          </div>
        </Tab>
        <Tab key="placements" title="Placements">
          <div className="flex flex-col gap-2">
            {form.placements.length > 0 ? (
              form.placements.map((placement, index) => (
                <ShowcasePlacement
                  key={index}
                  placement={placement}
                  onChange={(changed) => {
                    handleChangePlacement(changed.id, changed.value);
                  }}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 w-full p-5">
                <InboxIcon size={20} className="text-default-400" />
                <span className="text-sm text-default-500">
                  No placements available
                </span>
              </div>
            )}
          </div>
        </Tab>
      </Tabs>
      <div className="flex items-center justify-end">
        <Button
          radius="sm"
          variant="solid"
          color="primary"
          onPress={handleSave}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default DetailsShowCaseForm;

// =============================
// Types
// =============================
interface IDetailsShowCaseFormProps {
  placementsStructure: IPlacement[];
}
