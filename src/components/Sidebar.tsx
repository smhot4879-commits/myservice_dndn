import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  MessageSquare,
  Wrench,
  FileText,
  HelpCircle,
  Bell,
  Plus,
  Building,
  User,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { role, setRole, activeTab, setActiveTab, notifications, resetAllData, logout } = useApp();

  if (activeTab === 'selection') return null;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const navItems = [
    { id: 'dashboard', label: '대시보드', icon: LayoutDashboard },
    { id: 'chat', label: '대화', icon: MessageSquare },
    { id: 'repair-list', label: '수리 요청 내역', icon: Wrench },
    { id: 'documents', label: '계약서 및 서류', icon: FileText },
    { id: 'legal', label: '법률 가이드', icon: HelpCircle },
    { id: 'notifications', label: '알림', icon: Bell, badge: unreadCount > 0 ? unreadCount : undefined },
  ];

  const handleNavClick = (id: string) => {
    if (id === 'repair-list') {
      setActiveTab('dashboard');
    } else {
      setActiveTab(id);
    }
  };

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 hidden md:flex flex-col bg-white border-r border-[#E5E7EB] z-50 p-4">
      {/* Brand Header */}
      <div className="mb-6 px-2 flex justify-between items-center">
        <div onClick={() => setActiveTab('dashboard')} className="cursor-pointer group flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#0F172A] flex items-center justify-center text-white font-bold text-xs tracking-tight">
            든
          </div>
          <div>
            <h1 className="font-bold text-base text-neutral-900 tracking-tight leading-none group-hover:text-blue-600 transition-colors">
              든든집사
            </h1>
            <p className="text-[11px] text-neutral-400 font-medium mt-1">
              {role === 'LANDLORD' ? '임대인 파트너' : '임차인 홈'}
            </p>
          </div>
        </div>

        <button
          onClick={() => logout()}
          className="text-[11px] text-neutral-400 hover:text-red-600 font-medium transition-colors cursor-pointer"
          title="로그아웃"
        >
          로그아웃
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            activeTab === item.id || (item.id === 'repair-list' && activeTab === 'repair-request');

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-neutral-100 text-neutral-950 font-semibold'
                  : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-neutral-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className="font-mono text-[10px] text-white bg-blue-600 font-semibold px-1.5 py-0.2 rounded">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom CTA Button */}
      <div className="mt-auto pt-4 border-t border-[#E5E7EB] space-y-3">
        {role === 'TENANT' ? (
          <button
            onClick={() => setActiveTab('repair-request')}
            className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white py-2.5 rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs active:scale-[0.98] transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>수리 요청하기</span>
          </button>
        ) : (
          <button
            onClick={() => setActiveTab('dashboard')}
            className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white py-2.5 rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs active:scale-[0.98] transition-all cursor-pointer"
          >
            <Building className="w-4 h-4" />
            <span>매물 및 수리 현황</span>
          </button>
        )}

        {/* User Mini Profile Card */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-[#FAFAFA] border border-[#E5E7EB]">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-7 h-7 rounded-md overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0">
              <img
                src={
                  role === 'LANDLORD'
                    ? 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80'
                    : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
                }
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-neutral-900 truncate leading-tight">
                {role === 'LANDLORD' ? '김지수 관리자' : '김지우 님'}
              </p>
              <p className="text-[10px] text-neutral-400 font-mono truncate">
                {role === 'LANDLORD' ? '서초그랑자이 외 3건' : '그린빌 302호'}
              </p>
            </div>
          </div>

          <button
            onClick={() => resetAllData()}
            className="p-1 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
            title="데이터 초기화"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
