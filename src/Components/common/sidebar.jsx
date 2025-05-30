import React, { useState } from 'react';
import { useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useTabs } from '../../context/TabContext';
import { Tabs, Tab, IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { tabs, activeTab, openTab, closeTab } = useTabs();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { iconPath: '/images/nav/home.png', label: 'Home', route: '/leads' },
    { iconPath: '/images/nav/group.png', label: 'Lead', route: '/leadcardview' },
    { iconPath: '/images/nav/calen.png', label: 'Calendar', route: '/calenderpage' },
    // { iconPath: '/images/nav/task.png', label: 'Remainder', route: '/remainderpage' },
  ];

  const handleTabChange = (_, newValue) => {
    if (activeTab !== newValue) {
      const menuItem = menuItems.find(item => item.route === newValue);
      openTab(newValue, menuItem?.label || 'New');
    }
  };

  const toggleSidebar = () => setIsCollapsed(prev => !prev);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('profileImage');
    navigate('/');
  };

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <div className={`bg-white border-r flex flex-col justify-between transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
        <div className="flex items-center justify-center mt-6 h-20">
          <img
            src={isCollapsed ? '/images/nav/shortinkli.png' : '/images/nav/loginkli.png'}
            alt="Logo"
            className={`transition-all duration-300 ${isCollapsed ? 'w-12' : 'w-48'} h-auto`}
          />
        </div>

        <div className="flex flex-col items-center py-4 space-y-2">
          {menuItems.map(item => (
            <div
              key={item.route}
              onClick={() => openTab(item.route, item.label)}
              className={`flex items-center w-full cursor-pointer hover:bg-blue-100 rounded-lg px-4 py-2 transition-all duration-200 text-gray-700 ${
                location.pathname === item.route ? 'bg-blue-100 font-semibold text-blue-600' : ''
              }`}
            >
              <div className="flex items-center justify-center w-8">
                <img src={item.iconPath} alt={item.label} className="w-5 h-5 object-contain" />
              </div>
              {!isCollapsed && <span className="ml-3 text-sm font-medium">{item.label}</span>}
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center py-6 space-y-4 mb-4">
          <button
            onClick={toggleSidebar}
            className="flex items-center justify-center space-x-2 px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition"
          >
            <img src="/images/nav/collab.png" alt="Toggle" className="w-6 h-6" />
            {!isCollapsed && <span className="text-sm font-medium">Collapse</span>}
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center bg-black text-white space-x-2 px-4 py-2 hover:bg-red-600 rounded transition"
          >
            <img src="/images/nav/logout.png" alt="Logout" className="w-5 h-5" />
            {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Tab Bar */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: '#f9fafb', width: '100%' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ minHeight: 48, width: '100%' }}
          >
            {tabs.map(tab => (
              <Tab
                key={tab.path}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {tab.label}
                    <IconButton
                      size="small"
                      onClick={e => { e.stopPropagation(); closeTab(tab.path); }}
                      sx={{ ml: 1 }}
                    >
                      <CloseIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>
                }
                value={tab.path}
                sx={{ textTransform: 'none', minHeight: 48, minWidth: 'unset', px: 2, '&.Mui-selected': { color: 'primary.main', fontWeight: 'bold' } }}
              />
            ))}
          </Tabs>
        </Box>

        {/* Page Content Area */}
        <div className="flex-1 overflow-x-hidden overflow-y-scroll w-full h-full p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
