import React from 'react';
import { useApp } from '../context/AppContext';
import { Search, Bell, Settings, ArrowLeftRight, UserCheck } from 'lucide-react';

export const Header: React.FC = () => {
  const { role, setRole, activeTab, setActiveTab, searchQuery, setSearchQuery, notifications } = useApp();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (activeTab === 'selection') return null;

  return (
    <header className="fixed top-0 right-0 left-0 md:left-64 bg-white/95 backdrop-blur-sm z-40 px-4 md:px-8 py-3 flex justify-between items-center border-b border-[#E5E7EB] transition-all">
      {/* Left: Mobile Title or Search Input */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <div className="md:hidden flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-[#0F172A] flex items-center justify-center text-white font-bold text-xs">
            든
          </div>
          <span className="font-bold text-[#0F172A] text-base tracking-tight">든든집사</span>
        </div>

        <div className="relative w-full hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="수리 항목, 호실, 임차인 이름 검색..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#F4F5F7] hover:bg-[#EEF0F2] focus:bg-white rounded-lg border border-[#E5E7EB] focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-xs transition-all placeholder:text-neutral-400"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Role indicator (Unboxed Zero-Pill) */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-neutral-700 bg-neutral-100 rounded-md border border-neutral-200/80">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
          <span>{role === 'LANDLORD' ? '임대인 모드' : role === 'TENANT' ? '임차인 모드' : '수리업체 모드'}</span>
        </div>

        {/* Notifications Button */}
        <button
          onClick={() => setActiveTab('notifications')}
          className="p-2 text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 rounded-lg relative transition-colors cursor-pointer"
          aria-label="알림"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white" />
          )}
        </button>

        {/* Settings Button */}
        <button
          onClick={() => {
            if (role === 'LANDLORD') setActiveTab('landlord-register');
            else setActiveTab('tenant-register');
          }}
          className="p-2 text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
          title="회원정보 및 매물 설정"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* User Profile Info */}
        <div
          onClick={() => {
            if (role === 'LANDLORD') setActiveTab('landlord-register');
            else setActiveTab('tenant-register');
          }}
          className="flex items-center gap-2.5 pl-2 border-l border-neutral-200 cursor-pointer group"
        >
          <div className="w-7 h-7 rounded-lg overflow-hidden border border-neutral-300 bg-neutral-100 text-neutral-800 flex items-center justify-center font-semibold text-xs">
            {role === 'LANDLORD' ? (
              <img
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80"
                alt="Landlord Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                alt="Tenant Profile"
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="hidden lg:flex flex-col">
            <span className="text-xs font-semibold text-neutral-900 group-hover:text-blue-600 transition-colors">
              {role === 'LANDLORD' ? '김지수 관리자' : '김지우 님'}
            </span>
            <span className="text-[10px] text-neutral-500 font-mono">
              {role === 'LANDLORD' ? '서초그랑자이 외 3건' : '그린빌 302호'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
