export interface IShowcase {
  filter: ShowcaseFilter;
  offerIds: string[];
}

export type ShowcaseDeviceType = "desktop" | "mobile" | "tablet";
export type ShowcaseFilter = {
  countriesCodes?: string[];
  ipAddresses?: string[];
  devicesTypes?: ShowcaseDeviceType[];
  refferers?: string[];
};

export interface IDetailsShowcaseFormApi {}
export type DetailsShowcaseFormState = {};
export type DetailsShowcaseForm = {};
