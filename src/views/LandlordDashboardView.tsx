import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
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

  // Get active cases (excluding completed ones)
  const activeRepairCases = repairCases.filter((c) => c.status !== 'COMPLETED');
  const activeCase = activeRepairCases.find((c) => c.id === activeRepairId) || activeRepairCases[0] || repairCases[0];

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
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xs border-[3px] border-[#2b3fcb]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-[#1b1c1c] flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-[#0054cc]" />
                <span>조치 필요한 임차인 목록</span>
              </h3>
              <button
                onClick={() => setActiveTab('chat')}
                className="text-[#0054cc] text-xs font-bold hover:underline cursor-pointer"
              >
                전체보기
              </button>
            </div>

            <div className="space-y-3.5">
              {activeRepairCases.length === 0 ? (
                <div className="text-center py-8 text-[#727787] text-sm">
                  현재 조치가 필요한 수리 요청이 없습니다. (모든 수리 처리 완료)
                </div>
              ) : (
                activeRepairCases.map((rc) => {
                const statusMap: Record<string, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
                  REQUESTED: { label: '요청 완료', bg: 'bg-[#EF4444]/10', text: 'text-[#EF4444]', icon: <Wrench className="w-6 h-6" /> },
                  CHATTING: { label: '대화 중', bg: 'bg-[#0054cc]/10', text: 'text-[#0054cc]', icon: <MessageSquare className="w-6 h-6" /> },
                  QUOTE_UPLOADED: { label: '견적 도착', bg: 'bg-[#F59E0B]/10', text: 'text-[#F59E0B]', icon: <Receipt className="w-6 h-6" /> },
                  LANDLORD_APPROVED: { label: '임대인 승인', bg: 'bg-[#0054cc]/10', text: 'text-[#0054cc]', icon: <CheckCircle2 className="w-6 h-6" /> },
                  APPROVED: { label: '승인 완료', bg: 'bg-[#0054cc]/10', text: 'text-[#0054cc]', icon: <CheckCircle2 className="w-6 h-6" /> },
                  REPAIRING: { label: '수리 진행 중', bg: 'bg-[#8B5CF6]/10', text: 'text-[#8B5CF6]', icon: <Wrench className="w-6 h-6" /> },
                  COMPLETED: { label: '처리 완료', bg: 'bg-[#10B981]/10', text: 'text-[#10B981]', icon: <CheckCircle2 className="w-6 h-6" /> },
                };
                const statusInfo = statusMap[rc.status] || {
                  label: rc.status,
                  bg: 'bg-[#0054cc]/10',
                  text: 'text-[#0054cc]',
                  icon: <Wrench className="w-6 h-6" />,
                };

                return (
                  <div
                    key={rc.id}
                    onClick={() => {
                      setActiveRepairId(rc.id);
                      setActiveTab('chat');
                    }}
                    className="group flex flex-row items-center justify-between p-3.5 sm:p-4 rounded-2xl border border-[#c2c6d8]/30 hover:border-[#0054cc] transition-all bg-[#fcf9f8] hover:shadow-md cursor-pointer gap-3"
                  >
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full ${statusInfo.bg} flex items-center justify-center ${statusInfo.text} shrink-0`}>
                        <div className="scale-105">{statusInfo.icon}</div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-sm text-[#1b1c1c] truncate">
                          {rc.unit} 수리 요청 ({rc.title})
                        </h4>
                        <p className="text-xs text-[#424655] truncate mt-0.5">
                          {rc.symptom} • {rc.createdAt}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-2.5 sm:px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${statusInfo.bg} ${statusInfo.text}`}>
                        {statusInfo.label}
                      </span>
                      <ChevronRight className="w-5 h-5 text-[#727787] group-hover:text-[#0054cc] group-hover:translate-x-0.5 transition-all shrink-0" />
                    </div>
                  </div>
                );
              })
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

        {/* Right Column (4 cols): Landlord Lease Management */}
        <div className="col-span-12 lg:col-span-4 space-y-6 border-[9px] border-[#d7d7c0] rounded-3xl">
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xs border border-[#c2c6d8]/30 h-full flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#1b1c1c] mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#0054cc]" />
                <span>임대차 계약 관리</span>
              </h3>

              <div className="space-y-5">
                {propertyUnits.map((unit, idx) => (
                  <div
                    key={unit.id}
                    className={`relative pl-4 border-l-4 ${
                      idx === 0
                        ? 'border-[#0054cc]'
                        : idx === 1
                        ? 'border-[#10B981]'
                        : 'border-[#c2c6d8]'
                    }`}
                  >
                    <h4 className="font-bold text-sm text-[#1b1c1c]">
                      {unit.buildingName} {unit.unitName} • {unit.tenantName}
                    </h4>
                    <p className="text-xs text-[#424655] mb-2">계약 만료: {unit.contractEnd}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setActiveTab('documents')}
                        className="text-xs text-[#0054cc] font-bold border border-[#0054cc] px-2.5 py-1 rounded-lg hover:bg-[#0054cc]/5 transition-colors cursor-pointer"
                      >
                        계약 정보
                      </button>
                      <button
                        onClick={() => {
                          setActiveRepairId('req-001');
                          setActiveTab('chat');
                        }}
                        className="text-xs text-[#424655] border border-[#c2c6d8] px-2.5 py-1 rounded-lg hover:bg-[#f6f3f2] transition-colors cursor-pointer"
                      >
                        메시지
                      </button>
                    </div>
                  </div>
                ))}
              </div>
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
    </div>
  );
};
