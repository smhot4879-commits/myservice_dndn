import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, CheckCheck, Wrench, MessageSquare, FileText, Scale, ArrowLeft, Trash2 } from 'lucide-react';

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

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#c2c6d8]/40 pb-4">
        <div>
          <button
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-1.5 text-[#424655] hover:text-[#0054cc] font-bold text-sm cursor-pointer mb-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>대시보드로 돌아가기</span>
          </button>
          <h2 className="text-2xl font-extrabold text-[#1b1c1c] flex items-center gap-2">
            <Bell className="w-6 h-6 text-[#0054cc]" />
            <span>알림 센터</span>
          </h2>
        </div>

        <button
          onClick={markAllNotificationsRead}
          className="px-4 py-2.5 bg-[#f0eded] hover:bg-[#e5e2e1] text-[#1b1c1c] font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
        >
          <CheckCheck className="w-4 h-4 text-[#0054cc]" />
          <span>모두 읽음으로 표시</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-[#c2c6d8]/30 pb-2 overflow-x-auto">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === 'ALL' ? 'bg-[#0054cc] text-white' : 'bg-[#f0eded] text-[#424655]'
          }`}
        >
          전체 ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('REPAIR')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === 'REPAIR' ? 'bg-[#0054cc] text-white' : 'bg-[#f0eded] text-[#424655]'
          }`}
        >
          수리 건
        </button>
        <button
          onClick={() => setFilter('MESSAGE')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === 'MESSAGE' ? 'bg-[#0054cc] text-white' : 'bg-[#f0eded] text-[#424655]'
          }`}
        >
          대화
        </button>
        <button
          onClick={() => setFilter('CONTRACT')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === 'CONTRACT' ? 'bg-[#0054cc] text-white' : 'bg-[#f0eded] text-[#424655]'
          }`}
        >
          계약 알림
        </button>
      </div>

      {/* Notification List */}
      <div className="bg-white p-6 rounded-3xl shadow-xs border border-[#c2c6d8]/40 space-y-3">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-[#727787] text-sm">
            등록된 알림이 없습니다.
          </div>
        ) : (
          filtered.map((n) => (
            <div
              key={n.id}
              onClick={() => handleNotifClick(n)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                n.isRead
                  ? 'bg-white border-[#c2c6d8]/30 opacity-75'
                  : 'bg-[#dae2ff]/20 border-[#0054cc] shadow-2xs font-semibold'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  n.type === 'REPAIR'
                    ? 'bg-[#0054cc]/15 text-[#0054cc]'
                    : n.type === 'MESSAGE'
                    ? 'bg-[#10B981]/15 text-[#10B981]'
                    : n.type === 'CONTRACT'
                    ? 'bg-[#F59E0B]/15 text-[#F59E0B]'
                    : 'bg-[#7a24df]/15 text-[#7a24df]'
                }`}
              >
                {n.type === 'REPAIR' ? (
                  <Wrench className="w-5 h-5" />
                ) : n.type === 'MESSAGE' ? (
                  <MessageSquare className="w-5 h-5" />
                ) : n.type === 'CONTRACT' ? (
                  <FileText className="w-5 h-5" />
                ) : (
                  <Scale className="w-5 h-5" />
                )}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-[#1b1c1c]">{n.title}</h4>
                  <span className="text-[10px] text-[#727787]">{n.timestamp}</span>
                </div>
                <p className="text-xs text-[#424655] leading-relaxed">{n.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
