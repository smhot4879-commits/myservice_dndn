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
  const { role, setRole, activeTab, setActiveTab, notifications, resetAllData } = useApp();

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
    <aside className="h-screen w-64 fixed left-0 top-0 hidden md:flex flex-col bg-white shadow-sm border-r border-[#e5e2e1]/60 z-50 p-4">
      {/* Brand Header */}
      <div className="mb-6 px-2 flex justify-between items-start">
        <div onClick={() => setActiveTab('dashboard')} className="cursor-pointer">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#0054cc] flex items-center justify-center text-white font-black text-base shadow-sm">
              든
            </div>
            <h1 className="font-bold text-xl text-[#0054cc] tracking-tight">든든집사</h1>
          </div>
          <p className="text-xs text-[#727787] font-medium mt-1">
            {role === 'LANDLORD' ? '임대인 포털 (Landlord)' : '임차인 포털 (Tenant)'}
          </p>
        </div>

        <button
          onClick={() => setRole('SELECTION')}
          className="text-[11px] text-[#0054cc] hover:underline font-semibold flex items-center gap-1 mt-1 cursor-pointer"
          title="역할 선택 화면으로 이동"
        >
          역할 선택
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
              className={`w-full flex items-center justify-between p-3 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                isActive
                  ? 'text-[#0054cc] font-bold border-r-4 border-[#0054cc] bg-[#0054cc]/10 shadow-2xs'
                  : 'text-[#424655] hover:bg-[#f0eded] hover:text-[#0054cc]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#0054cc]' : 'text-[#727787]'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className="bg-[#EF4444] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom CTA Button */}
      <div className="mt-auto pt-4 border-t border-[#e5e2e1]/80 space-y-3">
        {role === 'TENANT' ? (
          <button
            onClick={() => setActiveTab('repair-request')}
            className="w-full bg-[#0054cc] hover:bg-[#066bfd] text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span>수리 요청하기</span>
          </button>
        ) : (
          <button
            onClick={() => setActiveTab('dashboard')}
            className="w-full bg-[#0054cc] hover:bg-[#066bfd] text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer"
          >
            <Building className="w-5 h-5" />
            <span>매물 및 수리 현황</span>
          </button>
        )}

        {/* User Mini Profile Card */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#EFF2F8] border border-[#c2c6d8]/30">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-white border border-[#c2c6d8] flex-shrink-0">
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
              <p className="text-xs font-bold text-[#1b1c1c] truncate">
                {role === 'LANDLORD' ? '김지수 관리자' : '김지우 님'}
              </p>
              <p className="text-[11px] text-[#727787] truncate">
                {role === 'LANDLORD' ? '보유 3개 매물' : '그린빌 302호'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              resetAllData();
            }}
            className="p-1.5 text-[#727787] hover:text-[#0054cc] transition-colors"
            title="데이터 초기화"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
