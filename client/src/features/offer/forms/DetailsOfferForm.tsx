import React, { useEffect } from "react";
import { useImmer } from "use-immer";
// React Query
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// API
import { uploadFile } from "@/api/backend/routes/file.api";
import { createOffer, updateOffer, getOfferById } from "@/api/backend/routes/offer.api";
// UI
import { Card, CardBody, Input, Button, Divider, Tooltip, Textarea } from "@heroui/react";
// Components
import SingleFileUploader from "@/features/files/ui/SingleFileUploader";
// DTOs
import { CreateOfferDTO, UpdateOfferDTO } from "@/api/backend/contracts/offer.dto";
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
    bonusCurrency: string;
    bonusDescription: string;
    rating: string;
    partnerUrl: string;
    brandAdvantages: string;
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
    bonusCurrency: "USD",
    bonusDescription: "",
    rating: "0",
    partnerUrl: "",
    brandAdvantages: "",
  },
  logoFile: null,
  logoUrl: null,
};

const DetailsOfferForm: React.FC<Props> = ({ offerId, initialLogoUrl = null, onClose, onSaved }) => {
  const [state, update] = useImmer<State>({ ...INITIAL_STATE, logoUrl: initialLogoUrl });
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
      draft.form.bonus = typeof d.bonus === "number" ? String(d.bonus) : d.bonus || "";
      draft.form.bonusCurrency = d.bonusCurrency || "USD";
      draft.form.bonusDescription = d.bonusDescription || "";
      draft.form.rating = typeof d.rating === "number" ? String(d.rating) : d.rating || "0";
      draft.form.partnerUrl = d.partnerUrl || "";
      draft.form.brandAdvantages = Array.isArray(d.brandAdvantages) ? d.brandAdvantages.join(", ") : "";
      draft.logoUrl = d.logoUrl ?? initialLogoUrl ?? null;
      draft.logoFile = null;
    });
  }, [isEdit, offerResp]);

  // ========= Validation =========
  const validate = () => {
    const nameOk = state.form.name.trim().length > 0;
    const ratingNum = Number(state.form.rating);
    const ratingOk = Number.isFinite(ratingNum) && ratingNum >= 0 && ratingNum <= 5;
    const bonusNum = Number(state.form.bonus);
    const bonusOk = Number.isFinite(bonusNum) && bonusNum >= 0;
    const currOk = state.form.bonusCurrency.trim().length > 0;
    update((d) => {
      d.isValid = nameOk && ratingOk && bonusOk && currOk;
    });
  };
  useEffect(() => {
    validate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.form.name, state.form.rating, state.form.bonus, state.form.bonusCurrency]);

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
      const base: Omit<CreateOfferDTO, "logoUrl"> = {
        name: state.form.name.trim(),
        bonus: Number(state.form.bonus),
        bonusCurrency: state.form.bonusCurrency.trim(),
        bonusDescription: state.form.bonusDescription.trim() || undefined,
        rating: Number(state.form.rating),
        partnerUrl: state.form.partnerUrl.trim() || undefined,
        brandAdvantages: state.form.brandAdvantages
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      // 2) Лого: если выбрали новый файл — грузим, иначе берём текущее/начальное
      let resolvedLogoUrl: string | null | undefined = state.logoUrl ?? initialLogoUrl ?? undefined;
      if (state.logoFile) {
        const uploaded: any = await uploadFile(state.logoFile);
        const url = uploaded?.url || uploaded?.data?.url || uploaded?.result?.url || null;
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
    <Card
      radius="sm"
      shadow="none"
    >
      <CardBody>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
          <div className="flex  gap-4">
            {/* Фото слева */}
            <div className="shrink-0 flex-1">
              <SingleFileUploader
                    valueUrl={state.logoFile ? null : state.logoUrl ?? undefined}
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
                variant="bordered"
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
                variant="bordered"
                placeholder="Describe bonus terms and highlights"
                value={state.form.bonusDescription}
                onValueChange={(v) =>
                  update((d) => {
                    d.form.bonusDescription = v;
                  })
                }
                aria-label="field bonusDescription"
                isDisabled={loading}
              />
            </div>
          </div>

          {/* Ниже — остальные поля */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="number"
              label="Rating (0-5)"
              variant="bordered"
              placeholder="4.5"
              value={state.form.rating}
              onValueChange={(v) =>
                update((d) => {
                  d.form.rating = v;
                })
              }
              aria-label="field rating"
              min={0}
              max={5}
              step={0.1}
              isDisabled={loading}
            />

            <Input
              type="number"
              label="Bonus"
              variant="bordered"
              placeholder="100"
              value={state.form.bonus}
              onValueChange={(v) =>
                update((d) => {
                  d.form.bonus = v;
                })
              }
              aria-label="field bonus"
              min={0}
              step={1}
              isDisabled={loading}
            />

            <Input
              type="text"
              label="Currency"
              variant="bordered"
              placeholder="USD"
              value={state.form.bonusCurrency}
              onValueChange={(v) =>
                update((d) => {
                  d.form.bonusCurrency = v;
                })
              }
              aria-label="field bonusCurrency"
              isDisabled={loading}
            />

            <Input
              type="url"
              label="Partner URL"
              variant="bordered"
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

            <Input
              type="text"
              label="Brand advantages (comma separated)"
              variant="bordered"
              placeholder="Fast payouts, 24/7 support"
              value={state.form.brandAdvantages}
              onValueChange={(v) =>
                update((d) => {
                  d.form.brandAdvantages = v;
                })
              }
              aria-label="field brandAdvantages"
              isDisabled={loading}
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
              <Button variant="flat" onPress={onClose} isDisabled={loading} type="button">
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