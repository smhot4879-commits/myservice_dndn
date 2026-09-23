import React, { useState } from 'react';
import { X, Check, Sparkles, Layers, ShieldCheck, ExternalLink, ArrowRight } from 'lucide-react';
import conceptAImg from '../assets/images/concept_a_minimal_1790148623300.jpg';
import conceptBImg from '../assets/images/concept_b_editorial_1790148638188.jpg';
import conceptCImg from '../assets/images/concept_c_console_1790148652646.jpg';

interface DesignConceptsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectConcept?: (conceptId: 'A' | 'B' | 'C') => void;
}

export const DesignConceptsModal: React.FC<DesignConceptsModalProps> = ({
  isOpen,
  onClose,
  onSelectConcept,
}) => {
  const [selectedConcept, setSelectedConcept] = useState<'A' | 'B' | 'C'>('A');
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  if (!isOpen) return null;

  const concepts = [
    {
      id: 'A' as const,
      tag: '가장 추천 ★',
      title: '시안 A: 토스 & 리니어 스타일',
      subtitle: '모던 미니멀 프롭테크 (Modern Minimalist Proptech)',
      image: conceptAImg,
      badgeColor: 'bg-blue-600 text-white',
      palette: [
        { name: '캔버스', color: '#F8F9FA', text: '#111827' },
        { name: '카드 표면', color: '#FFFFFF', border: '#E5E7EB' },
        { name: '딥 네이비', color: '#1D4ED8' },
        { name: '잉크 차콜', color: '#111827' },
      ],
      typography: 'Pretendard Variable (국문) + Plus Jakarta Sans (영문) + Tabular-nums',
      characteristics: [
        '알약 뱃지(Pill badge) 전면 제거 → 텍스트와 세련된 점·구분선(·)으로 메타데이터 표기',
        '과한 곡률(rounded-3xl) 제거 → 정제된 12px(rounded-xl) 모서리로 테크 유니콘 감성',
        '인공적인 네온 블루/배경 블러 제거 → 정밀한 1px 슬레이트 헤어라인 보더와 맑은 여백',
        '호실 번호, 월세/보증금, 수리비용이 세로축으로 완벽히 정렬되는 모노스페이스 수치 체계',
      ],
      vibe: '토스(Toss), 리니어(Linear), 피그마(Figma)처럼 군더더기 없고 반응이 칼 같은 현대적 플랫폼',
    },
    {
      id: 'B' as const,
      tag: '프리미엄 지향',
      title: '시안 B: 스트라이프 & 애플 스타일',
      subtitle: '에디토리얼 에셋 매니지먼트 (Editorial Asset Management)',
      image: conceptBImg,
      badgeColor: 'bg-[#1B4332] text-white',
      palette: [
        { name: '웜 페이퍼', color: '#FAF9F6', text: '#1D1D1F' },
        { name: '소프트 화이트', color: '#FFFFFF', border: '#E8E6E1' },
        { name: '포레스트 그린', color: '#1B4332' },
        { name: '웜 차콜', color: '#1D1D1F' },
      ],
      typography: 'Pretendard (국문) + Cabinet Grotesk / Lora (영문) + Tabular-nums',
      characteristics: [
        '따뜻한 오프화이트 지류 질감과 클래식한 1.5px 얇은 라인 드로잉 아이콘',
        '컬러풀한 원형 배경을 걷어내고, 건축 도면이나 계약 원본처럼 정갈한 문서 그리드',
        '원상복구 사전 점검 및 하자보수 이력을 공증된 법적 서류처럼 격식 있게 연출',
        '하이엔드 주거단지(한남더힐, 아크로 등) 임대차 관리에 어울리는 차분한 품격',
      ],
      vibe: '스트라이프(Stripe), 애플(Apple), 킨포크(Kinfolk)처럼 따뜻하고 신뢰감 넘치는 고급 자산 운용 서식',
    },
    {
      id: 'C' as const,
      tag: '업무 효율 극대화',
      title: '시안 C: B2B 엔터프라이즈 콘솔',
      subtitle: '하이덴시티 오퍼레이션 대시보드 (High-Density Operations Console)',
      image: conceptCImg,
      badgeColor: 'bg-indigo-700 text-white',
      palette: [
        { name: '슬레이트 캔버스', color: '#F1F5F9', text: '#0F172A' },
        { name: '데이터 셀', color: '#FFFFFF', border: '#CBD5E1' },
        { name: '인디고 블루', color: '#4F46E5' },
        { name: '슬레이트 900', color: '#0F172A' },
      ],
      typography: 'Pretendard Variable + JetBrains Mono (수치 및 코드)',
      characteristics: [
        '불필요한 공백을 줄이고 행 높이 40px의 고밀도 스프레드시트/테이블 구조 적용',
        '수십 개 호실과 수리 견적 현황을 스크롤 없이 한 화면에서 즉시 모니터링',
        '전문 임대사업자, 위탁관리 회사(PMC)가 사용하는 사내 ERP 콘솔 스타일',
        '상태별 미니멀 도트 인디케이터와 정밀한 필터 정렬 도구 집중 배치',
      ],
      vibe: '노션(Notion) 데이터베이스, 블룸버그/AWS 콘솔처럼 정보를 빠르고 정확하게 처리하는 실무형 도구',
    },
  ];

  const currentConcept = concepts.find((c) => c.id === selectedConcept)!;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-neutral-900">
                  탈(脫) AI 디자인 리뉴얼 시안 비교
                </h3>
                <span className="text-xs bg-neutral-200 text-neutral-700 font-semibold px-2 py-0.5 rounded">
                  3 Concepts
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                기능과 로직은 100% 보존하며, 타이포그래피와 컬러·그리드만 프로덕션 수준으로 전면 개편합니다.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 flex items-center justify-center transition-colors border border-neutral-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="p-2 sm:px-6 sm:py-3 bg-neutral-100/70 border-b border-neutral-200 flex flex-wrap gap-2">
          {concepts.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedConcept(c.id)}
              className={`flex-1 min-w-[200px] flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedConcept === c.id
                  ? 'bg-white text-neutral-900 shadow-sm border border-neutral-300'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/50 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                    selectedConcept === c.id ? 'bg-neutral-900 text-white' : 'bg-neutral-200 text-neutral-600'
                  }`}
                >
                  {c.id}
                </span>
                <span className="truncate">{c.title}</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${c.badgeColor}`}>
                {c.tag}
              </span>
            </button>
          ))}
        </div>

        {/* Modal Body: Active Concept Details */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Main Visual Mockup Showcase */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-neutral-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>{currentConcept.title} — 고해상도 디자인 시안 렌더링</span>
              </span>
              <button
                onClick={() => setZoomImage(currentConcept.image)}
                className="text-neutral-500 hover:text-blue-600 font-medium flex items-center gap-1 cursor-pointer transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>크게 보기 (원본 줌)</span>
              </button>
            </div>

            <div
              onClick={() => setZoomImage(currentConcept.image)}
              className="relative aspect-video rounded-xl overflow-hidden border border-neutral-300 shadow-md bg-neutral-900 cursor-zoom-in group"
            >
              <img
                src={currentConcept.image}
                alt={currentConcept.title}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-900/80 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg">
                  클릭하여 고화질 확대보기
                </span>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Characteristics */}
            <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-3">
              <h4 className="text-xs font-bold text-neutral-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>주요 디자인 차별화 포인트 (Anti-AI Slop)</span>
              </h4>
              <ul className="space-y-2 text-xs text-neutral-700 leading-relaxed">
                {currentConcept.characteristics.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-neutral-400 font-mono text-[10px] mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Typography & Palette */}
            <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-3.5">
              <div>
                <span className="text-[11px] font-bold text-neutral-500 block mb-1">
                  타이포그래피 구성
                </span>
                <p className="text-xs font-bold text-neutral-800 font-mono bg-white p-2 rounded-lg border border-neutral-200">
                  {currentConcept.typography}
                </p>
              </div>

              <div>
                <span className="text-[11px] font-bold text-neutral-500 block mb-1.5">
                  컬러 시스템 샘플
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {currentConcept.palette.map((p, idx) => (
                    <div key={idx} className="text-center space-y-1">
                      <div
                        className="h-9 rounded-lg border shadow-2xs"
                        style={{
                          backgroundColor: p.color,
                          borderColor: p.border || 'transparent',
                        }}
                      />
                      <span className="text-[10px] font-medium text-neutral-600 block truncate">
                        {p.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-neutral-500 block mb-1">
                  추구하는 인터페이스 느낌
                </span>
                <p className="text-xs text-neutral-700 leading-relaxed">
                  {currentConcept.vibe}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-neutral-500">
            현재 보고 계신 시안: <b className="text-neutral-900">{currentConcept.title}</b>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/50 rounded-lg transition-colors cursor-pointer"
            >
              닫기
            </button>
            <button
              onClick={() => {
                if (onSelectConcept) onSelectConcept(currentConcept.id);
                onClose();
              }}
              className="px-4 py-2 text-xs font-bold bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{currentConcept.title.split(':')[0]}으로 디자인 적용 요청하기</span>
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox Zoom Modal */}
      {zoomImage && (
        <div
          className="fixed inset-0 z-60 bg-black/85 flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in"
          onClick={() => setZoomImage(null)}
        >
          <div className="relative max-w-6xl w-full">
            <img
              src={zoomImage}
              alt="Design Preview Zoom"
              className="w-full h-auto rounded-xl shadow-2xl border border-white/20"
            />
            <button
              onClick={() => setZoomImage(null)}
              className="absolute top-4 right-4 bg-black/70 hover:bg-black text-white p-2 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
