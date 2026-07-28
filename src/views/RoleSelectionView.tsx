import React from 'react';
import { useApp } from '../context/AppContext';
import { Building2, Home, ArrowRight, ShieldCheck, Scale, Zap } from 'lucide-react';

export const RoleSelectionView: React.FC = () => {
  const { setRole } = useApp();

  return (
    <div className="bg-[#fcf9f8] min-h-screen flex flex-col justify-between">
      {/* Top Header Logo */}
      <header className="w-full pt-12 pb-8 px-4 flex justify-center items-center">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#0054cc] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#0054cc]/20">
            <Building2 className="w-7 h-7" />
          </div>
          <h1 className="font-bold text-3xl text-[#0054cc] tracking-tight">든든집사</h1>
        </div>
      </header>

      {/* Main Selection Area */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 max-w-[1000px] mx-auto w-full pb-16">
        <div className="text-center space-y-3 mb-12 max-w-[680px]">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1b1c1c] tracking-tight">
            시작하기 전에 역할을 선택해주세요
          </h2>
          <p className="text-[#424655] text-base md:text-lg leading-relaxed opacity-90">
            든든집사는 임대인과 임차인 모두에게 투명하고 효율적인 관리 환경을 제공합니다.
            해당되는 역할을 선택하여 맞춤형 대시보드로 이동하세요.
          </p>
        </div>

        {/* 2 Main Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {/* Landlord Card */}
          <button
            onClick={() => setRole('LANDLORD')}
            className="group relative flex flex-col items-center p-8 sm:p-10 bg-white border border-[#c2c6d8]/40 rounded-3xl card-shadow card-hover transition-all duration-300 text-left cursor-pointer"
          >
            <div className="w-20 h-20 mb-6 rounded-2xl bg-[#0054cc]/10 flex items-center justify-center text-[#0054cc] transition-all duration-300 group-hover:bg-[#0054cc] group-hover:text-white group-hover:scale-105">
              <Building2 className="w-10 h-10" />
            </div>

            <div className="w-full">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#0054cc] bg-[#0054cc]/10 px-3.5 py-1.5 rounded-full">
                  임대인 / 관리자
                </span>
                <ArrowRight className="w-5 h-5 text-[#727787] group-hover:text-[#0054cc] group-hover:translate-x-1 transition-all" />
              </div>

              <h3 className="text-2xl font-bold text-[#1b1c1c] mb-2">임대인입니다</h3>
              <p className="text-sm text-[#424655] leading-relaxed">
                보유 건물을 효율적으로 관리하고, 수리 요청 응대 및 임대 계약 현황을 한눈에 파악하세요.
              </p>
            </div>
          </button>

          {/* Tenant Card */}
          <button
            onClick={() => setRole('TENANT')}
            className="group relative flex flex-col items-center p-8 sm:p-10 bg-white border border-[#c2c6d8]/40 rounded-3xl card-shadow card-hover transition-all duration-300 text-left cursor-pointer"
          >
            <div className="w-20 h-20 mb-6 rounded-2xl bg-[#636100]/10 flex items-center justify-center text-[#636100] transition-all duration-300 group-hover:bg-[#636100] group-hover:text-white group-hover:scale-105">
              <Home className="w-10 h-10" />
            </div>

            <div className="w-full">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#636100] bg-[#e9e600]/30 px-3.5 py-1.5 rounded-full">
                  임차인 / 거주자
                </span>
                <ArrowRight className="w-5 h-5 text-[#727787] group-hover:text-[#636100] group-hover:translate-x-1 transition-all" />
              </div>

              <h3 className="text-2xl font-bold text-[#1b1c1c] mb-2">임차인입니다</h3>
              <p className="text-sm text-[#424655] leading-relaxed">
                수리 요청을 간편하게 접수하고 진행 상태를 확인하며, 계약 정보와 법률 가이드를 손쉽게 조회하세요.
              </p>
            </div>
          </button>
        </div>

        {/* Feature Bento Sub-cards */}
        <div className="mt-16 w-full grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-[#f6f3f2] border border-[#c2c6d8]/30 rounded-2xl flex flex-col items-center text-center gap-3">
            <div className="bg-[#066bfd]/15 p-3 rounded-xl text-[#0054cc]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#1b1c1c] mb-1">투명한 프로세스</h4>
              <p className="text-xs text-[#424655] leading-snug">
                모든 요청과 승인 과정이 실시간으로 안전하게 기록됩니다.
              </p>
            </div>
          </div>

          <div className="p-6 bg-[#f6f3f2] border border-[#c2c6d8]/30 rounded-2xl flex flex-col items-center text-center gap-3">
            <div className="bg-[#7a24df]/15 p-3 rounded-xl text-[#7a24df]">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#1b1c1c] mb-1">법률 가이드 제공</h4>
              <p className="text-xs text-[#424655] leading-snug">
                임대차 보호법 등 놓치기 쉬운 필수 법률 정보를 제공합니다.
              </p>
            </div>
          </div>

          <div className="p-6 bg-[#f6f3f2] border border-[#c2c6d8]/30 rounded-2xl flex flex-col items-center text-center gap-3">
            <div className="bg-[#10B981]/15 p-3 rounded-xl text-[#10B981]">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#1b1c1c] mb-1">빠른 소통</h4>
              <p className="text-xs text-[#424655] leading-snug">
                불필요한 전화 없이 앱 내에서 모든 이슈를 해결하세요.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 border-t border-[#c2c6d8]/30 bg-white text-center text-xs text-[#424655]">
        © 2026 든든집사 Management Inc.
      </footer>
    </div>
  );
};
