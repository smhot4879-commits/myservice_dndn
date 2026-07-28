export type Role = 'LANDLORD' | 'TENANT' | 'VENDOR' | 'SELECTION';

export interface InvitedVendor {
  id: string;
  vendorName: string;
  phone: string;
  memo?: string;
  invitedAt: string;
  inviteCode: string;
  status: 'INVITED' | 'JOINED';
}

export type RepairStatus =
  | 'REQUESTED'        // 요청 완료
  | 'CHATTING'         // 대화 중
  | 'QUOTE_UPLOADED'   // 견적 업로드 완료
  | 'LANDLORD_APPROVED'// 임대인 승인
  | 'REPAIRING'        // 수리 중
  | 'COMPLETED';       // 완료

export interface Estimate {
  id: string;
  vendorName: string;
  amount: number;
  details: string;
  expectedDate: string;
  isApproved: boolean;
  isRecommended?: boolean;
  contact?: string;
  contactPerson?: string;
  fileUrl?: string;
}

export interface RepairCase {
  id: string;
  unit: string;               // e.g. "302호", "그린빌 302호"
  tenantName: string;
  title: string;
  category: '에어컨' | '누수/수도' | '전기/조명' | '창호/문' | '기타';
  symptom: string;
  status: RepairStatus;
  createdAt: string;
  updatedAt: string;
  photos: string[];
  estimates: Estimate[];
  invitedVendors?: InvitedVendor[];
  moveInRecord?: {
    photoUrl: string;
    note: string;
    recordedAt: string;
  };
  completionReport?: {
    beforePhoto: string;
    afterPhoto: string;
    beforeNote: string;
    afterNote: string;
    completedAt: string;
    vendorName: string;
    finalAmount: number;
    specialNotes: string;
  };
}

export interface ChatMessage {
  id: string;
  repairCaseId: string;
  sender: 'LANDLORD' | 'TENANT' | 'TECHNICIAN' | 'SYSTEM';
  senderName: string;
  message: string;
  timestamp: string;
  attachmentUrl?: string;
  type?: 'TEXT' | 'MOVE_IN_EVIDENCE' | 'QUOTE_PROPOSAL' | 'APPROVAL_NOTICE';
  createdAt?: number;
}

export interface NotificationItem {
  id: string;
  type: 'REPAIR' | 'MESSAGE' | 'CONTRACT' | 'LEGAL';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  caseId?: string;
}

export interface PropertyUnit {
  id: string;
  buildingName: string;
  unitName: string;
  address: string;
  tenantName: string;
  tenantPhone: string;
  status: '입주중' | '초대 대기' | '공실';
  contractEnd: string;
  monthlyRent: number;
  deposit: number;
}

export interface LegalFAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
}

export interface CaseStudy {
  id: string;
  title: string;
  summary: string;
  verdict: 'WIN' | 'COMPROMISE' | 'LOSS';
  date: string;
  imageUrl: string;
}
