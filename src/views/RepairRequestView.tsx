import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Wrench, Upload, Camera, ArrowLeft, Send, FolderPlus, Trash2, X, Plus, Calculator, UserCheck, FileSpreadsheet } from 'lucide-react';
import { RepairCase, Estimate } from '../types';

export const RepairRequestView: React.FC = () => {
  const { role, addRepairCase, setActiveTab } = useApp();

  const [category, setCategory] = useState<RepairCase['category']>('에어컨');
  const [title, setTitle] = useState('거실 에어컨 냉방 불량 수리');
  const [symptom, setSymptom] = useState(
    '에어컨을 켜면 찬바람이 나오지 않고 미지근한 바람만 불며 실외기에서 고주파 음이 발생합니다.'
  );
  const [photos, setPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
  ]);
  const [estimatePhotos, setEstimatePhotos] = useState<string[]>([]);
  
  // Text Estimate State
  const [showTextForm, setShowTextForm] = useState(false);
  const [textVendorName, setTextVendorName] = useState('');
  const [textContactPerson, setTextContactPerson] = useState('');
  const [textPhone, setTextPhone] = useState('');
  const [textAmount, setTextAmount] = useState('');
  const [textDetails, setTextDetails] = useState('');
  const [textEstimates, setTextEstimates] = useState<Array<{
    id: string;
    vendorName: string;
    contactPerson: string;
    phone: string;
    amount: number;
    details: string;
  }>>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Upload Modal State & File Input Refs
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadModalTarget, setUploadModalTarget] = useState<'photos' | 'estimates'>('photos');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const estimateFileInputRef = useRef<HTMLInputElement>(null);

  const categories: RepairCase['category'][] = ['에어컨', '누수/수도', '전기/조명', '창호/문', '기타'];

  const handleOpenUploadModal = (target: 'photos' | 'estimates') => {
    setUploadModalTarget(target);
    setShowUploadModal(true);
  };

  const handleLocalFiles = (files: FileList | null, target: 'photos' | 'estimates') => {
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/') && !file.type.includes('pdf')) {
        alert('이미지 파일 또는 PDF 파일만 업로드 가능합니다.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const resultUrl = event.target?.result as string;
        if (resultUrl) {
          if (target === 'photos') {
            setPhotos((prev) => [...prev, resultUrl]);
          } else {
            setEstimatePhotos((prev) => [...prev, resultUrl]);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleLocalFiles(e.dataTransfer.files, uploadModalTarget);
    }
  };

  const handleAddSamplePhoto = () => {
    const samples = [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?auto=format&fit=crop&w=600&q=80',
    ];
    const randomSample = samples[Math.floor(Math.random() * samples.length)];
    if (uploadModalTarget === 'photos') {
      setPhotos((prev) => [...prev, randomSample]);
    } else {
      setEstimatePhotos((prev) => [...prev, randomSample]);
    }
  };

  const handleAddTextEstimate = () => {
    if (!textVendorName || !textAmount) {
      alert('업체명과 견적 금액은 필수 입력 항목입니다.');
      return;
    }

    const newEstimate = {
      id: `text-est-${Date.now()}`,
      vendorName: textVendorName,
      contactPerson: textContactPerson || '담당자 미정',
      phone: textPhone || '010-0000-0000',
      amount: parseInt(textAmount, 10),
      details: textDetails || '일반 수리 및 부품 교체 견적',
    };

    setTextEstimates((prev) => [...prev, newEstimate]);
    setTextVendorName('');
    setTextContactPerson('');
    setTextPhone('');
    setTextAmount('');
    setTextDetails('');
    setShowTextForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !symptom) {
      alert('수리 제목과 상세 증상을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    const initialEstimates: Estimate[] = [
      ...textEstimates.map((te) => ({
        id: te.id,
        vendorName: te.vendorName,
        amount: te.amount,
        details: te.details,
        expectedDate: '상담 후 일정 협의',
        isApproved: false,
        contact: te.phone,
        contactPerson: te.contactPerson,
      })),
      ...estimatePhotos.map((photoUrl, idx) => ({
        id: `est-photo-${Date.now()}-${idx}`,
        vendorName: `(주) 첨부 견적업체 #${idx + 1}`,
        amount: 150000 + idx * 20000,
        details: '첨부 견적서 파일 기반 수리 요청',
        expectedDate: '2026.07.28 14:00',
        isApproved: false,
        fileUrl: photoUrl,
      })),
    ];

    setTimeout(() => {
      addRepairCase({
        unit: '그린빌 302호',
        tenantName: role === 'LANDLORD' ? '박서준 님' : '김지우 님',
        title,
        category,
        symptom,
        photos,
        estimatePhotos,
        initialEstimates,
      });

      setIsSubmitting(false);
      setActiveTab('chat');
    }, 400);
  };

  if (role === 'LANDLORD') {
    return (
      <div className="max-w-xl mx-auto p-8 bg-white rounded-xl shadow-xs border border-neutral-200 text-center space-y-3 my-12 animate-in fade-in duration-200">
        <Wrench className="w-10 h-10 text-neutral-400 mx-auto" />
        <h2 className="text-base font-bold text-neutral-900">임대인 수리 요청 불가 안내</h2>
        <p className="text-xs text-neutral-500 leading-relaxed">
          수리 요청서 등록은 임차인 전용 기능입니다. 임대인은 등록된 수리 요청건에 대한 비교 견적 검토 및 승인을 진행합니다.
        </p>
        <button
          onClick={() => setActiveTab('dashboard')}
          className="px-4 py-2 bg-[#0F172A] text-white font-semibold text-xs rounded-lg hover:bg-[#1E293B] transition-colors cursor-pointer"
        >
          대시보드로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleLocalFiles(e.target.files, uploadModalTarget)}
        accept="image/*"
        multiple
        className="hidden"
      />
      <input
        type="file"
        ref={cameraInputRef}
        onChange={(e) => handleLocalFiles(e.target.files, uploadModalTarget)}
        accept="image/*"
        capture="environment"
        className="hidden"
      />
      <input
        type="file"
        ref={estimateFileInputRef}
        onChange={(e) => handleLocalFiles(e.target.files, 'estimates')}
        accept="image/*,.pdf"
        multiple
        className="hidden"
      />

      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
        <button
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-1.5 text-neutral-500 hover:text-neutral-900 font-semibold text-xs cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>대시보드로 돌아가기</span>
        </button>
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-neutral-900">수리 요청서 작성</h2>
          <div className="flex items-center gap-1 text-[11px] font-medium text-blue-700">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            <span>표준 양식 접수</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-5 sm:p-6 rounded-xl shadow-xs border border-neutral-200 space-y-5">
        {/* Step 1: Category */}
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-2">1. 고장 수리 분류</label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                  category === cat
                    ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-xs'
                    : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Title */}
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">2. 수리 요청 제목</label>
          <input
            type="text"
            required
            placeholder="예: 거실 에어컨 냉방 불량 수리 요청"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-semibold outline-none focus:bg-white focus:border-blue-600"
          />
        </div>

        {/* Step 3: Detailed Symptom */}
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            3. 상세 고장 증상 및 희망 수리 일시
          </label>
          <textarea
            rows={4}
            required
            placeholder="고장 부위, 발생 시점 및 평일/주말 희망 방문 시간을 구체적으로 작성해주세요."
            value={symptom}
            onChange={(e) => setSymptom(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs outline-none focus:bg-white focus:border-blue-600 resize-none"
          />
        </div>

        {/* Step 4: Photo Attachments */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-semibold text-neutral-700">4. 고장 현장 사진 ({photos.length}장)</label>
            <button
              type="button"
              onClick={() => handleOpenUploadModal('photos')}
              className="text-xs text-blue-600 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>사진 추가</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {photos.map((url, i) => (
              <div key={i} className="relative aspect-video rounded-lg overflow-hidden border border-neutral-200 group">
                <img src={url} alt={`Photo ${i}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setPhotos((prev) => prev.filter((_, idx) => idx !== i))}
                  className="absolute top-1 right-1 w-5 h-5 bg-black/70 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  ×
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => handleOpenUploadModal('photos')}
              className="aspect-video rounded-lg border border-dashed border-neutral-300 hover:border-neutral-500 bg-neutral-50 hover:bg-white transition-all flex flex-col items-center justify-center gap-1 text-neutral-500 hover:text-neutral-900 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span className="text-[11px] font-medium">사진 등록</span>
            </button>
          </div>
        </div>

        {/* Step 5: Comparative Quote Attachment or Text Registration */}
        <div className="pt-3 border-t border-neutral-100 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <p className="text-xs font-semibold text-neutral-900">5. 업체 견적서 등록 (선택)</p>
              <p className="text-[11px] text-neutral-500">
                수리 기사에게 받은 견적서 사진/파일을 첨부하거나 TEXT로 직접 입력하세요.
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleOpenUploadModal('estimates')}
                className="px-2.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-xs rounded-md transition-colors cursor-pointer flex items-center gap-1"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>파일 업로드</span>
              </button>

              <button
                type="button"
                onClick={() => setShowTextForm(!showTextForm)}
                className={`px-2.5 py-1.5 font-semibold text-xs rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                  showTextForm
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>{showTextForm ? '입력 닫기' : 'TEXT 등록'}</span>
              </button>
            </div>
          </div>

          {/* Form for TEXT Estimate Registration */}
          {showTextForm && (
            <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-lg space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                <span className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                  <Calculator className="w-3.5 h-3.5 text-blue-600" />
                  <span>견적 정보 직접 입력</span>
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">서면 견적 미발급 업체 전용</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                    업체명 *
                  </label>
                  <input
                    type="text"
                    placeholder="예: 성진에어컨 수리센터"
                    value={textVendorName}
                    onChange={(e) => setTextVendorName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-md text-xs outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                    담당 기사명
                  </label>
                  <input
                    type="text"
                    placeholder="예: 박철수 기사님"
                    value={textContactPerson}
                    onChange={(e) => setTextContactPerson(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-md text-xs outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                    업체 연락처
                  </label>
                  <input
                    type="text"
                    placeholder="예: 010-1234-5678"
                    value={textPhone}
                    onChange={(e) => setTextPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-md text-xs font-mono outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                    견적 금액 (원) *
                  </label>
                  <input
                    type="text"
                    placeholder="예: 120000"
                    value={textAmount}
                    onChange={(e) => setTextAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-md text-xs font-mono font-bold text-neutral-900 outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                  견적 내용 및 수리 범위
                </label>
                <input
                  type="text"
                  placeholder="예: 실외기 모터 교체, 가스 누설 완충 및 출장 공임비 포함"
                  value={textDetails}
                  onChange={(e) => setTextDetails(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-md text-xs outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowTextForm(false)}
                  className="px-3 py-1.5 bg-white text-neutral-600 font-semibold text-xs rounded-md border border-neutral-200 hover:bg-neutral-50 cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleAddTextEstimate}
                  className="px-3 py-1.5 bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold text-xs rounded-md shadow-xs cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>견적 추가</span>
                </button>
              </div>
            </div>
          )}

          {/* Registered List */}
          <div className="space-y-2">
            {textEstimates.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono text-neutral-500 block">
                  등록된 TEXT 견적 ({textEstimates.length}건)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {textEstimates.map((te) => (
                    <div
                      key={te.id}
                      className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg relative space-y-1"
                    >
                      <button
                        type="button"
                        onClick={() => setTextEstimates((prev) => prev.filter((item) => item.id !== te.id))}
                        className="absolute top-2.5 right-2.5 text-neutral-400 hover:text-rose-600 cursor-pointer p-0.5 rounded hover:bg-white"
                        title="삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center gap-1.5 pr-6">
                        <span className="font-bold text-xs text-neutral-900 truncate">{te.vendorName}</span>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-neutral-200 font-mono text-xs">
                        <span className="text-[11px] text-neutral-500 flex items-center gap-1">
                          <UserCheck className="w-3 h-3 text-neutral-400" />
                          {te.contactPerson}
                        </span>
                        <span className="font-bold text-neutral-900 tabular-nums">
                          ₩{te.amount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {estimatePhotos.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono text-neutral-500 block">
                  첨부된 견적서 사진/파일 ({estimatePhotos.length}장)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {estimatePhotos.map((url, i) => (
                    <div key={i} className="aspect-video rounded-lg overflow-hidden border border-neutral-200 relative group">
                      <img src={url} alt={`Quote ${i}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setEstimatePhotos((prev) => prev.filter((_, idx) => idx !== i))}
                        className="absolute top-1 right-1 w-5 h-5 bg-black/70 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold text-xs rounded-lg shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
        >
          {isSubmitting ? (
            <span>접수 처리 중...</span>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              <span>임대인에게 수리 요청 접수</span>
            </>
          )}
        </button>
      </form>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl border border-neutral-200 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
              <h3 className="text-sm font-bold text-neutral-900">
                {uploadModalTarget === 'photos' ? '현장 사진 첨부' : '견적서 파일 첨부'}
              </h3>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drag & Drop Main Zone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 rounded-lg border-2 border-dashed text-center transition-all cursor-pointer space-y-2 ${
                dragActive
                  ? 'border-blue-600 bg-blue-50/20'
                  : 'border-neutral-200 hover:border-neutral-400 bg-neutral-50 hover:bg-white'
              }`}
            >
              <Upload className="w-6 h-6 text-neutral-400 mx-auto" />
              <div>
                <p className="font-semibold text-xs text-neutral-900">
                  클릭하여 파일 선택 또는 드래그 앤 드롭
                </p>
                <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                  JPG, PNG, WEBP, PDF 지원
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="py-2 px-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FolderPlus className="w-3.5 h-3.5" />
                <span>파일 탐색기</span>
              </button>

              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="py-2 px-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>카메라 촬영</span>
              </button>
            </div>

            {/* Sample Add */}
            <div className="pt-2 border-t border-neutral-100 flex justify-between items-center text-xs">
              <span className="text-neutral-500 text-[11px]">테스트용 샘플 이미지</span>
              <button
                type="button"
                onClick={handleAddSamplePhoto}
                className="text-blue-600 hover:underline font-semibold cursor-pointer"
              >
                + 샘플 추가
              </button>
            </div>

            {/* Currently Uploaded List */}
            <div>
              <span className="text-[11px] font-mono text-neutral-500 block mb-1.5">
                첨부 목록 ({uploadModalTarget === 'photos' ? photos.length : estimatePhotos.length}건)
              </span>
              <div className="grid grid-cols-3 gap-2 max-h-36 overflow-y-auto">
                {(uploadModalTarget === 'photos' ? photos : estimatePhotos).map((url, idx) => (
                  <div key={idx} className="relative aspect-video rounded-md overflow-hidden border border-neutral-200 group">
                    <img src={url} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() =>
                        uploadModalTarget === 'photos'
                          ? setPhotos((prev) => prev.filter((_, i) => i !== idx))
                          : setEstimatePhotos((prev) => prev.filter((_, i) => i !== idx))
                      }
                      className="absolute top-1 right-1 w-4 h-4 bg-black/70 text-white rounded-full text-[10px] flex items-center justify-center cursor-pointer"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="w-full py-2 bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold text-xs rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                첨부 완료
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
