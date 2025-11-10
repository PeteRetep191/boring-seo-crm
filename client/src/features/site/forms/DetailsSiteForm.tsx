// Contexts
import { useDetailsSiteFormContext } from "@/features/site/contexts";
// UI
import { Button, Input, Textarea, Divider, Switch } from "@heroui/react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react";
import { Tabs, Tab } from "@heroui/react";
import { TagInput } from "@/shared/ui/inputs";
import { DefaultShowcase } from "@/features/site/ui";
import { CodeBlock } from "@/features/code/ui";
import { PlacementsManages } from "@/features/placement/ui";
// Icons
import { Save, Plus, InboxIcon } from "lucide-react";
// Forms
import { DetailsShowCaseForm } from "@/features/showcase/forms";

const DetailsSiteForm: React.FC<{
  siteId?: string;
  onSubmit: (siteId: string, data: any) => void;
}> = ({ siteId, onSubmit }) => {
  const { siteForm, tabState, modalsState, actions } =
    useDetailsSiteFormContext();

  // ------------------------------------
  // Handlers
  // ------------------------------------
  const handleSubmit = async () => {
    try {
      await siteForm.actions.handleSubmit({});

      onSubmit?.(siteId || "", siteForm.form);
    } catch (error) {
      console.error(error);
    }
  };

  // ------------------------------------
  // Render
  // ------------------------------------
  return (
    <>
      <div className="flex flex-col gap-2 min-h-0 h-full">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">
            {siteId ? `Edit Site ${siteId}` : "Create New Site"}
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-[14px]">
              {siteId && (
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
              isDisabled={
                siteForm.state.isSubmitting || !siteForm.state.isValid
              }
              isLoading={siteForm.state.isSubmitting}
              endContent={siteId ? <Save size={18} /> : <Plus size={18} />}
              onPress={handleSubmit}
            >
              {siteId ? "Save" : "Create New Site"}
            </Button>
          </div>
        </div>

        <Divider />

        <div
          className={`flex flex-row h-full gap-2 min-h-0 overflow-hidden ${siteForm.state.isSubmitting ? "opacity-50" : ""}`}
        >
          <div className="flex flex-col flex-1 h-full min-h-90">
            <Tabs
              aria-label="Options"
              selectedKey={tabState.activeTab}
              onSelectionChange={(key) => {
                actions.updateTabState(key as string);
              }}
              items={tabState.tabs}
            >
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
                    startContent={
                      <div className="pointer-events-none flex items-center">
                        <span className="text-default-400 text-md">
                          https://
                        </span>
                      </div>
                    }
                    labelPlacement="outside"
                    placeholder="Enter website URL"
                    value={(siteForm.form.url ?? "").replace(
                      /^https?:\/\//,
                      "",
                    )}
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

                <DefaultShowcase
                  placements={siteForm.form.placements}
                  value={siteForm.form.defaultShowcase}
                  onChange={(next) =>
                    siteForm.actions.updateForm((d) => {
                      d.defaultShowcase = next;
                    })
                  }
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
              <Tab
                key="webhook"
                title="Webhook"
                className="flex flex-col gap-4"
              >
                <Input
                  radius="sm"
                  label="Webhook URL"
                  labelPlacement="outside"
                  placeholder="Enter webhook URL"
                  startContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-md">https://</span>
                    </div>
                  }
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
                  <Switch
                    size="sm"
                    isSelected={
                      siteForm.form.settings.pushWebhookOnCreateUpdate
                    }
                    onValueChange={(value) => {
                      siteForm.actions.updateForm((draft) => {
                        draft.settings.pushWebhookOnCreateUpdate = value;
                      });
                    }}
                    className="justify-self-end"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 w-full">
                  <span>Wait for webhook success response</span>
                  <Switch
                    size="sm"
                    isSelected={
                      siteForm.form.settings.waitForWebhookSuccessResponse
                    }
                    onValueChange={(value) => {
                      siteForm.actions.updateForm((draft) => {
                        draft.settings.waitForWebhookSuccessResponse = value;
                      });
                    }}
                    className="justify-self-end"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 w-full">
                  <span>Add Placements Structure To Webhook</span>
                  <Switch
                    size="sm"
                    isSelected={
                      siteForm.form.settings.addPlacementsStructureToWebhook
                    }
                    onValueChange={(value) => {
                      siteForm.actions.updateForm((draft) => {
                        draft.settings.addPlacementsStructureToWebhook = value;
                      });
                    }}
                    className="justify-self-end"
                  />
                </div>
              </Tab>
            </Tabs>
          </div>

          <Divider orientation="vertical" />

          <div className="flex flex-col items-stretch gap-2 flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium">Showcases Panel</span>
              {siteForm.form.showcases.length > 0 && (
                <Button
                  size="sm"
                  variant="flat"
                  color="primary"
                  startContent={<Plus size={16} />}
                  className="ml-4"
                >
                  Add
                </Button>
              )}
            </div>
            {siteForm.form.showcases.length > 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 p-3">
                {siteForm.form.showcases.map((showcase, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-2"
                  >
                    <span className="font-medium">{`Showcase ${index + 1}`}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 p-3">
                <div className="flex flex-col items-center justify-center gap-1">
                  <InboxIcon size={20} className="text-default-400" />
                  <span className="text-sm text-default-400">
                    No Showcases Available
                  </span>
                </div>
                <Button
                  size="sm"
                  radius="sm"
                  variant="flat"
                  color="primary"
                  onPress={() => {
                    actions.updateModalsState((draft) => {
                      draft.openStates.showcaseDetailsModal = true;
                    });
                  }}
                >
                  <Plus size={20} /> Add Showcase
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        placement="top"
        size="3xl"
        isOpen={modalsState.openStates.showcaseDetailsModal}
        onClose={() => {
          actions.updateModalsState((draft) => {
            draft.openStates.showcaseDetailsModal = false;
          });
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 p-2">
                Showcase Details
              </ModalHeader>
              <ModalBody className="p-2 px-3">
                <DetailsShowCaseForm
                  placementsStructure={siteForm.form.placements}
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default DetailsSiteForm;
