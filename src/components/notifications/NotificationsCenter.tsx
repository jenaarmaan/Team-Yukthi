import React, { useState } from 'react';
import { AppNotification, NotificationType } from '../../types/recruitment';
import { recruitmentService } from '../../services/storageService';
import {
  Bell,
  CheckCircle2,
  Calendar,
  Clock,
  Sparkles,
  ShieldAlert,
  AlertTriangle,
  Award,
  CheckCheck,
  ChevronRight,
  Filter
} from 'lucide-react';

interface NotificationsCenterProps {
  notifications: AppNotification[];
  onActionRoute: (route?: AppNotification['actionRoute']) => void;
}

export const NotificationsCenter: React.FC<NotificationsCenterProps> = ({
  notifications,
  onActionRoute
}) => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !n.isRead;
    return true;
  });

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'interview_allocated':
      case 'replacement_opportunity':
        return <Calendar className="w-4 h-4 text-emerald-600" />;
      case 'standby_invitation':
        return <Sparkles className="w-4 h-4 text-indigo-600" />;
      case 'waitlist_update':
        return <Clock className="w-4 h-4 text-amber-600" />;
      case 'attendance_confirmed':
        return <CheckCircle2 className="w-4 h-4 text-teal-600" />;
      case 'absence_policy_alert':
      case 'absence_decision':
        return <ShieldAlert className="w-4 h-4 text-rose-600" />;
      case 'eligibility_result':
        return <Award className="w-4 h-4 text-indigo-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  const handleNotificationClick = (notif: AppNotification) => {
    recruitmentService.markNotificationAsRead(notif.id);
    if (notif.actionRoute) {
      onActionRoute(notif.actionRoute);
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg transition-all ${
              filter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1 rounded-lg transition-all ${
              filter === 'unread' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            Unread ({notifications.filter((n) => !n.isRead).length})
          </button>
        </div>

        <button
          onClick={() => recruitmentService.markAllNotificationsAsRead()}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          <span>Mark all read</span>
        </button>
      </div>

      {/* Notifications List */}
      {filtered.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 space-y-2">
          <Bell className="w-8 h-8 text-slate-300 mx-auto" />
          <h4 className="text-xs font-bold text-slate-700">No notifications to display</h4>
          <p className="text-[11px] text-slate-400">
            Recruitment slot allocations, waitlist shifts, and standby alerts will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleNotificationClick(notif)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 relative ${
                notif.isRead
                  ? 'bg-white border-slate-200/90'
                  : 'bg-indigo-50/50 border-indigo-200 hover:bg-indigo-50 shadow-xs'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                {getNotificationIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0 pr-2">
                <div className="flex items-center justify-between gap-1">
                  <h4
                    className={`text-xs leading-snug truncate ${
                      notif.isRead ? 'font-semibold text-slate-800' : 'font-extrabold text-slate-900'
                    }`}
                  >
                    {notif.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                    {notif.timestamp}
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    notif.deliveryChannel === 'simulated_fcm'
                      ? 'bg-purple-100 text-purple-700'
                      : notif.deliveryChannel === 'simulated_sms'
                      ? 'bg-amber-100 text-amber-700'
                      : notif.deliveryChannel === 'simulated_email'
                      ? 'bg-cyan-100 text-cyan-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {notif.deliveryChannel === 'simulated_fcm' ? 'FCM Push (Simulated)'
                      : notif.deliveryChannel === 'simulated_sms' ? 'SMS Gateway (Simulated)'
                      : notif.deliveryChannel === 'simulated_email' ? 'Email Dispatch (Simulated)'
                      : 'In-App Telemetry (Live)'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {notif.message}
                </p>

                {notif.actionRoute && (
                  <span className="text-[11px] font-bold text-indigo-600 flex items-center gap-0.5 mt-2">
                    <span>View details</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                )}
              </div>

              {!notif.isRead && (
                <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0 mt-2" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
