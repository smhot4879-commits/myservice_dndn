import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Estimate } from '../types';
import { Receipt, CheckCircle2, ShieldCheck, Plus, ArrowLeft, MessageSquare, Award, Clock } from 'lucide-react';

export const EstimateComparisonView: React.FC = () => {
  const { repairCases, activeRepairId, approveEstimate, addEstimateToCase, setActiveTab } = useApp();

  const currentCase = repairCases.find((c) => c.id === activeRepairId) || repairCases[0];

  const [showAddModal, setShowAddModal] = useState(false);
  const [approvingEst, setApprovingEst] = useState<Estimate | null>(null);
  const [vendorName, setVendorName] = useState('');
  const [amount, setAmount] = useState('160000');
  const [details, setDetails] = useState('');
  const [expectedDate, setExpectedDate] = useState('2026.07.28 14:00');

  if (!currentCase) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center bg-white rounded-3xl border border-[#c2c6d8]/30 space-y-4 animate-in fade-in">
        <Receipt className="w-12 h-12 text-[#0054cc] mx-auto" />
        <h3 className="text-lg font-bold text-[#1b1c1c]">선택되거나 등록된 수리 요청건이 없습니다.</h3>
        <p className="text-xs text-[#727787]">수리 요청서를 작성하시거나 대시보드에서 수리건을 선택해주세요.</p>
        <button
          onClick={() => setActiveTab('repair-request')}
          className="px-5 py-2.5 bg-[#0054cc] text-white font-bold text-xs rounded-xl hover:bg-[#066bfd] transition-all cursor-pointer"
        >
          수리 요청서 작성하기
        </button>
      </div>
    );
  }

  const confirmApprove = (est: Estimate) => {
    approveEstimate(currentCase.id, est.id);
    setApprovingEst(null);
    setActiveTab('chat');
  };

  const handleAddEstimateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorName || !amount) return;

    addEstimateToCase(currentCase.id, {
      vendorName,
      amount: parseInt(amount, 10),
      details: details || '전문 기사 현장 방문 수리 항목',
      expectedDate,
    });

    setVendorName('');
    setAmount('');
    setDetails('');
    setShowAddModal(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#c2c6d8]/40 pb-4">
        <div>
          <button
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-1.5 text-[#424655] hover:text-[#0054cc] font-bold text-sm cursor-pointer mb-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>대시보드로 돌아가기</span>
          </button>
          <h2 className="text-2xl font-extrabold text-[#1b1c1c]">
            {currentCase.title} - 투명 비교 견적서 ({currentCase.estimates.length}건)
          </h2>
          <p className="text-xs text-[#424655] mt-0.5">
            소재지: <span className="font-bold text-[#1b1c1c]">{currentCase.unit}</span> | 접수일: {currentCase.createdAt}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-[#f0eded] hover:bg-[#e5e2e1] text-[#1b1c1c] font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-[#0054cc]" />
            <span>견적서 추가</span>
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className="px-4 py-2.5 bg-[#0054cc] text-white font-bold text-xs rounded-xl hover:bg-[#066bfd] transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
          >
            <MessageSquare className="w-4 h-4" />
            <span>실시간 대화방</span>
          </button>
        </div>
      </div>

      {/* Info Callout */}
      <div className="bg-[#dae2ff]/40 p-4 rounded-2xl border border-[#0054cc]/20 flex items-center gap-3">
        <ShieldCheck className="w-6 h-6 text-[#0054cc] shrink-0" />
        <p className="text-xs text-[#001847] leading-relaxed">
          <span className="font-bold">든든집사 투명 정산 시스템:</span> 등록된 3개 이상의 비교 견적안을 종합 비교하여 적정 수리비를 판단하실 수 있습니다. 승인 즉시 3자 채팅방에 합의서가 보관됩니다.
        </p>
      </div>

      {/* Estimates Side-By-Side Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {currentCase.estimates.map((est) => (
          <div
            key={est.id}
            className={`bg-white rounded-3xl p-6 shadow-xs border transition-all relative flex flex-col justify-between ${
              est.isApproved
                ? 'border-2 border-[#10B981] ring-4 ring-[#10B981]/10 bg-[#10B981]/5'
                : est.isRecommended
                ? 'border-2 border-[#0054cc] ring-2 ring-[#0054cc]/10'
                : 'border-[#c2c6d8]/40 hover:border-[#0054cc]'
            }`}
          >
            {/* Badges */}
            <div className="flex justify-between items-center mb-4">
              {est.isApproved ? (
                <span className="bg-[#10B981] text-white text-[11px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>승인 완료된 견적</span>
                </span>
              ) : est.isRecommended ? (
                <span className="bg-[#0054cc] text-white text-[11px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  <span>최적 추천안</span>
                </span>
              ) : (
                <span className="bg-[#f0eded] text-[#424655] text-[11px] font-bold px-3 py-1 rounded-full">
                  일반 견적안
                </span>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-extrabold text-lg text-[#1b1c1c]">{est.vendorName}</h3>
                <p className="text-2xl font-black text-[#0054cc] mt-1">
                  ₩{est.amount.toLocaleString()} <span className="text-xs font-normal text-[#424655]">원</span>
                </p>
              </div>

              <div className="bg-[#f6f3f2] p-4 rounded-2xl space-y-2">
                <p className="text-xs font-bold text-[#1b1c1c]">수리 및 작업 세부 내용</p>
                <p className="text-xs text-[#424655] leading-relaxed">{est.details}</p>
              </div>

              <div className="flex items-center gap-2 text-xs text-[#424655] bg-[#fcf9f8] p-3 rounded-xl border border-[#c2c6d8]/30">
                <Clock className="w-4 h-4 text-[#0054cc]" />
                <span>방문 가능 일시: <strong className="text-[#1b1c1c]">{est.expectedDate}</strong></span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 pt-4 border-t border-[#c2c6d8]/30">
              {est.isApproved ? (
                <button
                  onClick={() => setActiveTab('chat')}
                  className="w-full py-3 bg-[#10B981] hover:bg-[#059669] text-white font-extrabold text-xs text-center rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>✓ 최종 승인 완료 (대화방 이동)</span>
                </button>
              ) : (
                <button
                  onClick={() => setApprovingEst(est)}
                  className="w-full py-3 bg-[#0054cc] hover:bg-[#066bfd] text-white font-extrabold text-xs rounded-xl shadow-md hover:scale-[1.01] active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>이 업체로 승인하기</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Approve Confirmation Modal */}
      {approvingEst && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 border border-[#c2c6d8]/40">
            <div className="flex items-center gap-3 border-b border-[#f0eded] pb-3">
              <div className="w-10 h-10 rounded-2xl bg-[#0054cc]/10 text-[#0054cc] flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#1b1c1c]">수리 업체 견적 승인</h3>
                <p className="text-xs text-[#424655]">선택하신 견적안으로 최종 승인을 진행합니다.</p>
              </div>
            </div>

            <div className="bg-[#f6f3f2] p-4 rounded-2xl space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#424655]">업체명</span>
                <span className="text-sm font-extrabold text-[#1b1c1c]">{approvingEst.vendorName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#424655]">최종 견적 금액</span>
                <span className="text-base font-black text-[#0054cc]">₩{approvingEst.amount.toLocaleString()} 원</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#424655]">방문 수리 일시</span>
                <span className="text-xs font-bold text-[#1b1c1c]">{approvingEst.expectedDate}</span>
              </div>
              <div className="pt-1 border-t border-[#c2c6d8]/40">
                <span className="text-xs font-bold text-[#424655] block mb-0.5">수리 내용</span>
                <p className="text-xs text-[#1b1c1c] leading-relaxed">{approvingEst.details}</p>
              </div>
            </div>

            <p className="text-xs text-[#424655] leading-relaxed bg-[#dae2ff]/30 p-3 rounded-xl border border-[#0054cc]/20">
              💡 승인 즉시 <strong className="text-[#0054cc]">수리 승인 통보</strong>가 등록되며, 임차인 및 수리 기사가 참여하는 <strong>실시간 3자 대화방</strong>으로 바로 이동합니다.
            </p>

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => setApprovingEst(null)}
                className="flex-1 py-3 border border-[#c2c6d8] text-[#424655] font-bold text-xs rounded-xl hover:bg-[#f6f3f2] cursor-pointer"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => confirmApprove(approvingEst)}
                className="flex-1 py-3 bg-[#0054cc] text-white font-extrabold text-xs rounded-xl hover:bg-[#066bfd] shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>승인 완료 및 대화방 이동</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Estimate Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-[#f0eded] pb-3">
              <h3 className="text-lg font-bold text-[#1b1c1c] flex items-center gap-2">
                <Receipt className="w-5 h-5 text-[#0054cc]" />
                <span>비교 견적서 추가 등록</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#727787] hover:text-[#1b1c1c] text-xl font-bold"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddEstimateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#424655] mb-1">업체명</label>
                <input
                  type="text"
                  required
                  placeholder="예: 삼화설비, (주) 바른수리"
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  className="w-full p-3 bg-[#f6f3f2] border border-[#c2c6d8] rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#424655] mb-1">견적 산출 금액 (원)</label>
                <input
                  type="number"
                  required
                  placeholder="예: 150000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-3 bg-[#f6f3f2] border border-[#c2c6d8] rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#424655] mb-1">세부 작업 내역</label>
                <textarea
                  rows={3}
                  placeholder="작업 부품, 교체 항목, 방수 처리 등 세부 산출 내역"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full p-3 bg-[#f6f3f2] border border-[#c2c6d8] rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#424655] mb-1">방문 수리 일시</label>
                <input
                  type="text"
                  placeholder="예: 2026.07.28 14:00"
                  value={expectedDate}
                  onChange={(e) => setExpectedDate(e.target.value)}
                  className="w-full p-3 bg-[#f6f3f2] border border-[#c2c6d8] rounded-xl text-sm"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 border border-[#c2c6d8] text-[#424655] font-bold text-sm rounded-xl hover:bg-[#f6f3f2]"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#0054cc] text-white font-bold text-sm rounded-xl hover:bg-[#066bfd] shadow-md"
                >
                  견적서 등록
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
