import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FileText, Download, Upload, Eye, ShieldCheck, ArrowLeft, Check, Plus } from 'lucide-react';

export const DocumentsView: React.FC = () => {
  const { role, setActiveTab, propertyUnits } = useApp();

  const [docs, setDocs] = useState([
    {
      id: 'doc-1',
      title: '주택임대차 표준계약서 (전자서명 완료)',
      type: 'PDF',
      size: '2.4 MB',
      date: '2023.10.15',
      category: '계약서',
    },
    {
      id: 'doc-2',
      title: '입주 시 시설물 점검표 및 상태 사진집',
      type: 'ZIP',
      size: '14.8 MB',
      date: '2023.10.15',
      category: '증빙자료',
    },
    {
      id: 'doc-3',
      title: '2026-07-25 에어컨 수리 비용 이체 영수증',
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
      alert('서류가 안전하게 암호화되어 저장되었습니다.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#c2c6d8]/40 pb-4">
        <div>
          <button
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-1.5 text-[#424655] hover:text-[#0054cc] font-bold text-sm cursor-pointer mb-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>대시보드로 돌아가기</span>
          </button>
          <h2 className="text-2xl font-extrabold text-[#1b1c1c] flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#0054cc]" />
            <span>계약서 및 서류 금고</span>
          </h2>
          <p className="text-xs text-[#424655] mt-1">
            암호화 보관된 전자계약서, 입주 시 상태 증빙 사진 및 정산 영수증
          </p>
        </div>

        <button
          onClick={handleUploadDoc}
          className="px-5 py-3 bg-[#0054cc] hover:bg-[#066bfd] text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          <span>신규 서류 업로드</span>
        </button>
      </div>

      {/* Summary Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xs border border-[#c2c6d8]/40 space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-[#c2c6d8]/30">
          <h3 className="font-extrabold text-base text-[#1b1c1c]">현재 체결된 임대차 계약 요약</h3>
          <span className="text-xs font-bold text-[#10B981] bg-[#10B981]/10 px-3 py-1 rounded-full flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>전자서명 법적 효력 보유</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-[#f6f3f2] p-4 rounded-2xl">
            <span className="text-[#727787]">임대 매물</span>
            <p className="font-bold text-sm text-[#1b1c1c] mt-0.5">그린빌 302호</p>
          </div>
          <div className="bg-[#f6f3f2] p-4 rounded-2xl">
            <span className="text-[#727787]">보증금 / 월세</span>
            <p className="font-bold text-sm text-[#0054cc] mt-0.5">1,000만원 / 85만원</p>
          </div>
          <div className="bg-[#f6f3f2] p-4 rounded-2xl">
            <span className="text-[#727787]">계약 만료 예정일</span>
            <p className="font-bold text-sm text-[#1b1c1c] mt-0.5">2025.10.14</p>
          </div>
        </div>
      </div>

      {/* Documents Repository List */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xs border border-[#c2c6d8]/40 space-y-4">
        <h3 className="font-extrabold text-base text-[#1b1c1c] mb-2">보관 중인 파일 목록 ({docs.length}건)</h3>

        <div className="space-y-3">
          {docs.map((doc) => (
            <div
              key={doc.id}
              className="p-4 rounded-2xl border border-[#c2c6d8]/40 hover:border-[#0054cc] transition-all bg-[#fcf9f8] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#0054cc]/10 text-[#0054cc] flex items-center justify-center font-bold text-xs">
                  {doc.type}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#1b1c1c]">{doc.title}</h4>
                  <p className="text-xs text-[#727787] mt-0.5">
                    등록일: {doc.date} | 용량: {doc.size}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert(`'${doc.title}' 파일 미리보기를 실행합니다.`)}
                  className="px-3 py-1.5 bg-white border border-[#c2c6d8] text-[#1b1c1c] font-bold text-xs rounded-xl hover:bg-[#f6f3f2] flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-[#0054cc]" />
                  <span>보기</span>
                </button>
                <button
                  onClick={() => alert(`'${doc.title}' 파일이 다운로드됩니다.`)}
                  className="px-3 py-1.5 bg-[#0054cc] text-white font-bold text-xs rounded-xl hover:bg-[#066bfd] flex items-center gap-1 cursor-pointer"
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
