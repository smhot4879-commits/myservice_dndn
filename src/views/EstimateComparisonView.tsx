import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Estimate } from '../types';
import { Receipt, CheckCircle2, Plus, ArrowLeft, MessageSquare, Clock, X, Check } from 'lucide-react';
import { formatRelativeTime } from '../lib/dateUtils';

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
      <div className="max-w-4xl mx-auto p-12 text-center bg-white rounded-xl border border-neutral-200 space-y-4 shadow-xs">
        <Receipt className="w-10 h-10 text-neutral-400 mx-auto" />
        <h3 className="text-base font-bold text-neutral-900">선택되거나 등록된 수리 요청건이 없습니다.</h3>
        <p className="text-xs text-neutral-500">수리 요청서를 작성하시거나 대시보드에서 수리건을 선택해주세요.</p>
        <button
          onClick={() => setActiveTab('repair-request')}
          className="px-4 py-2 bg-[#0F172A] text-white font-semibold text-xs rounded-lg hover:bg-[#1E293B] transition-all cursor-pointer"
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
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
        <div>
          <button
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-1.5 text-neutral-500 hover:text-neutral-900 font-semibold text-xs cursor-pointer mb-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>대시보드로 돌아가기</span>
          </button>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
              {currentCase.title}
            </h2>
            <span className="font-mono text-xs text-neutral-400">
              #{currentCase.id}
            </span>
          </div>
          <p className="text-xs text-neutral-500 font-mono mt-0.5">
            {currentCase.unit} · {currentCase.tenantName} · 접수 {currentCase.createdAt} ({formatRelativeTime(currentCase.createdAt)})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-800 font-semibold text-xs rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 text-neutral-500" />
            <span>견적서 수동 등록</span>
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className="px-3.5 py-2 bg-[#0F172A] text-white font-semibold text-xs rounded-lg hover:bg-[#1E293B] transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>3자 협의방</span>
          </button>
        </div>
      </div>

      {/* Notice Banner */}
      <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 flex items-start gap-3">
        <Receipt className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-xs text-neutral-600 leading-relaxed">
          <strong className="text-neutral-900 font-semibold">3사 비교 견적 승인 시스템:</strong> 등록된 비교 견적안의 부품 내역과 출장 비용을 대조하여 승인할 수 있습니다. 승인 즉시 임대인·임차인·수리업체 3자 대화방에 합의서가 공증 형식으로 보관됩니다.
        </p>
      </div>

      {/* Estimates 3-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {currentCase.estimates.map((est) => (
          <div
            key={est.id}
            className={`bg-white rounded-xl p-5 shadow-xs border transition-all relative flex flex-col justify-between ${
              est.isApproved
                ? 'border-emerald-600 ring-1 ring-emerald-600 bg-emerald-50/10'
                : est.isRecommended
                ? 'border-blue-600 ring-1 ring-blue-600'
                : 'border-neutral-200 hover:border-neutral-300'
            }`}
          >
            <div>
              {/* Card Meta Status */}
              <div className="flex justify-between items-center mb-3">
                {est.isApproved ? (
                  <div className="flex items-center gap-1 text-xs font-semibold text-emerald-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    <span>최종 승인 완료</span>
                  </div>
                ) : est.isRecommended ? (
                  <div className="flex items-center gap-1 text-xs font-semibold text-blue-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    <span>최적 추천안</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-xs text-neutral-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
                    <span>일반 견적안</span>
                  </div>
                )}
                <span className="font-mono text-[11px] text-neutral-400">
                  #{est.id}
                </span>
              </div>

              {/* Vendor & Pricing */}
              <div className="mb-4">
                <h3 className="font-bold text-base text-neutral-900">{est.vendorName}</h3>
                <div className="mt-1 font-mono tabular-nums text-2xl font-bold text-neutral-900 tracking-tight">
                  ₩{est.amount.toLocaleString()}
                  <span className="text-xs font-normal text-neutral-500 ml-1">원</span>
                </div>
              </div>

              {/* Work details */}
              <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-100 space-y-1 mb-3">
                <span className="text-[11px] font-semibold text-neutral-700 block">세부 시공 및 교체 내역</span>
                <p className="text-xs text-neutral-600 leading-relaxed">{est.details}</p>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-mono">
                <Clock className="w-3.5 h-3.5 text-neutral-400" />
                <span>방문: {est.expectedDate}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 pt-3 border-t border-neutral-100">
              {est.isApproved ? (
                <button
                  onClick={() => setActiveTab('chat')}
                  className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs text-center rounded-lg shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>승인 완료 (대화방 이동)</span>
                </button>
              ) : (
                <button
                  onClick={() => setApprovingEst(est)}
                  className="w-full py-2 bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold text-xs rounded-lg shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-98"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>이 견적으로 승인하기</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Approve Confirmation Modal */}
      {approvingEst && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl border border-neutral-200 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-sm font-bold text-neutral-900">
                수리 업체 견적 승인 확인
              </h3>
              <button
                onClick={() => setApprovingEst(null)}
                className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-neutral-500">업체명</span>
                <span className="font-bold text-neutral-900">{approvingEst.vendorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">최종 승인 금액</span>
                <span className="font-bold text-neutral-900 tabular-nums">₩{approvingEst.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">방문 예정 일시</span>
                <span className="text-neutral-900">{approvingEst.expectedDate}</span>
              </div>
            </div>

            <p className="text-xs text-neutral-500 leading-relaxed">
              승인 시 임차인과 시공 기사가 참여하는 3자 협의방에 합의서가 보관되며 수리 단계가 '승인 완료'로 즉시 갱신됩니다.
            </p>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setApprovingEst(null)}
                className="flex-1 py-2 border border-neutral-200 text-neutral-600 font-semibold text-xs rounded-lg hover:bg-neutral-50 cursor-pointer"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => confirmApprove(approvingEst)}
                className="flex-1 py-2 bg-[#0F172A] text-white font-semibold text-xs rounded-lg hover:bg-[#1E293B] shadow-xs cursor-pointer"
              >
                최종 승인 확정
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Estimate Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl border border-neutral-200 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
              <h3 className="text-sm font-bold text-neutral-900">
                비교 견적서 수동 등록
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddEstimateSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">업체명</label>
                <input
                  type="text"
                  required
                  placeholder="예: 삼화설비, (주) 바른수리"
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs outline-none focus:bg-white focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">견적 산출 금액 (원)</label>
                <input
                  type="number"
                  required
                  placeholder="예: 150000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs outline-none focus:bg-white focus:border-blue-600 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">세부 작업 내역</label>
                <textarea
                  rows={3}
                  placeholder="작업 부품, 교체 항목, 방수 처리 등 세부 산출 내역"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs outline-none focus:bg-white focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">방문 수리 일시</label>
                <input
                  type="text"
                  placeholder="예: 2026.07.28 14:00"
                  value={expectedDate}
                  onChange={(e) => setExpectedDate(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs outline-none focus:bg-white focus:border-blue-600 font-mono"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 border border-neutral-200 text-neutral-600 font-semibold text-xs rounded-lg hover:bg-neutral-50 cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#0F172A] text-white font-semibold text-xs rounded-lg hover:bg-[#1E293B] shadow-xs cursor-pointer"
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
