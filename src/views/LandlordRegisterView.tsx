import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Building2, Plus, Save, ArrowLeft, LogOut } from 'lucide-react';

export const LandlordRegisterView: React.FC = () => {
  const { setActiveTab, propertyUnits, addPropertyUnit, updateUserProfile, logout } = useApp();

  const [landlordName, setLandlordName] = useState('김지수');
  const [landlordPhone, setLandlordPhone] = useState('010-9988-1234');
  const [landlordEmail, setLandlordEmail] = useState('jisoo.kim@dundun.com');
  const [templateNotes, setTemplateNotes] = useState(
    '1. 모든 수리 요청은 든든집사 앱 비교 견적 시스템을 통해 사전 승인 후 진행함.\n2. 세입자 고의 및 과실로 인한 파손은 세입자 원상복구 부담 원칙 적용.'
  );

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUserProfile({
      userId: 'landlord-jisoo',
      name: landlordName,
      phone: landlordPhone,
      email: landlordEmail,
      role: 'LANDLORD',
      specialTerms: templateNotes,
    });
    alert('임대인 프로필 및 보유 매물 설정이 성공적으로 저장되었습니다.');
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    if (confirm('로그아웃 하시겠습니까? 역할 선택 화면으로 이동합니다.')) {
      logout();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between border-b border-[#c2c6d8]/40 pb-4">
        <button
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-1.5 text-[#424655] hover:text-[#0054cc] font-bold text-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>대시보드로 돌아가기</span>
        </button>
        <h2 className="text-xl font-extrabold text-[#1b1c1c]">임대인 프로필 및 매물 관리</h2>
        <span className="text-xs text-[#0054cc] font-bold bg-[#0054cc]/10 px-3 py-1 rounded-full">
          보유 매물: {propertyUnits.length}건
        </span>
      </div>

      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-3xl shadow-xs border border-[#c2c6d8]/30 space-y-6">
        {/* Personal Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#424655] mb-1">임대인/관리자 성명</label>
            <input
              type="text"
              value={landlordName}
              onChange={(e) => setLandlordName(e.target.value)}
              className="w-full p-3 bg-[#f6f3f2] border border-[#c2c6d8] rounded-xl text-sm font-medium focus:border-[#0054cc] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#424655] mb-1">연락처</label>
            <input
              type="text"
              value={landlordPhone}
              onChange={(e) => setLandlordPhone(e.target.value)}
              className="w-full p-3 bg-[#f6f3f2] border border-[#c2c6d8] rounded-xl text-sm font-medium focus:border-[#0054cc] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#424655] mb-1">이메일</label>
            <input
              type="email"
              value={landlordEmail}
              onChange={(e) => setLandlordEmail(e.target.value)}
              className="w-full p-3 bg-[#f6f3f2] border border-[#c2c6d8] rounded-xl text-sm font-medium focus:border-[#0054cc] outline-none"
            />
          </div>
        </div>

        {/* Managed Units Table */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-base text-[#1b1c1c] flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#0054cc]" />
              <span>등록된 소유 매물 및 호실 목록</span>
            </h3>
            <button
              type="button"
              onClick={() => {
                const b = prompt('건물명을 입력하세요 (예: 그린빌):');
                const u = prompt('호수를 입력하세요 (예: 302호):');
                if (b && u) {
                  addPropertyUnit({
                    buildingName: b,
                    unitName: u,
                    address: '서울특별시 강남구',
                    tenantName: '초대 대기',
                    tenantPhone: '010-0000-0000',
                    status: '초대 대기',
                    contractEnd: '2026.12.31',
                    monthlyRent: 90,
                    deposit: 1000,
                  });
                }
              }}
              className="text-xs font-bold text-[#0054cc] bg-[#0054cc]/10 hover:bg-[#0054cc]/20 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>매물 추가</span>
            </button>
          </div>

          <div className="overflow-x-auto border border-[#c2c6d8]/40 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f0eded] text-[#424655] font-bold">
                <tr>
                  <th className="p-3.5">건물/호실</th>
                  <th className="p-3.5">소재지 주소</th>
                  <th className="p-3.5">임차인</th>
                  <th className="p-3.5">상태</th>
                  <th className="p-3.5">보증금 / 월세</th>
                  <th className="p-3.5 text-right">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c2c6d8]/30">
                {propertyUnits.map((u) => (
                  <tr key={u.id} className="hover:bg-[#fcf9f8]">
                    <td className="p-3.5 font-bold text-[#1b1c1c]">
                      {u.buildingName} {u.unitName}
                    </td>
                    <td className="p-3.5 text-[#424655]">{u.address}</td>
                    <td className="p-3.5 font-medium text-[#1b1c1c]">{u.tenantName}</td>
                    <td className="p-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                          u.status === '입주중'
                            ? 'bg-[#10B981]/15 text-[#10B981]'
                            : u.status === '초대 대기'
                            ? 'bg-[#F59E0B]/15 text-[#F59E0B]'
                            : 'bg-[#EF4444]/15 text-[#EF4444]'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-[#0054cc]">
                      {u.deposit}만 / {u.monthlyRent}만
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => alert(`초대 링크가 생성되었습니다: https://dundunhouse.app/invite/${u.id}`)}
                        className="text-[#0054cc] hover:underline font-bold"
                      >
                        초대 링크
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Default Lease Special Terms Template */}
        <div>
          <label className="block text-xs font-bold text-[#424655] mb-1">
            임대건물 공통 원상복구 및 수리 가이드라인 (템플릿)
          </label>
          <textarea
            rows={4}
            value={templateNotes}
            onChange={(e) => setTemplateNotes(e.target.value)}
            className="w-full p-3 bg-[#f6f3f2] border border-[#c2c6d8] rounded-xl text-sm font-medium focus:border-[#0054cc] outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-[#0054cc] text-white font-bold text-base rounded-2xl shadow-lg hover:bg-[#066bfd] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Save className="w-5 h-5" />
          <span>임대인 설정 저장</span>
        </button>

        {/* Subtle Bottom Logout Button */}
        <div className="pt-6 border-t border-[#c2c6d8]/30 flex justify-center">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-medium text-[#727787] hover:text-[#1b1c1c] bg-[#f0eded]/80 hover:bg-[#e5e2e1] border border-[#c2c6d8]/40 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-[#727787]" />
            <span>로그아웃</span>
          </button>
        </div>
      </form>
    </div>
  );
};
