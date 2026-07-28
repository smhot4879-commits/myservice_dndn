import React from 'react';
import { useApp } from '../context/AppContext';
import { Building2, Home, ArrowRight, ShieldCheck, Scale, Zap, Lock } from 'lucide-react';

export const RoleSelectionView: React.FC = () => {
  const { setRole } = useApp();

  return (
    <div className="bg-[#fcf9f8] min-h-screen flex flex-col justify-between">
      {/* Top Header Logo */}
      <header className="w-full pt-6 pb-4 sm:pt-10 sm:pb-6 px-4 flex justify-center items-center shrink-0">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#0054cc] rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-md shadow-[#0054cc]/20">
            <Building2 className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <h1 className="font-extrabold text-2xl sm:text-3xl text-[#0054cc] tracking-tight">든든집사</h1>
        </div>
      </header>

      {/* Main Selection Area */}
      <main className="flex-grow flex flex-col items-center justify-center px-3 sm:px-6 max-w-[1000px] mx-auto w-full pb-8 sm:pb-12">
        <div className="text-center space-y-1.5 sm:space-y-3 mb-5 sm:mb-10 max-w-[680px]">
          <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-[#1b1c1c] tracking-tight">
            시작하기 전에 역할을 선택해주세요
          </h2>
          <p className="text-[#424655] text-xs sm:text-base md:text-lg leading-relaxed opacity-90">
            든든집사는 임대인과 임차인 모두에게 투명하고 효율적인 관리 환경을 제공합니다.
          </p>
        </div>

        {/* 2 Main Role Cards - 2 Columns on Mobile for Simultaneous View */}
        <div className="grid grid-cols-2 gap-3 sm:gap-6 md:gap-8 w-full">
          {/* Landlord Card */}
          <button
            onClick={() => setRole('LANDLORD', 'auth')}
            className="group relative flex flex-col justify-between p-4 sm:p-8 bg-white border border-[#c2c6d8]/40 rounded-2xl sm:rounded-3xl card-shadow card-hover transition-all duration-300 text-left cursor-pointer hover:border-[#0054cc]/40"
          >
            <div>
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-[#0054cc]/10 flex items-center justify-center text-[#0054cc] transition-all duration-300 group-hover:bg-[#0054cc] group-hover:text-white group-hover:scale-105">
                  <Building2 className="w-5 h-5 sm:w-8 sm:h-8" />
                </div>
                <span className="text-[10px] sm:text-xs font-extrabold text-[#0054cc] bg-[#0054cc]/10 px-2 py-1 sm:px-3.5 sm:py-1.5 rounded-full">
                  임대인 / 관리자
                </span>
              </div>

              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <h3 className="text-base sm:text-2xl font-bold text-[#1b1c1c]">임대인입니다</h3>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#727787] group-hover:text-[#0054cc] group-hover:translate-x-1 transition-all" />
              </div>

              <p className="text-[11px] sm:text-sm text-[#424655] leading-snug sm:leading-relaxed mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-none">
                보유 건물을 효율적으로 관리하고, 수리 요청 응대 및 임대 계약 현황을 확인하세요.
              </p>
            </div>

            <div className="text-[10px] sm:text-xs font-bold text-[#0054cc] bg-[#0054cc]/5 py-1.5 px-2 sm:py-2.5 sm:px-3 rounded-lg sm:rounded-xl border border-[#0054cc]/20 flex items-center justify-center sm:justify-start gap-1 sm:gap-1.5 mt-auto">
              <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span className="truncate">로그인 / 회원가입</span>
            </div>
          </button>

          {/* Tenant Card */}
          <button
            onClick={() => setRole('TENANT', 'auth')}
            className="group relative flex flex-col justify-between p-4 sm:p-8 bg-white border border-[#c2c6d8]/40 rounded-2xl sm:rounded-3xl card-shadow card-hover transition-all duration-300 text-left cursor-pointer hover:border-[#636100]/40"
          >
            <div>
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-[#636100]/10 flex items-center justify-center text-[#636100] transition-all duration-300 group-hover:bg-[#636100] group-hover:text-white group-hover:scale-105">
                  <Home className="w-5 h-5 sm:w-8 sm:h-8" />
                </div>
                <span className="text-[10px] sm:text-xs font-extrabold text-[#636100] bg-[#e9e600]/30 px-2 py-1 sm:px-3.5 sm:py-1.5 rounded-full">
                  임차인 / 거주자
                </span>
              </div>

              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <h3 className="text-base sm:text-2xl font-bold text-[#1b1c1c]">임차인입니다</h3>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#727787] group-hover:text-[#636100] group-hover:translate-x-1 transition-all" />
              </div>

              <p className="text-[11px] sm:text-sm text-[#424655] leading-snug sm:leading-relaxed mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-none">
                수리 요청을 간편하게 접수하고 진행 상태를 확인하며, 계약 정보를 조회하세요.
              </p>
            </div>

            <div className="text-[10px] sm:text-xs font-bold text-[#636100] bg-[#e9e600]/20 py-1.5 px-2 sm:py-2.5 sm:px-3 rounded-lg sm:rounded-xl border border-[#636100]/20 flex items-center justify-center sm:justify-start gap-1 sm:gap-1.5 mt-auto">
              <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span className="truncate">로그인 / 회원가입</span>
            </div>
          </button>
        </div>

        {/* Feature Bento Sub-cards */}
        <div className="mt-8 sm:mt-12 w-full grid grid-cols-3 gap-2 sm:gap-6">
          <div className="p-3 sm:p-6 bg-[#f6f3f2] border border-[#c2c6d8]/30 rounded-xl sm:rounded-2xl flex flex-col items-center text-center gap-1.5 sm:gap-3">
            <div className="bg-[#066bfd]/15 p-2 sm:p-3 rounded-lg sm:rounded-xl text-[#0054cc]">
              <ShieldCheck className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h4 className="text-[11px] sm:text-sm font-bold text-[#1b1c1c] mb-0.5 sm:mb-1">투명한 프로세스</h4>
              <p className="text-[10px] sm:text-xs text-[#424655] leading-snug hidden sm:block">
                모든 요청과 승인 과정이 실시간으로 안전하게 기록됩니다.
              </p>
            </div>
          </div>

          <div className="p-3 sm:p-6 bg-[#f6f3f2] border border-[#c2c6d8]/30 rounded-xl sm:rounded-2xl flex flex-col items-center text-center gap-1.5 sm:gap-3">
            <div className="bg-[#7a24df]/15 p-2 sm:p-3 rounded-lg sm:rounded-xl text-[#7a24df]">
              <Scale className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h4 className="text-[11px] sm:text-sm font-bold text-[#1b1c1c] mb-0.5 sm:mb-1">법률 가이드 제공</h4>
              <p className="text-[10px] sm:text-xs text-[#424655] leading-snug hidden sm:block">
                임대차 보호법 등 놓치기 쉬운 필수 법률 정보를 제공합니다.
              </p>
            </div>
          </div>

          <div className="p-3 sm:p-6 bg-[#f6f3f2] border border-[#c2c6d8]/30 rounded-xl sm:rounded-2xl flex flex-col items-center text-center gap-1.5 sm:gap-3">
            <div className="bg-[#10B981]/15 p-2 sm:p-3 rounded-lg sm:rounded-xl text-[#10B981]">
              <Zap className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h4 className="text-[11px] sm:text-sm font-bold text-[#1b1c1c] mb-0.5 sm:mb-1">빠른 소통</h4>
              <p className="text-[10px] sm:text-xs text-[#424655] leading-snug hidden sm:block">
                불필요한 전화 없이 앱 내에서 모든 이슈를 해결하세요.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 border-t border-[#c2c6d8]/30 bg-white text-center text-[10px] sm:text-xs text-[#424655] shrink-0">
        © 2026 든든집사 Management Inc.
      </footer>
    </div>
  );
};

