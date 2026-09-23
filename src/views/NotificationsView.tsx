import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, CheckCheck, Wrench, MessageSquare, FileText, Scale, ArrowLeft } from 'lucide-react';
import { formatActionDate, formatActionDateTime, formatRelativeTime } from '../lib/dateUtils';

export const NotificationsView: React.FC = () => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setActiveTab,
    setActiveRepairId,
  } = useApp();

  const [filter, setFilter] = useState<string>('ALL');

  const filtered = filter === 'ALL'
    ? notifications
    : notifications.filter((n) => n.type === filter);

  const handleNotifClick = (notif: typeof notifications[0]) => {
    markNotificationRead(notif.id);
    if (notif.caseId) {
      setActiveRepairId(notif.caseId);
      if (notif.type === 'REPAIR') {
        setActiveTab('estimates');
      } else if (notif.type === 'MESSAGE') {
        setActiveTab('chat');
      }
    } else if (notif.type === 'LEGAL') {
      setActiveTab('legal');
    } else if (notif.type === 'CONTRACT') {
      setActiveTab('documents');
    }
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'REPAIR':
        return <Wrench className="w-3.5 h-3.5 text-blue-600" />;
      case 'MESSAGE':
        return <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />;
      case 'CONTRACT':
        return <FileText className="w-3.5 h-3.5 text-amber-600" />;
      default:
        return <Scale className="w-3.5 h-3.5 text-neutral-600" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
        <div>
          <button
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-1.5 text-neutral-500 hover:text-neutral-900 font-semibold text-xs cursor-pointer mb-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>대시보드로 돌아가기</span>
          </button>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
              알림 센터
            </h2>
            <span className="font-mono text-xs text-neutral-400 font-medium">
              실시간 업데이트
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            수리 요청, 3사 견적 도착, 협의 대화 및 계약 갱신 알림
          </p>
        </div>

        <button
          onClick={markAllNotificationsRead}
          className="px-3 py-1.5 bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-semibold text-xs rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
        >
          <CheckCheck className="w-3.5 h-3.5 text-neutral-500" />
          <span>모두 읽음 처리</span>
        </button>
      </div>

      {/* Filter Tabs: Segmented Control */}
      <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg max-w-fit overflow-x-auto">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            filter === 'ALL'
              ? 'bg-white text-neutral-900 shadow-xs border border-neutral-200/50'
              : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          전체 ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('REPAIR')}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            filter === 'REPAIR'
              ? 'bg-white text-neutral-900 shadow-xs border border-neutral-200/50'
              : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          수리
        </button>
        <button
          onClick={() => setFilter('MESSAGE')}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            filter === 'MESSAGE'
              ? 'bg-white text-neutral-900 shadow-xs border border-neutral-200/50'
              : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          대화
        </button>
        <button
          onClick={() => setFilter('CONTRACT')}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            filter === 'CONTRACT'
              ? 'bg-white text-neutral-900 shadow-xs border border-neutral-200/50'
              : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          계약
        </button>
      </div>

      {/* Notification List */}
      <div className="bg-white p-5 sm:p-6 rounded-xl shadow-xs border border-neutral-200 space-y-2">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-neutral-400 text-xs font-mono">
            등록된 알림이 없습니다.
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {filtered.map((n) => (
              <div
                key={n.id}
                onClick={() => handleNotifClick(n)}
                className={`py-3 px-3 rounded-lg transition-colors cursor-pointer flex items-start gap-3.5 ${
                  n.isRead
                    ? 'hover:bg-neutral-50/70 opacity-70'
                    : 'bg-blue-50/30 hover:bg-blue-50/50'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center shrink-0 mt-0.5">
                  {getNotifIcon(n.type)}
                </div>

                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex justify-between items-baseline gap-2">
                    <div className="flex items-center gap-1.5 truncate">
                      {!n.isRead && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                      )}
                      <h4 className="text-xs font-bold text-neutral-900 truncate">
                        {n.title}
                      </h4>
                    </div>
                    <span
                      className="text-[11px] text-neutral-400 font-mono shrink-0 whitespace-nowrap"
                      title={formatActionDateTime(n.createdAt)}
                    >
                      {formatRelativeTime(n.createdAt, n.timestamp)}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    {n.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
