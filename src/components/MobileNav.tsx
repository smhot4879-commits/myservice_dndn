import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Wrench, FileText, HelpCircle, MessageSquare } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { role, activeTab, setActiveTab } = useApp();

  if (activeTab === 'selection') return null;

  return (
    <nav className="fixed bottom-0 w-full z-50 md:hidden bg-white border-t border-[#c2c6d8]/60 shadow-lg flex justify-around items-center h-16 px-2 pb-safe">
      <button
        onClick={() => setActiveTab('dashboard')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all cursor-pointer ${
          activeTab === 'dashboard'
            ? 'bg-[#066bfd] text-white font-bold'
            : 'text-[#424655] hover:bg-[#f6f3f2]'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] font-semibold mt-0.5">홈</span>
      </button>

      <button
        onClick={() => setActiveTab(role === 'LANDLORD' ? 'dashboard' : 'repair-request')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all cursor-pointer ${
          activeTab === 'repair-request'
            ? 'bg-[#066bfd] text-white font-bold'
            : 'text-[#424655] hover:bg-[#f6f3f2]'
        }`}
      >
        <Wrench className="w-5 h-5" />
        <span className="text-[10px] font-semibold mt-0.5">{role === 'LANDLORD' ? '수리현황' : '수리요청'}</span>
      </button>

      <button
        onClick={() => setActiveTab('documents')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all cursor-pointer ${
          activeTab === 'documents'
            ? 'bg-[#066bfd] text-white font-bold'
            : 'text-[#424655] hover:bg-[#f6f3f2]'
        }`}
      >
        <FileText className="w-5 h-5" />
        <span className="text-[10px] font-semibold mt-0.5">계약</span>
      </button>

      <button
        onClick={() => setActiveTab('chat')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all cursor-pointer ${
          activeTab === 'chat'
            ? 'bg-[#066bfd] text-white font-bold'
            : 'text-[#424655] hover:bg-[#f6f3f2]'
        }`}
      >
        <MessageSquare className="w-5 h-5" />
        <span className="text-[10px] font-semibold mt-0.5">대화</span>
      </button>

      <button
        onClick={() => setActiveTab('legal')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all cursor-pointer ${
          activeTab === 'legal'
            ? 'bg-[#066bfd] text-white font-bold'
            : 'text-[#424655] hover:bg-[#f6f3f2]'
        }`}
      >
        <HelpCircle className="w-5 h-5" />
        <span className="text-[10px] font-semibold mt-0.5">법률</span>
      </button>
    </nav>
  );
};
