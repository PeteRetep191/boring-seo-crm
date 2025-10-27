import React, { useEffect } from "react";
import { useImmer } from "use-immer";
// API
import { uploadFile } from "@/api/backend/routes/file.api";
import { createOffer } from "@/api/backend/routes/offer.api";
// UI
import { Card, CardHeader, CardBody, Input, Button, Divider, Tooltip, Textarea } from "@heroui/react";
// Components
import SingleFileUploader from "@/features/files/ui/SingleFileUploader";
// DTOs
import { CreateOfferDTO } from "@/api/backend/contracts/offer.dto";
// Utils
import toast from "react-hot-toast";

type Props = {
  /** valueUrl можно передать, если редактируешь (для create не обязателен) */
  initialLogoUrl?: string | null;
  onSubmit: (form: CreateOfferDTO, logoFile: File | null) => Promise<void>;
};

type State = {
  isSubmitting: boolean;
  isValid: boolean;
  form: {
    name: string;
    bonus: string; // как строка в инпуте, сконвертим к number
    bonusCurrency: string;
    bonusDescription: string;
    rating: string; // строка, потом number
    partnerUrl: string;
    brandAdvantages: string; // через запятую
  };
  logoFile: File | null;
  logoUrl: string | null; // только для превью, если пришло из пропсов
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

const AddNewOfferForm: React.FC<Props> = ({ initialLogoUrl = null, onSubmit }) => {
  const [state, update] = useImmer<State>({ ...INITIAL_STATE, logoUrl: initialLogoUrl });

  const validate = () => {
    const nameOk = state.form.name.trim().length > 0;
    const ratingNum = Number(state.form.rating);
    const ratingOk = Number.isFinite(ratingNum) && ratingNum >= 0 && ratingNum <= 5;
    const bonusNum = Number(state.form.bonus);
    const bonusOk = Number.isFinite(bonusNum) && bonusNum >= 0;
    const currOk = state.form.bonusCurrency.trim().length > 0;

    update(d => { d.isValid = nameOk && ratingOk && bonusOk && currOk; });
  };

  useEffect(() => {
    validate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.form.name, state.form.rating, state.form.bonus, state.form.bonusCurrency]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!state.isValid || state.isSubmitting) return;

    update(d => { d.isSubmitting = true; });
    try {
      // 1) Собираем базовый payload (без logoUrl)
      const basePayload: Omit<CreateOfferDTO, "logoUrl"> = {
        name: state.form.name.trim(),
        bonus: Number(state.form.bonus),
        bonusCurrency: state.form.bonusCurrency.trim(),
        bonusDescription: state.form.bonusDescription.trim() || undefined,
        rating: Number(state.form.rating),
        partnerUrl: state.form.partnerUrl.trim() || undefined,
        brandAdvantages: state.form.brandAdvantages
          .split(",")
          .map(s => s.trim())
          .filter(Boolean),
      };

      // 2) Если есть выбранный файл — загружаем и берём url
      let resolvedLogoUrl: string | null | undefined = initialLogoUrl || undefined;
      if (state.logoFile) {
        const uploaded: any = await uploadFile(state.logoFile);
        console.log("Uploaded file response:", uploaded);
        console.log("Uploaded?.result?.url:", uploaded?.result?.url);
        // поддержим разные возможные форматы ответа
        resolvedLogoUrl = uploaded?.url || null;
      }

      // 3) Создаём оффер
      const payload: CreateOfferDTO = {
        ...basePayload,
        logoUrl: resolvedLogoUrl ?? undefined,
      };

      await createOffer(payload);
      // 4) (опционально) сброс формы после успеха
      update(() => ({ ...INITIAL_STATE, logoUrl: resolvedLogoUrl ?? null }));
      toast.success("Offer created successfully");
      // 5) Вызываем коллбек onSubmit
      await onSubmit(payload, state.logoFile);
    } catch (err) {
      console.error("Failed to create offer:", err);
      toast.error("Failed to create offer");
    } finally {
      update(d => { d.isSubmitting = false; });
    }
  };

  return (
    <Card className="max-w-4xl w-full mx-auto p-1">
      <CardBody>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
          {/* Лого */}
          <div>
            {/* <label className="text-sm mb-2 block text-foreground-600">Logo</label> */}
            <SingleFileUploader
              valueUrl={state.logoFile ? null : state.logoUrl ?? undefined}
              onChange={(file) => update(d => { d.logoFile = file; })}
              accept={["image/*"]}
              maxSizeMb={5}
              description="PNG, JPG, WEBP до 5 МБ"
            />
          </div>

          {/* Основные поля */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="text"
              label="Name"
              variant="bordered"
              placeholder="Awesome Casino"
              value={state.form.name}
              onValueChange={(v) => update(d => { d.form.name = v; })}
              aria-label="field name"
            />

            <Input
              type="number"
              label="Rating (0-5)"
              variant="bordered"
              placeholder="4.5"
              value={state.form.rating}
              onValueChange={(v) => update(d => { d.form.rating = v; })}
              aria-label="field rating"
              min={0}
              max={5}
              step={0.1}
            />

            <Input
              type="number"
              label="Bonus"
              variant="bordered"
              placeholder="100"
              value={state.form.bonus}
              onValueChange={(v) => update(d => { d.form.bonus = v; })}
              aria-label="field bonus"
              min={0}
              step={1}
            />

            <Input
              type="text"
              label="Currency"
              variant="bordered"
              placeholder="USD"
              value={state.form.bonusCurrency}
              onValueChange={(v) => update(d => { d.form.bonusCurrency = v; })}
              aria-label="field bonusCurrency"
            />

            <Input
              type="url"
              label="Partner URL"
              variant="bordered"
              placeholder="https://partner.example.com"
              value={state.form.partnerUrl}
              onValueChange={(v) => update(d => { d.form.partnerUrl = v; })}
              aria-label="field partnerUrl"
            />

            <Input
              type="text"
              label="Brand advantages (comma separated)"
              variant="bordered"
              placeholder="Fast payouts, 24/7 support"
              value={state.form.brandAdvantages}
              onValueChange={(v) => update(d => { d.form.brandAdvantages = v; })}
              aria-label="field brandAdvantages"
            />
          </div>

          <Textarea
            label="Bonus description"
            variant="bordered"
            placeholder="Describe bonus terms and highlights"
            value={state.form.bonusDescription}
            onValueChange={(v) => update(d => { d.form.bonusDescription = v; })}
            aria-label="field bonusDescription"
          />

          <Divider />

          <div className="flex items-center justify-end gap-2">
            <Tooltip content="Сбросить форму">
              <Button
                variant="flat"
                onPress={() =>
                  update(() => ({ ...INITIAL_STATE, logoUrl: initialLogoUrl || null }))
                }
                type="button"
              >
                Reset
              </Button>
            </Tooltip>
            <Button
              type="submit"
              color="primary"
              isDisabled={!state.isValid}
              isLoading={state.isSubmitting}
            >
              Create Offer
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};

export default AddNewOfferForm;