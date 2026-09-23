import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FileText, Download, ArrowLeft, Award, X } from 'lucide-react';
import { formatRelativeTime } from '../lib/dateUtils';

export const CompletionReportView: React.FC = () => {
  const { repairCases, activeRepairId, setActiveTab } = useApp();

  const currentCase = repairCases.find((c) => c.id === activeRepairId) || repairCases.find((c) => c.status === 'COMPLETED') || repairCases[0];

  const [showPdfModal, setShowPdfModal] = useState(false);

  if (!currentCase) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center bg-white rounded-xl border border-neutral-200 space-y-4 shadow-xs">
        <FileText className="w-10 h-10 text-neutral-400 mx-auto" />
        <h3 className="text-base font-bold text-neutral-900">수리 완료 및 정산 보고서가 없습니다.</h3>
        <p className="text-xs text-neutral-500">수리가 완료된 건이 있거나 대시보드에서 완료건을 선택해주세요.</p>
        <button
          onClick={() => setActiveTab('dashboard')}
          className="px-4 py-2 bg-[#0F172A] text-white font-semibold text-xs rounded-lg hover:bg-[#1E293B] transition-colors cursor-pointer"
        >
          대시보드로 돌아가기
        </button>
      </div>
    );
  }

  const report = currentCase.completionReport || {
    beforePhoto: currentCase.photos[0] || 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
    afterPhoto: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
    beforeNote: currentCase.symptom || '수리 진행 전 고장 상태 확인됨.',
    afterNote: '전문 수리업체 수리 완료 및 정상 가동 상태 최종 점검함.',
    completedAt: '2026.07.25 14:30',
    vendorName: currentCase.estimates[0]?.vendorName || '(주) 바른수리 인테리어',
    finalAmount: currentCase.estimates[0]?.amount || 150000,
    specialNotes: '시공 후 1년간 하자 보수 보증서 발행 완료. 임대인 및 임차인 서명 확인됨.'
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
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
              수리 완료 및 정산 보고서
            </h2>
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span>완료 #{currentCase.id}</span>
            </div>
          </div>
          <p className="text-xs text-neutral-500 font-mono mt-0.5">
            {currentCase.unit} · {currentCase.title}
          </p>
        </div>

        <button
          onClick={() => setShowPdfModal(true)}
          className="px-3.5 py-2 bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold text-xs rounded-lg shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-98"
        >
          <Download className="w-3.5 h-3.5" />
          <span>합의 증명서 (PDF)</span>
        </button>
      </div>

      {/* Main Report Container */}
      <div className="bg-white p-5 sm:p-6 rounded-xl shadow-xs border border-neutral-200 space-y-6">
        {/* Verification Banner */}
        <div className="bg-emerald-50/60 p-4 rounded-lg border border-emerald-200 flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
            ✓
          </div>
          <div>
            <h3 className="font-bold text-xs text-emerald-950">임대인 - 임차인 수리 합의 체결 완료</h3>
            <p className="text-xs text-emerald-800/80 mt-0.5">
              본 수리 건은 든든집사 투명 비교 견적 시스템을 통해 비용 승인 및 현장 검수가 완료되었습니다.
            </p>
          </div>
        </div>

        {/* Before vs After Gallery */}
        <div>
          <h3 className="font-bold text-xs text-neutral-900 mb-3 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-neutral-700" />
            <span>수리 전 / 수리 후 현장 비교 검수</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Before Card */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-rose-600">[수리 전]</span>
                <span className="text-neutral-400 font-mono text-[11px]">
                  {currentCase.createdAt} ({formatRelativeTime(currentCase.createdAt)})
                </span>
              </div>
              <div className="aspect-video rounded-lg overflow-hidden border border-neutral-200 bg-neutral-100">
                <img src={report.beforePhoto} alt="Before" className="w-full h-full object-cover" />
              </div>
              <p className="text-xs text-neutral-600 bg-neutral-50 p-3 rounded-lg border border-neutral-100 leading-relaxed">
                {report.beforeNote}
              </p>
            </div>

            {/* After Card */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-emerald-600">[수리 후]</span>
                <span className="text-neutral-400 font-mono text-[11px]">{report.completedAt}</span>
              </div>
              <div className="aspect-video rounded-lg overflow-hidden border border-neutral-200 bg-neutral-100">
                <img src={report.afterPhoto} alt="After" className="w-full h-full object-cover" />
              </div>
              <p className="text-xs text-neutral-600 bg-neutral-50 p-3 rounded-lg border border-neutral-100 leading-relaxed">
                {report.afterNote}
              </p>
            </div>
          </div>
        </div>

        {/* Milestone & Cost Summary */}
        <div className="bg-neutral-50 p-4 rounded-lg space-y-3 border border-neutral-200">
          <h4 className="font-bold text-xs text-neutral-900 border-b border-neutral-200 pb-2">
            최종 정산 및 시공 정보
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
            <div>
              <span className="text-neutral-400 text-[11px] block">시공 수리 업체</span>
              <p className="font-semibold text-neutral-900 mt-0.5">{report.vendorName}</p>
            </div>

            <div>
              <span className="text-neutral-400 text-[11px] block">최종 승인 결제액</span>
              <p className="font-bold text-sm text-neutral-900 mt-0.5 tabular-nums">
                ₩{report.finalAmount.toLocaleString()}원
              </p>
            </div>

            <div>
              <span className="text-neutral-400 text-[11px] block">하자 보수 보증</span>
              <p className="font-semibold text-emerald-700 mt-0.5">1년간 무상 AS</p>
            </div>
          </div>

          <div className="pt-2 text-xs text-neutral-500 border-t border-neutral-200/80">
            <span className="font-semibold text-neutral-700">특이사항: </span>
            {report.specialNotes}
          </div>
        </div>
      </div>

      {/* PDF Document Preview Modal */}
      {showPdfModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-xl w-full max-h-[85vh] overflow-y-auto shadow-xl space-y-4 border border-neutral-200 animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-neutral-800" />
                <h3 className="text-sm font-bold text-neutral-900">수리 및 비용 정산 합의 증명서</h3>
              </div>
              <button
                onClick={() => setShowPdfModal(false)}
                className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Document Printable Paper View */}
            <div className="bg-neutral-50 p-6 border border-neutral-300 rounded-lg space-y-4 text-neutral-900 font-mono text-xs">
              <div className="text-center border-b border-neutral-300 pb-3">
                <h1 className="text-sm font-bold tracking-widest uppercase">수리 비용 및 시설 합의서</h1>
                <p className="text-[10px] text-neutral-400 mt-0.5">인증번호: #CERT-2026-99201 · 전자서명 원본</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div className="bg-white p-2.5 rounded border border-neutral-200">
                  <p className="font-bold text-neutral-700 border-b border-neutral-200 pb-1">1. 임대인 (소유자)</p>
                  <p className="mt-1">성명: 김지수 님</p>
                  <p>호실: 그린빌 302호</p>
                </div>
                <div className="bg-white p-2.5 rounded border border-neutral-200">
                  <p className="font-bold text-neutral-700 border-b border-neutral-200 pb-1">2. 임차인 (거주자)</p>
                  <p className="mt-1">성명: {currentCase.tenantName}</p>
                  <p>계약: 월세 (1000/85)</p>
                </div>
              </div>

              <div className="bg-white p-2.5 rounded border border-neutral-200 text-[11px]">
                <p className="font-bold text-neutral-700 border-b border-neutral-200 pb-1">3. 수리 및 정산 내역</p>
                <p className="mt-1">수리건: {currentCase.title}</p>
                <p>시공사: {report.vendorName}</p>
                <p>정산금액: ₩{report.finalAmount.toLocaleString()}원 (임대인 부담 완료)</p>
              </div>

              <div className="text-center pt-3 border-t border-neutral-300 text-[11px]">
                <p className="font-semibold">위 수리건에 대하여 상호 원만히 검수 완료하였음을 증명합니다.</p>
                <p className="text-[10px] text-neutral-400 mt-1">2026년 07월 26일</p>
                <p className="font-bold text-xs text-blue-600 mt-1">든든집사 (DUNDUN HOUSE) 전자인증</p>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => {
                  alert('PDF 파일이 저장되었습니다.');
                  setShowPdfModal(false);
                }}
                className="flex-1 py-2 bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold text-xs rounded-lg shadow-xs cursor-pointer"
              >
                PDF 다운로드
              </button>
              <button
                onClick={() => setShowPdfModal(false)}
                className="px-4 py-2 border border-neutral-200 text-neutral-600 font-semibold text-xs rounded-lg hover:bg-neutral-50 cursor-pointer"
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
