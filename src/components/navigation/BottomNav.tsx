import React from 'react';
import { Home, Briefcase, FileText, Bell, User } from 'lucide-react';

export type NavTab = 'home' | 'opportunities' | 'applications' | 'notifications' | 'profile';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  unreadCount: number;
  urgentApplicationAction: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  unreadCount,
  urgentApplicationAction
}) => {
  const tabs = [
    {
      id: 'home' as NavTab,
      label: 'Home',
      icon: Home
    },
    {
      id: 'opportunities' as NavTab,
      label: 'Opportunities',
      icon: Briefcase
    },
    {
      id: 'applications' as NavTab,
      label: 'Applications',
      icon: FileText,
      badge: urgentApplicationAction
    },
    {
      id: 'notifications' as NavTab,
      label: 'Alerts',
      icon: Bell,
      badgeCount: unreadCount
    },
    {
      id: 'profile' as NavTab,
      label: 'Profile',
      icon: User
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 shadow-lg px-2 max-w-md mx-auto">
      <div className="grid grid-cols-5 items-center h-16">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const IconComponent = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`min-h-[48px] flex flex-col items-center justify-center relative py-1 transition-colors ${
                isActive ? 'text-indigo-600 font-semibold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <IconComponent
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'
                  }`}
                />
                
                {/* Urgent application badge (standby offer, QR pass ready, etc.) */}
                {tab.badge && !isActive && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-indigo-600 ring-2 ring-white animate-pulse" />
                )}

                {/* Unread count badge for alerts */}
                {tab.badgeCount !== undefined && tab.badgeCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center border border-white">
                    {tab.badgeCount > 9 ? '9+' : tab.badgeCount}
                  </span>
                )}
              </div>

              <span className={`text-[10px] mt-1 tracking-tight leading-none ${isActive ? 'text-indigo-700 font-bold' : 'text-slate-500'}`}>
                {tab.label}
              </span>

              {isActive && (
                <span className="absolute bottom-1 w-5 h-0.5 bg-indigo-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
