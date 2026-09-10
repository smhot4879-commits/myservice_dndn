import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatRelativeTime } from '../lib/dateUtils';
import { RepairCase, PropertyUnit } from '../types';
import {
  Building2,
  AlertCircle,
  ChevronRight,
  MessageSquare,
  Wrench,
  Receipt,
  CheckCircle2,
  FileText,
  HelpCircle,
  PlayCircle,
  Plus,
  ArrowRight,
  Sparkles,
  History,
  Eye,
  X,
  Filter,
  ChevronDown,
} from 'lucide-react';

export const LandlordDashboardView: React.FC = () => {
  const {
    setActiveTab,
    setActiveRepairId,
    activeRepairId,
    repairCases,
    propertyUnits,
    addPropertyUnit,
  } = useApp();

  const [showAddUnitModal, setShowShowAddUnitModal] = useState(false);
  const [newBuilding, setNewBuilding] = useState('');
  const [newUnit, setNewUnit] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newTenant, setNewTenant] = useState('');

  // Tab & state for Landlord Lease Management (임대차 계약 & 해당 임차인 수리이력 탭)
  const [leaseTab, setLeaseTab] = useState<'UNITS' | 'REPAIR_HISTORY'>('UNITS');
  const [tenantFilterId, setTenantFilterId] = useState<string>('ALL');
  const [selectedTenantForHistory, setSelectedTenantForHistory] = useState<PropertyUnit | null>(null);
  const [selectedQuickCase, setSelectedQuickCase] = useState<RepairCase | null>(null);

  // State for Action Needed (조치 필요한 임차인 목록 전체보기 모달 및 필터)
  const [showAllActionNeededModal, setShowAllActionNeededModal] = useState(false);
  const [actionNeededFilter, setActionNeededFilter] = useState<'ALL' | 'QUOTE' | 'REQUESTED' | 'CHATTING'>('ALL');

  // Get active cases (excluding completed ones)
  const activeRepairCases = repairCases.filter((c) => c.status !== 'COMPLETED');
  const completedRepairCases = repairCases.filter((c) => c.status === 'COMPLETED');
  const activeCase = activeRepairCases.find((c) => c.id === activeRepairId) || activeRepairCases[0] || repairCases[0];

  // 최근 5개까지만 메인 대시보드 카드에 노출 (나머지는 전체보기에서 확인)
  const displayedActiveCases = activeRepairCases.slice(0, 5);

  const getCasesForUnit = (unit: PropertyUnit) => {
    const cleanUnitName = unit.unitName.replace(/[^0-9]/g, '');
    const cleanBuilding = unit.buildingName.replace(/\s+/g, '');
    const cleanTenant = unit.tenantName.replace(/\s+|님/g, '');

    return repairCases.filter((rc) => {
      const rcUnit = (rc.unit || '').replace(/\s+/g, '');
      const rcTenant = (rc.tenantName || '').replace(/\s+|님/g, '');
      const unitMatch = cleanUnitName.length > 0 && rcUnit.includes(cleanUnitName);
      const buildingMatch = cleanBuilding.length > 0 && rcUnit.includes(cleanBuilding);
      const tenantMatch =
        cleanTenant.length > 1 &&
        rcTenant.length > 1 &&
        (rcTenant.includes(cleanTenant) || cleanTenant.includes(rcTenant));
      return (unitMatch && (buildingMatch || cleanBuilding.length === 0)) || tenantMatch || (unitMatch && !rcUnit.includes('그랑자이'));
    });
  };

  const displayedTenantRepairs = repairCases.filter((rc) => {
    if (tenantFilterId === 'ALL') return true;
    const unit = propertyUnits.find((u) => u.id === tenantFilterId);
    if (!unit) return true;
    const unitRepairs = getCasesForUnit(unit);
    return unitRepairs.some((c) => c.id === rc.id);
  });

  const getStatusInfo = (status: string) => {
    const map: Record<
      string,
      { label: string; bg: string; text: string; icon: React.ReactNode }
    > = {
      REQUESTED: { label: '요청 완료', bg: 'bg-[#EF4444]/10', text: 'text-[#EF4444]', icon: <Wrench className="w-5 h-5" /> },
      CHATTING: { label: '대화 중', bg: 'bg-[#0054cc]/10', text: 'text-[#0054cc]', icon: <MessageSquare className="w-5 h-5" /> },
      QUOTE_UPLOADED: { label: '견적 도착', bg: 'bg-[#F59E0B]/10', text: 'text-[#F59E0B]', icon: <Receipt className="w-5 h-5" /> },
      LANDLORD_APPROVED: { label: '임대인 승인', bg: 'bg-[#0054cc]/10', text: 'text-[#0054cc]', icon: <CheckCircle2 className="w-5 h-5" /> },
      APPROVED: { label: '승인 완료', bg: 'bg-[#0054cc]/10', text: 'text-[#0054cc]', icon: <CheckCircle2 className="w-5 h-5" /> },
      REPAIRING: { label: '수리 진행 중', bg: 'bg-[#8B5CF6]/10', text: 'text-[#8B5CF6]', icon: <Wrench className="w-5 h-5" /> },
      COMPLETED: { label: '수리 완료', bg: 'bg-[#10B981]/10', text: 'text-[#10B981]', icon: <CheckCircle2 className="w-5 h-5" /> },
    };
    return (
      map[status] || {
        label: status,
        bg: 'bg-[#0054cc]/10',
        text: 'text-[#0054cc]',
        icon: <Wrench className="w-5 h-5" />,
      }
    );
  };

  const handleAddUnitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBuilding || !newUnit) return;
    addPropertyUnit({
      buildingName: newBuilding,
      unitName: newUnit,
      address: newAddress || '서울특별시 강남구',
      tenantName: newTenant || '초대 대기',
      tenantPhone: '010-0000-0000',
      status: '초대 대기',
      contractEnd: '2026.12.31',
      monthlyRent: 100,
      deposit: 1000,
    });
    setNewBuilding('');
    setNewUnit('');
    setNewAddress('');
    setNewTenant('');
    setShowShowAddUnitModal(false);
    alert('새 호실이 등록되었습니다! 임차인 초대 링크가 생성되었습니다.');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1b1c1c] tracking-tight">
            안녕하세요, 지수 님!
          </h2>
          <p className="text-sm sm:text-base text-[#424655] mt-1">
            오늘 관리해야 할 작업이{' '}
            <span className="text-[#0054cc] font-bold">
              {repairCases.filter((c) => c.status !== 'COMPLETED').length + 2}건
            </span>
             있습니다.
          </p>
        </div>
        <button
          onClick={() => setShowShowAddUnitModal(true)}
          className="bg-[#0054cc] hover:bg-[#066bfd] text-white px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-md shadow-[#0054cc]/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
        >
          <Building2 className="w-5 h-5" />
          <span>매물/호실 추가</span>
        </button>
      </section>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column (8 cols): Primary Priority Tasks & Tenant Active Repair */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Action Needed Section */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xs border border-[#c2c6d8]/30">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2.5">
                <h3 className="text-lg font-bold text-[#1b1c1c] flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-[#0054cc]" />
                  <span>조치 필요한 임차인 목록</span>
                </h3>
                <span className="text-xs bg-[#0054cc]/10 text-[#0054cc] font-extrabold px-2.5 py-0.5 rounded-full">
                  {activeRepairCases.length > 5
                    ? `최근 5건 (전체 ${activeRepairCases.length}건)`
                    : `${activeRepairCases.length}건`}
                </span>
              </div>
              <button
                onClick={() => setShowAllActionNeededModal(true)}
                className="text-[#0054cc] text-xs font-bold hover:underline cursor-pointer flex items-center gap-1 py-1.5 px-3 rounded-xl hover:bg-[#0054cc]/5 transition-colors"
                title="조치 필요한 임차인 전체 목록 보기"
              >
                <span>전체보기</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3.5">
              {displayedActiveCases.length === 0 ? (
                <div className="text-center py-8 text-[#727787] text-sm">
                  현재 조치가 필요한 수리 요청이 없습니다. (모든 수리 처리 완료)
                </div>
              ) : (
                displayedActiveCases.map((rc) => {
                  const statusInfo = getStatusInfo(rc.status);
                  return (
                    <div
                      key={rc.id}
                      onClick={() => {
                        setActiveRepairId(rc.id);
                        setActiveTab("chat");
                      }}
                      className="group flex flex-row items-center justify-between p-3.5 sm:p-4 rounded-2xl border border-[#c2c6d8]/30 hover:border-[#0054cc] transition-all bg-[#fcf9f8] hover:shadow-md cursor-pointer gap-3"
                    >
                      <div className="flex items-center gap-3.5 min-w-0 flex-1">
                        <div
                          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full ${statusInfo.bg} flex items-center justify-center ${statusInfo.text} shrink-0`}
                        >
                          <div className="scale-105">{statusInfo.icon}</div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-sm text-[#1b1c1c] truncate">
                            {rc.unit} 수리 요청 ({rc.title})
                          </h4>
                          <p className="text-xs text-[#424655] truncate mt-0.5">
                            {rc.symptom} • {rc.createdAt} ({formatRelativeTime(rc.createdAt)})
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`px-2.5 sm:px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${statusInfo.bg} ${statusInfo.text}`}
                        >
                          {statusInfo.label}
                        </span>
                        <ChevronRight className="w-5 h-5 text-[#727787] group-hover:text-[#0054cc] group-hover:translate-x-0.5 transition-all shrink-0" />
                      </div>
                    </div>
                  );
                })
              )}

              {/* View More button if more than 5 cases */}
              {activeRepairCases.length > 5 && (
                <div className="pt-2">
                  <button
                    onClick={() => setShowAllActionNeededModal(true)}
                    className="w-full py-3 px-4 bg-[#f8f9fa] hover:bg-[#0054cc]/5 border border-[#c2c6d8]/40 hover:border-[#0054cc]/40 text-[#0054cc] font-extrabold text-xs rounded-2xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs group"
                  >
                    <span>조치 필요한 임차인 목록 전체보기 (외 {activeRepairCases.length - 5}건 더보기)</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Integrated Repair Status (Tenant & Landlord Interaction) */}
          <div className="bg-[#066bfd] text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden border border-white/20">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold mb-1">현재 진행 중인 수리 현황</h3>
                  <p className="text-xs text-white/80">임차인 협의 및 수리 프로세스</p>
                </div>
                <Wrench className="w-10 h-10 text-white/20" />
              </div>

              {/* Active Case Card Details */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 mb-6">
                <div className="flex items-center gap-3 sm:gap-4 mb-6">
                  <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg shrink-0">
                    ❄️
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-base truncate">{activeCase?.title || '거실 에어컨 수리'}</p>
                    <p className="text-xs text-white/80 truncate">
                      견적 업로드 완료 • 임대인 승인 대기 단계 ({activeCase?.unit})
                    </p>
                  </div>
                  <span className="bg-white text-[#0054cc] font-bold text-xs px-3 py-1 rounded-full shadow-sm whitespace-nowrap shrink-0">
                    진행 중
                  </span>
                </div>

                {/* Progress Stepper Bar */}
                <div className="relative flex justify-between items-center px-2 py-1">
                  <div className="absolute top-4 left-4 right-4 h-0.5 bg-white/20 -z-0" />
                  <div className="absolute top-4 left-4 w-3/5 h-0.5 bg-white -z-0" />

                  {/* Step 1 */}
                  <div className="flex flex-col items-center gap-1.5 z-10">
                    <div className="w-8 h-8 rounded-full bg-white text-[#0054cc] flex items-center justify-center font-bold text-xs shadow-xs">
                      ✓
                    </div>
                    <span className="text-[10px] font-bold">요청완료</span>
                  </div>

                  {/* Step 2 */}
                  <div className="flex flex-col items-center gap-1.5 z-10">
                    <div className="w-8 h-8 rounded-full bg-white text-[#0054cc] flex items-center justify-center font-bold text-xs shadow-xs">
                      💬
                    </div>
                    <span className="text-[10px] font-bold">대화</span>
                  </div>

                  {/* Step 3 */}
                  <div className="flex flex-col items-center gap-1.5 z-10">
                    <div className="w-8 h-8 rounded-full bg-white text-[#0054cc] flex items-center justify-center font-bold text-xs shadow-xs">
                      📄
                    </div>
                    <span className="text-[10px] font-bold">견적업로드</span>
                  </div>

                  {/* Step 4 */}
                  <div className="flex flex-col items-center gap-1.5 z-10">
                    <div className="w-8 h-8 rounded-full bg-white/30 border-2 border-white text-white flex items-center justify-center font-bold text-xs shadow-xs animate-pulse">
                      👤
                    </div>
                    <span className="text-[10px] font-bold">임대인 승인</span>
                  </div>

                  {/* Step 5 */}
                  <div className="flex flex-col items-center gap-1.5 z-10">
                    <div className="w-8 h-8 rounded-full bg-white/20 text-white/60 flex items-center justify-center font-bold text-xs">
                      🛠️
                    </div>
                    <span className="text-[10px] opacity-60">수리</span>
                  </div>

                  {/* Step 6 */}
                  <div className="flex flex-col items-center gap-1.5 z-10">
                    <div className="w-8 h-8 rounded-full bg-white/20 text-white/60 flex items-center justify-center font-bold text-xs">
                      ✓
                    </div>
                    <span className="text-[10px] opacity-60">완료</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setActiveRepairId(activeCase?.id || 'req-001');
                    setActiveTab('estimates');
                  }}
                  className="flex-1 bg-white text-[#0054cc] font-bold py-3.5 px-4 rounded-xl shadow-lg hover:bg-opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Receipt className="w-5 h-5" />
                  <span>비교 견적서 확인 및 승인하기</span>
                </button>
                <button
                  onClick={() => {
                    setActiveRepairId(activeCase?.id || 'req-001');
                    setActiveTab('chat');
                  }}
                  className="bg-white/20 hover:bg-white/30 text-white font-bold py-3.5 px-5 rounded-xl border border-white/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>임차인과 대화하기</span>
                </button>
              </div>
            </div>
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
          </div>
        </div>

        {/* Right Column (4 cols): Landlord Lease & Repair Management */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-white p-6 sm:p-7 rounded-3xl shadow-xs border border-[#c2c6d8]/30 h-full flex flex-col justify-between">
            <div>
              {/* Header: Title and Tabs (호실 목록 vs 수리이력) */}
              <div className="mb-5 pb-3.5 border-b border-[#c2c6d8]/30">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <h3 className="text-lg font-bold text-[#1b1c1c] flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#0054cc]" />
                    <span>임대차 계약 & 수리 관리</span>
                  </h3>
                </div>

                {/* Tab Selector: 호실 목록 vs 수리이력 */}
                <div className="flex items-center gap-1.5 p-1 bg-[#f0f2f5] rounded-2xl">
                  <button
                    onClick={() => setLeaseTab("UNITS")}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                      leaseTab === "UNITS"
                        ? "bg-white text-[#0054cc] shadow-xs"
                        : "text-[#727787] hover:text-[#1b1c1c]"
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>호실 목록</span>
                    <span className="text-[10px] bg-[#0054cc]/10 text-[#0054cc] font-black px-1.5 py-0.2 rounded-full">
                      {propertyUnits.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setLeaseTab("REPAIR_HISTORY")}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                      leaseTab === "REPAIR_HISTORY"
                        ? "bg-white text-[#0054cc] shadow-xs"
                        : "text-[#727787] hover:text-[#1b1c1c]"
                    }`}
                  >
                    <History className="w-3.5 h-3.5" />
                    <span>수리이력</span>
                    <span className="text-[10px] bg-[#0054cc]/10 text-[#0054cc] font-black px-1.5 py-0.2 rounded-full">
                      {repairCases.length}
                    </span>
                  </button>
                </div>
              </div>

              {/* TAB 1: 호실 목록 (각 임차인별 수리이력 퀵버튼 포함) */}
              {leaseTab === "UNITS" && (
                <div className="space-y-4">
                  {propertyUnits.map((unit, idx) => {
                    const unitRepairs = getCasesForUnit(unit);
                    const activeCount = unitRepairs.filter((c) => c.status !== "COMPLETED").length;
                    return (
                      <div
                        key={unit.id}
                        className={`relative pl-4 pr-3 py-3.5 rounded-2xl border border-[#c2c6d8]/30 hover:border-[#0054cc] transition-all bg-[#fcf9f8] hover:shadow-xs border-l-4 ${
                          idx === 0
                            ? "border-l-[#0054cc]"
                            : idx === 1
                            ? "border-l-[#10B981]"
                            : "border-l-[#c2c6d8]"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div>
                            <h4 className="font-bold text-sm text-[#1b1c1c]">
                              {unit.buildingName} {unit.unitName} • {unit.tenantName}
                            </h4>
                            <p className="text-xs text-[#424655]">계약 만료: {unit.contractEnd}</p>
                          </div>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                              unit.status === "입주중"
                                ? "bg-[#10B981]/10 text-[#10B981]"
                                : "bg-[#F59E0B]/10 text-[#F59E0B]"
                            }`}
                          >
                            {unit.status}
                          </span>
                        </div>

                        {/* Repair Status Badge & Count */}
                        {unitRepairs.length > 0 ? (
                          <div className="my-2 text-[11px] text-[#424655] flex items-center justify-between bg-white p-2 rounded-xl border border-[#c2c6d8]/20">
                            <span className="flex items-center gap-1.5">
                              <Wrench className="w-3.5 h-3.5 text-[#0054cc]" />
                              <span>해당 임차인 수리이력: <b className="text-[#0054cc]">{unitRepairs.length}건</b></span>
                            </span>
                            {activeCount > 0 ? (
                              <span className="text-[10px] bg-[#EF4444]/10 text-[#EF4444] font-black px-2 py-0.5 rounded-full">
                                진행 중 {activeCount}건
                              </span>
                            ) : (
                              <span className="text-[10px] bg-[#10B981]/10 text-[#10B981] font-bold px-2 py-0.5 rounded-full">
                                완료됨
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="my-2 text-[11px] text-[#727787] flex items-center gap-1.5 bg-white/70 p-2 rounded-xl border border-[#c2c6d8]/20">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                            <span>현재 등록된 수리 이력 없음 (이상 무)</span>
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-1.5 mt-2">
                          <button
                            onClick={() => setSelectedTenantForHistory(unit)}
                            className="text-xs bg-[#0054cc] hover:bg-[#066bfd] text-white font-extrabold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer shadow-xs active:scale-95"
                            title="해당 임차인과의 수리이력 바로보기"
                          >
                            <History className="w-3.5 h-3.5" />
                            <span>수리이력 ({unitRepairs.length})</span>
                          </button>
                          <button
                            onClick={() => setActiveTab("documents")}
                            className="text-xs text-[#0054cc] font-bold border border-[#0054cc]/30 bg-white hover:bg-[#0054cc]/5 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                          >
                            계약 정보
                          </button>
                          <button
                            onClick={() => {
                              const firstCase = unitRepairs[0];
                              setActiveRepairId(firstCase ? firstCase.id : "req-001");
                              setActiveTab("chat");
                            }}
                            className="text-xs text-[#424655] border border-[#c2c6d8] bg-white hover:bg-[#f6f3f2] px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                          >
                            메시지
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* TAB 2: 임차인별 수리이력 목록 */}
              {leaseTab === "REPAIR_HISTORY" && (
                <div className="space-y-3.5">
                  {/* Unit/Tenant Filter Pills */}
                  <div className="flex flex-wrap gap-1.5 pb-2 border-b border-[#c2c6d8]/20">
                    <button
                      onClick={() => setTenantFilterId("ALL")}
                      className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        tenantFilterId === "ALL"
                          ? "bg-[#0054cc] text-white shadow-xs"
                          : "bg-[#f0f2f5] text-[#424655] hover:bg-white"
                      }`}
                    >
                      전체 ({repairCases.length})
                    </button>
                    {propertyUnits.map((u) => {
                      const count = getCasesForUnit(u).length;
                      return (
                        <button
                          key={u.id}
                          onClick={() => setTenantFilterId(u.id)}
                          className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                            tenantFilterId === u.id
                              ? "bg-[#0054cc] text-white shadow-xs"
                              : "bg-[#f0f2f5] text-[#424655] hover:bg-white"
                          }`}
                        >
                          {u.unitName} ({count})
                        </button>
                      );
                    })}
                  </div>

                  {/* Repair cases list for tenant */}
                  <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                    {displayedTenantRepairs.length === 0 ? (
                      <div className="p-6 text-center text-xs text-[#727787] bg-[#f8f9fa] rounded-2xl border border-dashed border-[#c2c6d8]">
                        해당 임차인의 등록된 수리 이력이 없습니다.
                      </div>
                    ) : (
                      displayedTenantRepairs.map((rc) => {
                        const statusInfo = getStatusInfo(rc.status);
                        return (
                          <div
                            key={rc.id}
                            className="p-3 bg-[#fcf9f8] hover:bg-white rounded-2xl border border-[#c2c6d8]/30 hover:border-[#0054cc] transition-all space-y-1.5 shadow-xs"
                          >
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-xs font-black text-[#1b1c1c] truncate">
                                {rc.unit} • {rc.tenantName}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${statusInfo.bg} ${statusInfo.text}`}
                              >
                                {statusInfo.label}
                              </span>
                            </div>
                            <h5 className="text-xs font-bold text-[#0054cc] truncate">
                              {rc.title}
                            </h5>
                            <p className="text-[11px] text-[#727787] truncate">
                              {rc.createdAt} ({formatRelativeTime(rc.createdAt)})
                            </p>
                            <div className="flex items-center justify-between pt-1.5 border-t border-[#c2c6d8]/20 text-[11px]">
                              <span className="text-[#424655]">
                                {rc.estimates.length > 0
                                  ? `견적 ₩${rc.estimates[0].amount.toLocaleString()}`
                                  : "견적 대기"}
                              </span>
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => setSelectedQuickCase(rc)}
                                  className="text-[#0054cc] font-extrabold hover:underline cursor-pointer"
                                >
                                  상세보기
                                </button>
                                <span className="text-gray-300">|</span>
                                <button
                                  onClick={() => {
                                    setActiveRepairId(rc.id);
                                    setActiveTab("chat");
                                  }}
                                  className="text-[#424655] hover:text-[#0054cc] font-bold cursor-pointer"
                                >
                                  대화방
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Vacancy Rate Insight */}
            <div className="mt-8 pt-6 border-t border-[#c2c6d8]/40">
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="text-[#424655]">전체 공실률</span>
                <span className="font-bold text-[#0054cc]">8.5% (임대율 91.5%)</span>
              </div>
              <div className="w-full h-2.5 bg-[#f0eded] rounded-full overflow-hidden">
                <div className="h-full bg-[#0054cc] w-[91.5%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Tertiary Priority Grid */}
        <div className="col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Legal Q&A Card */}
          <div
            onClick={() => setActiveTab('legal')}
            className="bg-white p-6 rounded-3xl shadow-xs border border-[#c2c6d8]/30 group hover:border-[#0054cc] transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-[#7a24df]/10 flex items-center justify-center text-[#7a24df]">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-[#1b1c1c]">법률 Q&A 및 가이드</h3>
              </div>
              <p className="text-xs text-[#424655] mb-4 leading-relaxed">
                "에어컨 수리비, 임대인과 임차인 중 누가 내나요?" 표준 법적 수선 의무 판례 가이드
              </p>
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-[#7a24df] font-bold">자세히 보기</span>
              <ArrowRight className="w-4 h-4 text-[#727787] group-hover:text-[#7a24df] group-hover:translate-x-1 transition-all" />
            </div>
          </div>

          {/* Service Tutorial Card */}
          <div
            onClick={() => alert('든든집사 사용 가이드 영상: 준비 중입니다.')}
            className="bg-white p-6 rounded-3xl shadow-xs border border-[#c2c6d8]/30 group hover:border-[#0054cc] transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-[#F59E0B]/10 flex items-center justify-center text-[#F59E0B]">
                  <PlayCircle className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-[#1b1c1c]">서비스 사용법</h3>
              </div>
              <p className="text-xs text-[#424655] mb-4 leading-relaxed">
                처음이신가요? 투명한 비교 견적서 승인과 3자 채팅 기록 100% 활용하는 법
              </p>
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-[#F59E0B] font-bold">영상 가이드</span>
              <ArrowRight className="w-4 h-4 text-[#727787] group-hover:text-[#F59E0B] group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </div>
      </div>

      {/* Add Unit Modal */}
      {showAddUnitModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-[#f0eded] pb-3">
              <h3 className="text-lg font-bold text-[#1b1c1c] flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#0054cc]" />
                <span>새 매물/호실 추가</span>
              </h3>
              <button
                onClick={() => setShowShowAddUnitModal(false)}
                className="text-[#727787] hover:text-[#1b1c1c] text-xl font-bold"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddUnitSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#424655] mb-1">건물명</label>
                <input
                  type="text"
                  required
                  placeholder="예: 그린빌, 서초그랑자이"
                  value={newBuilding}
                  onChange={(e) => setNewBuilding(e.target.value)}
                  className="w-full p-3 bg-[#f6f3f2] border border-[#c2c6d8] rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#424655] mb-1">동/호수</label>
                <input
                  type="text"
                  required
                  placeholder="예: 102동 1504호"
                  value={newUnit}
                  onChange={(e) => setNewUnit(e.target.value)}
                  className="w-full p-3 bg-[#f6f3f2] border border-[#c2c6d8] rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#424655] mb-1">소재지 주소</label>
                <input
                  type="text"
                  placeholder="예: 서울특별시 서초구 효령로 403"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="w-full p-3 bg-[#f6f3f2] border border-[#c2c6d8] rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#424655] mb-1">임차인 이름 (선택)</label>
                <input
                  type="text"
                  placeholder="미입력시 '초대 대기'로 등록됩니다"
                  value={newTenant}
                  onChange={(e) => setNewTenant(e.target.value)}
                  className="w-full p-3 bg-[#f6f3f2] border border-[#c2c6d8] rounded-xl text-sm"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowShowAddUnitModal(false)}
                  className="flex-1 py-3 border border-[#c2c6d8] text-[#424655] font-bold text-sm rounded-xl hover:bg-[#f6f3f2]"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#0054cc] text-white font-bold text-sm rounded-xl hover:bg-[#066bfd] shadow-md"
                >
                  매물 등록하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dedicated Modal for Tenant Repair History (해당 임차인과의 수리이력 모달) */}
      {selectedTenantForHistory && (() => {
        const unitCases = getCasesForUnit(selectedTenantForHistory);
        const activeCount = unitCases.filter((c) => c.status !== 'COMPLETED').length;
        const completedCount = unitCases.filter((c) => c.status === 'COMPLETED').length;
        const totalSpent = unitCases.reduce((sum, c) => {
          const approved = c.estimates.find((e) => e.isApproved) || c.estimates[0];
          return sum + (approved ? approved.amount : 0);
        }, 0);

        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={() => setSelectedTenantForHistory(null)}
          >
            <div
              className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-[#c2c6d8]/40 overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-5 sm:p-6 bg-[#fcf9f8] border-b border-[#c2c6d8]/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#0054cc]/10 text-[#0054cc] flex items-center justify-center shrink-0">
                    <History className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#0054cc] bg-[#0054cc]/10 px-2 py-0.5 rounded-full">
                        {selectedTenantForHistory.buildingName} {selectedTenantForHistory.unitName}
                      </span>
                      <span className="text-xs font-black text-[#1b1c1c]">
                        임차인: {selectedTenantForHistory.tenantName}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-[#1b1c1c] mt-1">
                      해당 임차인과의 수리이력 ({unitCases.length}건)
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedTenantForHistory(null)}
                  className="w-8 h-8 rounded-full bg-white hover:bg-gray-100 text-[#727787] hover:text-[#1b1c1c] flex items-center justify-center transition-colors border border-[#c2c6d8]/30 cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-left">
                {/* Tenant & Lease Info Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#f8f9fa] p-4 rounded-2xl border border-[#c2c6d8]/20">
                  <div>
                    <span className="text-[11px] text-[#727787] block font-medium">연락처</span>
                    <span className="text-xs font-bold text-[#1b1c1c]">{selectedTenantForHistory.tenantPhone}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#727787] block font-medium">계약 만료일</span>
                    <span className="text-xs font-bold text-[#1b1c1c]">{selectedTenantForHistory.contractEnd}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#727787] block font-medium">보증금 / 월세</span>
                    <span className="text-xs font-bold text-[#1b1c1c]">
                      {selectedTenantForHistory.deposit}만 / {selectedTenantForHistory.monthlyRent}만
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#727787] block font-medium">총 수리비용</span>
                    <span className="text-xs font-black text-[#0054cc]">
                      ₩{totalSpent.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Stat summary pills */}
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="bg-[#f0f4ff] p-3 rounded-xl border border-[#0054cc]/15 text-center">
                    <span className="text-[11px] text-[#727787] block">누적 수리</span>
                    <span className="text-base font-black text-[#0054cc]">{unitCases.length}건</span>
                  </div>
                  <div className="bg-[#fff4f2] p-3 rounded-xl border border-[#EF4444]/15 text-center">
                    <span className="text-[11px] text-[#727787] block">진행 중</span>
                    <span className="text-base font-black text-[#EF4444]">{activeCount}건</span>
                  </div>
                  <div className="bg-[#f0fdf4] p-3 rounded-xl border border-[#10B981]/15 text-center">
                    <span className="text-[11px] text-[#727787] block">처리 완료</span>
                    <span className="text-base font-black text-[#10B981]">{completedCount}건</span>
                  </div>
                </div>

                {/* Repair Cases List */}
                <div className="space-y-3">
                  <h4 className="text-xs font-extrabold text-[#424655] flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Wrench className="w-3.5 h-3.5 text-[#0054cc]" />
                      <span>수리 요청 내역 리스트</span>
                    </span>
                    <span className="text-[11px] text-[#727787] font-normal">
                      최근 접수순 정렬
                    </span>
                  </h4>

                  {unitCases.length === 0 ? (
                    <div className="p-8 text-center bg-[#f8f9fa] rounded-2xl border border-dashed border-[#c2c6d8] space-y-2">
                      <CheckCircle2 className="w-8 h-8 text-[#10B981] mx-auto opacity-70" />
                      <p className="text-xs font-bold text-[#1b1c1c]">등록된 수리 이력이 없습니다.</p>
                      <p className="text-[11px] text-[#727787]">
                        해당 임차인은 입주 이후 접수된 고장/수리 요청이 없습니다.
                      </p>
                    </div>
                  ) : (
                    unitCases.map((rc) => {
                      const statusInfo = getStatusInfo(rc.status);
                      const approvedEstimate =
                        rc.estimates.find((e) => e.isApproved) || rc.estimates[0];

                      return (
                        <div
                          key={rc.id}
                          className="p-4 bg-[#fcf9f8] hover:bg-white rounded-2xl border border-[#c2c6d8]/30 hover:border-[#0054cc] transition-all space-y-3 shadow-xs"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusInfo.bg} ${statusInfo.text}`}
                              >
                                {statusInfo.label}
                              </span>
                              <span className="text-xs font-black text-[#0054cc]">#{rc.id}</span>
                              <span className="text-xs font-bold text-[#424655]">• {rc.category}</span>
                            </div>
                            <span className="text-[11px] text-[#727787]">
                              접수: {rc.createdAt} ({formatRelativeTime(rc.createdAt)})
                            </span>
                          </div>

                          <div>
                            <h5 className="text-sm font-extrabold text-[#1b1c1c]">{rc.title}</h5>
                            <p className="text-xs text-[#424655] mt-1 leading-relaxed whitespace-pre-wrap bg-white/80 p-2.5 rounded-xl border border-[#c2c6d8]/20">
                              {rc.symptom}
                            </p>
                          </div>

                          {/* Photos Thumbnail Preview */}
                          {rc.photos && rc.photos.length > 0 && (
                            <div className="flex items-center gap-2 overflow-x-auto py-1">
                              {rc.photos.map((img, i) => (
                                <img
                                  key={i}
                                  src={img}
                                  alt="수리 사진"
                                  className="w-16 h-12 object-cover rounded-lg border border-[#c2c6d8]/30 shrink-0"
                                />
                              ))}
                            </div>
                          )}

                          {/* Estimates & Move-in comparison note */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-[#c2c6d8]/20 text-xs">
                            <div>
                              {approvedEstimate ? (
                                <span className="font-bold text-[#0054cc]">
                                  견적/수리비: ₩{approvedEstimate.amount.toLocaleString()} ({approvedEstimate.vendorName})
                                </span>
                              ) : (
                                <span className="text-[#727787]">견적 산출 중</span>
                              )}
                            </div>

                            <div className="flex items-center gap-1.5 self-end sm:self-auto">
                              <button
                                onClick={() => {
                                  setSelectedTenantForHistory(null);
                                  setSelectedQuickCase(rc);
                                }}
                                className="text-xs bg-white hover:bg-gray-100 text-[#0054cc] font-bold border border-[#0054cc]/30 px-2.5 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>요청내역 바로보기</span>
                              </button>

                              <button
                                onClick={() => {
                                  setSelectedTenantForHistory(null);
                                  setActiveRepairId(rc.id);
                                  setActiveTab('chat');
                                }}
                                className="text-xs bg-[#0054cc] hover:bg-[#066bfd] text-white font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>3자 대화방</span>
                              </button>

                              {rc.status === 'COMPLETED' && (
                                <button
                                  onClick={() => {
                                    setSelectedTenantForHistory(null);
                                    setActiveRepairId(rc.id);
                                    setActiveTab('completion');
                                  }}
                                  className="text-xs bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20 font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 border border-[#10B981]/30 cursor-pointer"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>보고서</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 sm:p-5 bg-[#f8f9fa] border-t border-[#c2c6d8]/30 flex items-center justify-between">
                <span className="text-xs text-[#727787]">
                  💡 임대차 계약 종료 시 원상복구 대조 자료로 활용할 수 있습니다.
                </span>
                <button
                  onClick={() => setSelectedTenantForHistory(null)}
                  className="px-4 py-2 text-xs font-bold bg-white hover:bg-gray-100 text-[#424655] border border-[#c2c6d8] rounded-xl transition-all cursor-pointer"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Modal for All Action Needed Tenants (조치 필요한 임차인 목록 전체보기 모달) */}
      {showAllActionNeededModal && (() => {
        const filteredAllCases = activeRepairCases.filter((rc) => {
          if (actionNeededFilter === 'QUOTE') return rc.status === 'QUOTE_UPLOADED';
          if (actionNeededFilter === 'CHATTING') return rc.status === 'CHATTING';
          if (actionNeededFilter === 'REQUESTED') return rc.status === 'REQUESTED';
          return true;
        });

        const quoteCount = activeRepairCases.filter((c) => c.status === 'QUOTE_UPLOADED').length;
        const chattingCount = activeRepairCases.filter((c) => c.status === 'CHATTING').length;
        const requestedCount = activeRepairCases.filter((c) => c.status === 'REQUESTED').length;

        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={() => setShowAllActionNeededModal(false)}
          >
            <div
              className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-[#c2c6d8]/40 overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-5 sm:p-6 bg-[#fcf9f8] border-b border-[#c2c6d8]/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#0054cc]/10 text-[#0054cc] flex items-center justify-center shrink-0">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-black text-[#1b1c1c]">
                        조치 필요한 임차인 목록 전체보기
                      </h3>
                      <span className="text-xs font-black text-[#0054cc] bg-[#0054cc]/10 px-2.5 py-0.5 rounded-full">
                        총 {activeRepairCases.length}건
                      </span>
                    </div>
                    <p className="text-xs text-[#727787] mt-0.5">
                      임대인의 조치 및 협의, 견적 승인이 필요한 전체 진행 중 목록입니다.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowAllActionNeededModal(false)}
                  className="w-8 h-8 rounded-full bg-white hover:bg-gray-100 text-[#727787] hover:text-[#1b1c1c] flex items-center justify-center transition-colors border border-[#c2c6d8]/30 cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Filter Pills */}
              <div className="px-5 sm:px-6 py-3 bg-[#f8f9fa] border-b border-[#c2c6d8]/20 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-[#727787] mr-1 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5 text-[#0054cc]" />
                  <span>상태 필터:</span>
                </span>
                <button
                  onClick={() => setActionNeededFilter('ALL')}
                  className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    actionNeededFilter === 'ALL'
                      ? 'bg-[#0054cc] text-white shadow-xs'
                      : 'bg-white text-[#424655] hover:bg-gray-100 border border-[#c2c6d8]/30'
                  }`}
                >
                  전체 ({activeRepairCases.length})
                </button>
                <button
                  onClick={() => setActionNeededFilter('QUOTE')}
                  className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    actionNeededFilter === 'QUOTE'
                      ? 'bg-[#F59E0B] text-white shadow-xs'
                      : 'bg-white text-[#424655] hover:bg-gray-100 border border-[#c2c6d8]/30'
                  }`}
                >
                  견적 도착 ({quoteCount})
                </button>
                <button
                  onClick={() => setActionNeededFilter('CHATTING')}
                  className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    actionNeededFilter === 'CHATTING'
                      ? 'bg-[#0054cc] text-white shadow-xs'
                      : 'bg-white text-[#424655] hover:bg-gray-100 border border-[#c2c6d8]/30'
                  }`}
                >
                  대화 중 ({chattingCount})
                </button>
                <button
                  onClick={() => setActionNeededFilter('REQUESTED')}
                  className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    actionNeededFilter === 'REQUESTED'
                      ? 'bg-[#EF4444] text-white shadow-xs'
                      : 'bg-white text-[#424655] hover:bg-gray-100 border border-[#c2c6d8]/30'
                  }`}
                >
                  요청 접수 ({requestedCount})
                </button>
              </div>

              {/* Cases List */}
              <div className="p-5 sm:p-6 overflow-y-auto space-y-3 text-left max-h-[520px]">
                {filteredAllCases.length === 0 ? (
                  <div className="p-8 text-center text-xs text-[#727787] bg-[#f8f9fa] rounded-2xl border border-dashed border-[#c2c6d8]">
                    선택한 상태에 해당하는 조치 필요 항목이 없습니다.
                  </div>
                ) : (
                  filteredAllCases.map((rc) => {
                    const statusInfo = getStatusInfo(rc.status);
                    const approvedEstimate =
                      rc.estimates.find((e) => e.isApproved) || rc.estimates[0];

                    return (
                      <div
                        key={rc.id}
                        className="p-4 rounded-2xl border border-[#c2c6d8]/30 hover:border-[#0054cc] transition-all bg-[#fcf9f8] hover:bg-white hover:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3.5"
                      >
                        <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                          <div
                            className={`w-11 h-11 rounded-2xl ${statusInfo.bg} flex items-center justify-center ${statusInfo.text} shrink-0`}
                          >
                            {statusInfo.icon}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${statusInfo.bg} ${statusInfo.text}`}
                              >
                                {statusInfo.label}
                              </span>
                              <span className="text-xs font-black text-[#0054cc]">#{rc.id}</span>
                              <span className="text-xs font-bold text-[#1b1c1c]">
                                {rc.unit} ({rc.tenantName})
                              </span>
                              <span className="text-[11px] text-[#727787]">
                                • {rc.category}
                              </span>
                            </div>
                            <h4 className="font-extrabold text-sm text-[#1b1c1c]">
                              {rc.title}
                            </h4>
                            <p className="text-xs text-[#424655] mt-1 line-clamp-1">
                              {rc.symptom}
                            </p>
                            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-[11px] text-[#727787]">
                              <span>접수: {rc.createdAt} ({formatRelativeTime(rc.createdAt)})</span>
                              {approvedEstimate && (
                                <span className="text-[#0054cc] font-bold">
                                  견적: ₩{approvedEstimate.amount.toLocaleString()} ({approvedEstimate.vendorName})
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap items-center gap-2 self-end sm:self-center shrink-0">
                          <button
                            onClick={() => {
                              setShowAllActionNeededModal(false);
                              setSelectedQuickCase(rc);
                            }}
                            className="text-xs bg-white hover:bg-gray-100 text-[#424655] border border-[#c2c6d8]/40 px-2.5 py-1.5 rounded-xl flex items-center gap-1 font-bold cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#0054cc]" />
                            <span>상세보기</span>
                          </button>

                          <button
                            onClick={() => {
                              setShowAllActionNeededModal(false);
                              setActiveRepairId(rc.id);
                              setActiveTab('estimates');
                            }}
                            className="text-xs bg-white hover:bg-gray-100 text-[#0054cc] border border-[#0054cc]/30 px-2.5 py-1.5 rounded-xl flex items-center gap-1 font-bold cursor-pointer"
                          >
                            <Receipt className="w-3.5 h-3.5 text-[#F59E0B]" />
                            <span>견적 확인</span>
                          </button>

                          <button
                            onClick={() => {
                              setShowAllActionNeededModal(false);
                              setActiveRepairId(rc.id);
                              setActiveTab('chat');
                            }}
                            className="text-xs bg-[#0054cc] hover:bg-[#066bfd] text-white px-3 py-1.5 rounded-xl flex items-center gap-1 font-extrabold transition-all cursor-pointer shadow-xs active:scale-95"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>대화방 이동</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div className="p-4 sm:p-5 bg-[#f8f9fa] border-t border-[#c2c6d8]/30 flex items-center justify-between">
                <span className="text-xs text-[#727787]">
                  💡 항목 클릭 시 대화방 또는 비교 견적서로 바로 연결됩니다.
                </span>
                <button
                  onClick={() => setShowAllActionNeededModal(false)}
                  className="px-4 py-2 text-xs font-bold bg-white hover:bg-gray-100 text-[#424655] border border-[#c2c6d8] rounded-xl transition-all cursor-pointer"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {selectedQuickCase && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setSelectedQuickCase(null)}
        >
          <div
            className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-[#c2c6d8]/40 overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-5 sm:p-6 bg-[#fcf9f8] border-b border-[#c2c6d8]/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#0054cc]/10 text-[#0054cc] flex items-center justify-center shrink-0">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-[#0054cc] bg-[#0054cc]/10 px-2 py-0.5 rounded-full">
                      #{selectedQuickCase.id}
                    </span>
                    <span className="text-xs font-bold text-[#424655]">
                      • {selectedQuickCase.category}
                    </span>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                        getStatusInfo(selectedQuickCase.status).bg
                      } ${getStatusInfo(selectedQuickCase.status).text}`}
                    >
                      {getStatusInfo(selectedQuickCase.status).label}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-[#1b1c1c] mt-0.5">
                    {selectedQuickCase.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedQuickCase(null)}
                className="w-8 h-8 rounded-full bg-white hover:bg-gray-100 text-[#727787] hover:text-[#1b1c1c] flex items-center justify-center transition-colors border border-[#c2c6d8]/30 cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-left">
              {/* Unit & Tenant Info Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#f8f9fa] p-4 rounded-2xl border border-[#c2c6d8]/20">
                <div>
                  <span className="text-[11px] text-[#727787] block font-medium">대상 호실</span>
                  <span className="text-sm font-black text-[#1b1c1c]">{selectedQuickCase.unit}</span>
                </div>
                <div>
                  <span className="text-[11px] text-[#727787] block font-medium">신청 임차인</span>
                  <span className="text-sm font-black text-[#1b1c1c]">{selectedQuickCase.tenantName}</span>
                </div>
                <div>
                  <span className="text-[11px] text-[#727787] block font-medium">접수 일시</span>
                  <span className="text-xs font-bold text-[#1b1c1c]">{selectedQuickCase.createdAt}</span>
                </div>
                <div>
                  <span className="text-[11px] text-[#727787] block font-medium">경과 기준</span>
                  <span className="text-xs font-black text-[#0054cc]">
                    {formatRelativeTime(selectedQuickCase.createdAt)}
                  </span>
                </div>
              </div>

              {/* Symptoms & Request Details */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-extrabold text-[#424655] flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-[#0054cc]" />
                  <span>고장 증상 및 요청 상세</span>
                </h4>
                <div className="bg-[#fcf9f8] p-4 rounded-2xl border border-[#c2c6d8]/30 text-xs text-[#1b1c1c] leading-relaxed whitespace-pre-wrap">
                  {selectedQuickCase.symptom}
                </div>
              </div>

              {/* Attached Photos */}
              {selectedQuickCase.photos && selectedQuickCase.photos.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-extrabold text-[#424655]">
                    현장 첨부 사진 ({selectedQuickCase.photos.length}장)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {selectedQuickCase.photos.map((img, i) => (
                      <div
                        key={i}
                        className="aspect-video rounded-2xl overflow-hidden border border-[#c2c6d8]/30 bg-black/5 group relative"
                      >
                        <img
                          src={img}
                          alt="현장 사진"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <span className="absolute bottom-1.5 right-1.5 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                          사진 #{i + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Move-in Baseline Record (원상복구 분쟁 대비) */}
              {selectedQuickCase.moveInRecord && (
                <div className="bg-[#eef5ff] p-4 rounded-2xl border border-[#0054cc]/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#0054cc] flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" />
                      <span>입주 시 사전 점검 대조 기록 ({selectedQuickCase.moveInRecord.recordedAt})</span>
                    </span>
                    <span className="text-[10px] text-[#0054cc] font-bold bg-white px-2 py-0.5 rounded-full shadow-xs">
                      원상복구 분쟁 방지
                    </span>
                  </div>
                  <p className="text-xs text-[#424655] leading-relaxed">
                    {selectedQuickCase.moveInRecord.note}
                  </p>
                </div>
              )}

              {/* Estimates Overview */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-extrabold text-[#424655] flex items-center gap-1.5">
                    <Receipt className="w-3.5 h-3.5 text-[#0054cc]" />
                    <span>등록된 수리업체 견적서 ({selectedQuickCase.estimates.length}건)</span>
                  </h4>
                </div>

                {selectedQuickCase.estimates.length === 0 ? (
                  <div className="p-4 rounded-2xl bg-[#f8f9fa] border border-[#c2c6d8]/20 text-center text-xs text-[#727787]">
                    아직 등록된 비교 견적서가 없습니다.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedQuickCase.estimates.map((est) => (
                      <div
                        key={est.id}
                        className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition-all ${
                          est.isApproved
                            ? 'bg-[#0054cc]/5 border-[#0054cc]'
                            : 'bg-white border-[#c2c6d8]/30 hover:border-[#0054cc]/50'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-xs text-[#1b1c1c]">
                              {est.vendorName}
                            </span>
                            {est.isApproved && (
                              <span className="text-[10px] font-bold bg-[#0054cc] text-white px-2 py-0.5 rounded-full">
                                최종 승인됨
                              </span>
                            )}
                            {est.isRecommended && (
                              <span className="text-[10px] font-bold bg-[#F59E0B]/10 text-[#F59E0B] px-2 py-0.5 rounded-full">
                                추천 견적
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#424655]">{est.details}</p>
                          <p className="text-[11px] text-[#727787]">방문 예정일: {est.expectedDate}</p>
                        </div>
                        <div className="sm:text-right shrink-0">
                          <span className="text-sm font-black text-[#0054cc]">
                            ₩{est.amount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer Quick Action Buttons (퀙메뉴) */}
            <div className="p-4 sm:p-5 bg-[#f8f9fa] border-t border-[#c2c6d8]/30 flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    setActiveRepairId(selectedQuickCase.id);
                    setActiveTab('estimates');
                    setSelectedQuickCase(null);
                  }}
                  className="bg-[#0054cc] hover:bg-[#066bfd] text-white font-bold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  <Receipt className="w-4 h-4" />
                  <span>비교 견적서 보기</span>
                </button>

                <button
                  onClick={() => {
                    setActiveRepairId(selectedQuickCase.id);
                    setActiveTab('chat');
                    setSelectedQuickCase(null);
                  }}
                  className="bg-white hover:bg-gray-50 text-[#0054cc] border border-[#0054cc]/30 font-bold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>3자 협의방 이동</span>
                </button>

                {selectedQuickCase.status === 'COMPLETED' && (
                  <button
                    onClick={() => {
                      setActiveRepairId(selectedQuickCase.id);
                      setActiveTab('completion');
                      setSelectedQuickCase(null);
                    }}
                    className="bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>완료 보고서 보기</span>
                  </button>
                )}
              </div>

              <button
                onClick={() => setSelectedQuickCase(null)}
                className="px-4 py-2.5 text-xs font-bold text-[#727787] hover:text-[#1b1c1c] hover:bg-gray-200/60 rounded-xl transition-all cursor-pointer ml-auto"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
