import React, { useState } from 'react';
import { Link, useLocation } from "react-router-dom";
// components
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Button, Tooltip } from '@heroui/react';
// icons
import { LogOut, Tags, Link2, ChartPie, Settings, PanelLeftClose, PanelLeftOpen} from 'lucide-react';

type NavItem = {
  label: string;
  to: string;
  icon: React.ReactNode;
};

const NAV_ITEMS: NavItem[] = [
    { 
        label: "Dashboard",
        icon: <ChartPie />,
        to: "/",
    },
    { 
        label: "Offers", 
        icon: <Tags />, 
        to: "/offers", 
    },
    { 
        label: "Sites", 
        icon: <Link2 />, 
        to: "/sites", 
    },
    { 
        label: "Settings", 
        icon: <Settings />, 
        to: "/settings", 
    },
];

const SideBar: React.FC = () => {
    const [ collapsed, setCollapsed ] = useState<boolean>(true);
    const { pathname } = useLocation();

    return (
        <div className='relative'>
            <Button 
                variant="solid" 
                isIconOnly 
                color="default" 
                size="sm" 
                className='absolute top-0 -right-[32px] rounded-none z-3 bg-black/10 hover:bg-black/90 text-gray-200' 
                onPress={() => setCollapsed((prev) => !prev)}
            >
                {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
            </Button>
            <Sidebar
                collapsed={collapsed}
                rootStyles={{
                    height: '100vh',
                    backgroundColor: 'hsla(240, 10%, 10%, 1)',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '100px',
                    border: 'none',
                    '.ps-sidebar-container': {
                        backgroundColor: 'transparent'
                    }
                }}
            >
                <div className='flex items-center justify-start gap-2 p-4 pl-5 bg-black/10 border-b border-white/10'>
                    <img src="https://placehold.co/400x400?text=Logo" alt="Company Logo" className="h-[45px] object-cover rounded" />
                    {!collapsed && (
                        <div className='flex flex-col items-start overflow-hidden'>
                            <h2 className='text-lg truncate'>CRM NAME HERE</h2>
                            <span className='text-xs truncate'>Description here</span>
                        </div>
                    )}
                </div>
                <Menu
                    menuItemStyles={{
                        button: ({active}) => {
                            return {
                                backgroundColor: active ? 'hsl(var(--heroui-primary) / 1)' : 'transparent',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                },
                            };
                        },
                    }}
                >
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.to || pathname.startsWith(item.to + "/");

                        return (
                            <MenuItem
                                key={item.to}
                                icon={item.icon}
                                component={<Link to={item.to} />}
                                active={isActive}
                            >
                                {item.label}
                            </MenuItem>
                        );
                    })}
                </Menu>
                <div className='flex flex-col gap-2 bg-black/10 p-3 px-4 absolute bottom-0 w-full border-t border-white/10'>
                    <div className='flex items-center justify-between gap-2'>
                        {!collapsed && (
                            <div className='flex items-center gap-2'>
                                <img src="https://placehold.co/400x400?text=User" alt="User Avatar" className="h-[40px] w-[40px] object-cover rounded" />
                                <div className='flex flex-col items-start'>
                                    <span className='text-md truncate'>User Name</span>
                                    <span className='text-xs truncate'>User Email</span>
                                </div>
                            </div>
                        )}
                        <Tooltip content="Log Out" placement="top">
                            <Button variant="flat" isIconOnly color="danger" size="sm" className={`${collapsed ? 'w-full' : ''}`}>
                                <LogOut size={16} />
                            </Button>
                        </Tooltip>
                    </div>
                </div>
            </Sidebar>
        </div>
    )
}

export default SideBar;
