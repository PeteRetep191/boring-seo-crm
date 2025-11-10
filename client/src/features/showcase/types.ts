export interface IShowcase {
  filter: ShowcaseFilter | null;
  placements: IShowcasePlacement[];
}

export interface IShowcasePlacement {
  id: string;
  value: string | string[] | null | undefined;
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
