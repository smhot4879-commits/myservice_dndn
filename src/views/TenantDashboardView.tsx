import React from 'react';
import { useApp } from '../context/AppContext';
import { formatRelativeTime } from '../lib/dateUtils';
import {
  Wrench,
  MessageSquare,
  FileText,
  HelpCircle,
  Plus,
  Receipt,
  Check,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export const TenantDashboardView: React.FC = () => {
  const { setActiveTab, setActiveRepairId, activeRepairId, repairCases } = useApp();

  const activeRepairCases = repairCases.filter((c) => c.status !== 'COMPLETED');
  const activeCase = activeRepairCases.find((c) => c.id === activeRepairId) || activeRepairCases[0] || repairCases[0];

  const getStatusInfo = (status: string) => {
    const map: Record<string, { label: string; dotColor: string; textColor: string }> = {
      REQUESTED: { label: '요청 접수', dotColor: 'bg-rose-500', textColor: 'text-rose-700' },
      CHATTING: { label: '협의 중', dotColor: 'bg-blue-600', textColor: 'text-blue-700' },
      QUOTE_UPLOADED: { label: '견적 도착', dotColor: 'bg-amber-500', textColor: 'text-amber-700' },
      LANDLORD_APPROVED: { label: '임대인 승인', dotColor: 'bg-blue-600', textColor: 'text-blue-700' },
      APPROVED: { label: '승인 완료', dotColor: 'bg-blue-600', textColor: 'text-blue-700' },
      REPAIRING: { label: '수리 진행 중', dotColor: 'bg-indigo-500', textColor: 'text-indigo-700' },
      COMPLETED: { label: '수리 완료', dotColor: 'bg-emerald-600', textColor: 'text-emerald-700' },
    };
    return map[status] || { label: status, dotColor: 'bg-neutral-400', textColor: 'text-neutral-700' };
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Welcome Header */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-1">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-950 tracking-tight">
              안녕하세요, 김지우 님
            </h2>
            <span className="font-mono text-xs text-neutral-400 font-medium">
              그린빌 302호
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            서울특별시 서초구 방배로 124 그린빌 302호 거주 중
          </p>
        </div>

        <button
          onClick={() => setActiveTab('repair-request')}
          className="bg-[#0F172A] hover:bg-[#1E293B] text-white px-3.5 py-2 rounded-lg font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>수리 요청 접수하기</span>
        </button>
      </section>

      {/* Hero CTA Card: Linear / Toss Style */}
      <div className="bg-[#0F172A] text-white p-5 sm:p-6 rounded-xl border border-neutral-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1.5 text-left">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span className="font-mono text-[11px] text-neutral-300">
              REPAIR & DEPOSIT PROTECTION
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
            집 안 시설에 수리나 하자가 발생했나요?
          </h3>
          <p className="text-xs text-neutral-400 max-w-xl leading-relaxed">
            사진과 함께 증상을 접수하시면 임대인에게 실시간 알림이 전송되며, 3자 채팅을 통해 3개 업체의 비교 견적을 투명하게 확인하실 수 있습니다.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('repair-request')}
          className="bg-white hover:bg-neutral-100 text-neutral-900 font-semibold px-4 py-2.5 rounded-lg text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0 active:scale-98"
        >
          <Wrench className="w-4 h-4 text-blue-600" />
          <span>수리 접수서 작성</span>
        </button>
      </div>

      {/* Active Repair Pipeline Section */}
      {activeCase && (
        <div className="bg-white p-5 sm:p-6 rounded-xl border border-neutral-200 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-neutral-900">
                현재 진행 중인 수리 건
              </h3>
            </div>
            <span className="font-mono text-xs text-neutral-400">
              #{activeCase.id}
            </span>
          </div>

          <div className="p-4 rounded-lg bg-neutral-50/80 border border-neutral-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-bold text-sm text-neutral-900">{activeCase.title}</h4>
                <p className="text-xs text-neutral-500 mt-0.5">{activeCase.symptom}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setActiveRepairId(activeCase.id);
                    setActiveTab('estimates');
                  }}
                  className="bg-white hover:bg-neutral-100 text-neutral-900 border border-neutral-300 font-semibold text-xs px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1"
                >
                  <Receipt className="w-3.5 h-3.5 text-amber-600" />
                  <span>견적서 ({activeCase.estimates.length})</span>
                </button>
                <button
                  onClick={() => {
                    setActiveRepairId(activeCase.id);
                    setActiveTab('chat');
                  }}
                  className="bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold text-xs px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>3자 협의방</span>
                </button>
              </div>
            </div>

            {/* Stepper */}
            <div className="pt-3 border-t border-neutral-200">
              <div className="grid grid-cols-6 gap-1 text-center">
                <div className="space-y-1">
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto text-[10px] font-bold">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-[10px] text-neutral-600">1. 접수</span>
                </div>
                <div className="space-y-1">
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto text-[10px] font-bold">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-[10px] text-neutral-600">2. 대화</span>
                </div>
                <div className="space-y-1">
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto text-[10px] font-bold">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-[10px] text-neutral-600">3. 견적</span>
                </div>
                <div className="space-y-1">
                  <div className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center mx-auto text-[10px] font-bold ring-2 ring-blue-500/30">
                    4
                  </div>
                  <span className="text-[10px] font-semibold text-neutral-900">4. 승인</span>
                </div>
                <div className="space-y-1 opacity-40">
                  <div className="w-5 h-5 rounded-full border border-neutral-400 text-neutral-400 flex items-center justify-center mx-auto text-[10px]">
                    5
                  </div>
                  <span className="text-[10px] text-neutral-400">5. 수리</span>
                </div>
                <div className="space-y-1 opacity-40">
                  <div className="w-5 h-5 rounded-full border border-neutral-400 text-neutral-400 flex items-center justify-center mx-auto text-[10px]">
                    6
                  </div>
                  <span className="text-[10px] text-neutral-400">6. 완료</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Repair Requests List */}
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-neutral-200 shadow-xs space-y-3">
        <div className="flex justify-between items-center pb-3 border-b border-neutral-100">
          <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
            <Wrench className="w-4 h-4 text-neutral-700" />
            <span>수리 요청 내역 ({activeRepairCases.length}건)</span>
          </h3>
          <button
            onClick={() => setActiveTab('repair-request')}
            className="text-xs text-blue-600 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>새 요청 접수</span>
          </button>
        </div>

        <div className="divide-y divide-neutral-100">
          {activeRepairCases.length === 0 ? (
            <div className="text-center py-6 text-neutral-400 text-xs">
              진행 중인 수리 요청 내역이 없습니다.
            </div>
          ) : (
            activeRepairCases.map((rc) => {
              const statusInfo = getStatusInfo(rc.status);
              return (
                <div
                  key={rc.id}
                  onClick={() => setActiveRepairId(rc.id)}
                  className="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:bg-neutral-50 px-2 rounded-lg transition-colors cursor-pointer"
                >
                  <div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="flex items-center gap-1 text-[11px] font-medium">
                        <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotColor}`} />
                        <span className={statusInfo.textColor}>{statusInfo.label}</span>
                      </div>
                      <span className="text-neutral-300">·</span>
                      <span className="font-mono text-neutral-400">#{rc.id}</span>
                      <span className="text-neutral-300">·</span>
                      <span className="font-semibold text-neutral-900">{rc.title}</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                      {rc.createdAt} ({formatRelativeTime(rc.createdAt)})
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveRepairId(rc.id);
                        setActiveTab('chat');
                      }}
                      className="px-2.5 py-1 bg-white border border-neutral-300 hover:bg-neutral-100 text-neutral-800 rounded-md text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-neutral-500" />
                      <span>대화</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveRepairId(rc.id);
                        setActiveTab('estimates');
                      }}
                      className="px-2.5 py-1 bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-md text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>견적서 ({rc.estimates.length})</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Lease Contract & Legal Guide */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Lease Info */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-neutral-700" />
                <span>현재 임대차 계약 정보</span>
              </h3>
              <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                <span>계약 유지 중</span>
              </div>
            </div>

            <div className="bg-neutral-50 rounded-lg p-3.5 space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-neutral-500">소재지</span>
                <span className="text-neutral-900 font-semibold">그린빌 302호</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">보증금 / 월세</span>
                <span className="text-neutral-900 font-semibold tabular-nums">1,000만 / 85만</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">계약 만료일</span>
                <span className="text-neutral-900 font-semibold">2026.10.14</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('documents')}
            className="mt-4 w-full py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-neutral-600" />
            <span>전자계약서 원본 보기</span>
          </button>
        </div>

        {/* Tenant Rights */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-neutral-700" />
                <span>임차인 권리 & 수선 의무 가이드</span>
              </h3>
            </div>

            <p className="text-xs text-neutral-500 leading-relaxed mb-3">
              민법 제623조에 따라 누수, 보일러 고장, 난방 결함 등 필수 시설의 대규모 하자는 임대인 부담으로 수리해야 합니다.
            </p>

            <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200 text-[11px] text-neutral-600 space-y-1">
              <div className="font-semibold text-neutral-900">💡 원상복구 분쟁 예방 팁</div>
              <p>입주 전 촬영된 현장 사진 기록이 보관되어 퇴실 시 억울한 수리비 공제를 방지합니다.</p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('legal')}
            className="mt-4 w-full py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <HelpCircle className="w-3.5 h-3.5 text-neutral-600" />
            <span>법률 가이드 및 판례 확인</span>
          </button>
        </div>
      </div>
    </div>
  );
};
