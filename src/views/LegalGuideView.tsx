import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LEGAL_FAQS, CASE_STUDIES } from '../data/mockData';
import { HelpCircle, ChevronDown, ChevronUp, Scale, BookOpen, ShieldAlert, ArrowLeft, Send, X, Building2, CheckCircle2 } from 'lucide-react';

export const LegalGuideView: React.FC = () => {
  const { setActiveTab, addRealtorInquiry } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [openFaqId, setOpenFaqId] = useState<string>('faq-1');

  // Realtor 1:1 Inquiry Modal state
  const [showInquiryModal, setShowInquiryModal] = useState<boolean>(false);
  const [inquiryType, setInquiryType] = useState<string>('수리비용 분담 및 원상복구');
  const [inquiryContent, setInquiryContent] = useState<string>('');
  const [contactPhone, setContactPhone] = useState<string>('010-1234-5678');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const categories = ['전체', '수리 책임 소재', '계약 및 이사', '계약 갱신'];

  const filteredFaqs = selectedCategory === '전체'
    ? LEGAL_FAQS
    : LEGAL_FAQS.filter((f) => f.category === selectedCategory);

  const handleSendInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryContent.trim()) {
      alert('문의 내용을 입력해 주세요.');
      return;
    }
    await addRealtorInquiry(inquiryType, contactPhone, inquiryContent);
    setIsSubmitted(true);
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
              임대차 법률 가이드 & 판례
            </h2>
            <span className="font-mono text-xs text-neutral-400 font-medium">
              민법 제623조 기준
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            주택임대차보호법 및 표준 판례 기준 수선 의무와 원상복구 분쟁 방지 기준
          </p>
        </div>

        <button
          onClick={() => {
            setIsSubmitted(false);
            setInquiryContent('');
            setShowInquiryModal(true);
          }}
          className="px-3.5 py-2 bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold text-xs rounded-lg shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0 active:scale-98"
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>공인중개사 1:1 상담</span>
        </button>
      </div>

      {/* Category Tabs: Segmented Control */}
      <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg max-w-fit">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-white text-neutral-900 shadow-xs border border-neutral-200/50'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQ Accordion Section */}
      <div className="bg-white p-5 sm:p-6 rounded-xl shadow-xs border border-neutral-200 space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <h3 className="font-bold text-sm text-neutral-900 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-neutral-700" />
            <span>자주 묻는 법률 질문 ({filteredFaqs.length})</span>
          </h3>
          <span className="font-mono text-xs text-neutral-400">Q&A</span>
        </div>

        <div className="divide-y divide-neutral-100">
          {filteredFaqs.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div key={faq.id} className="py-2.5">
                <button
                  onClick={() => setOpenFaqId(isOpen ? '' : faq.id)}
                  className="w-full text-left font-semibold text-xs text-neutral-900 hover:text-blue-600 flex justify-between items-center cursor-pointer py-1.5 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="font-mono text-blue-600 font-bold">Q.</span>
                    <span>{faq.question}</span>
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-neutral-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="mt-2 p-3.5 bg-neutral-50 rounded-lg border border-neutral-200/80 space-y-2.5 animate-in fade-in duration-150">
                    <p className="text-xs text-neutral-600 leading-relaxed whitespace-pre-line">
                      {faq.answer}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {faq.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-mono text-neutral-500 bg-white border border-neutral-200 px-1.5 py-0.5 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Real Case Studies Section */}
      <div className="bg-white p-5 sm:p-6 rounded-xl shadow-xs border border-neutral-200 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <h3 className="font-bold text-sm text-neutral-900 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-neutral-700" />
            <span>실제 임대차 수리 분쟁 판례 사례</span>
          </h3>
          <span className="font-mono text-xs text-neutral-400">대법원 및 분쟁조정위</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CASE_STUDIES.map((cs) => (
            <div
              key={cs.id}
              className="p-4 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50/50 transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  {/* Zero-Pill: Dot + Text */}
                  <div className="flex items-center gap-1.5 text-xs font-semibold">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        cs.verdict === 'WIN' ? 'bg-emerald-600' : 'bg-amber-500'
                      }`}
                    />
                    <span className={cs.verdict === 'WIN' ? 'text-emerald-700' : 'text-amber-700'}>
                      {cs.verdict === 'WIN' ? '임차인 승소 (원상복구 면책)' : '상호 분담 조정'}
                    </span>
                  </div>
                  <span className="text-[11px] text-neutral-400 font-mono">{cs.date}</span>
                </div>
                <h4 className="font-bold text-xs text-neutral-900">{cs.title}</h4>
                <p className="text-xs text-neutral-500 leading-relaxed">{cs.summary}</p>
              </div>

              <img
                src={cs.imageUrl}
                alt={cs.title}
                className="w-full h-28 object-cover rounded-md border border-neutral-200"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Realtor 1:1 Inquiry Modal */}
      {showInquiryModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full shadow-xl space-y-4 relative border border-neutral-200 animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-neutral-800" />
                <h3 className="text-sm font-bold text-neutral-900">전속 공인중개사 1:1 법률 자문</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowInquiryModal(false)}
                className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!isSubmitted ? (
              <form onSubmit={handleSendInquiry} className="space-y-3 text-left">
                <p className="text-xs text-neutral-500 leading-relaxed">
                  임대차 수리 책임 소재, 계약 갱신, 퇴실 원상복구 분쟁 등 주택임대차 전문 공인중개사가 1:1로 자문해 드립니다.
                </p>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    문의 분야 선택
                  </label>
                  <select
                    value={inquiryType}
                    onChange={(e) => setInquiryType(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-medium focus:bg-white focus:border-blue-600 outline-none"
                  >
                    <option value="수리비용 분담 및 원상복구">수리비용 분담 및 원상복구</option>
                    <option value="계약 만료/갱신청구권 분쟁">계약 만료 / 갱신청구권 분쟁</option>
                    <option value="보증금 반환 및 퇴거 절차">보증금 반환 및 퇴거 절차</option>
                    <option value="기타 임대차 분쟁 문의">기타 임대차 분쟁 문의</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    답변 받으실 연락처
                  </label>
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="010-0000-0000"
                    required
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-mono outline-none focus:bg-white focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    문의 사항 세부 내용
                  </label>
                  <textarea
                    rows={4}
                    value={inquiryContent}
                    onChange={(e) => setInquiryContent(e.target.value)}
                    placeholder="예: 입주 3개월 차에 에어컨 메인보드 고장이 발생했습니다. 수리비 25만원 부담 주체에 대해 공인중개사님의 의견을 구합니다."
                    required
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs outline-none focus:bg-white focus:border-blue-600 resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowInquiryModal(false)}
                    className="px-3 py-2 border border-neutral-200 text-neutral-600 font-semibold text-xs rounded-lg hover:bg-neutral-50 cursor-pointer"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold text-xs rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5 active:scale-98"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>문의 전송</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 text-center py-4 animate-in fade-in duration-200">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">
                    공인중개사 1:1 문의가 접수되었습니다
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1 leading-relaxed max-w-xs mx-auto">
                    검토 후 입력하신 연락처(<span className="font-mono font-medium text-neutral-900">{contactPhone}</span>)로 신속히 회신드리겠습니다.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowInquiryModal(false)}
                  className="px-4 py-2 bg-[#0F172A] text-white font-semibold text-xs rounded-lg shadow-xs cursor-pointer"
                >
                  확인
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
