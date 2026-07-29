import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Send,
  Image as ImageIcon,
  ShieldCheck,
  CheckCircle2,
  Receipt,
  FileCheck,
  ArrowLeft,
  Wrench,
  AlertCircle,
  UserPlus,
  Phone,
  Link as LinkIcon,
  Copy,
  ExternalLink,
  MessageSquare,
  Check,
  Share2,
  Building2,
  UserCheck,
  X,
  Sparkles,
} from 'lucide-react';

export const ChatView: React.FC = () => {
  const {
    role,
    setRole,
    repairCases,
    activeRepairId,
    chatMessages,
    sendChatMessage,
    setActiveTab,
    completeRepair,
    inviteVendorToCase,
    joinAsVendor,
  } = useApp();

  const currentCase = repairCases.find((c) => c.id === activeRepairId) || repairCases[0];
  const caseMessages = currentCase ? chatMessages.filter((m) => m.repairCaseId === currentCase.id) : [];

  const [inputMsg, setInputMsg] = useState('');
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Invite Vendor Modal States
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteVendorName, setInviteVendorName] = useState('(주) 성진에어컨 수리센터');
  const [invitePhone, setInvitePhone] = useState('010-9876-5432');
  const [inviteMemo, setInviteMemo] = useState('에어컨 냉방 불량 수리 견적 및 현장 방문 일정 협의건입니다.');
  
  // Link Result States
  const [generatedInviteCode, setGeneratedInviteCode] = useState<string | null>(null);
  const [copiedToast, setCopiedToast] = useState(false);

  const scrollToBottom = (smooth = true) => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto',
      });
    }
  };

  useEffect(() => {
    scrollToBottom(true);
  }, [caseMessages]);

  const handleInputFocus = () => {
    setTimeout(() => {
      scrollToBottom(true);
    }, 150);
  };

  if (!currentCase) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center bg-white rounded-3xl border border-[#c2c6d8]/30 space-y-4 animate-in fade-in">
        <MessageSquare className="w-12 h-12 text-[#0054cc] mx-auto" />
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

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    let senderRole: 'LANDLORD' | 'TENANT' | 'TECHNICIAN' = 'TENANT';
    let senderName = '김지우 님';

    if (role === 'LANDLORD') {
      senderRole = 'LANDLORD';
      senderName = '임대인 김지수';
    } else if (role === 'VENDOR') {
      senderRole = 'TECHNICIAN';
      senderName = currentCase.invitedVendors?.[0]?.vendorName
        ? `수리업체 (${currentCase.invitedVendors[0].vendorName})`
        : '수리업체 (성진에어컨)';
    }

    sendChatMessage(currentCase.id, senderRole, senderName, inputMsg);
    setInputMsg('');
    setTimeout(() => {
      scrollToBottom(true);
    }, 50);
  };

  const handleQuickHashtag = (tag: string) => {
    if (role === 'VENDOR') {
      if (tag === 'VENDOR_QUOTE') {
        sendChatMessage(
          currentCase.id,
          'TECHNICIAN',
          currentCase.invitedVendors?.[0]?.vendorName || '수리업체 (성진에어컨)',
          '[견적 제출] 현장 정밀 점검 결과 부품 교체 및 출장비 포함 총 ₩150,000입니다. (1년 무상 보증 포함)',
          'QUOTE_PROPOSAL'
        );
      } else if (tag === 'VENDOR_VISIT') {
        sendChatMessage(
          currentCase.id,
          'TECHNICIAN',
          currentCase.invitedVendors?.[0]?.vendorName || '수리업체 (성진에어컨)',
          '수리 기사 방문 일정 안내: 이번 주 토요일 오전 10시 방문 가능합니다. 일정 확인 부탁드립니다.'
        );
      } else if (tag === 'VENDOR_DONE') {
        sendChatMessage(
          currentCase.id,
          'TECHNICIAN',
          currentCase.invitedVendors?.[0]?.vendorName || '수리업체 (성진에어컨)',
          '에어컨 냉매 가스 회수 완충 및 정밀 교체 작업이 완료되었습니다. 시원한 정상 냉풍 확인했습니다.'
        );
      }
      setTimeout(() => scrollToBottom(true), 50);
      return;
    }

    if (tag === 'MOVE_IN') {
      sendChatMessage(
        currentCase.id,
        role === 'LANDLORD' ? 'LANDLORD' : 'TENANT',
        role === 'LANDLORD' ? '임대인 김지수' : '김지우 님',
        '입주 당시 촬영해 둔 에어컨 연결부 상태 사진을 근거 자료로 공유합니다.',
        'MOVE_IN_EVIDENCE',
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80'
      );
    } else if (tag === 'VISIT') {
      sendChatMessage(
        currentCase.id,
        role === 'LANDLORD' ? 'LANDLORD' : 'TENANT',
        role === 'LANDLORD' ? '임대인 김지수' : '김지우 님',
        '수리 기사님 방문 시간 협의를 요청합니다. 이번 주 토요일 오전 10시 방문 가능하실까요?'
      );
    } else if (tag === 'PAYMENT') {
      sendChatMessage(
        currentCase.id,
        'LANDLORD',
        '임대인 김지수',
        '업체 수리비 ₩150,000 송금이 완료되었습니다. 정산 확인 부탁드립니다.'
      );
    }
    setTimeout(() => scrollToBottom(true), 50);
  };

  const handleSendInviteLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteVendorName.trim() || !invitePhone.trim()) {
      alert('업체명과 연락처를 모두 입력해주세요.');
      return;
    }

    const code = inviteVendorToCase(
      currentCase.id,
      inviteVendorName.trim(),
      invitePhone.trim(),
      inviteMemo.trim()
    );
    setGeneratedInviteCode(code);
  };

  const handleCopyInviteLink = () => {
    const inviteUrl = `https://dundeun-jibsa.app/invite/${currentCase.id}?code=${generatedInviteCode || 'v-8821'}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  const handleDirectJoinAsVendor = () => {
    joinAsVendor(currentCase.id, inviteVendorName || '(주) 성진에어컨');
    setShowInviteModal(false);
    setGeneratedInviteCode(null);
  };

  const handleCompleteRepairReport = () => {
    completeRepair(currentCase.id, {
      beforePhoto: currentCase.photos[0] || 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
      afterPhoto: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
      beforeNote: currentCase.symptom,
      afterNote: '냉매 가스 회수 후 방수 정밀 테이핑 및 가스 완충 완료. 시원한 냉풍 정상 출력 검수 완료.',
      completedAt: new Date().toISOString().replace('T', ' ').slice(0, 16).replace(/-/g, '.'),
      vendorName: currentCase.estimates[0]?.vendorName || inviteVendorName || '(주) 바른수리 인테리어',
      finalAmount: currentCase.estimates[0]?.amount || 150000,
      specialNotes: '시공 후 1년 하자 보수 보증서 발행. 임차인 최종 서명 수령 완료.',
    });
    setActiveTab('completion');
  };

  const fullInviteUrl = `https://dundeun-jibsa.app/invite/${currentCase.id}?code=${generatedInviteCode || 'v-8821'}`;

  return (
    <div className="max-w-4xl mx-auto space-y-3 animate-in fade-in duration-300">
      {/* VENDOR Mode Active Banner */}
      {role === 'VENDOR' && (
        <div className="bg-[#10B981] text-white p-3 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-white shrink-0" />
            <span>수리업체 무로그인 대화 참여 모드</span>
          </div>
          <button
            onClick={() => setRole('LANDLORD')}
            className="px-3 py-1 bg-white hover:bg-emerald-50 text-[#065F46] font-bold text-[11px] rounded-lg shadow-2xs transition-all cursor-pointer whitespace-nowrap"
          >
            임대인/임차인 화면으로 전환
          </button>
        </div>
      )}

      {/* Main Clean Chat Window Container */}
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xs border border-[#c2c6d8]/40 flex flex-col h-[calc(100vh-180px)] min-h-[500px] max-h-[720px] overflow-hidden">
        {/* Minimalist Stream Header */}
        <div className="p-3.5 sm:p-4 border-b border-[#c2c6d8]/30 flex justify-between items-center bg-[#fcf9f8] rounded-t-2xl sm:rounded-t-3xl shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="p-1.5 hover:bg-[#f0eded] rounded-xl text-[#727787] cursor-pointer shrink-0"
              title="대시보드로 돌아가기"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2 truncate">
                <span className="font-extrabold text-sm sm:text-base text-[#1b1c1c] truncate">
                  {currentCase.title}
                </span>
                <span className="bg-[#0054cc]/10 text-[#0054cc] font-bold text-[11px] px-2 py-0.5 rounded-full shrink-0">
                  {currentCase.unit}
                </span>
              </div>
              <p className="text-[11px] text-[#727787] truncate">
                {currentCase.tenantName} | {currentCase.category}
              </p>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => {
                setGeneratedInviteCode(null);
                setShowInviteModal(true);
              }}
              className="px-2.5 py-1.5 bg-[#0054cc]/10 hover:bg-[#0054cc]/20 text-[#0054cc] font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer transition-all"
              title="수리업체 초대"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">업체 초대</span>
            </button>
            <button
              onClick={() => setActiveTab('estimates')}
              className="px-2.5 py-1.5 bg-[#f0eded] hover:bg-[#e5e2e1] text-[#1b1c1c] font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
              title="견적서 확인"
            >
              <Receipt className="w-3.5 h-3.5 text-[#0054cc]" />
              <span className="hidden sm:inline">견적 ({currentCase.estimates.length})</span>
            </button>
          </div>
        </div>

        {/* Messages Scroll Area */}
        <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-3.5 bg-[#faf9f8]">
          {/* Embedded Move In Record Card if exists */}
          {currentCase.moveInRecord && (
            <div className="bg-[#dae2ff]/30 p-3.5 rounded-2xl border border-[#0054cc]/20 space-y-2 max-w-md mx-auto">
              <div className="flex items-center justify-between text-xs font-bold text-[#001847]">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#0054cc]" />
                  <span>입주 시 상태 기록</span>
                </span>
                <span className="text-[10px] text-[#727787]">{currentCase.moveInRecord.recordedAt}</span>
              </div>
              <p className="text-xs text-[#424655] leading-relaxed">{currentCase.moveInRecord.note}</p>
              <img
                src={currentCase.moveInRecord.photoUrl}
                alt="Move In Evidence"
                className="w-full h-36 object-cover rounded-xl border border-[#c2c6d8]"
              />
            </div>
          )}

          {/* Chat Bubbles Loop */}
          {caseMessages.map((msg) => {
            const isMe =
              (role === 'LANDLORD' && msg.sender === 'LANDLORD') ||
              (role === 'TENANT' && msg.sender === 'TENANT') ||
              (role === 'VENDOR' && msg.sender === 'TECHNICIAN');
            const isSystem = msg.sender === 'SYSTEM';
            const isTechnician = msg.sender === 'TECHNICIAN';

            if (isSystem) {
              return (
                <div key={msg.id} className="flex justify-center my-2">
                  <div className="bg-[#f0eded] text-[#424655] text-xs font-semibold px-3.5 py-1 rounded-2xl border border-[#c2c6d8]/40 shadow-2xs text-center max-w-md">
                    {msg.message}
                  </div>
                </div>
              );
            }

            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-1.5 mb-0.5 px-1">
                  <span className="text-[10px] font-bold text-[#727787]">{msg.senderName}</span>
                  {isTechnician && (
                    <span className="bg-[#10B981]/15 text-[#065F46] text-[9px] font-extrabold px-1.5 py-0.2 rounded-md">
                      수리기사/업체
                    </span>
                  )}
                </div>

                <div
                  className={`max-w-[85%] sm:max-w-[75%] p-3 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-2xs ${
                    isMe
                      ? 'bg-[#0054cc] text-white rounded-tr-none'
                      : isTechnician
                      ? 'bg-[#E6F4EA] text-[#065F46] border border-[#10B981]/30 rounded-tl-none font-medium'
                      : 'bg-white text-[#1b1c1c] rounded-tl-none border border-[#c2c6d8]/40'
                  }`}
                >
                  <p>{msg.message}</p>

                  {msg.attachmentUrl && (
                    <img
                      src={msg.attachmentUrl}
                      alt="Attachment"
                      className="mt-2 rounded-xl border border-white/20 max-h-48 w-full object-cover"
                    />
                  )}
                </div>
                <span className="text-[9px] sm:text-[10px] text-[#727787] mt-0.5 px-1">{msg.timestamp}</span>
              </div>
            );
          })}
        </div>

        {/* Quick Hashtag Chips */}
        <div className="px-3 py-1.5 border-t border-[#c2c6d8]/30 bg-[#fcf9f8] flex items-center gap-1.5 overflow-x-auto shrink-0">
          <span className="text-[10px] font-bold text-[#727787] whitespace-nowrap">빠른 입력:</span>

          {role === 'VENDOR' ? (
            <>
              <button
                onClick={() => handleQuickHashtag('VENDOR_QUOTE')}
                className="px-2.5 py-0.5 bg-white hover:bg-[#E6F4EA] text-[#065F46] border border-[#10B981]/40 rounded-full text-[11px] font-extrabold whitespace-nowrap cursor-pointer"
              >
                #견적서_제출
              </button>
              <button
                onClick={() => handleQuickHashtag('VENDOR_VISIT')}
                className="px-2.5 py-0.5 bg-white hover:bg-[#E6F4EA] text-[#065F46] border border-[#10B981]/40 rounded-full text-[11px] font-extrabold whitespace-nowrap cursor-pointer"
              >
                #방문일정_제안
              </button>
              <button
                onClick={() => handleQuickHashtag('VENDOR_DONE')}
                className="px-2.5 py-0.5 bg-white hover:bg-[#E6F4EA] text-[#065F46] border border-[#10B981]/40 rounded-full text-[11px] font-extrabold whitespace-nowrap cursor-pointer"
              >
                #수리완료_보고
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleQuickHashtag('MOVE_IN')}
                className="px-2.5 py-0.5 bg-white hover:bg-[#dae2ff] text-[#0054cc] border border-[#0054cc]/30 rounded-full text-[11px] font-semibold whitespace-nowrap cursor-pointer"
              >
                #입주상태_기록
              </button>
              <button
                onClick={() => handleQuickHashtag('VISIT')}
                className="px-2.5 py-0.5 bg-white hover:bg-[#dae2ff] text-[#0054cc] border border-[#0054cc]/30 rounded-full text-[11px] font-semibold whitespace-nowrap cursor-pointer"
              >
                #방문요청
              </button>
              <button
                onClick={() => handleQuickHashtag('PAYMENT')}
                className="px-2.5 py-0.5 bg-white hover:bg-[#dae2ff] text-[#0054cc] border border-[#0054cc]/30 rounded-full text-[11px] font-semibold whitespace-nowrap cursor-pointer"
              >
                #입금확인
              </button>
            </>
          )}
        </div>

        {/* Input Box Bar */}
        <form onSubmit={handleSend} className="p-2 sm:p-3 border-t border-[#c2c6d8]/40 flex items-center gap-2 bg-white rounded-b-2xl sm:rounded-b-3xl shrink-0">
          <button
            type="button"
            onClick={() => {
              const sampleImg = 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=600&q=80';
              sendChatMessage(
                currentCase.id,
                role === 'LANDLORD' ? 'LANDLORD' : role === 'VENDOR' ? 'TECHNICIAN' : 'TENANT',
                role === 'LANDLORD' ? '임대인 김지수' : role === 'VENDOR' ? '수리업체 (성진에어컨)' : '김지우 님',
                '현장 관련 사진을 추가 공유합니다.',
                'TEXT',
                sampleImg
              );
            }}
            className="p-2 text-[#727787] hover:text-[#0054cc] hover:bg-[#f0eded] rounded-xl transition-colors cursor-pointer shrink-0"
            title="사진 첨부"
          >
            <ImageIcon className="w-5 h-5" />
          </button>

          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            onFocus={handleInputFocus}
            placeholder={
              role === 'VENDOR'
                ? '수리 기사 메시지를 입력하세요 (견적, 일정 등)...'
                : '대화 메시지를 입력하세요...'
            }
            className="flex-1 py-2 px-3 sm:px-4 bg-[#f6f3f2] focus:bg-white border border-transparent focus:border-[#0054cc] rounded-xl outline-none text-xs sm:text-sm transition-all"
          />

          <button
            type="submit"
            className="p-2.5 bg-[#0054cc] hover:bg-[#066bfd] text-white rounded-xl shadow-md active:scale-95 transition-all cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Vendor Invitation Modal (수리업체 초대 모달) */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 relative border border-[#c2c6d8]/40 animate-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => {
                setShowInviteModal(false);
                setGeneratedInviteCode(null);
              }}
              className="absolute top-5 right-5 text-[#727787] hover:text-[#1b1c1c] p-1 rounded-full hover:bg-[#f0eded] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!generatedInviteCode ? (
              /* Step 1: Input Form */
              <form onSubmit={handleSendInviteLink} className="space-y-5">
                <div>
                  <div className="flex items-center gap-2">
                    <UserPlus className="w-6 h-6 text-[#0054cc]" />
                    <h3 className="text-xl font-bold text-[#1b1c1c]">수리업체 3자 대화방 초대</h3>
                  </div>
                  <p className="text-xs text-[#727787] mt-1 leading-relaxed">
                    수리 기사님은 <strong className="text-[#0054cc]">별도의 회원가입 및 로그인 없이</strong> 발송된 전용 링크만 누르면 대화방에 즉시 참여하여 견적 제출 및 방문 일정을 협의할 수 있습니다.
                  </p>
                </div>

                <div className="p-3.5 bg-[#EFF2F8] border border-[#0054cc]/20 rounded-2xl flex items-center gap-2.5 text-xs text-[#001847]">
                  <Sparkles className="w-4 h-4 text-[#0054cc] shrink-0" />
                  <span>임대인-임차인-수리업체 3자 대화로 수리 분쟁을 사전에 완전 방지합니다.</span>
                </div>

                <div className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-[#424655] mb-1">
                      수리업체 / 기사님 상호명 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={inviteVendorName}
                      onChange={(e) => setInviteVendorName(e.target.value)}
                      placeholder="예: (주) 성진에어컨 기술팀"
                      required
                      className="w-full p-3 bg-white border border-[#c2c6d8] rounded-xl text-xs font-bold focus:border-[#0054cc] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#424655] mb-1">
                      기사님/담당자 연락처 (휴대폰 번호) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#727787]" />
                      <input
                        type="text"
                        value={invitePhone}
                        onChange={(e) => setInvitePhone(e.target.value)}
                        placeholder="예: 010-9876-5432"
                        required
                        className="w-full pl-9 pr-3 py-3 bg-white border border-[#c2c6d8] rounded-xl text-xs font-bold focus:border-[#0054cc] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#424655] mb-1">
                      초대 시 전달할 수리 요청 메모
                    </label>
                    <textarea
                      rows={2}
                      value={inviteMemo}
                      onChange={(e) => setInviteMemo(e.target.value)}
                      placeholder="예: 에어컨 냉방 불량 현장 점검 및 수리 견적 요청건입니다."
                      className="w-full p-3 bg-white border border-[#c2c6d8] rounded-xl text-xs font-medium focus:border-[#0054cc] outline-none resize-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="px-4 py-3 bg-[#f0eded] text-[#424655] font-bold text-xs rounded-xl hover:bg-[#e5e2e1] cursor-pointer"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#0054cc] hover:bg-[#066bfd] text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>대화방 초대 링크 생성 및 발송</span>
                  </button>
                </div>
              </form>
            ) : (
              /* Step 2: Link Generated & Send Success Screen */
              <div className="space-y-5 animate-in fade-in duration-300">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-[#10B981]/15 text-[#065F46] rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6 text-[#10B981]" />
                  </div>
                  <h3 className="text-lg font-extrabold text-[#1b1c1c]">
                    수리업체 초대 링크가 발송되었습니다!
                  </h3>
                  <p className="text-xs text-[#727787]">
                    <strong>{inviteVendorName}</strong> ({invitePhone}) 님에게 전송된 링크로 접속 시 로그인 없이 즉시 대화방에 참여하게 됩니다.
                  </p>
                </div>

                {/* Invite Link Box */}
                <div className="p-3.5 bg-[#f6f3f2] rounded-2xl border border-[#c2c6d8] space-y-2">
                  <span className="text-[11px] font-bold text-[#424655] block">
                    생성된 전용 초대 링크 (노로그인 다이렉트 입장):
                  </span>
                  <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-[#c2c6d8]/60">
                    <LinkIcon className="w-4 h-4 text-[#0054cc] shrink-0" />
                    <span className="text-xs text-[#0054cc] font-mono truncate flex-1">
                      {fullInviteUrl}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyInviteLink}
                      className="px-3 py-1.5 bg-[#0054cc] text-white font-bold text-xs rounded-lg hover:bg-[#066bfd] transition-all cursor-pointer flex items-center gap-1 shrink-0"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>복사</span>
                    </button>
                  </div>
                  {copiedToast && (
                    <p className="text-[11px] font-bold text-[#10B981] flex items-center gap-1 animate-in fade-in">
                      <Check className="w-3 h-3" />
                      초대 링크가 클립보드에 복사되었습니다!
                    </p>
                  )}
                </div>

                {/* Test Direct Vendor Join Button */}
                <div className="p-4 bg-[#E6F4EA] rounded-2xl border border-[#10B981]/30 space-y-2">
                  <p className="text-xs font-extrabold text-[#065F46] flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-[#10B981]" />
                    <span>[시뮬레이션] 수리업체 입장에서 대화 바로 테스트</span>
                  </p>
                  <p className="text-[11px] text-[#065F46]/80 leading-relaxed">
                    아래 버튼을 누르면 별도 회원가입 없이 수리업체(기사님) 시점으로 대화방에 즉시 입장하여 견적을 등록하거나 메시지를 보내실 수 있습니다.
                  </p>
                  <button
                    type="button"
                    onClick={handleDirectJoinAsVendor}
                    className="w-full py-3 bg-[#10B981] hover:bg-[#059669] text-white font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>수리업체 시점으로 바로 대화방 입장하기</span>
                  </button>
                </div>

                <div className="pt-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setShowInviteModal(false);
                      setGeneratedInviteCode(null);
                    }}
                    className="w-full py-3 bg-[#f0eded] hover:bg-[#e5e2e1] text-[#1b1c1c] font-extrabold text-xs rounded-xl cursor-pointer"
                  >
                    닫기
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
