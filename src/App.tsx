import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { Footer } from './components/Footer';
import { DesignConceptsModal } from './components/DesignConceptsModal';
import { Sparkles } from 'lucide-react';

import { RoleSelectionView } from './views/RoleSelectionView';
import { LandlordDashboardView } from './views/LandlordDashboardView';
import { TenantDashboardView } from './views/TenantDashboardView';
import { RepairRequestView } from './views/RepairRequestView';
import { EstimateComparisonView } from './views/EstimateComparisonView';
import { ChatView } from './views/ChatView';
import { CompletionReportView } from './views/CompletionReportView';
import { LegalGuideView } from './views/LegalGuideView';
import { DocumentsView } from './views/DocumentsView';
import { NotificationsView } from './views/NotificationsView';
import { TenantRegisterView } from './views/TenantRegisterView';
import { LandlordRegisterView } from './views/LandlordRegisterView';
import { AuthView } from './views/AuthView';

const MainContent: React.FC = () => {
  const { role, activeTab } = useApp();
  const [showDesignModal, setShowDesignModal] = useState<boolean>(true);

  if (role === 'SELECTION' || activeTab === 'selection') {
    return (
      <>
        <RoleSelectionView />
        <DesignConceptsModal
          isOpen={showDesignModal}
          onClose={() => setShowDesignModal(false)}
        />
        {/* Floating trigger button */}
        <button
          onClick={() => setShowDesignModal(true)}
          className="fixed bottom-6 right-6 z-50 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-xl border border-neutral-700 flex items-center gap-2 transition-all cursor-pointer hover:scale-105 active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>디자인 시안 3종 비교보기</span>
        </button>
      </>
    );
  }

  if (activeTab === 'auth') {
    return <AuthView />;
  }

  const renderView = () => {
    switch (activeTab) {
      case 'dashboard':
        return role === 'LANDLORD' ? <LandlordDashboardView /> : <TenantDashboardView />;
      case 'repair-request':
        return <RepairRequestView />;
      case 'estimates':
        return <EstimateComparisonView />;
      case 'chat':
        return <ChatView />;
      case 'completion':
        return <CompletionReportView />;
      case 'legal':
        return <LegalGuideView />;
      case 'documents':
        return <DocumentsView />;
      case 'notifications':
        return <NotificationsView />;
      case 'tenant-register':
        return <TenantRegisterView />;
      case 'landlord-register':
        return <LandlordRegisterView />;
      default:
        return role === 'LANDLORD' ? <LandlordDashboardView /> : <TenantDashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#EFF2F8] text-[#1b1c1c] flex flex-col font-sans antialiased">
      <Sidebar />
      <Header />
      <main className="flex-1 md:ml-64 pt-20 sm:pt-24 pb-20 md:pb-12 px-3.5 sm:px-6 md:px-8 max-w-[1400px] w-full mx-auto overflow-x-hidden">
        {renderView()}
      </main>
      <Footer />
      <MobileNav />

      {/* Floating Design Concepts Trigger */}
      <button
        onClick={() => setShowDesignModal(true)}
        className="fixed bottom-6 right-6 z-50 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-xl border border-neutral-700 flex items-center gap-2 transition-all cursor-pointer hover:scale-105 active:scale-95"
        title="디자인 시안 3종 비교 뷰어 열기"
      >
        <Sparkles className="w-4 h-4 text-blue-400" />
        <span className="hidden sm:inline">탈(脫) AI 디자인 시안 3종 비교</span>
        <span className="sm:hidden">시안 비교</span>
      </button>

      {/* Design Concepts Modal */}
      <DesignConceptsModal
        isOpen={showDesignModal}
        onClose={() => setShowDesignModal(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;
