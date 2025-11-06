export interface IPlacement {
  id: string;
  name: string;
  description: string;
  type: "single" | "multiple" | null;
}
