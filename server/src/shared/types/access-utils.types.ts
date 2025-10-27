import { IUserDocument } from "@/models/user.model";

export type CheckAccessParams = {
  user: IUserDocument;
  service: string;
  section: string;
  action: string;
  filters?: Record<string, any>;
}