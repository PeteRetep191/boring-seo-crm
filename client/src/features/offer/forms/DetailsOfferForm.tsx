import React, { useEffect } from "react";
import { useImmer } from "use-immer";
// React Query
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// API
import { uploadFile } from "@/api/backend/routes/file.api";
import {
  createOffer,
  updateOffer,
  getOfferById,
} from "@/api/backend/routes/offer.api";
// UI
import {
  Card,
  CardBody,
  Input,
  Button,
  Divider,
  Tooltip,
  Textarea,
} from "@heroui/react";
// Components
import SingleFileUploader from "@/features/files/ui/SingleFileUploader";
import { ArrayStringEditor } from "@/shared/components";
// DTOs
import {
  CreateOfferDTO,
  UpdateOfferDTO,
} from "@/api/backend/contracts/offer.dto";
// Utils
import toast from "react-hot-toast";

type Props = {
  /** Если есть offerId — форма работает в режиме редактирования */
  offerId?: string;
  /** Можно подкинуть превью логотипа, если есть */
  initialLogoUrl?: string | null;
  /** Закрыть модал/дровер */
  onClose?: () => void;
  /** Коллбек после успешного сохранения (create/update) */
  onSaved?: (payload: any) => void;
};

type State = {
  isSubmitting: boolean;
  isValid: boolean;
  form: {
    name: string;
    bonus: string;
    description: string;
    rating: number;
    partnerUrl: string;
    // isActive?: boolean;
    brandAdvantages: string[];
  };
  logoFile: File | null;
  logoUrl: string | null;
};

const INITIAL_STATE: State = {
  isSubmitting: false,
  isValid: false,
  form: {
    name: "",
    bonus: "",
    description: "",
    rating: 0,
    partnerUrl: "",
    brandAdvantages: [
      "Fast delivery",
      "24/7 customer support",
      "Money-back guarantee",
    ],
  },
  logoFile: null,
  logoUrl: null,
};

const DetailsOfferForm: React.FC<Props> = ({
  offerId,
  initialLogoUrl = null,
  onClose,
  onSaved,
}) => {
  const [state, update] = useImmer<State>({
    ...INITIAL_STATE,
    logoUrl: initialLogoUrl,
  });
  const queryClient = useQueryClient();
  const isEdit = Boolean(offerId);

  // ========= Load offer for edit =========
  const { data: offerResp, isFetching } = useQuery({
    queryKey: ["offer", offerId],
    queryFn: async () => {
      const res = await getOfferById(offerId as string);
      return res?.data ?? res;
    },
    enabled: isEdit,
  });

  useEffect(() => {
    if (!isEdit || !offerResp) return;
    const d = offerResp?.result ?? offerResp;
    console.log("Loaded offer for edit:", d);
    update((draft) => {
      draft.form.name = d.name || "";
      draft.form.bonus =
        typeof d.bonus === "number" ? String(d.bonus) : d.bonus || "";
      draft.form.description = d.description || "";
      draft.form.rating =
        typeof d.rating === "number" ? String(d.rating) : d.rating || "0";
      draft.form.partnerUrl = d.partnerUrl || "";
      draft.form.brandAdvantages = Array.isArray(d.brandAdvantages)
        ? d.brandAdvantages
        : [];
      draft.logoUrl = d.logoUrl ?? initialLogoUrl ?? null;
      draft.logoFile = null;
    });
  }, [isEdit, offerResp]);

  // ========= Validation =========
  const validate = () => {
    const name = state.form.name ?? "";
    const bonus = String(state.form.bonus ?? "");
    const rating = Number(state.form.rating);

    const nameOk = name.length > 0;
    const bonusOk = bonus.length > 0;
    const ratingOk = Number.isFinite(rating) && rating >= 0 && rating <= 5;

    update((d) => {
      d.isValid = nameOk && bonusOk && ratingOk;

      // легка нормалізація
      d.form.name = name;
      d.form.bonus = bonus;
      d.form.rating = rating;

      if (typeof d.form.description === "string") {
        const t = d.form.description;
        d.form.description = t === "" ? "" : t;
      }
      if (typeof d.form.partnerUrl === "string") {
        const t = d.form.partnerUrl;
        d.form.partnerUrl = t === "" ? "" : t;
      }
    });
  };

  useEffect(() => {
    validate();
  }, [state.form]);

  // ========= Mutations =========
  const createMut = useMutation({
    mutationFn: (payload: CreateOfferDTO) => createOffer(payload),
  });

  const updateMut = useMutation({
    mutationFn: (vars: { offerId: string; data: UpdateOfferDTO }) =>
      updateOffer({ offerId: vars.offerId, updatedOfferData: vars.data }),
  });

  // ========= Submit =========
  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!state.isValid || state.isSubmitting) return;

    update((d) => {
      d.isSubmitting = true;
    });

    try {
      // 1) Базовый payload
      const base: Omit<CreateOfferDTO, "logoUrl" | "isActive"> = {
        name: state.form.name.trim(),
        bonus: state.form.bonus.trim(),
        description: state.form.description.trim() || undefined,
        rating: state.form.rating,
        partnerUrl: state.form.partnerUrl.trim() || undefined,
        brandAdvantages: state.form.brandAdvantages,
      };

      // 2) Лого: если выбрали новый файл — грузим, иначе берём текущее/начальное
      let resolvedLogoUrl: string | null | undefined =
        state.logoUrl ?? initialLogoUrl ?? undefined;
      if (state.logoFile) {
        const uploaded: any = await uploadFile(state.logoFile);
        const url =
          uploaded?.url || uploaded?.data?.url || uploaded?.result?.url || null;
        resolvedLogoUrl = url ?? undefined;
      }

      if (isEdit && offerId) {
        // UPDATE
        const updatePayload: UpdateOfferDTO = {
          ...base,
          logoUrl: resolvedLogoUrl ?? undefined,
        };
        await updateMut.mutateAsync({ offerId, data: updatePayload });
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["offer", offerId] }),
          queryClient.invalidateQueries({ queryKey: ["offers"] }),
        ]);
        toast.success("Offer updated");
        onSaved?.({ id: offerId, ...updatePayload });
        onClose?.();
      } else {
        // CREATE
        const createPayload: CreateOfferDTO = {
          ...base,
          logoUrl: resolvedLogoUrl ?? undefined,
        };
        const res = await createMut.mutateAsync(createPayload);
        await queryClient.invalidateQueries({ queryKey: ["offers"] });
        toast.success("Offer created");
        onSaved?.(res?.data ?? res);
        update(() => ({ ...INITIAL_STATE, logoUrl: resolvedLogoUrl ?? null }));
        onClose?.();
      }
    } catch (err) {
      console.error("Offer save failed:", err);
      toast.error("Failed to save offer");
    } finally {
      update((d) => {
        d.isSubmitting = false;
      });
    }
  };

  // ========= UI =========
  const title = isEdit ? "Edit Offer" : "Create Offer";
  const cta = isEdit ? "Save" : "Create Offer";
  const loading = isFetching || state.isSubmitting;

  return (
    <Card radius="sm" shadow="none">
      <CardBody>
        <form
          className="flex flex-col gap-5"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="flex  gap-4">
            {/* Фото слева */}
            <div className="shrink-0 flex-1">
              <SingleFileUploader
                valueUrl={state.logoFile ? null : (state.logoUrl ?? undefined)}
                onChange={(file) =>
                  update((d) => {
                    d.logoFile = file;
                  })
                }
                accept={["image/*"]}
                maxSizeMb={5}
                description=": PNG, JPG, WEBP up to 5 MB"
              />
            </div>

            {/* Справа — Name + Description в колонке */}
            <div className="flex flex-2 flex-col gap-4">
              <Input
                type="text"
                label="Name"
                labelPlacement="outside"
                variant="flat"
                placeholder="Awesome Casino"
                value={state.form.name}
                onValueChange={(v) =>
                  update((d) => {
                    d.form.name = v;
                  })
                }
                aria-label="field name"
                isDisabled={loading}
              />
              <Textarea
                label="Description"
                labelPlacement="outside"
                variant="flat"
                placeholder="Describe bonus terms and highlights"
                value={state.form.description}
                onValueChange={(v) =>
                  update((d) => {
                    d.form.description = v;
                  })
                }
                aria-label="field description"
                isDisabled={loading}
              />
            </div>
          </div>

          {/* Ниже — остальные поля */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="text"
              label="Bonus"
              labelPlacement="outside"
              variant="flat"
              placeholder="100% up to $3,000 + 220 Bonus Spins"
              value={state.form.bonus}
              onValueChange={(v) =>
                update((d) => {
                  d.form.bonus = v;
                })
              }
              aria-label="field bonus"
              isDisabled={loading}
              className="col-span-1 md:col-span-2"
            />

            <Input
              type="number"
              label="Rating (0-5)"
              labelPlacement="outside"
              variant="flat"
              placeholder="4.5"
              value={state.form.rating.toString()}
              onValueChange={(v) =>
                update((d) => {
                  d.form.rating = parseInt(v);
                })
              }
              aria-label="field rating"
              min={0}
              max={5}
              step={0.1}
              isDisabled={loading}
            />

            <Input
              type="url"
              label="Partner URL"
              labelPlacement="outside"
              variant="flat"
              placeholder="https://partner.example.com"
              value={state.form.partnerUrl}
              onValueChange={(v) =>
                update((d) => {
                  d.form.partnerUrl = v;
                })
              }
              aria-label="field partnerUrl"
              isDisabled={loading}
            />

            <ArrayStringEditor
              title="Brand Advantages"
              values={
                Array.isArray(state.form.brandAdvantages)
                  ? state.form.brandAdvantages
                  : []
              }
              onChange={(vals) =>
                update((d) => {
                  d.form.brandAdvantages = vals;
                })
              }
              placeholder="Advantage..."
              className="col-span-1 md:col-span-2"
            />
          </div>

          <Divider />

          <div className="flex items-center justify-end gap-2">
            <Button
              type="submit"
              color="primary"
              isDisabled={!state.isValid || loading}
              isLoading={loading}
            >
              {cta}
            </Button>
            {onClose && (
              <Button
                variant="flat"
                onPress={onClose}
                isDisabled={loading}
                type="button"
              >
                Close
              </Button>
            )}
          </div>
        </form>
      </CardBody>
    </Card>
  );
};

export default DetailsOfferForm;
