import React from 'react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  if (activeTab === 'selection') return null;

  return (
    <footer className="w-full py-8 md:ml-64 md:w-[calc(100%-16rem)] bg-white border-t border-[#c2c6d8]/40 mt-16 px-4 md:px-8">
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-col md:flex-row items-center gap-3 text-center md:text-left">
          <span className="font-bold text-base text-[#1b1c1c]">든든집사</span>
          <span className="hidden md:inline text-[#c2c6d8]">|</span>
          <p className="text-xs text-[#424655]">
            © 2026 든든집사(PropertyFlow) Management Inc. All rights reserved.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-xs text-[#424655]">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              alert('이용약관: 든든집사 투명 수리 분쟁 해결 표준 약관이 적용됩니다.');
            }}
            className="hover:text-[#0054cc] transition-colors"
          >
            이용약관
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              alert('개인정보처리방침: 모든 계약서 및 사진 정보는 암호화되어 안전하게 보관됩니다.');
            }}
            className="hover:text-[#0054cc] transition-colors"
          >
            개인정보처리방침
          </a>
          <button
            onClick={() => setActiveTab('legal')}
            className="hover:text-[#0054cc] transition-colors cursor-pointer"
          >
            법률 가이드
          </button>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              alert('고객지원 센터: 1588-0000 (평일 09:00 - 18:00)');
            }}
            className="hover:text-[#0054cc] transition-colors"
          >
            고객지원
          </a>
        </div>
      </div>
    </footer>
  );
};
