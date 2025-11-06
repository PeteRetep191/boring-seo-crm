import React from "react";
import { useParams, useNavigate } from "react-router-dom";
// UI
import {
  Button,
  Input,
  Textarea,
  Divider,
  Tabs,
  Tab,
  Switch,
} from "@heroui/react";
import { TagInput } from "@/shared/ui/inputs";
import { ShowcaseItem } from "@/features/showcase/ui";
import { CodeBlock } from "@/features/code/ui";
import { PlacementsManages } from "@/features/placement/ui";
// Icons
import { Save, Plus } from "lucide-react";
import { useSiteForm } from "@/features/site/hooks";

// ==============================
// SiteDetailsPage
// ==============================
const SiteDetailsPage: React.FC = () => {
  const { siteId } = useParams();
  const navigate = useNavigate();

  const siteForm = useSiteForm({
    onClose: () => {
      navigate("/sites");
    },
  });
  // ------------------------------------
  // Helpers
  // ------------------------------------
  const isEdit = !!siteId;

  // ------------------------------------
  // Handlers
  // ------------------------------------
  const handleSubmit = async () => {
    try {
      await siteForm.actions.handleSubmit({
        onSuccess: () => {
          navigate("/sites");
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  // ------------------------------------
  // Render
  // ------------------------------------
  return (
    <div className="flex flex-col gap-2 min-h-0 h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">
          {isEdit ? `Edit Site ${siteId}` : "Create New Site"}
        </h2>
        <div className="flex items-center gap-4">
          <span className="text-[14px]">
            {isEdit && (
              <span>
                Last Modified:{" "}
                <strong>
                  {siteForm.form.updatedAt?.toLocaleString() || "N/A"}
                </strong>
              </span>
            )}
          </span>
          <Button
            radius="sm"
            size="md"
            variant="solid"
            color="primary"
            isDisabled={siteForm.state.isSubmitting || !siteForm.state.isValid}
            isLoading={siteForm.state.isSubmitting}
            endContent={isEdit ? <Save size={18} /> : <Plus size={18} />}
            onPress={handleSubmit}
          >
            {isEdit ? "Save" : "Create New Site"}
          </Button>
        </div>
      </div>

      <Divider />

      <div
        className={`flex flex-row h-full gap-2 min-h-0 overflow-hidden ${siteForm.state.isSubmitting ? "opacity-50" : ""}`}
      >
        <div className="flex flex-col flex-1 h-full min-h-90">
          <Tabs aria-label="Options">
            <Tab
              key="main"
              title="Main"
              className="flex flex-col gap-2 h-full min-h-0"
            >
              <div className="flex flex-row gap-2">
                <Input
                  radius="sm"
                  label="Site Name"
                  labelPlacement="outside"
                  placeholder="Enter site name"
                  value={siteForm.form.name}
                  onChange={(e) =>
                    siteForm.actions.updateForm((draft) => {
                      draft.name = e.target.value;
                    })
                  }
                  className="flex-2"
                />
                <Input
                  radius="sm"
                  label="Website URL"
                  startContent="https://"
                  labelPlacement="outside"
                  placeholder="Enter website URL"
                  value={(siteForm.form.url ?? "").replace(/^https?:\/\//, "")}
                  onChange={(e) =>
                    siteForm.actions.updateForm((draft) => {
                      const raw = e.target.value.replace(/^https?:\/\//, "");
                      draft.url = raw ? `https://${raw}` : "";
                    })
                  }
                  className="flex-5"
                  classNames={{ input: "bg-gray-500" }}
                />
              </div>

              <Textarea
                radius="sm"
                label="Description"
                labelPlacement="outside"
                placeholder="Enter description"
                value={siteForm.form.description}
                onChange={(e) =>
                  siteForm.actions.updateForm((draft) => {
                    draft.description = e.target.value;
                  })
                }
              />

              <TagInput
                value={siteForm.form.tags}
                onChange={(tags) =>
                  siteForm.actions.updateForm((draft) => {
                    draft.tags = tags;
                  })
                }
              />
              <Divider />

              <ShowcaseItem
                showcaseId={undefined}
                showOffersList
                canRemove={false}
                className="w-full"
              />
            </Tab>
            <Tab
              key="placements"
              title="Placements"
              className="flex flex-col items-start gap-2 h-full min-h-0"
            >
              <PlacementsManages
                placements={siteForm.form.placements}
                onChange={(placements) => {
                  siteForm.actions.updateForm((draft) => {
                    draft.placements = placements;
                  });
                }}
              />
            </Tab>
            <Tab key="webhook" title="Webhook" className="flex flex-col gap-4">
              <Input
                radius="sm"
                label="Webhook URL"
                labelPlacement="outside"
                placeholder="Enter webhook URL"
                startContent="https://"
                value={(siteForm.form.webhookUrl ?? "").replace(
                  /^https?:\/\//i,
                  "",
                )}
                onChange={(e) =>
                  siteForm.actions.updateForm((draft) => {
                    const raw = e.target.value.replace(/^https?:\/\//i, "");
                    draft.webhookUrl = raw ? `https://${raw}` : "";
                  })
                }
                className="flex-5"
                classNames={{ input: "bg-gray-500" }}
              />
              <CodeBlock title="JSON" language="json" value={siteForm.form} />
            </Tab>
            <Tab
              key="settings"
              title="Settings"
              className="flex flex-col items-start gap-2 h-full min-h-0"
            >
              <div className="grid grid-cols-2 gap-2 w-full">
                <span>Push webhook when create/update site</span>
                <Switch size="sm" className="justify-self-end" />
              </div>
              <div className="grid grid-cols-2 gap-2 w-full">
                <span>Wait for webhook success response</span>
                <Switch size="sm" className="justify-self-end" />
              </div>
            </Tab>
          </Tabs>
        </div>

        <Divider orientation="vertical" />

        <div className="flex flex-col items-stretch gap-2 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium">Showcases Panel</span>
            <Button
              size="sm"
              variant="flat"
              color="primary"
              startContent={<Plus size={16} />}
              className="ml-4"
            >
              Add
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteDetailsPage;
