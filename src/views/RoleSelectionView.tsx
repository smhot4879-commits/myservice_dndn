import React from 'react';
import { useApp } from '../context/AppContext';
import { Building2, Home, ArrowRight, ShieldCheck, Scale, Zap, Lock } from 'lucide-react';

export const RoleSelectionView: React.FC = () => {
  const { setRole } = useApp();

  return (
    <div className="bg-[#F8F9FA] min-h-screen flex flex-col justify-between">
      {/* Top Header */}
      <header className="w-full pt-8 pb-4 sm:pt-12 sm:pb-6 px-4 flex justify-center items-center shrink-0 border-b border-[#E5E7EB] bg-white">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#0F172A] rounded-lg flex items-center justify-center text-white font-bold text-sm tracking-tight">
            든
          </div>
          <h1 className="font-bold text-xl text-neutral-900 tracking-tight">든든집사</h1>
        </div>
      </header>

      {/* Main Selection Area */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 max-w-4xl mx-auto w-full py-10 sm:py-16">
        <div className="text-center space-y-2 mb-8 sm:mb-12 max-w-lg">
          <span className="text-xs font-semibold text-blue-600 tracking-wider">
            DEUNDEN PROPTECH OS
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900 tracking-tight">
            시작할 역할을 선택해주세요
          </h2>
          <p className="text-neutral-500 text-xs sm:text-sm leading-relaxed">
            임대인과 임차인 모두에게 투명한 수리 이력과 안전한 보증금 정산 환경을 제공합니다.
          </p>
        </div>

        {/* 2 Main Role Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full">
          {/* Landlord Card */}
          <button
            onClick={() => setRole('LANDLORD', 'auth')}
            className="group flex flex-col justify-between p-6 sm:p-8 bg-white border border-[#E5E7EB] hover:border-neutral-400 rounded-xl transition-all text-left cursor-pointer shadow-xs hover:shadow-md"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-800 transition-colors group-hover:bg-[#0F172A] group-hover:text-white">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono font-medium text-neutral-500">
                  LANDLORD
                </span>
              </div>

              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">
                  임대인입니다
                </h3>
                <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>

              <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed mb-6">
                보유 건물을 등록하고, 임차인의 수리 요청 접수 및 비교 견적 승인을 신속히 처리하세요.
              </p>
            </div>

            <div className="text-xs font-semibold text-neutral-800 bg-neutral-50 hover:bg-neutral-100 py-2.5 px-3 rounded-lg border border-[#E5E7EB] flex items-center justify-center gap-1.5 mt-auto">
              <Lock className="w-3.5 h-3.5 text-neutral-500" />
              <span>임대인 관리자 접속</span>
            </div>
          </button>

          {/* Tenant Card */}
          <button
            onClick={() => setRole('TENANT', 'auth')}
            className="group flex flex-col justify-between p-6 sm:p-8 bg-white border border-[#E5E7EB] hover:border-neutral-400 rounded-xl transition-all text-left cursor-pointer shadow-xs hover:shadow-md"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-800 transition-colors group-hover:bg-[#0F172A] group-hover:text-white">
                  <Home className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono font-medium text-neutral-500">
                  TENANT
                </span>
              </div>

              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">
                  임차인입니다
                </h3>
                <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>

              <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed mb-6">
                사진 한 장으로 간편하게 수리를 요청하고, 실시간 진행 상태와 계약 서류를 보관하세요.
              </p>
            </div>

            <div className="text-xs font-semibold text-neutral-800 bg-neutral-50 hover:bg-neutral-100 py-2.5 px-3 rounded-lg border border-[#E5E7EB] flex items-center justify-center gap-1.5 mt-auto">
              <Lock className="w-3.5 h-3.5 text-neutral-500" />
              <span>임차인 홈 접속</span>
            </div>
          </button>
        </div>

        {/* Feature Bento Sub-cards: Clean 1px Hairline */}
        <div className="mt-8 sm:mt-12 w-full grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="p-4 bg-white border border-[#E5E7EB] rounded-xl flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-neutral-900 mb-0.5">원상복구 사전 점검</h4>
              <p className="text-[11px] text-neutral-500 leading-relaxed">
                입주 전 하자 기록으로 퇴실 시 보증금 분쟁을 원천 차단합니다.
              </p>
            </div>
          </div>

          <div className="p-4 bg-white border border-[#E5E7EB] rounded-xl flex items-start gap-3">
            <Scale className="w-5 h-5 text-neutral-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-neutral-900 mb-0.5">판례 기반 법률 가이드</h4>
              <p className="text-[11px] text-neutral-500 leading-relaxed">
                임대차보호법과 법원 판례 기준의 수리비 부담 주체를 안내합니다.
              </p>
            </div>
          </div>

          <div className="p-4 bg-white border border-[#E5E7EB] rounded-xl flex items-start gap-3">
            <Zap className="w-5 h-5 text-neutral-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-neutral-900 mb-0.5">3자 투명 협의</h4>
              <p className="text-[11px] text-neutral-500 leading-relaxed">
                임대인-임차인-수리업체 3자 채널로 일정과 견적을 투명하게 조율합니다.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 border-t border-[#E5E7EB] bg-white text-center text-xs text-neutral-400 shrink-0">
        © 2026 든든집사 (Deunden). All rights reserved.
      </footer>
    </div>
  );
};

