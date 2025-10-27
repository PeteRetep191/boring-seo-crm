import React, { useState } from 'react';
// Context
import { useAuthContext } from '@/core/providers/AuthProvider';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Button, Tooltip } from '@heroui/react';
import { LogOut, Tags, Link2, ChartPie, Settings, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

// ===============================
// Types
// ===============================
type NavItem = {
  label: string;
  to: string;
  icon: React.ReactNode;
};

// ===============================
// Routes stay exactly the same
// ===============================
const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', icon: <ChartPie />, to: '/' },
  { label: 'Offers', icon: <Tags />, to: '/offers' },
  { label: 'Sites', icon: <Link2 />, to: '/sites' },
  { label: 'Settings', icon: <Settings />, to: '/settings' },
];

// Small helper for active state
const isPathActive = (pathname: string, to: string) =>
  pathname === to || pathname.startsWith(to + '/');

const SideBar: React.FC = () => {
    const { user } = useAuthContext();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <div className="relative">
      {/* Collapse / expand button */}
      <Button
        variant="solid"
        isIconOnly
        color="default"
        size="sm"
        className="absolute top-0 -right-[32px] rounded-none z-3 bg-sidebar-bg hover:bg-sidebar-hover text-sidebar-text"
        onPress={() => setIsCollapsed((v) => !v)}
      >
        {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
      </Button>

      <Sidebar
        collapsed={isCollapsed}
        rootStyles={{
          height: '100vh',
          backgroundColor: 'var(--sidebar-bg)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: '100px',
          border: 'none',
          // make container transparent to let our header/footer colors show through
          '.ps-sidebar-container': {
            backgroundColor: 'transparent',
          },
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-start gap-2 p-4 pl-5 bg-sidebar-header-bg border-b border-[var(--sidebar-border)]">
          <img
            onClick={() => navigate('/')}
            src="https://placehold.co/100x100?text=Logo"
            alt="CRM Logo"
            className="w-10 h-10 cursor-pointer"
          />
          {!isCollapsed && <h1 className="text-2xl truncate">Boring CRM</h1>}
        </div>

        {/* Nav */}
        <Menu
          menuItemStyles={{
            button: ({ active }) => ({
              backgroundColor: active ? 'var(--sidebar-active-bg)' : 'transparent',
              color: active ? 'var(--sidebar-text-active)' : 'var(--sidebar-text)',
              '& .ps-menu-icon': {
                color: active ? 'var(--sidebar-text-active)' : 'var(--sidebar-text)',
                transition: 'color .15s ease',
              },
              '&:hover': {
                backgroundColor: 'var(--sidebar-hover)',
                color: 'var(--sidebar-text-active)',
              },
              '&:hover .ps-menu-icon': {
                color: 'var(--sidebar-text-active)',
              },
            }),
            icon: ({ active }) => ({
              color: active ? 'var(--sidebar-text-active)' : 'var(--sidebar-text)',
              transition: 'color .15s ease',
            }),
          }}
        >
          {NAV_ITEMS.map((item) => {
            const active = isPathActive(pathname, item.to);
            return (
              <Tooltip
                key={item.to}
                placement="right"
                radius="sm"
                isDisabled={!isCollapsed}
                content={item.label}
              >
                <MenuItem icon={item.icon} component={<Link to={item.to} />} active={active}>
                  {item.label}
                </MenuItem>
              </Tooltip>
            );
          })}
        </Menu>

        {/* Footer */}
        <div className="flex flex-col gap-2 bg-sidebar-footer-bg p-3 px-4 absolute bottom-0 w-full border-t border-[var(--sidebar-border)]">
          <div className="flex items-center justify-between gap-2">
            {!isCollapsed && (
              <div className="flex items-center gap-2">
                <img
                  src="https://placehold.co/100x100?text=User"
                  alt="User Avatar"
                  className="h-10 w-10 object-cover rounded-lg"
                />
                <div className="flex flex-col items-start">
                  <span className="text-md truncate text-sidebar-text">{user.name}</span>
                  <span className="text-xs truncate text-sidebar-text-muted">{user.email}</span>
                </div>
              </div>
            )}

            <Tooltip content="Log Out" placement="top">
              <Button
                variant="flat"
                isIconOnly
                color="danger"
                onPress={() => navigate('/login')}
                size="sm"
                className={isCollapsed ? 'w-full' : ''}
              >
                <LogOut size={16} />
              </Button>
            </Tooltip>
          </div>
        </div>
      </Sidebar>
    </div>
  );
};

export default SideBar;
