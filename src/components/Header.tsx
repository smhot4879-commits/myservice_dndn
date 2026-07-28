import React from 'react';
import { useApp } from '../context/AppContext';
import { Search, Bell, Settings, ArrowLeftRight, UserCheck } from 'lucide-react';

export const Header: React.FC = () => {
  const { role, setRole, activeTab, setActiveTab, searchQuery, setSearchQuery, notifications } = useApp();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (activeTab === 'selection') return null;

  return (
    <header className="fixed top-0 right-0 left-0 md:left-64 bg-white/95 backdrop-blur-md z-40 px-4 md:px-8 py-3.5 flex justify-between items-center shadow-xs border-b border-[#e5e2e1]/60 transition-all">
      {/* Mobile Title or Search Input */}
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        <div className="md:hidden flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#0054cc] flex items-center justify-center text-white font-bold text-sm">
            든
          </div>
          <span className="font-bold text-[#0054cc] text-lg">든든집사</span>
        </div>

        <div className="relative w-full hidden sm:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#727787]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="검색어를 입력하세요 (수리 항목, 호실, 법률 등)..."
            className="w-full pl-10 pr-4 py-2 bg-[#f0eded]/60 focus:bg-white rounded-full border border-transparent focus:border-[#0054cc] outline-none text-sm transition-all"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Role Quick Switcher Badge */}
        <button
          onClick={() => {
            if (role === 'LANDLORD') setRole('TENANT');
            else if (role === 'TENANT') setRole('LANDLORD');
            else setRole('LANDLORD');
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold active:scale-95 transition-all shadow-2xs cursor-pointer ${
            role === 'VENDOR'
              ? 'bg-[#10B981]/15 text-[#065F46] border border-[#10B981]/30'
              : 'bg-[#dae2ff] text-[#001847] hover:bg-[#b1c5ff]'
          }`}
          title="포털 화면 전환"
        >
          <ArrowLeftRight className="w-3.5 h-3.5 text-[#0054cc]" />
          <span>
            {role === 'LANDLORD' ? '임대인 포털' : role === 'TENANT' ? '임차인 포털' : '수리업체 (로그인없음)'}
          </span>
          <span className="text-[10px] opacity-70 bg-white/60 px-1.5 py-0.5 rounded-full">전환</span>
        </button>

        {/* Notifications Button */}
        <button
          onClick={() => setActiveTab('notifications')}
          className="p-2 text-[#424655] hover:text-[#0054cc] hover:bg-[#f0eded] rounded-full relative transition-colors cursor-pointer"
          aria-label="알림"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#EF4444] rounded-full ring-2 ring-white animate-pulse" />
          )}
        </button>

        {/* Settings Button */}
        <button
          onClick={() => {
            if (role === 'LANDLORD') setActiveTab('landlord-register');
            else setActiveTab('tenant-register');
          }}
          className="p-2 text-[#424655] hover:text-[#0054cc] hover:bg-[#f0eded] rounded-full transition-colors cursor-pointer"
          title="회원정보 및 매물 설정"
        >
          <Settings className="w-5 h-5" />
        </button>

        {/* User Profile Info */}
        <div
          onClick={() => {
            if (role === 'LANDLORD') setActiveTab('landlord-register');
            else setActiveTab('tenant-register');
          }}
          className="flex items-center gap-2.5 pl-2 border-l border-[#c2c6d8]/40 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-full ring-2 ring-[#0054cc]/20 overflow-hidden bg-gradient-to-tr from-[#0054cc] to-[#066bfd] text-white flex items-center justify-center font-semibold text-xs">
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
            <span className="text-xs font-bold text-[#1b1c1c] group-hover:text-[#0054cc] transition-colors">
              {role === 'LANDLORD' ? '김지수 관리자' : '김지우 님'}
            </span>
            <span className="text-[10px] text-[#727787]">
              {role === 'LANDLORD' ? '서초그랑자이 외 3건' : '그린빌 302호'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
