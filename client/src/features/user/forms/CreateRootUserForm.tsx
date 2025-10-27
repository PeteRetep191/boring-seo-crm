import React, { useMemo, useState } from "react";
// API
import { createRootUser } from "@/api/backend/routes/user.api";
// UI Components
import { Card, CardHeader, CardBody, Input, Button, Divider, Tooltip } from "@heroui/react";
// Toast
import { toast } from "react-hot-toast";

type RootPayload = {
  name: string;
  email: string;
  password: string;
};

const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CreateRootUserForm: React.FC = () => {
  const [form, setForm] = useState<RootPayload>({ name: "", email: "", password: "" });
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const isValid = useMemo(() => {
    if (!form.name.trim()) return false;
    if (!emailRx.test(form.email.trim())) return false;
    if (form.password.length < 8) return false;
    if (form.password !== confirm) return false;
    return true;
  }, [form, confirm]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid || submitting) return;

    setSubmitting(true);
    setError(null);
    try {
      await createRootUser(form);

      toast.success("ROOT пользователь создан. Перенаправляю на вход…");
      setTimeout(() => {
        if (typeof window !== "undefined") {
          window.location.assign("/login");
        }
      }, 1200);
    } catch (err: any) {
      console.error("Failed to create root user:", err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create root user";
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <Card className="max-w-md w-full mx-auto p-1">
        <CardHeader className="flex items-center justify-between gap-1">
          <div className="flex flex-col items-start gap-1">
            <h1 className="text-2xl font-semibold">Root user created</h1>
            <p className="text-sm text-foreground-500">Теперь вы можете войти, используя указанные e-mail и пароль.</p>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="max-w-md w-full mx-auto p-1">
      <CardHeader className="flex items-center justify-between gap-1">
        <div className="flex flex-col items-start gap-1">
          <h1 className="text-2xl font-semibold">Create ROOT user</h1>
          <p className="text-sm text-foreground-500">{`{We will replace it by CRM name}`}</p>
        </div>
        <img src="https://placehold.co/400x400?text=Logo" alt="Company Logo" className="h-[55px] object-cover rounded" />
      </CardHeader>
      <CardBody>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
          <Input
            type="text"
            label="Name"
            variant="bordered"
            placeholder="Jane Doe"
            value={form.name}
            onValueChange={(v) => setForm((s) => ({ ...s, name: v }))}
            aria-label="field name"
          />

          <Input
            type="email"
            label="E-mail"
            variant="bordered"
            placeholder="admin@yourdomain.tld"
            value={form.email}
            onValueChange={(v) => setForm((s) => ({ ...s, email: v }))}
            autoComplete="email"
            aria-label="field email"
            isInvalid={!!form.email && !emailRx.test(form.email)}
            errorMessage={!!form.email && !emailRx.test(form.email) ? "Некорректный e-mail" : undefined}
          />

          <Input
            type="password"
            label="Password"
            variant="bordered"
            placeholder="••••••••"
            value={form.password}
            onValueChange={(v) => setForm((s) => ({ ...s, password: v }))}
            autoComplete="new-password"
            aria-label="field password"
            description="Минимум 8 символов"
            isInvalid={!!form.password && form.password.length < 8}
          />

          <Input
            type="password"
            label="Confirm password"
            variant="bordered"
            placeholder="••••••••"
            value={confirm}
            onValueChange={setConfirm}
            autoComplete="new-password"
            aria-label="field confirm password"
            isInvalid={!!confirm && confirm !== form.password}
            errorMessage={!!confirm && confirm !== form.password ? "Пароли не совпадают" : undefined}
          />

          <Divider />

          <Tooltip content="Создать суперпользователя. Разрешено обычно только один раз." placement="top">
            <Button type="submit" color="primary" isDisabled={!isValid} isLoading={submitting} className="w-full">
              Create ROOT user
            </Button>
          </Tooltip>

          {error ? <p className="text-danger text-sm">{error}</p> : null}
        </form>
      </CardBody>
    </Card>
  );
};

export default CreateRootUserForm;