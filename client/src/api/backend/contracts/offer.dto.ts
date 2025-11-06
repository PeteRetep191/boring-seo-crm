/** Базовая сущность оффера (как приходит с сервера) */
export interface Offer {
  _id: string;
  name: string;
  logoUrl?: string | null;
  bonus: number;
  bonusCurrency: string;
  bonusDescription?: string | null;
  rating: number; // 0..5
  partnerUrl?: string | null;
  brandAdvantages: string[];
  isActive: boolean;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

/** DTO для создания оффера */
export interface CreateOfferDTO {
  name: string;
  logoUrl?: string | null;
  bonus: string;
  description?: string | null;
  rating: number;
  partnerUrl?: string | null;
  isActive?: boolean;
  brandAdvantages?: string[];
  archived?: boolean;
}

/** DTO для обновления оффера (все поля опциональны) */
export type UpdateOfferDTO = Partial<CreateOfferDTO>;

/** Тип фильтра с UI (если есть конкретный формат — подставь его тут) */
export type UIFilter = unknown;

/** DTO для получения списка офферов */
export interface FetchOffersDTO {
  page?: number;
  limit?: number;
  search?: string;
  filters?: UIFilter[]; // на бэке парсится из строкового filters
}

/** DTO для запроса оффера по id */
export interface GetOfferByIdDTO {
  offerId: string;
}

/** DTO для удаления оффера по id */
export interface DeleteOfferByIdDTO {
  offerId: string;
}

/** Удобный тип пагинации, если хочешь типизировать ответ списка */
export interface PaginationMeta {
  page: number;
  limit: number;
  pages: number;
  total: number;
}

/** Опционально: тип ответа списка от бэка */
export interface FetchOffersResponse {
  offers: Offer[];
  total: number;
  pagination: PaginationMeta;
}
