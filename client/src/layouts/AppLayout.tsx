import React, { Suspense } from "react";
import { Outlet, useLoaderData } from "react-router-dom";
import { Await } from "react-router";
// Components
import { Loader } from "@/shared/ui";
import { SideBar } from "@/features/sidebar/ui";
import { ThemeSwitcher } from "@/features/theme/ui";
import { Breadcrumbs } from "@/features/breadcrumbs/ui";
// import { NotificationsPopoverTrigger } from '@/features/notification/ui';
// Libs
import { getTodayString } from "@/shared/lib/date";
import { Divider } from "@heroui/react";

const AppLayout: React.FC = () => {
  const { ready } = useLoaderData() as { ready: Promise<void> };

  return (
    <div className="flex flex-row w-full h-screen overflow-hidden">
      <Suspense fallback={<Loader />}>
        <Await resolve={ready}>
          <SideBar />
          <div className="flex flex-1 flex-col h-full">
            <div className="flex items-center gap-2 justify-end min-h-8 px-2 pr-3">
              <span className="text-[14px]">UTC</span>
              <span className="text-[14px]">{getTodayString()}</span>
              <Divider orientation="vertical" className="h-[70%]" />
              <ThemeSwitcher />
              {/* <NotificationsPopoverTrigger /> */}
            </div>
            <div className="flex flex-col gap-2 p-2 min-h-0 h-full">
              <Breadcrumbs />
              <Outlet />
            </div>
          </div>
        </Await>
      </Suspense>
    </div>
  );
};

export default AppLayout;
