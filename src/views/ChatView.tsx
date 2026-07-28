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
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Invite Vendor Modal States
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteVendorName, setInviteVendorName] = useState('(주) 성진에어컨 수리센터');
  const [invitePhone, setInvitePhone] = useState('010-9876-5432');
  const [inviteMemo, setInviteMemo] = useState('에어컨 냉방 불량 수리 견적 및 현장 방문 일정 협의건입니다.');
  
  // Link Result States
  const [generatedInviteCode, setGeneratedInviteCode] = useState<string | null>(null);
  const [copiedToast, setCopiedToast] = useState(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [caseMessages]);

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
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* VENDOR Mode Active Banner */}
      {role === 'VENDOR' && (
        <div className="bg-[#10B981] text-white p-4 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-2xl">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm">수리업체 무로그인 대화 참여 모드</span>
                <span className="bg-white text-[#10B981] text-[10px] font-black px-2 py-0.5 rounded-full">
                  회원가입 없음
                </span>
              </div>
              <p className="text-xs text-white/90">
                초대받은 수리 기사님 시점으로 3자 대화방에서 견적제출 및 일정 상담 중입니다.
              </p>
            </div>
          </div>

          <button
            onClick={() => setRole('LANDLORD')}
            className="px-4 py-2 bg-white hover:bg-emerald-50 text-[#065F46] font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
          >
            임대인/임차인 화면으로 전환
          </button>
        </div>
      )}

      {/* Top Header & Stepper Bar */}
      <div className="bg-white p-5 rounded-3xl shadow-xs border border-[#c2c6d8]/40 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="p-2 hover:bg-[#f0eded] rounded-xl text-[#727787] cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-[#1b1c1c]">{currentCase.title}</span>
                <span className="bg-[#0054cc]/10 text-[#0054cc] font-bold text-xs px-2.5 py-0.5 rounded-full">
                  {currentCase.unit}
                </span>
              </div>
              <p className="text-xs text-[#424655] mt-0.5">
                임차인: {currentCase.tenantName} | 카테고리: {currentCase.category}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Invite Vendor Action Button */}
            <button
              onClick={() => {
                setGeneratedInviteCode(null);
                setShowInviteModal(true);
              }}
              className="px-3.5 py-2 bg-[#0054cc]/10 hover:bg-[#0054cc]/20 text-[#0054cc] font-extrabold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer transition-all border border-[#0054cc]/20 shadow-2xs"
            >
              <UserPlus className="w-4 h-4 text-[#0054cc]" />
              <span>수리업체 초대하기</span>
            </button>

            <button
              onClick={() => setActiveTab('estimates')}
              className="px-3.5 py-2 bg-[#f0eded] hover:bg-[#e5e2e1] text-[#1b1c1c] font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <Receipt className="w-4 h-4 text-[#0054cc]" />
              <span>비교 견적서 ({currentCase.estimates.length})</span>
            </button>

            {currentCase.status === 'COMPLETED' ? (
              <button
                onClick={() => setActiveTab('completion')}
                className="px-3.5 py-2 bg-[#10B981] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <FileCheck className="w-4 h-4" />
                <span>수리 보고서 보기</span>
              </button>
            ) : (
              <button
                onClick={handleCompleteRepairReport}
                className="px-3.5 py-2 bg-[#0054cc] text-white font-bold text-xs rounded-xl hover:bg-[#066bfd] flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>수리 완료 처리</span>
              </button>
            )}
          </div>
        </div>

        {/* Status Stepper & Participants Badge */}
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 py-2.5 bg-[#fcf9f8] rounded-2xl border border-[#c2c6d8]/30">
          <div className="flex items-center gap-2 text-xs font-bold text-[#1b1c1c]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0054cc] animate-pulse" />
            <span>현재 상태: {currentCase.status === 'QUOTE_UPLOADED' ? '비교 견적 검토 단계' : currentCase.status}</span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-[#424655]">
            <span className="font-bold text-[#0054cc]">대화 참여자:</span>
            <span>임대인(김지수), 임차인({currentCase.tenantName})</span>
            {currentCase.invitedVendors && currentCase.invitedVendors.length > 0 ? (
              <span className="inline-flex items-center gap-1 bg-[#10B981]/10 text-[#065F46] font-extrabold px-2 py-0.5 rounded-md border border-[#10B981]/20">
                <UserCheck className="w-3 h-3" />
                <span>수리업체: {currentCase.invitedVendors[0].vendorName}</span>
              </span>
            ) : (
              <button
                onClick={() => {
                  setGeneratedInviteCode(null);
                  setShowInviteModal(true);
                }}
                className="text-[#0054cc] hover:underline font-bold cursor-pointer"
              >
                + 수리업체 초대
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Chat Stream (Left 8 cols) & Case Summary Sidebar (Right 4 cols) */}
      <div className="grid grid-cols-12 gap-6">
        {/* Chat Messages Stream */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-3xl shadow-xs border border-[#c2c6d8]/40 flex flex-col h-[620px]">
          {/* Stream Header */}
          <div className="p-4 border-b border-[#c2c6d8]/30 flex justify-between items-center bg-[#fcf9f8] rounded-t-3xl">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#0054cc]" />
              <span className="font-bold text-xs text-[#1b1c1c]">법적 근거 보관 3자 실시간 대화방</span>
            </div>
            <span className="text-[11px] text-[#727787]">메시지는 실시간 서명 기록됩니다</span>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {/* Embedded Move In Record Card */}
            {currentCase.moveInRecord && (
              <div className="bg-[#dae2ff]/30 p-4 rounded-2xl border border-[#0054cc]/20 space-y-2 max-w-lg mx-auto">
                <div className="flex items-center justify-between text-xs font-bold text-[#001847]">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#0054cc]" />
                    <span>입주 시 상태 기록 (증빙 근거 자료)</span>
                  </span>
                  <span className="text-[10px] text-[#727787]">{currentCase.moveInRecord.recordedAt}</span>
                </div>
                <p className="text-xs text-[#424655] leading-relaxed">{currentCase.moveInRecord.note}</p>
                <img
                  src={currentCase.moveInRecord.photoUrl}
                  alt="Move In Evidence"
                  className="w-full h-40 object-cover rounded-xl border border-[#c2c6d8]"
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
                  <div key={msg.id} className="flex justify-center my-3">
                    <div className="bg-[#f0eded] text-[#424655] text-xs font-semibold px-4 py-1.5 rounded-2xl border border-[#c2c6d8]/40 shadow-2xs text-center max-w-md">
                      {msg.message}
                    </div>
                  </div>
                );
              }

              return (
                <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-1.5 mb-1 px-1">
                    <span className="text-[10px] font-bold text-[#727787]">{msg.senderName}</span>
                    {isTechnician && (
                      <span className="bg-[#10B981]/15 text-[#065F46] text-[9px] font-extrabold px-1.5 py-0.2 rounded-md">
                        수리기사/업체
                      </span>
                    )}
                  </div>

                  <div
                    className={`max-w-[80%] sm:max-w-[70%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-2xs ${
                      isMe
                        ? 'bg-[#0054cc] text-white rounded-tr-none'
                        : isTechnician
                        ? 'bg-[#E6F4EA] text-[#065F46] border border-[#10B981]/30 rounded-tl-none font-medium'
                        : 'bg-[#f0eded] text-[#1b1c1c] rounded-tl-none border border-[#c2c6d8]/30'
                    }`}
                  >
                    <p>{msg.message}</p>

                    {msg.attachmentUrl && (
                      <img
                        src={msg.attachmentUrl}
                        alt="Attachment"
                        className="mt-2.5 rounded-xl border border-white/20 max-h-48 w-full object-cover"
                      />
                    )}
                  </div>
                  <span className="text-[10px] text-[#727787] mt-1 px-1">{msg.timestamp}</span>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Hashtag Chips */}
          <div className="px-4 py-2 border-t border-[#c2c6d8]/30 bg-[#fcf9f8] flex items-center gap-2 overflow-x-auto">
            <span className="text-[11px] font-bold text-[#727787] whitespace-nowrap">빠른 입력:</span>

            {role === 'VENDOR' ? (
              <>
                <button
                  onClick={() => handleQuickHashtag('VENDOR_QUOTE')}
                  className="px-2.5 py-1 bg-white hover:bg-[#E6F4EA] text-[#065F46] border border-[#10B981]/40 rounded-full text-xs font-extrabold whitespace-nowrap cursor-pointer"
                >
                  #견적서_제출
                </button>
                <button
                  onClick={() => handleQuickHashtag('VENDOR_VISIT')}
                  className="px-2.5 py-1 bg-white hover:bg-[#E6F4EA] text-[#065F46] border border-[#10B981]/40 rounded-full text-xs font-extrabold whitespace-nowrap cursor-pointer"
                >
                  #방문일정_제안
                </button>
                <button
                  onClick={() => handleQuickHashtag('VENDOR_DONE')}
                  className="px-2.5 py-1 bg-white hover:bg-[#E6F4EA] text-[#065F46] border border-[#10B981]/40 rounded-full text-xs font-extrabold whitespace-nowrap cursor-pointer"
                >
                  #수리완료_보고
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleQuickHashtag('MOVE_IN')}
                  className="px-2.5 py-1 bg-white hover:bg-[#dae2ff] text-[#0054cc] border border-[#0054cc]/30 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer"
                >
                  #입주상태_기록
                </button>
                <button
                  onClick={() => handleQuickHashtag('VISIT')}
                  className="px-2.5 py-1 bg-white hover:bg-[#dae2ff] text-[#0054cc] border border-[#0054cc]/30 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer"
                >
                  #방문요청
                </button>
                <button
                  onClick={() => handleQuickHashtag('PAYMENT')}
                  className="px-2.5 py-1 bg-white hover:bg-[#dae2ff] text-[#0054cc] border border-[#0054cc]/30 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer"
                >
                  #입금확인
                </button>
              </>
            )}
          </div>

          {/* Input Box Bar */}
          <form onSubmit={handleSend} className="p-3 border-t border-[#c2c6d8]/40 flex items-center gap-2 bg-white rounded-b-3xl">
            {/* Photo Upload Button */}
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
              className="p-2.5 text-[#727787] hover:text-[#0054cc] hover:bg-[#f0eded] rounded-xl transition-colors cursor-pointer"
              title="사진 첨부"
            >
              <ImageIcon className="w-5 h-5" />
            </button>

            {/* Invite Vendor Button in Input Bar */}
            <button
              type="button"
              onClick={() => {
                setGeneratedInviteCode(null);
                setShowInviteModal(true);
              }}
              className="px-3 py-2 bg-[#0054cc]/10 hover:bg-[#0054cc]/20 text-[#0054cc] font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
              title="수리업체 무로그인 대화방 초대"
            >
              <UserPlus className="w-4 h-4 text-[#0054cc]" />
              <span className="hidden sm:inline">수리업체 초대</span>
            </button>

            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder={
                role === 'VENDOR'
                  ? '수리 기사 메시지를 입력하세요 (견적, 일정 등)...'
                  : '투명 수리 협의 메시지를 입력하세요...'
              }
              className="flex-1 py-2.5 px-4 bg-[#f6f3f2] focus:bg-white border border-transparent focus:border-[#0054cc] rounded-2xl outline-none text-sm transition-all"
            />

            <button
              type="submit"
              className="p-3 bg-[#0054cc] hover:bg-[#066bfd] text-white rounded-2xl shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right Floating Summary Sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          {/* Invited Vendor Status Card */}
          <div className="bg-white p-5 rounded-3xl shadow-xs border border-[#0054cc]/30 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#c2c6d8]/30">
              <h4 className="font-extrabold text-xs text-[#0054cc] flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-[#0054cc]" />
                <span>수리업체 3자 참여 현황</span>
              </h4>
              <button
                onClick={() => {
                  setGeneratedInviteCode(null);
                  setShowInviteModal(true);
                }}
                className="text-[10px] bg-[#0054cc] text-white font-bold px-2 py-1 rounded-lg hover:bg-[#066bfd] transition-all cursor-pointer"
              >
                + 업체 초대
              </button>
            </div>

            {currentCase.invitedVendors && currentCase.invitedVendors.length > 0 ? (
              <div className="space-y-2">
                {currentCase.invitedVendors.map((v) => (
                  <div key={v.id} className="p-3 bg-[#EFF2F8] rounded-2xl border border-[#0054cc]/20 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs text-[#1b1c1c]">{v.vendorName}</span>
                      <span className="bg-[#10B981]/15 text-[#065F46] text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <UserCheck className="w-3 h-3" />
                        초대 완료
                      </span>
                    </div>
                    <p className="text-[11px] text-[#424655] flex items-center gap-1">
                      <Phone className="w-3 h-3 text-[#0054cc]" />
                      {v.phone}
                    </p>
                    <div className="pt-1.5 flex justify-end">
                      <button
                        onClick={() => joinAsVendor(currentCase.id, v.vendorName)}
                        className="text-[10px] text-[#0054cc] hover:underline font-extrabold flex items-center gap-1 cursor-pointer"
                      >
                        <span>[시뮬레이션] 수리업체 시점 대화 참여</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                onClick={() => {
                  setGeneratedInviteCode(null);
                  setShowInviteModal(true);
                }}
                className="p-4 rounded-2xl border-2 border-dashed border-[#c2c6d8] hover:border-[#0054cc] bg-[#fcf9f8] hover:bg-white text-center cursor-pointer transition-all space-y-1"
              >
                <UserPlus className="w-5 h-5 text-[#0054cc] mx-auto" />
                <p className="text-xs font-extrabold text-[#1b1c1c]">수리업체 초대하기</p>
                <p className="text-[10px] text-[#727787]">
                  회원가입 없이 링크로 3자 대화방 입장
                </p>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-xs border border-[#c2c6d8]/40 space-y-4">
            <h3 className="font-extrabold text-base text-[#1b1c1c] pb-3 border-b border-[#c2c6d8]/30 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-[#0054cc]" />
              <span>수리 및 기록 요약</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-[#424655]">호실 / 세대:</span>
                <span className="font-bold text-[#1b1c1c]">{currentCase.unit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#424655]">임차인 성명:</span>
                <span className="font-bold text-[#1b1c1c]">{currentCase.tenantName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#424655]">수리 분류:</span>
                <span className="font-bold text-[#0054cc]">{currentCase.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#424655]">접수 일시:</span>
                <span className="font-bold text-[#1b1c1c]">{currentCase.createdAt}</span>
              </div>
            </div>

            {/* Approved Estimate box */}
            <div className="bg-[#f6f3f2] p-4 rounded-2xl space-y-2 border border-[#c2c6d8]/30">
              <span className="text-[11px] font-bold text-[#0054cc]">등록된 비교 견적 ({currentCase.estimates.length}건)</span>
              {currentCase.estimates[0] && (
                <div>
                  <p className="font-bold text-sm text-[#1b1c1c]">{currentCase.estimates[0].vendorName}</p>
                  <p className="text-base font-black text-[#0054cc]">
                    ₩{currentCase.estimates[0].amount.toLocaleString()}원
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => setActiveTab('estimates')}
              className="w-full py-3 bg-[#0054cc] text-white font-bold text-xs rounded-xl hover:bg-[#066bfd] transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Receipt className="w-4 h-4" />
              <span>전체 비교 견적서 확인하기</span>
            </button>
          </div>

          <div className="bg-[#fcf9f8] p-5 rounded-3xl border border-dashed border-[#c2c6d8] space-y-2">
            <p className="text-xs font-bold text-[#1b1c1c] flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-[#7a24df]" />
              <span>법률 효력 안내</span>
            </p>
            <p className="text-[11px] text-[#424655] leading-relaxed">
              본 대화방에서 오간 합의 내용 및 사진 자료는 주택임대차 분쟁 조정 위원회 제출 시 합의 이력 서류로 활용됩니다.
            </p>
          </div>
        </div>
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
