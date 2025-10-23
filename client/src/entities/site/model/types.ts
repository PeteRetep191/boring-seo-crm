export type ISite = {
    _id: string;
    name: string;
    tags: string[];
    status: "active" | "inactive";
}