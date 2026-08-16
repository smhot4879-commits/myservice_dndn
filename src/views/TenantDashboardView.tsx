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
  ShieldCheck,
} from 'lucide-react';

export const TenantDashboardView: React.FC = () => {
  const { setActiveTab, setActiveRepairId, activeRepairId, repairCases, notifications } = useApp();

  const activeRepairCases = repairCases.filter((c) => c.status !== 'COMPLETED');
  const activeCase = activeRepairCases.find((c) => c.id === activeRepairId) || activeRepairCases[0] || repairCases[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome & High Priority Call to Action Header */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-1 sm:pt-2">
        <div>
          <h2 className="text-[21px] sm:text-3xl font-extrabold text-[#1b1c1c] tracking-tight">
            안녕하세요, 김지우 님! 👋
          </h2>
          <p className="text-xs sm:text-base text-[#424655] mt-0.5 sm:mt-1">
            서울특별시 강남구 테헤란로 123 <span className="font-bold text-[#0054cc]">그린빌 302호</span> 거주 중
          </p>
        </div>

        <button
          onClick={() => setActiveTab('repair-request')}
          className="w-full sm:w-auto bg-[#0054cc] hover:bg-[#066bfd] text-white px-5 py-3 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="pl-[68px]">임대인에게 수리 요청하기</span>
        </button>
      </section>

      {/* Main Repair Call To Action Card if repair needed */}
      <div className="bg-gradient-to-r from-[#0054cc] to-[#066bfd] text-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6 relative overflow-hidden">
        <div className="space-y-1.5 sm:space-y-2 z-10 text-left">
          <span className="inline-block bg-white/20 text-white font-bold text-[11px] sm:text-xs px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border border-white/30">
            빠르고 투명한 수리 접수
          </span>
          <h3 className="text-base sm:text-2xl font-extrabold leading-snug">
            집 안 시설이 고장났거나 누수가 있나요?
          </h3>
          <p className="text-xs sm:text-sm text-white/90 max-w-lg leading-relaxed">
            양식에 맞춰 사진과 함께 접수하시면 임대인에게 실시간 전달되며, 3자 채팅을 통해 업체의 비교 견적을 손쉽게 확인하실 수 있습니다.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('repair-request')}
          className="w-full md:w-auto bg-white text-[#0054cc] hover:bg-opacity-90 font-extrabold px-5 py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer z-10 shrink-0"
        >
          <Wrench className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>수리 요청서 작성하기</span>
        </button>
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Active Repair Request Progress Section */}
      {activeCase && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xs border border-[#c2c6d8]/30">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-[#1b1c1c] flex items-center gap-2">
              <Wrench className="w-5 h-5 text-[#0054cc]" />
              <span>현재 선택된 수리 요청</span>
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
                  <span className="text-[9px]">비교 견적서 ({activeCase.estimates.length}건)</span>
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

      {/* All Recent Repair Requests List Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xs border border-[#c2c6d8]/30 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-[#1b1c1c] flex items-center gap-2">
            <Wrench className="w-5 h-5 text-[#0054cc]" />
            <span>최근 올린 수리 요청 내역 ({activeRepairCases.length}건)</span>
          </h3>
          <button
            onClick={() => setActiveTab('repair-request')}
            className="text-xs text-[#0054cc] font-bold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>새 요청 작성</span>
          </button>
        </div>

        <div className="space-y-3">
          {activeRepairCases.length === 0 ? (
            <div className="text-center py-8 text-[#727787] text-sm">
              진행 중인 수리 요청 내역이 없습니다. (모든 수리 처리 완료)
            </div>
          ) : (
            activeRepairCases.map((rc) => {
              const isSelected = rc.id === activeCase?.id;
              const statusMap: Record<string, { label: string; bg: string; text: string }> = {
                REQUESTED: { label: '요청 완료', bg: 'bg-[#0054cc]/10', text: 'text-[#0054cc]' },
                CHATTING: { label: '대화 중', bg: 'bg-[#0054cc]/10', text: 'text-[#0054cc]' },
                QUOTE_UPLOADED: { label: '견적 도착', bg: 'bg-[#F59E0B]/10', text: 'text-[#F59E0B]' },
                LANDLORD_APPROVED: { label: '임대인 승인', bg: 'bg-[#0054cc]/10', text: 'text-[#0054cc]' },
                APPROVED: { label: '승인 완료', bg: 'bg-[#10B981]/10', text: 'text-[#10B981]' },
                REPAIRING: { label: '수리 진행 중', bg: 'bg-[#8B5CF6]/10', text: 'text-[#8B5CF6]' },
                COMPLETED: { label: '수리 완료', bg: 'bg-[#6B7280]/10', text: 'text-[#6B7280]' },
              };
              const statusInfo = statusMap[rc.status] || { label: rc.status, bg: 'bg-[#0054cc]/10', text: 'text-[#0054cc]' };

              return (
                <div
                  key={rc.id}
                  onClick={() => setActiveRepairId(rc.id)}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer ${
                    isSelected
                      ? 'border-[#0054cc] bg-[#f0f4ff]/70 shadow-xs ring-1 ring-[#0054cc]/30'
                      : 'border-[#c2c6d8]/30 bg-[#fcf9f8] hover:border-[#0054cc]/50 hover:bg-white'
                  }`}
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${statusInfo.bg} ${statusInfo.text}`}>
                        {statusInfo.label}
                      </span>
                      <span className="text-xs font-bold text-[#0054cc]">#{rc.id}</span>
                      <span className="text-xs text-[#727787]">• {rc.unit}</span>
                      <span className="text-[11px] text-[#727787]">({rc.createdAt})</span>
                    </div>
                    <h4 className="font-extrabold text-base text-[#1b1c1c]">{rc.title}</h4>
                    <p className="text-xs text-[#424655] line-clamp-1">{rc.symptom}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-[#c2c6d8]/20">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveRepairId(rc.id);
                        setActiveTab('chat');
                      }}
                      className="px-3 py-2 bg-white border border-[#0054cc] text-[#0054cc] hover:bg-[#0054cc]/5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>3자 대화방</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveRepairId(rc.id);
                        setActiveTab('estimates');
                      }}
                      className="px-3 py-2 bg-[#0054cc] text-white hover:bg-[#066bfd] rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>비교 견적서 ({rc.estimates.length})</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Grid Row: Contract Info & Notifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Lease Contract Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xs border border-[#c2c6d8]/30 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-[#1b1c1c] flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#0054cc]" />
                <span className="text-[13px]">현재 임대차 계약</span>
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
            <span className="text-[9px]">전자계약서 및 특약 원본 확인</span>
          </button>
        </div>

        {/* Tenant Legal & Rights Guide Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xs border border-[#c2c6d8]/30 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-[#1b1c1c] flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#0054cc]" />
                <span>임차인 법률 & 권리 가이드</span>
              </h3>
              <span className="text-xs font-bold text-[#0054cc] bg-[#0054cc]/10 px-2.5 py-1 rounded-full">
                안전한 임대차
              </span>
            </div>

            <p className="text-xs text-[#424655] leading-relaxed mb-4">
              수리 비용 부담 주체(민법 제623조) 및 하자담보책임, 보증금 보호 등 주요 임대차 법률 가이드를 확인해 보세요.
            </p>

            <div className="bg-[#fcf9f8] p-4 rounded-2xl border border-[#c2c6d8]/30 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1b1c1c]">
                <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                <span>임대인의 하자수리 의무 (민법 제623조)</span>
              </div>
              <p className="text-[11px] text-[#727787] leading-relaxed">
                누수, 보일러 고장, 난방 결함 등 대규모 시설 및 구조적 문제는 임대인(집주인) 부담 수리가 원칙입니다.
              </p>
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
