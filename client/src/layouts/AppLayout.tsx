import React, { Suspense } from 'react';
import { Outlet, useLoaderData } from 'react-router-dom';
import { Await } from 'react-router'
// Components
import { Loader } from '@/shared/ui';
import { SideBar } from '@/features/sidebar/ui';
import { ThemeSwitcher } from '@/features/theme/ui';
import { Breadcrumbs } from '@/features/breadcrumbs/ui';
// Libs
import { getTodayString } from '@/shared/lib/date';
import { Divider } from '@heroui/react';

const AppLayout: React.FC = () => {
  const { ready } = useLoaderData() as { ready: Promise<void> };
  
  return (
    <div className="app-layout">
      <Suspense fallback={<div className="flex items-center justify-center h-screen"><Loader /></div>}>
        <Await resolve={ready}>
          <div className='flex flex-row w-full h-screen overflow-hidden'>
            <SideBar />
            <div className='flex flex-1 flex-col'>
              <div className='flex items-center gap-2 justify-end min-h-8 px-2  bg-black/30'>
                <span className='text-[14px]'>{getTodayString()}</span>
                <Divider orientation="vertical" className='h-[70%]' />
                <ThemeSwitcher />
              </div>
              <div className='flex flex-col gap-2 p-2 min-h-0'>
                <Breadcrumbs />
                <Outlet />
              </div>
            </div>
          </div>
        </Await>
      </Suspense>
    </div>
  );
}

export default AppLayout;