import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Wrench,
  MessageSquare,
  FileText,
  HelpCircle,
  Bell,
  ChevronRight,
  Plus,
  Home,
  CheckCircle2,
  Receipt,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const TenantDashboardView: React.FC = () => {
  const { setActiveTab, setActiveRepairId, repairCases, notifications } = useApp();

  const tenantCases = repairCases.filter((c) => c.tenantName.includes('지우') || c.unit.includes('302'));
  const activeCase = tenantCases.find((c) => c.status !== 'COMPLETED') || tenantCases[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome & High Priority Call to Action Header */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1b1c1c] tracking-tight">
            안녕하세요, 김지우 님! 👋
          </h2>
          <p className="text-sm sm:text-base text-[#424655] mt-1">
            서울특별시 강남구 테헤란로 123 <span className="font-bold text-[#0054cc]">그린빌 302호</span> 거주 중
          </p>
        </div>

        <button
          onClick={() => setActiveTab('repair-request')}
          className="bg-[#0054cc] hover:bg-[#066bfd] text-white px-6 py-3.5 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-[#0054cc]/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>임대인에게 수리 요청하기</span>
        </button>
      </section>

      {/* Main Repair Call To Action Card if repair needed */}
      <div className="bg-gradient-to-r from-[#0054cc] to-[#066bfd] text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10 text-center md:text-left">
          <span className="bg-white/20 text-white font-bold text-xs px-3 py-1 rounded-full border border-white/30">
            빠르고 투명한 수리 접수
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold">집 안 시설이 고장났거나 누수가 있나요?</h3>
          <p className="text-sm text-white/80 max-w-lg">
            양식에 맞춰 사진과 함께 접수하시면 임대인에게 실시간 전달되며, 3자 채팅을 통해 업체의 비교 견적을 손쉽게 확인하실 수 있습니다.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('repair-request')}
          className="bg-white text-[#0054cc] hover:bg-opacity-90 font-extrabold px-6 py-4 rounded-2xl text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer z-10 whitespace-nowrap"
        >
          <Wrench className="w-5 h-5" />
          <span>수리 요청서 작성하기</span>
        </button>
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
      </div>

      {/* Active Repair Request Progress Section */}
      {activeCase && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xs border border-[#c2c6d8]/30">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-[#1b1c1c] flex items-center gap-2">
              <Wrench className="w-5 h-5 text-[#0054cc]" />
              <span>현재 진행 중인 수리 요청</span>
            </h3>
            <span className="text-xs font-bold text-[#0054cc] bg-[#0054cc]/10 px-3 py-1 rounded-full">
              ID: #{activeCase.id}
            </span>
          </div>

          <div className="bg-[#fcf9f8] rounded-2xl p-6 border border-[#c2c6d8]/40 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-extrabold text-lg text-[#1b1c1c]">{activeCase.title}</h4>
                <p className="text-xs text-[#424655] mt-1">{activeCase.symptom}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setActiveRepairId(activeCase.id);
                    setActiveTab('estimates');
                  }}
                  className="bg-[#0054cc] text-white font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-[#066bfd] transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Receipt className="w-4 h-4" />
                  <span>비교 견적서 ({activeCase.estimates.length}건)</span>
                </button>
                <button
                  onClick={() => {
                    setActiveRepairId(activeCase.id);
                    setActiveTab('chat');
                  }}
                  className="bg-white text-[#0054cc] border border-[#0054cc] font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-[#0054cc]/5 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>임대인 대화</span>
                </button>
              </div>
            </div>

            {/* Step Stepper */}
            <div className="relative flex justify-between items-center px-2 py-3 border-t border-[#c2c6d8]/30 pt-6">
              <div className="absolute top-8 left-4 right-4 h-0.5 bg-[#c2c6d8]/40 -z-0" />
              <div className="absolute top-8 left-4 w-3/5 h-0.5 bg-[#0054cc] -z-0" />

              <div className="flex flex-col items-center gap-1.5 z-10">
                <div className="w-8 h-8 rounded-full bg-[#0054cc] text-white flex items-center justify-center font-bold text-xs">
                  ✓
                </div>
                <span className="text-[10px] font-bold text-[#0054cc]">요청완료</span>
              </div>

              <div className="flex flex-col items-center gap-1.5 z-10">
                <div className="w-8 h-8 rounded-full bg-[#0054cc] text-white flex items-center justify-center font-bold text-xs">
                  💬
                </div>
                <span className="text-[10px] font-bold text-[#0054cc]">대화</span>
              </div>

              <div className="flex flex-col items-center gap-1.5 z-10">
                <div className="w-8 h-8 rounded-full bg-[#0054cc] text-white flex items-center justify-center font-bold text-xs">
                  📄
                </div>
                <span className="text-[10px] font-bold text-[#0054cc]">견적업로드</span>
              </div>

              <div className="flex flex-col items-center gap-1.5 z-10">
                <div className="w-8 h-8 rounded-full bg-white border-2 border-[#0054cc] text-[#0054cc] flex items-center justify-center font-bold text-xs shadow-md animate-pulse">
                  👤
                </div>
                <span className="text-[10px] font-bold text-[#0054cc]">임대인 승인</span>
              </div>

              <div className="flex flex-col items-center gap-1.5 z-10">
                <div className="w-8 h-8 rounded-full bg-[#e5e2e1] text-[#727787] flex items-center justify-center font-bold text-xs">
                  🛠️
                </div>
                <span className="text-[10px] text-[#727787]">수리</span>
              </div>

              <div className="flex flex-col items-center gap-1.5 z-10">
                <div className="w-8 h-8 rounded-full bg-[#e5e2e1] text-[#727787] flex items-center justify-center font-bold text-xs">
                  ✓
                </div>
                <span className="text-[10px] text-[#727787]">완료</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid Row: Contract Info & Notifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Lease Contract Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xs border border-[#c2c6d8]/30 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-[#1b1c1c] flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#0054cc]" />
                <span>현재 임대차 계약</span>
              </h3>
              <span className="text-xs font-bold text-[#10B981] bg-[#10B981]/10 px-2.5 py-1 rounded-full">
                계약 유지 중
              </span>
            </div>

            <div className="bg-[#f6f3f2] rounded-2xl p-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[#424655]">소재지</span>
                <span className="font-bold text-[#1b1c1c]">그린빌 302호</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#424655]">보증금 / 월세</span>
                <span className="font-bold text-[#0054cc]">1,000만원 / 85만원</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#424655]">계약 만료일</span>
                <span className="font-bold text-[#1b1c1c]">2025.10.14 (1년 남음)</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-[#c2c6d8]/40">
                <span className="text-[#424655]">임대인 연락처</span>
                <span className="font-bold text-[#1b1c1c]">김지수 님 (앱 내 3자 채팅)</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('documents')}
            className="mt-6 w-full py-3 bg-[#f0eded] hover:bg-[#e5e2e1] text-[#1b1c1c] font-bold text-sm rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <FileText className="w-4 h-4 text-[#0054cc]" />
            <span>전자계약서 및 특약 원본 확인</span>
          </button>
        </div>

        {/* Notifications & Announcements */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xs border border-[#c2c6d8]/30 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-[#1b1c1c] flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#0054cc]" />
                <span>최근 알림</span>
              </h3>
              <button
                onClick={() => setActiveTab('notifications')}
                className="text-xs text-[#0054cc] font-bold hover:underline cursor-pointer"
              >
                전체보기
              </button>
            </div>

            <div className="space-y-3">
              {notifications.slice(0, 3).map((n) => (
                <div
                  key={n.id}
                  onClick={() => setActiveTab('notifications')}
                  className="p-3.5 rounded-2xl bg-[#fcf9f8] border border-[#c2c6d8]/30 hover:border-[#0054cc] transition-all cursor-pointer flex items-start gap-3"
                >
                  <div className="w-2 h-2 rounded-full bg-[#0054cc] mt-1.5 shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-bold text-xs text-[#1b1c1c]">{n.title}</h4>
                    <p className="text-[11px] text-[#424655] line-clamp-1 mt-0.5">{n.message}</p>
                  </div>
                  <span className="text-[10px] text-[#727787]">{n.timestamp}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('legal')}
            className="mt-6 w-full py-3 bg-[#0054cc]/10 hover:bg-[#0054cc]/15 text-[#0054cc] font-bold text-sm rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <HelpCircle className="w-4 h-4" />
            <span>임차인 필수 법률 가이드 보기</span>
          </button>
        </div>
      </div>
    </div>
  );
};
