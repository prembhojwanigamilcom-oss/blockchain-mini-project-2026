import React, { useState } from 'react';
import { Web3Provider } from './context/Web3Context';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './pages/LandingPage';
import { VerificationPortal } from './pages/VerificationPortal';
import { IssueMarksheet } from './pages/admin/IssueMarksheet';
import { CertificateRecords } from './pages/admin/CertificateRecords';
import { AdminDashboard } from './pages/admin/AdminDashboard';

export const AppContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'verify' | 'issue' | 'records' | 'dashboard' | 'landing'>('verify');

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F0E8] text-[#182C2A] font-sans selection:bg-[#9C815D] selection:text-[#FAF9F5]">
      {/* Institutional Top Navbar */}
      <Navbar
        currentTab={currentTab === 'landing' ? 'verify' : currentTab}
        setCurrentTab={(tab) => setCurrentTab(tab)}
      />

      {/* Main View Area */}
      <main className="flex-grow">
        {currentTab === 'landing' && (
          <LandingPage
            onStartVerify={() => setCurrentTab('verify')}
            onGoToDashboard={() => setCurrentTab('dashboard')}
          />
        )}

        {currentTab === 'verify' && <VerificationPortal />}

        {currentTab === 'issue' && (
          <IssueMarksheet onSuccessRedirect={() => setCurrentTab('records')} />
        )}

        {currentTab === 'records' && <CertificateRecords />}

        {currentTab === 'dashboard' && (
          <AdminDashboard onNavigate={(tab) => setCurrentTab(tab)} />
        )}
      </main>

      {/* Editorial Footer */}
      <Footer />
    </div>
  );
};

export function App() {
  return (
    <Web3Provider>
      <AppContent />
    </Web3Provider>
  );
}

export default App;
