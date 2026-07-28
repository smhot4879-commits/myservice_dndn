import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Link as LinkIcon, Check, Save, ArrowLeft, ShieldCheck, LogOut } from 'lucide-react';

export const TenantRegisterView: React.FC = () => {
  const { setActiveTab, updateUserProfile, logout } = useApp();

  const [address, setAddress] = useState('서울특별시 강남구 테헤란로 123 그린빌 302호');
  const [deposit, setDeposit] = useState('1000');
  const [rent, setRent] = useState('85');
  const [startDate, setStartDate] = useState('2023-10-15');
  const [endDate, setEndDate] = useState('2025-10-14');
  const [specialTerms, setSpecialTerms] = useState(
    '1. 에어컨 및 보일러 주요 시설 노후 고장 시 임대인 수리 책임\n2. 애완동물 사육 시 퇴거 시 소독비 부담\n3. 전세보증금 반환 보증보험 가입 동의'
  );
  const [name, setName] = useState('김지우');
  const [phone, setPhone] = useState('010-3829-1029');
  const [copiedLink, setCopiedLink] = useState(false);
  const [authenticated, setAuthenticated] = useState(true);

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(`https://dundunhouse.app/invite/tenant/302?code=INV-99201`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUserProfile({
      userId: 'tenant-jiwoo',
      name,
      phone,
      role: 'TENANT',
      address,
      deposit,
      rent,
      specialTerms,
    });
    alert('임차인 회원정보 및 계약 정보가 안전하게 저장되었습니다.');
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Banner indicating auto-login completed */}
      <div className="bg-[#636100]/10 border border-[#636100]/30 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#636100] text-white flex items-center justify-center font-extrabold text-sm shrink-0">
            ✓
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-[#1b1c1c]">임차인 회원가입 및 자동 로그인 완료</h3>
            <p className="text-xs text-[#424655]">기본 회원 정보 및 거주지 정보를 확인 후 수리 요청 서비스를 이용해 보세요.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="px-4 py-2 bg-white text-[#ef4444] border border-[#ef4444]/30 hover:bg-[#ef4444] hover:text-white font-bold text-xs rounded-xl shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>로그아웃</span>
        </button>
      </div>

      <div className="flex items-center justify-between border-b border-[#c2c6d8]/40 pb-4">
        <button
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-1.5 text-[#424655] hover:text-[#0054cc] font-bold text-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>대시보드로 돌아가기</span>
        </button>
        <h2 className="text-xl font-extrabold text-[#1b1c1c]">임차인 회원정보 및 임대차 등록</h2>
        <span className="text-xs text-[#0054cc] font-bold bg-[#0054cc]/10 px-3 py-1 rounded-full">
          그린빌 302호
        </span>
      </div>

      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-3xl shadow-xs border border-[#c2c6d8]/30 space-y-6">
        {/* Personal Authentication */}
        <div className="bg-[#f0eded] p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-[#c2c6d8]/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#10B981]/15 text-[#10B981] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-sm text-[#1b1c1c]">본인 인증 완료 (NICE 평가정보)</p>
              <p className="text-xs text-[#424655]">실명 및 거주자 본인 확인이 확인되었습니다.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setAuthenticated(true);
              alert('본인인증이 완료되었습니다.');
            }}
            className="px-4 py-2 bg-white text-[#10B981] border border-[#10B981] font-bold text-xs rounded-xl shadow-2xs hover:bg-[#10B981]/5"
          >
            {authenticated ? '인증 완료됨' : '본인인증 실행'}
          </button>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#424655] mb-1">임차인 성명</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-[#f6f3f2] border border-[#c2c6d8] rounded-xl text-sm font-medium focus:border-[#0054cc] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#424655] mb-1">휴대폰 번호</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 bg-[#f6f3f2] border border-[#c2c6d8] rounded-xl text-sm font-medium focus:border-[#0054cc] outline-none"
            />
          </div>
        </div>

        {/* Address Field with Search Button */}
        <div>
          <label className="block text-xs font-bold text-[#424655] mb-1">거주지 소재지 주소</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="flex-1 p-3 bg-[#f6f3f2] border border-[#c2c6d8] rounded-xl text-sm font-medium focus:border-[#0054cc] outline-none"
            />
            <button
              type="button"
              onClick={() => alert('도로명 주소 검색 팝업이 호출됩니다.')}
              className="px-4 bg-[#0054cc] text-white font-bold text-xs rounded-xl hover:bg-[#066bfd] transition-all flex items-center gap-1 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>주소 검색</span>
            </button>
          </div>
        </div>

        {/* Rent & Deposit */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#424655] mb-1">임대 보증금 (만원)</label>
            <input
              type="number"
              value={deposit}
              onChange={(e) => setDeposit(e.target.value)}
              className="w-full p-3 bg-[#f6f3f2] border border-[#c2c6d8] rounded-xl text-sm font-medium focus:border-[#0054cc] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#424655] mb-1">월 차임/월세 (만원)</label>
            <input
              type="number"
              value={rent}
              onChange={(e) => setRent(e.target.value)}
              className="w-full p-3 bg-[#f6f3f2] border border-[#c2c6d8] rounded-xl text-sm font-medium focus:border-[#0054cc] outline-none"
            />
          </div>
        </div>

        {/* Contract Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#424655] mb-1">계약 시작일</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-3 bg-[#f6f3f2] border border-[#c2c6d8] rounded-xl text-sm font-medium focus:border-[#0054cc] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#424655] mb-1">계약 만료일</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-3 bg-[#f6f3f2] border border-[#c2c6d8] rounded-xl text-sm font-medium focus:border-[#0054cc] outline-none"
            />
          </div>
        </div>

        {/* Special Terms */}
        <div>
          <label className="block text-xs font-bold text-[#424655] mb-1">임대차 특약 사항 메모</label>
          <textarea
            rows={4}
            value={specialTerms}
            onChange={(e) => setSpecialTerms(e.target.value)}
            placeholder="계약서 상 등록된 주요 특약 및 수리 의무 협의사항을 입력하세요"
            className="w-full p-3 bg-[#f6f3f2] border border-[#c2c6d8] rounded-xl text-sm font-medium focus:border-[#0054cc] outline-none"
          />
        </div>

        {/* Share Invite Link with Landlord */}
        <div className="bg-[#dae2ff]/40 p-5 rounded-2xl border border-[#0054cc]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="font-bold text-sm text-[#001847]">임대인 연동 초대 링크</p>
            <p className="text-xs text-[#424655]">임대인에게 링크를 전송하면 수리 요청 및 대화방이 자동으로 연결됩니다.</p>
          </div>
          <button
            type="button"
            onClick={handleCopyInviteLink}
            className="px-4 py-2.5 bg-[#0054cc] text-white font-bold text-xs rounded-xl shadow-md hover:bg-[#066bfd] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {copiedLink ? <Check className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
            <span>{copiedLink ? '링크 복사됨!' : '임대인에게 링크 공유'}</span>
          </button>
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-[#0054cc] text-white font-bold text-base rounded-2xl shadow-lg hover:bg-[#066bfd] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Save className="w-5 h-5" />
          <span>회원가입 및 정보 저장 완료 (대시보드로 이동)</span>
        </button>

        {/* Bottom Logout Button */}
        <div className="pt-6 border-t border-[#c2c6d8]/30 flex justify-center">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-[#ef4444] hover:text-white bg-[#ef4444]/10 hover:bg-[#ef4444] border border-[#ef4444]/30 transition-all cursor-pointer shadow-2xs"
          >
            <LogOut className="w-4 h-4" />
            <span>로그아웃 (역할 선택으로 돌아가기)</span>
          </button>
        </div>
      </form>
    </div>
  );
};
