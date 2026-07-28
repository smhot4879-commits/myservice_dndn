import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LEGAL_FAQS, CASE_STUDIES } from '../data/mockData';
import { HelpCircle, ChevronDown, ChevronUp, Scale, BookOpen, ShieldAlert, PhoneCall, ArrowLeft, MessageSquare, Send, X, Building2, CheckCircle2 } from 'lucide-react';

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
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
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
            <Scale className="w-7 h-7 text-[#0054cc]" />
            <span>임대차 법률 가이드 & 판례 사례</span>
          </h2>
          <p className="text-xs text-[#424655] mt-1">
            주택임대차보호법 및 민법 제623조 기준 수선 의무와 분쟁 방지 필수 정보
          </p>
        </div>

        <button
          onClick={() => {
            setIsSubmitted(false);
            setInquiryContent('');
            setShowInquiryModal(true);
          }}
          className="px-5 py-3 bg-[#0054cc] hover:bg-[#066bfd] text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Building2 className="w-4 h-4" />
          <span>공인중개사 1:1 문의하기</span>
        </button>
      </div>

      {/* Category Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-[#7a24df] text-white shadow-md'
                : 'bg-[#f0eded] text-[#424655] hover:bg-[#e5e2e1]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQ Accordion Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xs border border-[#c2c6d8]/40 space-y-4">
        <h3 className="font-extrabold text-base text-[#1b1c1c] mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#7a24df]" />
          <span>자주 묻는 법률 질문 (Q&A)</span>
        </h3>

        <div className="space-y-3">
          {filteredFaqs.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className="border border-[#c2c6d8]/40 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqId(isOpen ? '' : faq.id)}
                  className="w-full p-4 text-left font-bold text-sm text-[#1b1c1c] bg-[#fcf9f8] hover:bg-[#f6f3f2] flex justify-between items-center cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-[#7a24df]">Q.</span>
                    <span>{faq.question}</span>
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-[#7a24df]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#727787]" />
                  )}
                </button>

                {isOpen && (
                  <div className="p-5 bg-white border-t border-[#c2c6d8]/30 space-y-3 animate-in fade-in duration-200">
                    <p className="text-xs text-[#424655] leading-relaxed whitespace-pre-line">
                      {faq.answer}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {faq.tags.map((tag) => (
                        <span key={tag} className="text-[10px] font-bold text-[#7a24df] bg-[#7a24df]/10 px-2 py-0.5 rounded-md">
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
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xs border border-[#c2c6d8]/40 space-y-4">
        <h3 className="font-extrabold text-base text-[#1b1c1c] mb-4 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-[#0054cc]" />
          <span>주요 임대차 수리 분쟁 실제 판례 사례</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CASE_STUDIES.map((cs) => (
            <div
              key={cs.id}
              className="p-5 rounded-2xl border border-[#c2c6d8]/40 bg-[#fcf9f8] space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${
                      cs.verdict === 'WIN'
                        ? 'bg-[#10B981]/15 text-[#10B981]'
                        : 'bg-[#F59E0B]/15 text-[#F59E0B]'
                    }`}
                  >
                    {cs.verdict === 'WIN' ? '임차인 승소/원상복구' : '상호 분담 조정'}
                  </span>
                  <span className="text-[10px] text-[#727787]">{cs.date}</span>
                </div>
                <h4 className="font-bold text-sm text-[#1b1c1c]">{cs.title}</h4>
                <p className="text-xs text-[#424655] leading-relaxed">{cs.summary}</p>
              </div>

              <img
                src={cs.imageUrl}
                alt={cs.title}
                className="w-full h-32 object-cover rounded-xl border border-[#c2c6d8]/40"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 공인중개사 1:1 문의하기 모달 */}
      {showInquiryModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 relative border border-[#c2c6d8]/40 animate-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setShowInquiryModal(false)}
              className="absolute top-5 right-5 text-[#727787] hover:text-[#1b1c1c] p-1 rounded-full hover:bg-[#f0eded] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!isSubmitted ? (
              <form onSubmit={handleSendInquiry} className="space-y-5">
                <div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-6 h-6 text-[#0054cc]" />
                    <h3 className="text-xl font-bold text-[#1b1c1c]">전속 공인중개사 1:1 문의하기</h3>
                  </div>
                  <p className="text-xs text-[#727787] mt-1 leading-relaxed">
                    임대차 수리 책임 소재, 계약 갱신, 원상복구 분쟁 등 주택임대차 전문 공인중개사가 1:1로 신속하고 정확하게 답변드립니다.
                  </p>
                </div>

                <div className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-[#424655] mb-1">
                      문의 분야 선택
                    </label>
                    <select
                      value={inquiryType}
                      onChange={(e) => setInquiryType(e.target.value)}
                      className="w-full p-3 bg-white border border-[#c2c6d8] rounded-xl text-xs font-bold focus:border-[#0054cc] outline-none"
                    >
                      <option value="수리비용 분담 및 원상복구">수리비용 분담 및 원상복구</option>
                      <option value="계약 만료/갱신청구권 분쟁">계약 만료 / 갱신청구권 분쟁</option>
                      <option value="보증금 반환 및 퇴거 절차">보증금 반환 및 퇴거 절차</option>
                      <option value="기타 임대차 분쟁 문의">기타 임대차 분쟁 문의</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#424655] mb-1">
                      답변 받으실 연락처 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="010-0000-0000"
                      required
                      className="w-full p-3 bg-white border border-[#c2c6d8] rounded-xl text-xs font-bold focus:border-[#0054cc] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#424655] mb-1">
                      문의 사항 세부 내용 <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      value={inquiryContent}
                      onChange={(e) => setInquiryContent(e.target.value)}
                      placeholder="예: 입주 3개월 차에 에어컨 메인보드 고장이 발생했습니다. 수리비 25만원 부담 주체에 대해 공인중개사님의 의견을 구합니다."
                      required
                      className="w-full p-3 bg-white border border-[#c2c6d8] rounded-xl text-xs font-medium focus:border-[#0054cc] outline-none resize-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowInquiryModal(false)}
                    className="px-4 py-3 bg-[#f0eded] text-[#424655] font-bold text-xs rounded-xl hover:bg-[#e5e2e1] cursor-pointer"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#0054cc] hover:bg-[#066bfd] text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <Send className="w-4 h-4" />
                    <span>공인중개사에게 1:1 문의 전송</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-5 text-center py-4 animate-in fade-in duration-300">
                <div className="w-12 h-12 bg-[#10B981]/15 text-[#065F46] rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6 text-[#10B981]" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-[#1b1c1c]">
                    공인중개사 1:1 문의가 정상 접수되었습니다!
                  </h3>
                  <p className="text-xs text-[#727787] mt-1 leading-relaxed max-w-sm mx-auto">
                    든든집사 검증 전문 공인중개사가 검토 후 입력하신 연락처(<strong>{contactPhone}</strong>)로 1시간 이내 친절하게 답변드리겠습니다.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowInquiryModal(false)}
                  className="px-6 py-3 bg-[#0054cc] hover:bg-[#066bfd] text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer"
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
