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
  History,
  Eye,
  X,
  Filter,
  Check,
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

  // Tab & state for Landlord Lease Management
  const [leaseTab, setLeaseTab] = useState<'UNITS' | 'REPAIR_HISTORY'>('UNITS');
  const [tenantFilterId, setTenantFilterId] = useState<string>('ALL');
  const [selectedTenantForHistory, setSelectedTenantForHistory] = useState<PropertyUnit | null>(null);
  const [selectedQuickCase, setSelectedQuickCase] = useState<RepairCase | null>(null);

  // State for Action Needed modal & filters
  const [showAllActionNeededModal, setShowAllActionNeededModal] = useState(false);
  const [actionNeededFilter, setActionNeededFilter] = useState<'ALL' | 'QUOTE' | 'REQUESTED' | 'CHATTING'>('ALL');

  // Active & Completed cases
  const activeRepairCases = repairCases.filter((c) => c.status !== 'COMPLETED');
  const completedRepairCases = repairCases.filter((c) => c.status === 'COMPLETED');
  const activeCase = activeRepairCases.find((c) => c.id === activeRepairId) || activeRepairCases[0] || repairCases[0];

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

  // Concept A Zero-Pill status mapper: clean dot indicator + precise text
  const getStatusInfo = (status: string) => {
    const map: Record<
      string,
      { label: string; dotColor: string; textColor: string; icon: React.ReactNode }
    > = {
      REQUESTED: {
        label: '요청 접수',
        dotColor: 'bg-rose-500',
        textColor: 'text-rose-700',
        icon: <Wrench className="w-4 h-4 text-rose-600" />,
      },
      CHATTING: {
        label: '협의 중',
        dotColor: 'bg-blue-600',
        textColor: 'text-blue-700',
        icon: <MessageSquare className="w-4 h-4 text-blue-600" />,
      },
      QUOTE_UPLOADED: {
        label: '견적 도착',
        dotColor: 'bg-amber-500',
        textColor: 'text-amber-800',
        icon: <Receipt className="w-4 h-4 text-amber-600" />,
      },
      LANDLORD_APPROVED: {
        label: '임대인 승인',
        dotColor: 'bg-blue-600',
        textColor: 'text-blue-700',
        icon: <CheckCircle2 className="w-4 h-4 text-blue-600" />,
      },
      APPROVED: {
        label: '승인 완료',
        dotColor: 'bg-blue-600',
        textColor: 'text-blue-700',
        icon: <CheckCircle2 className="w-4 h-4 text-blue-600" />,
      },
      REPAIRING: {
        label: '수리 진행 중',
        dotColor: 'bg-indigo-500',
        textColor: 'text-indigo-700',
        icon: <Wrench className="w-4 h-4 text-indigo-600" />,
      },
      COMPLETED: {
        label: '수리 완료',
        dotColor: 'bg-emerald-600',
        textColor: 'text-emerald-700',
        icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
      },
    };
    return (
      map[status] || {
        label: status,
        dotColor: 'bg-neutral-400',
        textColor: 'text-neutral-700',
        icon: <Wrench className="w-4 h-4 text-neutral-500" />,
      }
    );
  };

  const handleAddUnitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBuilding || !newUnit) return;
    addPropertyUnit({
      buildingName: newBuilding,
      unitName: newUnit,
      address: newAddress || '서울특별시 서초구',
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
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Welcome Header */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-950 tracking-tight">
              안녕하세요, 김지수 관리자님
            </h2>
            <span className="font-mono text-xs text-neutral-400 font-medium">
              3개 매물 관리 중
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            임대인 승인 및 조치가 필요한 수리 요청이{' '}
            <span className="font-semibold text-neutral-900 underline underline-offset-4 decoration-blue-600">
              {activeRepairCases.length}건
            </span>
            있습니다.
          </p>
        </div>
        <button
          onClick={() => setShowShowAddUnitModal(true)}
          className="bg-[#0F172A] hover:bg-[#1E293B] text-white px-3.5 py-2 rounded-lg font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>매물/호실 추가</span>
        </button>
      </section>

      {/* Main Grid: 8 cols left, 4 cols right */}
      <div className="grid grid-cols-12 gap-5">
        {/* Left Column (8 cols) */}
        <div className="col-span-12 lg:col-span-8 space-y-5">
          {/* Action Needed Section */}
          <div className="bg-white p-5 sm:p-6 rounded-xl border border-neutral-200 shadow-xs">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-neutral-900">
                  조치 필요한 임차인 수리 요청
                </h3>
                <span className="font-mono text-xs text-neutral-500 tabular-nums">
                  ({displayedActiveCases.length}/{activeRepairCases.length})
                </span>
              </div>
              <button
                onClick={() => setShowAllActionNeededModal(true)}
                className="text-neutral-500 hover:text-blue-600 text-xs font-semibold cursor-pointer flex items-center gap-1 transition-colors"
                title="조치 필요한 임차인 전체 목록 보기"
              >
                <span>전체 {activeRepairCases.length}건 보기</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-neutral-100">
              {displayedActiveCases.length === 0 ? (
                <div className="text-center py-8 text-neutral-400 text-xs">
                  현재 조치가 필요한 수리 요청이 없습니다.
                </div>
              ) : (
                displayedActiveCases.map((rc) => {
                  const statusInfo = getStatusInfo(rc.status);
                  return (
                    <div
                      key={rc.id}
                      onClick={() => {
                        setActiveRepairId(rc.id);
                        setActiveTab('chat');
                      }}
                      className="group flex items-center justify-between py-3 hover:bg-neutral-50/80 px-2 rounded-lg transition-all cursor-pointer gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-8 h-8 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center shrink-0">
                          {statusInfo.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-semibold text-neutral-900">
                              {rc.unit}
                            </span>
                            <span className="text-neutral-300">·</span>
                            <h4 className="font-semibold text-xs text-neutral-900 truncate">
                              {rc.title}
                            </h4>
                          </div>
                          <p className="text-[11px] text-neutral-400 truncate mt-0.5 font-mono">
                            {rc.tenantName} · {rc.createdAt} ({formatRelativeTime(rc.createdAt)})
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {/* Zero-Pill status: text + quiet dot */}
                        <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-700">
                          <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotColor}`} />
                          <span>{statusInfo.label}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-700 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {activeRepairCases.length > 5 && (
              <div className="pt-3 mt-1 border-t border-neutral-100 text-center">
                <button
                  onClick={() => setShowAllActionNeededModal(true)}
                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center justify-center gap-1 mx-auto cursor-pointer"
                >
                  <span>외 {activeRepairCases.length - 5}개 요청 더보기</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Integrated Active Repair Case: Concept A Toss/Linear Style Hero Card */}
          <div className="bg-[#0F172A] text-white p-5 sm:p-6 rounded-xl border border-neutral-800 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                    Active Repair Pipeline
                  </span>
                </div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  {activeCase?.unit} · {activeCase?.title || '거실 에어컨 수리'}
                </h3>
              </div>
              <div className="text-right">
                <span className="font-mono text-xs text-neutral-300 block">
                  #{activeCase?.id || 'req-001'}
                </span>
                <span className="text-[11px] text-neutral-400 font-mono">
                  {activeCase?.tenantName}
                </span>
              </div>
            </div>

            {/* Stepper Pipeline: Clean, Minimalist Linear Style */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-6 gap-1 relative text-center">
                {/* Step 1 */}
                <div className="space-y-1.5">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center mx-auto text-xs font-mono font-bold shadow-xs">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-medium text-neutral-300 block">1. 접수</span>
                </div>

                {/* Step 2 */}
                <div className="space-y-1.5">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center mx-auto text-xs font-mono font-bold shadow-xs">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-medium text-neutral-300 block">2. 협의</span>
                </div>

                {/* Step 3 */}
                <div className="space-y-1.5">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center mx-auto text-xs font-mono font-bold shadow-xs">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-medium text-neutral-300 block">3. 견적</span>
                </div>

                {/* Step 4 (Active Current Stage) */}
                <div className="space-y-1.5">
                  <div className="w-6 h-6 rounded-full bg-white text-[#0F172A] flex items-center justify-center mx-auto text-xs font-mono font-bold shadow-md ring-2 ring-blue-500/50 animate-pulse">
                    4
                  </div>
                  <span className="text-[10px] font-bold text-white block">4. 임대인 승인</span>
                </div>

                {/* Step 5 */}
                <div className="space-y-1.5 opacity-40">
                  <div className="w-6 h-6 rounded-full border border-neutral-500 text-neutral-400 flex items-center justify-center mx-auto text-xs font-mono">
                    5
                  </div>
                  <span className="text-[10px] text-neutral-400 block">5. 시공</span>
                </div>

                {/* Step 6 */}
                <div className="space-y-1.5 opacity-40">
                  <div className="w-6 h-6 rounded-full border border-neutral-500 text-neutral-400 flex items-center justify-center mx-auto text-xs font-mono">
                    6
                  </div>
                  <span className="text-[10px] text-neutral-400 block">6. 완료</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => {
                  setActiveRepairId(activeCase?.id || 'req-001');
                  setActiveTab('estimates');
                }}
                className="flex-1 bg-white hover:bg-neutral-100 text-neutral-900 font-semibold py-2.5 px-3 rounded-lg text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-98"
              >
                <Receipt className="w-4 h-4 text-blue-600" />
                <span>비교 견적서 3사 확인 및 승인</span>
              </button>
              <button
                onClick={() => {
                  setActiveRepairId(activeCase?.id || 'req-001');
                  setActiveTab('chat');
                }}
                className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 font-semibold py-2.5 px-4 rounded-lg text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
              >
                <MessageSquare className="w-4 h-4 text-neutral-300" />
                <span>3자 협의방 열기</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Landlord Lease & Repair Management */}
        <div className="col-span-12 lg:col-span-4 space-y-5">
          <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs h-full flex flex-col justify-between">
            <div>
              {/* Header & Tabs */}
              <div className="mb-4 pb-3 border-b border-neutral-100">
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-neutral-700" />
                    <span>호실 및 임차인 관리</span>
                  </h3>
                </div>

                {/* Segmented Control */}
                <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg">
                  <button
                    onClick={() => setLeaseTab('UNITS')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                      leaseTab === 'UNITS'
                        ? 'bg-white text-neutral-900 shadow-xs border border-neutral-200/40'
                        : 'text-neutral-500 hover:text-neutral-900'
                    }`}
                  >
                    <span>호실 목록</span>
                    <span className="font-mono text-[10px] text-neutral-400">
                      {propertyUnits.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setLeaseTab('REPAIR_HISTORY')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                      leaseTab === 'REPAIR_HISTORY'
                        ? 'bg-white text-neutral-900 shadow-xs border border-neutral-200/40'
                        : 'text-neutral-500 hover:text-neutral-900'
                    }`}
                  >
                    <span>수리 이력</span>
                    <span className="font-mono text-[10px] text-neutral-400">
                      {repairCases.length}
                    </span>
                  </button>
                </div>
              </div>

              {/* Tab 1: Units list */}
              {leaseTab === 'UNITS' && (
                <div className="space-y-3">
                  {propertyUnits.map((unit) => {
                    const unitRepairs = getCasesForUnit(unit);
                    const activeCount = unitRepairs.filter((c) => c.status !== 'COMPLETED').length;
                    return (
                      <div
                        key={unit.id}
                        className="p-3.5 rounded-lg border border-neutral-200 hover:border-neutral-300 transition-all bg-white hover:bg-neutral-50/50"
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div>
                            <h4 className="font-bold text-xs text-neutral-900">
                              {unit.buildingName} {unit.unitName}
                            </h4>
                            <p className="text-[11px] text-neutral-500 font-mono mt-0.5">
                              {unit.tenantName} · 만료 {unit.contractEnd}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 text-[11px] font-medium text-neutral-600">
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                unit.status === '입주중' ? 'bg-emerald-600' : 'bg-amber-500'
                              }`}
                            />
                            <span>{unit.status}</span>
                          </div>
                        </div>

                        {/* Repair count metadata */}
                        <div className="mt-2 pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px]">
                          <span className="text-neutral-500 font-mono">
                            수리 이력: <b className="text-neutral-900">{unitRepairs.length}건</b>
                            {activeCount > 0 && (
                              <span className="text-rose-600 ml-1">({activeCount}건 진행)</span>
                            )}
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedTenantForHistory(unit)}
                              className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                            >
                              이력보기
                            </button>
                            <span className="text-neutral-200">|</span>
                            <button
                              onClick={() => {
                                const firstCase = unitRepairs[0];
                                setActiveRepairId(firstCase ? firstCase.id : 'req-001');
                                setActiveTab('chat');
                              }}
                              className="text-xs font-medium text-neutral-600 hover:text-neutral-950 cursor-pointer"
                            >
                              대화
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Tab 2: Repair History by Tenant */}
              {leaseTab === 'REPAIR_HISTORY' && (
                <div className="space-y-3">
                  {/* Filter chips */}
                  <div className="flex flex-wrap gap-1 pb-1">
                    <button
                      onClick={() => setTenantFilterId('ALL')}
                      className={`text-[11px] px-2 py-0.5 rounded font-medium transition-all cursor-pointer ${
                        tenantFilterId === 'ALL'
                          ? 'bg-neutral-900 text-white'
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
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
                          className={`text-[11px] px-2 py-0.5 rounded font-medium transition-all cursor-pointer ${
                            tenantFilterId === u.id
                              ? 'bg-neutral-900 text-white'
                              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                          }`}
                        >
                          {u.unitName} ({count})
                        </button>
                      );
                    })}
                  </div>

                  {/* List */}
                  <div className="space-y-2 max-h-[440px] overflow-y-auto pr-0.5 divide-y divide-neutral-100">
                    {displayedTenantRepairs.length === 0 ? (
                      <div className="p-6 text-center text-xs text-neutral-400">
                        등록된 수리 이력이 없습니다.
                      </div>
                    ) : (
                      displayedTenantRepairs.map((rc) => {
                        const statusInfo = getStatusInfo(rc.status);
                        return (
                          <div key={rc.id} className="pt-2 pb-1 space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-semibold text-neutral-900">
                                {rc.unit} · {rc.tenantName}
                              </span>
                              <div className="flex items-center gap-1 text-[11px]">
                                <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotColor}`} />
                                <span className={statusInfo.textColor}>{statusInfo.label}</span>
                              </div>
                            </div>
                            <h5 className="text-xs text-neutral-700 truncate font-medium">
                              {rc.title}
                            </h5>
                            <div className="flex items-center justify-between text-[11px] text-neutral-400 font-mono">
                              <span>{rc.createdAt}</span>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setSelectedQuickCase(rc)}
                                  className="text-blue-600 hover:underline cursor-pointer font-medium"
                                >
                                  상세
                                </button>
                                <button
                                  onClick={() => {
                                    setActiveRepairId(rc.id);
                                    setActiveTab('chat');
                                  }}
                                  className="text-neutral-600 hover:text-neutral-900 cursor-pointer"
                                >
                                  채팅
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

            {/* Occupancy Indicator */}
            <div className="mt-5 pt-4 border-t border-neutral-100">
              <div className="flex justify-between items-center text-xs mb-1.5 font-mono">
                <span className="text-neutral-500">임대 점유율</span>
                <span className="font-semibold text-neutral-900 tabular-nums">91.5%</span>
              </div>
              <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 w-[91.5%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Legal Guide & Tutorial */}
        <div className="col-span-12 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            onClick={() => setActiveTab('legal')}
            className="bg-white p-5 rounded-xl border border-neutral-200 hover:border-neutral-300 transition-all cursor-pointer flex flex-col justify-between shadow-xs group"
          >
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <HelpCircle className="w-4 h-4 text-neutral-700" />
                <h3 className="font-bold text-xs text-neutral-900">
                  임대차 수선 의무 판례 가이드
                </h3>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed">
                에어컨, 보일러, 방수 등 판례 기준 수리비 부담 주체(임대인 vs 임차인) 표준 가이드를 확인하세요.
              </p>
            </div>
            <div className="flex items-center justify-between pt-3 mt-2 border-t border-neutral-100">
              <span className="text-xs text-neutral-700 font-semibold group-hover:text-blue-600 transition-colors">
                법률 판례 확인하기
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>

          <div
            onClick={() => alert('든든집사 사용 가이드 영상: 준비 중입니다.')}
            className="bg-white p-5 rounded-xl border border-neutral-200 hover:border-neutral-300 transition-all cursor-pointer flex flex-col justify-between shadow-xs group"
          >
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <PlayCircle className="w-4 h-4 text-neutral-700" />
                <h3 className="font-bold text-xs text-neutral-900">
                  서비스 이용 안내
                </h3>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed">
                3사 비교 견적서 승인 프로세스와 3자 채팅 보관을 통해 분쟁 없는 임대 관리를 시작하세요.
              </p>
            </div>
            <div className="flex items-center justify-between pt-3 mt-2 border-t border-neutral-100">
              <span className="text-xs text-neutral-700 font-semibold group-hover:text-blue-600 transition-colors">
                사용 가이드 확인하기
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>
        </div>
      </div>

      {/* Add Unit Modal: Concept A */}
      {showAddUnitModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl border border-neutral-200 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
              <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-neutral-800" />
                <span>새 매물/호실 등록</span>
              </h3>
              <button
                onClick={() => setShowShowAddUnitModal(false)}
                className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddUnitSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">건물명</label>
                <input
                  type="text"
                  required
                  placeholder="예: 그린빌, 서초그랑자이"
                  value={newBuilding}
                  onChange={(e) => setNewBuilding(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs outline-none focus:bg-white focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">동/호수</label>
                <input
                  type="text"
                  required
                  placeholder="예: 102동 1504호"
                  value={newUnit}
                  onChange={(e) => setNewUnit(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs outline-none focus:bg-white focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">소재지 주소</label>
                <input
                  type="text"
                  placeholder="예: 서울특별시 서초구 효령로 403"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs outline-none focus:bg-white focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">임차인 이름 (선택)</label>
                <input
                  type="text"
                  placeholder="미입력시 '초대 대기'로 등록됩니다"
                  value={newTenant}
                  onChange={(e) => setNewTenant(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs outline-none focus:bg-white focus:border-blue-600"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowShowAddUnitModal(false)}
                  className="flex-1 py-2 border border-neutral-200 text-neutral-600 font-semibold text-xs rounded-lg hover:bg-neutral-50 cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#0F172A] text-white font-semibold text-xs rounded-lg hover:bg-[#1E293B] shadow-xs cursor-pointer"
                >
                  호실 등록하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tenant Repair History Modal: Concept A */}
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
            onClick={() => setSelectedTenantForHistory(null)}
          >
            <div
              className="bg-white w-full max-w-2xl rounded-xl shadow-xl border border-neutral-200 overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-neutral-900">
                      {selectedTenantForHistory.buildingName} {selectedTenantForHistory.unitName}
                    </span>
                    <span className="text-neutral-300">·</span>
                    <span className="text-xs text-neutral-600">
                      임차인 {selectedTenantForHistory.tenantName}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-neutral-900 mt-0.5">
                    수리 이력 내역서 ({unitCases.length}건)
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedTenantForHistory(null)}
                  className="p-1 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 overflow-y-auto space-y-4 text-left">
                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2 bg-neutral-50 p-3 rounded-lg border border-neutral-200 font-mono text-center">
                  <div>
                    <span className="text-[10px] text-neutral-400 block">누적 수리</span>
                    <span className="text-sm font-bold text-neutral-900 tabular-nums">{unitCases.length}건</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block">진행 중</span>
                    <span className="text-sm font-bold text-rose-600 tabular-nums">{activeCount}건</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block">누적 지출</span>
                    <span className="text-sm font-bold text-neutral-900 tabular-nums">₩{totalSpent.toLocaleString()}</span>
                  </div>
                </div>

                {/* Cases */}
                <div className="divide-y divide-neutral-100">
                  {unitCases.length === 0 ? (
                    <div className="py-8 text-center text-xs text-neutral-400">
                      등록된 수리 이력이 없습니다.
                    </div>
                  ) : (
                    unitCases.map((rc) => {
                      const statusInfo = getStatusInfo(rc.status);
                      const approvedEstimate =
                        rc.estimates.find((e) => e.isApproved) || rc.estimates[0];
                      return (
                        <div key={rc.id} className="py-3 space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5 font-semibold text-neutral-900">
                              <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotColor}`} />
                              <span>{statusInfo.label}</span>
                              <span className="text-neutral-300">·</span>
                              <span className="font-mono text-neutral-500">#{rc.id}</span>
                            </div>
                            <span className="text-[11px] text-neutral-400 font-mono">{rc.createdAt}</span>
                          </div>
                          <h4 className="text-xs font-bold text-neutral-900">{rc.title}</h4>
                          <p className="text-xs text-neutral-500">{rc.symptom}</p>
                          <div className="flex items-center justify-between pt-1 text-[11px]">
                            <span className="font-mono text-neutral-700">
                              {approvedEstimate ? `₩${approvedEstimate.amount.toLocaleString()}` : '견적 산출 중'}
                            </span>
                            <button
                              onClick={() => {
                                setSelectedTenantForHistory(null);
                                setActiveRepairId(rc.id);
                                setActiveTab('chat');
                              }}
                              className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                            >
                              협의방 이동 →
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="p-3 bg-neutral-50 border-t border-neutral-200 flex justify-end">
                <button
                  onClick={() => setSelectedTenantForHistory(null)}
                  className="px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-200 rounded-md cursor-pointer"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* All Action Needed Modal */}
      {showAllActionNeededModal && (() => {
        const filteredAllCases = activeRepairCases.filter((rc) => {
          if (actionNeededFilter === 'QUOTE') return rc.status === 'QUOTE_UPLOADED';
          if (actionNeededFilter === 'CHATTING') return rc.status === 'CHATTING';
          if (actionNeededFilter === 'REQUESTED') return rc.status === 'REQUESTED';
          return true;
        });

        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
            onClick={() => setShowAllActionNeededModal(false)}
          >
            <div
              className="bg-white w-full max-w-3xl rounded-xl shadow-xl border border-neutral-200 overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">
                    조치 필요한 임차인 수리 요청 전체
                  </h3>
                  <p className="text-xs text-neutral-500 font-mono mt-0.5">
                    총 {activeRepairCases.length}건 대기 중
                  </p>
                </div>
                <button
                  onClick={() => setShowAllActionNeededModal(false)}
                  className="p-1 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Filter Tabs */}
              <div className="px-4 py-2 border-b border-neutral-200 flex items-center gap-1.5 text-xs">
                <button
                  onClick={() => setActionNeededFilter('ALL')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                    actionNeededFilter === 'ALL'
                      ? 'bg-neutral-900 text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  전체 ({activeRepairCases.length})
                </button>
                <button
                  onClick={() => setActionNeededFilter('QUOTE')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                    actionNeededFilter === 'QUOTE'
                      ? 'bg-neutral-900 text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  견적 도착
                </button>
                <button
                  onClick={() => setActionNeededFilter('CHATTING')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                    actionNeededFilter === 'CHATTING'
                      ? 'bg-neutral-900 text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  대화 중
                </button>
              </div>

              <div className="p-4 overflow-y-auto divide-y divide-neutral-100 text-left">
                {filteredAllCases.map((rc) => {
                  const statusInfo = getStatusInfo(rc.status);
                  return (
                    <div
                      key={rc.id}
                      className="py-3 flex items-center justify-between gap-3 hover:bg-neutral-50 px-2 rounded-lg"
                    >
                      <div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-semibold text-neutral-900 font-mono">{rc.unit}</span>
                          <span className="text-neutral-300">·</span>
                          <span className="font-semibold text-neutral-900">{rc.title}</span>
                        </div>
                        <p className="text-[11px] text-neutral-500 mt-0.5">
                          {rc.tenantName} · {rc.createdAt} ({formatRelativeTime(rc.createdAt)})
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-xs font-medium mr-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotColor}`} />
                          <span className={statusInfo.textColor}>{statusInfo.label}</span>
                        </div>
                        <button
                          onClick={() => {
                            setShowAllActionNeededModal(false);
                            setActiveRepairId(rc.id);
                            setActiveTab('chat');
                          }}
                          className="px-2.5 py-1 text-xs font-semibold bg-[#0F172A] text-white rounded-md hover:bg-[#1E293B] cursor-pointer"
                        >
                          대화방
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 bg-neutral-50 border-t border-neutral-200 flex justify-end">
                <button
                  onClick={() => setShowAllActionNeededModal(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-200 rounded-md cursor-pointer"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Quick Case Details Modal */}
      {selectedQuickCase && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setSelectedQuickCase(null)}
        >
          <div
            className="bg-white w-full max-w-lg rounded-xl shadow-xl border border-neutral-200 overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
              <div>
                <span className="font-mono text-xs text-neutral-400">#{selectedQuickCase.id}</span>
                <h3 className="text-sm font-bold text-neutral-900">{selectedQuickCase.title}</h3>
              </div>
              <button
                onClick={() => setSelectedQuickCase(null)}
                className="p-1 text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3 text-xs text-left">
              <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200 font-mono space-y-1">
                <div>대상 호실: <b className="text-neutral-900">{selectedQuickCase.unit}</b></div>
                <div>임차인: <b className="text-neutral-900">{selectedQuickCase.tenantName}</b></div>
                <div>접수일: <b className="text-neutral-900">{selectedQuickCase.createdAt}</b></div>
              </div>

              <div>
                <span className="font-bold text-neutral-700 block mb-1">고장 증상</span>
                <p className="p-2.5 bg-white border border-neutral-200 rounded-lg text-neutral-800">
                  {selectedQuickCase.symptom}
                </p>
              </div>

              {selectedQuickCase.photos && selectedQuickCase.photos.length > 0 && (
                <div>
                  <span className="font-bold text-neutral-700 block mb-1">현장 사진</span>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedQuickCase.photos.map((p, i) => (
                      <img
                        key={i}
                        src={p}
                        alt="현장"
                        className="w-full h-24 object-cover rounded-lg border border-neutral-200"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 bg-neutral-50 border-t border-neutral-200 flex justify-end gap-2">
              <button
                onClick={() => setSelectedQuickCase(null)}
                className="px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-200 rounded-md cursor-pointer"
              >
                닫기
              </button>
              <button
                onClick={() => {
                  setActiveRepairId(selectedQuickCase.id);
                  setActiveTab('chat');
                  setSelectedQuickCase(null);
                }}
                className="px-3 py-1.5 text-xs font-semibold bg-[#0F172A] text-white rounded-md hover:bg-[#1E293B] cursor-pointer"
              >
                3자 협의방 열기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
