import { IShowcase } from "@/features/showcase/types";
import { IPlacement } from "@/features/placement/types";

export interface ISite {
  name: string;
  description: string;
  url: string;
  tags: string[];
  showcases: IShowcase[];
  placements: IPlacement[];
  webhookUrl: string;
  updatedAt?: Date;
}

export interface SiteFormProps {
  siteId?: string;
  onClose: () => void;
}

export interface ISiteDetailsFormState {
  isSubmitting: boolean;
  isValid: boolean;
}
