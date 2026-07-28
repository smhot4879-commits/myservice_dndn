import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, FileText, Download, ArrowLeft, ShieldCheck, Award, Calendar, DollarSign } from 'lucide-react';

export const CompletionReportView: React.FC = () => {
  const { repairCases, activeRepairId, setActiveTab } = useApp();

  const currentCase = repairCases.find((c) => c.id === activeRepairId) || repairCases.find((c) => c.status === 'COMPLETED') || repairCases[0];

  const [showPdfModal, setShowPdfModal] = useState(false);

  if (!currentCase) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center bg-white rounded-3xl border border-[#c2c6d8]/30 space-y-4 animate-in fade-in">
        <FileText className="w-12 h-12 text-[#0054cc] mx-auto" />
        <h3 className="text-lg font-bold text-[#1b1c1c]">수리 완료 및 정산 보고서가 없습니다.</h3>
        <p className="text-xs text-[#727787]">수리가 완료된 건이 있거나 대시보드에서 완료건을 선택해주세요.</p>
        <button
          onClick={() => setActiveTab('dashboard')}
          className="px-5 py-2.5 bg-[#0054cc] text-white font-bold text-xs rounded-xl hover:bg-[#066bfd] transition-all cursor-pointer"
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
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
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
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-extrabold text-[#1b1c1c]">수리 완료 및 정산 보고서</h2>
            <span className="bg-[#10B981] text-white font-extrabold text-xs px-3 py-1 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>수리 완료 ID: #{currentCase.id}</span>
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowPdfModal(true)}
          className="px-5 py-3 bg-[#0054cc] hover:bg-[#066bfd] text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>합의 이력 요약서 (PDF) 다운로드</span>
        </button>
      </div>

      {/* Main Report Container */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xs border border-[#c2c6d8]/40 space-y-8">
        {/* Verification Banner */}
        <div className="bg-[#10B981]/10 p-5 rounded-2xl border border-[#10B981]/30 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#10B981] text-white flex items-center justify-center font-bold text-xl shrink-0">
            ✓
          </div>
          <div>
            <h3 className="font-extrabold text-base text-[#1b1c1c]">임대인 - 임차인 수리 합의 체결 완료</h3>
            <p className="text-xs text-[#424655] mt-0.5">
              본 수리건은 든든집사 투명 시스템을 통해 견적 승인 및 수리 검수가 정당하게 완료되었습니다.
            </p>
          </div>
        </div>

        {/* Before vs After Gallery */}
        <div>
          <h3 className="font-extrabold text-base text-[#1b1c1c] mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-[#0054cc]" />
            <span>수리 전 / 수리 후 현장 비교 검수</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Before Card */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-[#EF4444]">
                <span>[수리 전 상태]</span>
                <span className="text-[#727787] font-normal">{currentCase.createdAt}</span>
              </div>
              <div className="aspect-video rounded-2xl overflow-hidden border border-[#c2c6d8] bg-black">
                <img src={report.beforePhoto} alt="Before" className="w-full h-full object-cover" />
              </div>
              <p className="text-xs text-[#424655] bg-[#fcf9f8] p-3 rounded-xl border border-[#c2c6d8]/30 leading-relaxed">
                {report.beforeNote}
              </p>
            </div>

            {/* After Card */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-[#10B981]">
                <span>[수리 완료 후 상태]</span>
                <span className="text-[#727787] font-normal">{report.completedAt}</span>
              </div>
              <div className="aspect-video rounded-2xl overflow-hidden border border-[#10B981] bg-black">
                <img src={report.afterPhoto} alt="After" className="w-full h-full object-cover" />
              </div>
              <p className="text-xs text-[#424655] bg-[#10B981]/5 p-3 rounded-xl border border-[#10B981]/20 leading-relaxed">
                {report.afterNote}
              </p>
            </div>
          </div>
        </div>

        {/* Milestone & Cost Summary */}
        <div className="bg-[#f6f3f2] p-6 rounded-2xl space-y-4 border border-[#c2c6d8]/40">
          <h4 className="font-extrabold text-sm text-[#1b1c1c] border-b border-[#c2c6d8]/30 pb-2">
            최종 정산 및 시공 정보
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-[#727787]">시공 수리 업체</span>
              <p className="font-bold text-sm text-[#1b1c1c] mt-0.5">{report.vendorName}</p>
            </div>

            <div>
              <span className="text-[#727787]">최종 승인 결제액</span>
              <p className="font-extrabold text-base text-[#0054cc] mt-0.5">
                ₩{report.finalAmount.toLocaleString()}원
              </p>
            </div>

            <div>
              <span className="text-[#727787]">하자 보수 보증</span>
              <p className="font-bold text-sm text-[#10B981] mt-0.5">1년간 무상 AS 제공</p>
            </div>
          </div>

          <div className="pt-2 text-xs text-[#424655]">
            <span className="font-bold text-[#1b1c1c]">특이사항: </span>
            {report.specialNotes}
          </div>
        </div>
      </div>

      {/* PDF Document Preview Modal */}
      {showPdfModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-[#f0eded] pb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-6 h-6 text-[#0054cc]" />
                <h3 className="text-xl font-bold text-[#1b1c1c]">수리 및 비용 정산 합의 증명서</h3>
              </div>
              <button
                onClick={() => setShowPdfModal(false)}
                className="text-[#727787] hover:text-[#1b1c1c] text-2xl font-bold cursor-pointer"
              >
                ×
              </button>
            </div>

            {/* Document Printable Paper View */}
            <div className="bg-[#fcf9f8] p-8 border-2 border-[#1b1c1c] rounded-xl space-y-6 text-[#1b1c1c] font-mono text-xs">
              <div className="text-center border-b-2 border-[#1b1c1c] pb-4">
                <h1 className="text-xl font-black tracking-widest">수리 비용 및 상태 합의서</h1>
                <p className="text-[10px] text-[#727787] mt-1">발행번호: #CERT-2026-99201 | 든든집사 전자서명</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-bold border-b border-[#1b1c1c] pb-1">1. 임대인 (건물주)</p>
                  <p className="mt-1">성명: 김지수 님</p>
                  <p>건물: 그린빌 302호</p>
                </div>
                <div>
                  <p className="font-bold border-b border-[#1b1c1c] pb-1">2. 임차인 (거주자)</p>
                  <p className="mt-1">성명: {currentCase.tenantName}</p>
                  <p>계약: 월세 (1000/85)</p>
                </div>
              </div>

              <div>
                <p className="font-bold border-b border-[#1b1c1c] pb-1">3. 수리 및 정산 요약</p>
                <p className="mt-1">수리건: {currentCase.title}</p>
                <p>시공업체: {report.vendorName}</p>
                <p>최종 금액: ₩{report.finalAmount.toLocaleString()}원 (임대인 부담 완료)</p>
              </div>

              <div className="text-center pt-6 border-t border-[#1b1c1c]">
                <p className="font-bold text-sm">위 수리건에 대하여 상호 원만히 검수 완료하였음을 증명합니다.</p>
                <p className="text-[10px] mt-2">2026년 07월 26일</p>
                <p className="font-extrabold text-sm text-[#0054cc] mt-1">든든집사 (DUNDUN HOUSE) 전자인증</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  alert('PDF 파일이 다운로드 폴더에 저장되었습니다.');
                  setShowPdfModal(false);
                }}
                className="flex-1 py-3.5 bg-[#0054cc] text-white font-bold text-sm rounded-xl shadow-md hover:bg-[#066bfd] cursor-pointer"
              >
                PDF 다운로드 실행
              </button>
              <button
                onClick={() => setShowPdfModal(false)}
                className="px-6 py-3.5 border border-[#c2c6d8] text-[#424655] font-bold text-sm rounded-xl hover:bg-[#f6f3f2] cursor-pointer"
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
