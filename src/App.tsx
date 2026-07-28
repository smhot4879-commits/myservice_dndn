import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { Footer } from './components/Footer';

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

  if (role === 'SELECTION' || activeTab === 'selection') {
    return <RoleSelectionView />;
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
      <main className="flex-1 md:ml-64 pt-20 pb-20 md:pb-12 px-4 sm:px-6 md:px-8 max-w-[1400px] w-full mx-auto">
        {renderView()}
      </main>
      <Footer />
      <MobileNav />
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
