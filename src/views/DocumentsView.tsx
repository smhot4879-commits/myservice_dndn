import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FileText, Download, Upload, Eye, ShieldCheck, ArrowLeft, Plus } from 'lucide-react';

export const DocumentsView: React.FC = () => {
  const { setActiveTab } = useApp();

  const [docs, setDocs] = useState([
    {
      id: 'doc-1',
      title: '주택임대차 표준계약서 (전자서명 완료본)',
      type: 'PDF',
      size: '2.4 MB',
      date: '2023.10.15',
      category: '계약서',
    },
    {
      id: 'doc-2',
      title: '입주 시 시설물 사전 점검표 및 현장 사진집',
      type: 'ZIP',
      size: '14.8 MB',
      date: '2023.10.15',
      category: '증빙자료',
    },
    {
      id: 'doc-3',
      title: '2026-07-25 에어컨 수리 비용 정산 영수증',
      type: 'PDF',
      size: '420 KB',
      date: '2026.07.25',
      category: '영수증',
    }
  ]);

  const handleUploadDoc = () => {
    const title = prompt('업로드할 서류명을 입력하세요 (예: 보증금 이체 확인증):');
    if (title) {
      setDocs((prev) => [
        {
          id: `doc-${Date.now()}`,
          title,
          type: 'PDF',
          size: '1.1 MB',
          date: new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
          category: '기타서류',
        },
        ...prev,
      ]);
      alert('서류가 안전하게 암호화 보관소에 저장되었습니다.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header */}
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
              계약서 및 서류 보관소
            </h2>
            <span className="font-mono text-xs text-neutral-400 font-medium">
              보안 암호화 저장
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            법적 효력을 지닌 전자계약서, 입주 시 상태 대조 사진 및 수리 정산 영수증
          </p>
        </div>

        <button
          onClick={handleUploadDoc}
          className="px-3.5 py-2 bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold text-xs rounded-lg shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-98"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>신규 서류 업로드</span>
        </button>
      </div>

      {/* Summary Card */}
      <div className="bg-white p-5 sm:p-6 rounded-xl shadow-xs border border-neutral-200 space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-neutral-100">
          <h3 className="font-bold text-sm text-neutral-900">현재 체결된 임대차 계약 요약</h3>
          {/* Zero-Pill: Dot + Text */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            <span>전자서명 법적 효력 보유</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-neutral-50 p-3.5 rounded-lg border border-neutral-100 font-mono">
            <span className="text-neutral-400 text-[11px] block">소재지</span>
            <p className="font-semibold text-xs text-neutral-900 mt-0.5">그린빌 302호</p>
          </div>
          <div className="bg-neutral-50 p-3.5 rounded-lg border border-neutral-100 font-mono">
            <span className="text-neutral-400 text-[11px] block">보증금 / 월세</span>
            <p className="font-semibold text-xs text-neutral-900 mt-0.5 tabular-nums">1,000만 / 85만원</p>
          </div>
          <div className="bg-neutral-50 p-3.5 rounded-lg border border-neutral-100 font-mono">
            <span className="text-neutral-400 text-[11px] block">계약 만료일</span>
            <p className="font-semibold text-xs text-neutral-900 mt-0.5 tabular-nums">2026.10.14</p>
          </div>
        </div>
      </div>

      {/* Documents Repository List */}
      <div className="bg-white p-5 sm:p-6 rounded-xl shadow-xs border border-neutral-200 space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-neutral-100">
          <h3 className="font-bold text-sm text-neutral-900">
            보관 중인 파일 목록
          </h3>
          <span className="font-mono text-xs text-neutral-400">
            {docs.length}건
          </span>
        </div>

        <div className="divide-y divide-neutral-100">
          {docs.map((doc) => (
            <div
              key={doc.id}
              className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-50 px-2 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center font-mono font-bold text-[10px] text-neutral-700 shrink-0">
                  {doc.type}
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-neutral-900">{doc.title}</h4>
                  <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                    {doc.category} · {doc.date} · {doc.size}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={() => alert(`'${doc.title}' 파일 미리보기를 실행합니다.`)}
                  className="px-2.5 py-1.5 bg-white border border-neutral-200 text-neutral-700 font-semibold text-xs rounded-md hover:bg-neutral-50 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-neutral-500" />
                  <span>미리보기</span>
                </button>
                <button
                  onClick={() => alert(`'${doc.title}' 파일이 다운로드됩니다.`)}
                  className="px-2.5 py-1.5 bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold text-xs rounded-md flex items-center gap-1 cursor-pointer shadow-xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>다운로드</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
