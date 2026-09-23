import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Send,
  Image as ImageIcon,
  ShieldCheck,
  Receipt,
  ArrowLeft,
  UserPlus,
  Phone,
  Link as LinkIcon,
  Copy,
  ExternalLink,
  Check,
  Share2,
  Building2,
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
    scrollToBottom(false);
  }, [currentCase?.id]);

  useEffect(() => {
    scrollToBottom(true);
  }, [chatMessages.length]);

  if (!currentCase) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center bg-white rounded-xl border border-neutral-200 space-y-4 shadow-xs">
        <Receipt className="w-10 h-10 text-neutral-400 mx-auto" />
        <h3 className="text-base font-bold text-neutral-900">선택된 수리 요청건이 없습니다.</h3>
        <p className="text-xs text-neutral-500">대시보드에서 수리건을 선택하거나 새로운 요청서를 작성해주세요.</p>
        <button
          onClick={() => setActiveTab('dashboard')}
          className="px-4 py-2 bg-[#0F172A] text-white font-semibold text-xs rounded-lg hover:bg-[#1E293B] cursor-pointer"
        >
          대시보드로 돌아가기
        </button>
      </div>
    );
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    let senderRole: 'LANDLORD' | 'TENANT' | 'TECHNICIAN' = 'LANDLORD';
    let senderName = '임대인 김지수';

    if (role === 'TENANT') {
      senderRole = 'TENANT';
      senderName = '김지우 님';
    } else if (role === 'VENDOR') {
      senderRole = 'TECHNICIAN';
      senderName = currentCase.invitedVendors?.[0]?.vendorName || '수리업체 (성진에어컨)';
    }

    sendChatMessage(currentCase.id, senderRole, senderName, inputMsg.trim());
    setInputMsg('');
    setTimeout(() => scrollToBottom(true), 50);
  };

  const handleInputFocus = () => {
    setTimeout(() => {
      scrollToBottom(true);
    }, 200);
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

  const fullInviteUrl = `https://dundeun-jibsa.app/invite/${currentCase.id}?code=${generatedInviteCode || 'v-8821'}`;

  return (
    <div className="max-w-4xl mx-auto space-y-3 animate-in fade-in duration-200">
      {/* VENDOR Mode Active Banner */}
      {role === 'VENDOR' && (
        <div className="bg-emerald-700 text-white px-4 py-2.5 rounded-lg shadow-xs flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-white shrink-0" />
            <span>수리업체 무로그인 대화 참여 모드</span>
          </div>
          <button
            onClick={() => setRole('LANDLORD')}
            className="px-2.5 py-1 bg-white text-emerald-800 font-semibold text-[11px] rounded transition-colors cursor-pointer"
          >
            임대인/임차인 화면으로 전환
          </button>
        </div>
      )}

      {/* Main Chat Window */}
      <div className="bg-white rounded-xl shadow-xs border border-neutral-200 flex flex-col h-[calc(100vh-180px)] min-h-[500px] max-h-[720px] overflow-hidden">
        {/* Stream Header */}
        <div className="p-3 sm:p-4 border-b border-neutral-200 flex justify-between items-center bg-white shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="p-1 hover:bg-neutral-100 rounded text-neutral-500 cursor-pointer shrink-0 transition-colors"
              title="대시보드로 돌아가기"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2 truncate">
                <span className="font-bold text-sm text-neutral-900 truncate">
                  {currentCase.title}
                </span>
                <span className="font-mono text-xs text-neutral-400 shrink-0">
                  {currentCase.unit}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 font-mono truncate mt-0.5">
                {currentCase.tenantName} · {currentCase.category}
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
              className="px-2.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-xs rounded-md flex items-center gap-1 cursor-pointer transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5 text-neutral-600" />
              <span className="hidden sm:inline">업체 초대</span>
            </button>
            <button
              onClick={() => setActiveTab('estimates')}
              className="px-2.5 py-1.5 bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold text-xs rounded-md flex items-center gap-1 cursor-pointer shadow-xs transition-colors"
            >
              <Receipt className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">견적 ({currentCase.estimates.length})</span>
            </button>
          </div>
        </div>

        {/* Messages Scroll Area */}
        <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-neutral-50/40">
          {/* Embedded Move In Record Card */}
          {currentCase.moveInRecord && (
            <div className="bg-white p-3.5 rounded-lg border border-neutral-200 space-y-2 max-w-md mx-auto shadow-xs">
              <div className="flex items-center justify-between text-xs font-semibold text-neutral-900">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>입주 시 상태 사진 기록</span>
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">{currentCase.moveInRecord.recordedAt}</span>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">{currentCase.moveInRecord.note}</p>
              <img
                src={currentCase.moveInRecord.photoUrl}
                alt="Move In Evidence"
                className="w-full h-32 object-cover rounded border border-neutral-200"
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
                  <div className="bg-neutral-100 text-neutral-600 text-[11px] font-mono px-3 py-1 rounded border border-neutral-200 text-center max-w-md">
                    {msg.message}
                  </div>
                </div>
              );
            }

            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-1.5 mb-1 px-1">
                  <span className="text-[11px] font-medium text-neutral-500">{msg.senderName}</span>
                  {isTechnician && (
                    <span className="text-[10px] font-semibold text-emerald-700 font-mono">
                      [수리기사]
                    </span>
                  )}
                </div>

                <div
                  className={`max-w-[85%] sm:max-w-[75%] p-3 rounded-lg text-xs leading-relaxed ${
                    isMe
                      ? 'bg-[#0F172A] text-white shadow-xs'
                      : isTechnician
                      ? 'bg-emerald-50 text-emerald-950 border border-emerald-200'
                      : 'bg-white text-neutral-900 border border-neutral-200 shadow-xs'
                  }`}
                >
                  <p>{msg.message}</p>

                  {msg.attachmentUrl && (
                    <img
                      src={msg.attachmentUrl}
                      alt="Attachment"
                      className="mt-2 rounded border border-black/10 max-h-48 w-full object-cover"
                    />
                  )}
                </div>
                <span className="text-[10px] text-neutral-400 font-mono mt-1 px-1">{msg.timestamp}</span>
              </div>
            );
          })}
        </div>

        {/* Quick Hashtag Chips */}
        <div className="px-3 py-1.5 border-t border-neutral-200 bg-white flex items-center gap-1.5 overflow-x-auto shrink-0">
          <span className="text-[11px] font-mono text-neutral-400 whitespace-nowrap">빠른 태그:</span>

          {role === 'VENDOR' ? (
            <>
              <button
                onClick={() => handleQuickHashtag('VENDOR_QUOTE')}
                className="px-2 py-0.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded text-[11px] font-medium whitespace-nowrap cursor-pointer transition-colors"
              >
                #견적서_제출
              </button>
              <button
                onClick={() => handleQuickHashtag('VENDOR_VISIT')}
                className="px-2 py-0.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded text-[11px] font-medium whitespace-nowrap cursor-pointer transition-colors"
              >
                #방문일정_제안
              </button>
              <button
                onClick={() => handleQuickHashtag('VENDOR_DONE')}
                className="px-2 py-0.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded text-[11px] font-medium whitespace-nowrap cursor-pointer transition-colors"
              >
                #수리완료_보고
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleQuickHashtag('MOVE_IN')}
                className="px-2 py-0.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded text-[11px] font-medium whitespace-nowrap cursor-pointer transition-colors"
              >
                #입주상태_기록
              </button>
              <button
                onClick={() => handleQuickHashtag('VISIT')}
                className="px-2 py-0.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded text-[11px] font-medium whitespace-nowrap cursor-pointer transition-colors"
              >
                #방문요청
              </button>
              <button
                onClick={() => handleQuickHashtag('PAYMENT')}
                className="px-2 py-0.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded text-[11px] font-medium whitespace-nowrap cursor-pointer transition-colors"
              >
                #입금확인
              </button>
            </>
          )}
        </div>

        {/* Input Box Bar */}
        <form onSubmit={handleSend} className="p-2.5 border-t border-neutral-200 flex items-center gap-2 bg-white shrink-0">
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
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded transition-colors cursor-pointer shrink-0"
            title="사진 첨부"
          >
            <ImageIcon className="w-4 h-4" />
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
            className="flex-1 py-1.5 px-3 bg-neutral-50 focus:bg-white border border-neutral-200 focus:border-neutral-400 rounded-lg outline-none text-xs transition-colors"
          />

          <button
            type="submit"
            className="p-2 bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-lg shadow-xs active:scale-95 transition-all cursor-pointer shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Vendor Invitation Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl space-y-4 relative border border-neutral-200 animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
              <h3 className="text-sm font-bold text-neutral-900">수리업체 3자 대화방 초대</h3>
              <button
                type="button"
                onClick={() => {
                  setShowInviteModal(false);
                  setGeneratedInviteCode(null);
                }}
                className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!generatedInviteCode ? (
              <form onSubmit={handleSendInviteLink} className="space-y-3">
                <p className="text-xs text-neutral-500 leading-relaxed">
                  수리 기사님은 별도 회원가입 없이 발송된 전용 링크로 즉시 대화방에 참여하여 견적과 일정을 조율할 수 있습니다.
                </p>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    수리업체 / 기사명 *
                  </label>
                  <input
                    type="text"
                    value={inviteVendorName}
                    onChange={(e) => setInviteVendorName(e.target.value)}
                    placeholder="예: (주) 성진에어컨 기술팀"
                    required
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs outline-none focus:bg-white focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    기사님 연락처 *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                    <input
                      type="text"
                      value={invitePhone}
                      onChange={(e) => setInvitePhone(e.target.value)}
                      placeholder="010-9876-5432"
                      required
                      className="w-full pl-8 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-mono outline-none focus:bg-white focus:border-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    요청 메모
                  </label>
                  <textarea
                    rows={2}
                    value={inviteMemo}
                    onChange={(e) => setInviteMemo(e.target.value)}
                    placeholder="예: 에어컨 냉방 불량 현장 점검 및 견적 요청"
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs outline-none focus:bg-white focus:border-blue-600 resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="px-3 py-1.5 border border-neutral-200 text-neutral-600 font-semibold text-xs rounded-lg hover:bg-neutral-50 cursor-pointer"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold text-xs rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>초대 링크 생성</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="text-center space-y-1">
                  <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-bold text-neutral-900">
                    초대 링크가 생성되었습니다
                  </h3>
                  <p className="text-[11px] text-neutral-500 font-mono">
                    {inviteVendorName} ({invitePhone})
                  </p>
                </div>

                <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 space-y-2">
                  <div className="flex items-center gap-1.5 bg-white p-2 rounded border border-neutral-200">
                    <LinkIcon className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span className="text-[11px] text-neutral-600 font-mono truncate flex-1">
                      {fullInviteUrl}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyInviteLink}
                      className="px-2 py-1 bg-[#0F172A] text-white font-semibold text-[10px] rounded hover:bg-[#1E293B] transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                    >
                      <Copy className="w-3 h-3" />
                      <span>복사</span>
                    </button>
                  </div>
                  {copiedToast && (
                    <p className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>초대 링크가 클립보드에 복사되었습니다.</span>
                    </p>
                  )}
                </div>

                <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-200 space-y-1.5">
                  <p className="text-xs font-semibold text-emerald-900 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>[테스트] 수리업체 시점으로 바로 입장</span>
                  </p>
                  <button
                    type="button"
                    onClick={handleDirectJoinAsVendor}
                    className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-md shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>수리업체 모드로 참여하기</span>
                  </button>
                </div>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setShowInviteModal(false);
                      setGeneratedInviteCode(null);
                    }}
                    className="w-full py-2 border border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-semibold text-xs rounded-lg cursor-pointer"
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
