import React, { useState } from 'react';
import { AppNotification } from '../../types/recruitment';
import {
  Bell,
  CheckCircle2,
  Calendar,
  Briefcase,
  Award,
  AlertCircle,
  Clock,
  Sparkles,
  Filter,
  CheckCheck,
  ChevronRight
} from 'lucide-react';

interface CandidateNotificationsViewProps {
  notifications: AppNotification[];
  onActionRoute?: (route?: AppNotification['actionRoute']) => void;
  onNavigateToTab?: (tab: 'applications' | 'arena' | 'profile' | 'dashboard') => void;
}

export const CandidateNotificationsView: React.FC<CandidateNotificationsViewProps> = ({
  notifications,
  onActionRoute,
  onNavigateToTab
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [localNotifications, setLocalNotifications] = useState<AppNotification[]>(notifications);

  const categories = [
    { id: 'all', label: 'All Alerts' },
    { id: 'interview', label: 'Interviews & Slots' },
    { id: 'application', label: 'Applications & Status' },
    { id: 'opportunity', label: 'Hiring Opportunities' },
    { id: 'arena', label: 'Arena & Competitions' },
    { id: 'announcement', label: 'Announcements' }
  ];

  const handleMarkAllRead = () => {
    setLocalNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleToggleRead = (id: string) => {
    setLocalNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    );
  };

  const filtered = localNotifications.filter((n) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'interview') return n.type.includes('slot') || n.type.includes('interview') || n.type.includes('standby');
    if (activeCategory === 'application') return n.type.includes('application') || n.type.includes('status');
    if (activeCategory === 'opportunity') return n.type.includes('drive') || n.type.includes('opportunity');
    if (activeCategory === 'arena') return n.type.includes('challenge') || n.type.includes('arena') || n.type.includes('badge');
    return true;
  });

  const getNotificationIcon = (type: string) => {
    if (type.includes('slot') || type.includes('interview')) {
      return <Calendar className="w-4 h-4 text-emerald-600" />;
    }
    if (type.includes('standby') || type.includes('alert')) {
      return <AlertCircle className="w-4 h-4 text-amber-600" />;
    }
    if (type.includes('application') || type.includes('offer')) {
      return <Briefcase className="w-4 h-4 text-indigo-600" />;
    }
    if (type.includes('arena') || type.includes('badge')) {
      return <Award className="w-4 h-4 text-violet-600" />;
    }
    return <Bell className="w-4 h-4 text-slate-500" />;
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 font-sans">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Notification Center</h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time recruitment updates, interview reminders, arena challenges, and institutional announcements.
          </p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs self-start sm:self-auto"
        >
          <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Mark All as Read</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-white border border-slate-200 rounded-2xl shadow-2xs text-xs font-semibold">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-indigo-600 text-white shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-2">
            <Bell className="w-8 h-8 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-900">No Notifications in this Category</h4>
            <p className="text-xs text-slate-500">You are completely up to date with all recruitment updates.</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 cursor-pointer ${
                item.isRead
                  ? 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                  : 'bg-indigo-50/50 border-indigo-200 shadow-xs'
              }`}
              onClick={() => {
                if (item.actionRoute && onActionRoute) {
                  onActionRoute(item.actionRoute);
                } else if (onNavigateToTab) {
                  if (item.type.includes('arena')) onNavigateToTab('arena');
                  else onNavigateToTab('applications');
                }
              }}
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-xl bg-white border border-slate-200 shrink-0 mt-0.5 shadow-2xs">
                  {getNotificationIcon(item.type)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                    {!item.isRead && (
                      <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.message}</p>
                  <span className="text-[10px] text-slate-400 block pt-0.5">
                    {new Date(item.timestamp).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleRead(item.id);
                  }}
                  className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                  title={item.isRead ? 'Mark as Unread' : 'Mark as Read'}
                >
                  <CheckCircle2 className={`w-4 h-4 ${item.isRead ? 'text-emerald-500' : 'text-slate-300'}`} />
                </button>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
