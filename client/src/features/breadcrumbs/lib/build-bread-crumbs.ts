// Types
import { BreadcrumbItem, RouteLabelMap } from "../types/breadcrumbs";
// Libs
import { titleCase } from "@/shared/lib/text";

const buildBreadcrumbs = (
  pathname: string,
  map: RouteLabelMap = {}
): BreadcrumbItem[] => {
  const segments = pathname.replace(/\/+$/, "").split("/");
  const crumbs: BreadcrumbItem[] = [];

  let hrefAcc = "";
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];

    if (i === 0 && seg === "") {
      const label = map["/"] ?? map[""] ?? "Home";
      crumbs.push({ label, href: "/" });
      hrefAcc = "/";
      continue;
    }

    if (!seg) continue;

    hrefAcc += (hrefAcc.endsWith("/") ? "" : "/") + encodeURIComponent(seg);
    const decoded = decodeURIComponent(seg);

    const mapped = map[decoded] ?? map[`:${decoded}`] ?? null;

    const label = mapped ?? titleCase(decoded);
    crumbs.push({ label, href: hrefAcc });
  }

  return crumbs;
};

export default buildBreadcrumbs;
