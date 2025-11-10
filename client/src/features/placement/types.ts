export interface IPlacement {
  id: string;
  name: string;
  type: PlacementType;
}

export type PlacementType = "single" | "multiple" | null;
