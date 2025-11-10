export interface IOffer {
  _id: string;
  id: string;
  name: string;
  description: string;
  brandAdvantages: string[];
  logoUrl: string;
  partnerUrl: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  archived: boolean;
}
