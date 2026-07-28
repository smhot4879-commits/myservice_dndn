import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Role,
  RepairCase,
  ChatMessage,
  NotificationItem,
  PropertyUnit,
  Estimate,
  InvitedVendor,
} from '../types';
import {
  INITIAL_PROPERTY_UNITS,
  INITIAL_REPAIR_CASES,
  INITIAL_CHAT_MESSAGES,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';
import { db } from '../lib/firebase';
import {
  collection,
  doc,
  setDoc,
  onSnapshot,
} from 'firebase/firestore';

export interface RealtorInquiry {
  id: string;
  inquiryType: string;
  contactPhone: string;
  inquiryContent: string;
  status: 'PENDING' | 'ANSWERED';
  createdAt: string;
}

export interface UserProfileData {
  userId: string;
  name: string;
  phone: string;
  email?: string;
  role: Role;
  address?: string;
  deposit?: string;
  rent?: string;
  specialTerms?: string;
}

interface AppContextType {
  role: Role;
  setRole: (role: Role, targetTab?: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeRepairId: string;
  setActiveRepairId: (id: string) => void;
  repairCases: RepairCase[];
  chatMessages: ChatMessage[];
  notifications: NotificationItem[];
  propertyUnits: PropertyUnit[];
  realtorInquiries: RealtorInquiry[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Actions
  addRepairCase: (data: {
    unit: string;
    tenantName: string;
    title: string;
    category: RepairCase['category'];
    symptom: string;
    photos: string[];
    estimatePhotos?: string[];
    initialEstimates?: Estimate[];
  }) => string;
  addEstimateToCase: (caseId: string, estimate: Omit<Estimate, 'id' | 'isApproved'>) => void;
  approveEstimate: (caseId: string, estimateId: string) => void;
  completeRepair: (caseId: string, reportData: NonNullable<RepairCase['completionReport']>) => void;
  sendChatMessage: (
    repairCaseId: string,
    sender: ChatMessage['sender'],
    senderName: string,
    message: string,
    type?: ChatMessage['type'],
    attachmentUrl?: string
  ) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addPropertyUnit: (unit: Omit<PropertyUnit, 'id'>) => void;
  inviteVendorToCase: (caseId: string, vendorName: string, phone: string, memo?: string) => string;
  joinAsVendor: (caseId: string, vendorName: string) => void;
  addRealtorInquiry: (inquiryType: string, contactPhone: string, inquiryContent: string) => Promise<void>;
  updateUserProfile: (profileData: UserProfileData) => Promise<void>;
  logout: () => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper to sanitize objects so Firestore never receives undefined properties
const cleanData = <T extends Record<string, any>>(data: T): T => {
  return JSON.parse(JSON.stringify(data));
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<Role>(() => {
    const saved = localStorage.getItem('db_role');
    return (saved as Role) || 'SELECTION';
  });

  const [activeTab, setActiveTabState] = useState<string>(() => {
    return localStorage.getItem('db_activeTab') || 'dashboard';
  });

  const [activeRepairId, setActiveRepairIdState] = useState<string>('req-001');

  const [repairCases, setRepairCases] = useState<RepairCase[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [propertyUnits, setPropertyUnits] = useState<PropertyUnit[]>([]);
  const [realtorInquiries, setRealtorInquiries] = useState<RealtorInquiry[]>([]);

  const [searchQuery, setSearchQuery] = useState('');

  // Local storage sync for session state
  useEffect(() => {
    localStorage.setItem('db_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('db_activeTab', activeTab);
  }, [activeTab]);

  // Firestore Real-time Subscriptions & Seed Initialization
  useEffect(() => {
    // 1. Property Units
    const unsubUnits = onSnapshot(collection(db, 'propertyUnits'), (snapshot) => {
      if (snapshot.empty) {
        INITIAL_PROPERTY_UNITS.forEach((unit) => {
          setDoc(doc(db, 'propertyUnits', unit.id), cleanData(unit));
        });
      } else {
        const items = snapshot.docs.map((doc) => doc.data() as PropertyUnit);
        setPropertyUnits(items);
      }
    });

    // 2. Repair Cases
    const unsubCases = onSnapshot(collection(db, 'repairCases'), (snapshot) => {
      if (snapshot.empty) {
        INITIAL_REPAIR_CASES.forEach((rc) => {
          setDoc(doc(db, 'repairCases', rc.id), cleanData(rc));
        });
      } else {
        const items = snapshot.docs.map((doc) => doc.data() as RepairCase);
        setRepairCases(items);
      }
    });

    // 3. Chat Messages
    const unsubChat = onSnapshot(collection(db, 'chatMessages'), (snapshot) => {
      if (snapshot.empty) {
        INITIAL_CHAT_MESSAGES.forEach((msg) => {
          setDoc(doc(db, 'chatMessages', msg.id), cleanData(msg));
        });
      } else {
        const items = snapshot.docs.map((doc) => doc.data() as ChatMessage);
        // Sort chronologically by createdAt timestamp or message ID number
        items.sort((a, b) => {
          const timeA = a.createdAt ?? (parseInt(a.id.replace('msg-', ''), 10) || 0);
          const timeB = b.createdAt ?? (parseInt(b.id.replace('msg-', ''), 10) || 0);
          if (timeA !== timeB) {
            return timeA - timeB;
          }
          return a.id.localeCompare(b.id);
        });
        setChatMessages(items);
      }
    });

    // 4. Notifications
    const unsubNotifs = onSnapshot(collection(db, 'notifications'), (snapshot) => {
      if (snapshot.empty) {
        INITIAL_NOTIFICATIONS.forEach((n) => {
          setDoc(doc(db, 'notifications', n.id), cleanData(n));
        });
      } else {
        const items = snapshot.docs.map((doc) => doc.data() as NotificationItem);
        setNotifications(items);
      }
    });

    // 5. Realtor Inquiries
    const unsubInquiries = onSnapshot(collection(db, 'realtorInquiries'), (snapshot) => {
      const items = snapshot.docs.map((doc) => doc.data() as RealtorInquiry);
      setRealtorInquiries(items);
    });

    return () => {
      unsubUnits();
      unsubCases();
      unsubChat();
      unsubNotifs();
      unsubInquiries();
    };
  }, []);

  const setRole = (newRole: Role, targetTab?: string) => {
    setRoleState(newRole);
    if (newRole === 'SELECTION') {
      setActiveTabState('selection');
    } else if (targetTab) {
      setActiveTabState(targetTab);
    } else if (newRole === 'LANDLORD') {
      setActiveTabState('landlord-register');
    } else if (newRole === 'TENANT') {
      setActiveTabState('tenant-register');
    } else {
      setActiveTabState('dashboard');
    }
  };

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
  };

  const setActiveRepairId = (id: string) => {
    setActiveRepairIdState(id);
  };

  const logout = () => {
    setRoleState('SELECTION');
    setActiveTabState('selection');
    localStorage.removeItem('db_role');
    localStorage.removeItem('db_activeTab');
  };

  const addRepairCase = (data: {
    unit: string;
    tenantName: string;
    title: string;
    category: RepairCase['category'];
    symptom: string;
    photos: string[];
    estimatePhotos?: string[];
    initialEstimates?: Estimate[];
  }): string => {
    const newId = `req-${Date.now().toString().slice(-4)}`;
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16).replace(/-/g, '.');

    let defaultEstimates: Estimate[] = [];
    if (data.initialEstimates && data.initialEstimates.length > 0) {
      defaultEstimates = data.initialEstimates;
    } else if (data.estimatePhotos && data.estimatePhotos.length > 0) {
      defaultEstimates = data.estimatePhotos.map((photoUrl, idx) => ({
        id: `est-${Date.now()}-${idx + 1}`,
        vendorName: `(주) 첨부견적 업체 #${idx + 1}`,
        amount: 150000 + idx * 30000,
        details: '파일/사진 첨부 수리 견적서',
        expectedDate: '2026.07.28 14:00',
        isApproved: false,
        isRecommended: idx === 0,
        fileUrl: photoUrl,
      }));
    }

    const hasEstimates = defaultEstimates.length > 0 || (data.estimatePhotos && data.estimatePhotos.length > 0);

    const newCase: RepairCase = {
      id: newId,
      unit: data.unit || '그린빌 302호',
      tenantName: data.tenantName || '김지우 님',
      title: data.title,
      category: data.category,
      symptom: data.symptom,
      status: hasEstimates ? 'QUOTE_UPLOADED' : 'REQUESTED',
      createdAt: nowStr,
      updatedAt: nowStr,
      photos: data.photos.length > 0 ? data.photos : ['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80'],
      estimates: defaultEstimates,
    };

    setDoc(doc(db, 'repairCases', newId), cleanData(newCase));

    // Initial system message
    const initialMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      repairCaseId: newId,
      sender: 'SYSTEM',
      senderName: '든든집사 알림',
      message: `수리 요청이 새로 접수되었습니다. (${data.title})`,
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      type: 'TEXT',
      createdAt: Date.now(),
    };
    setDoc(doc(db, 'chatMessages', initialMsg.id), cleanData(initialMsg));

    // Notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      type: 'REPAIR',
      title: `새 수리 요청: ${data.title}`,
      message: `${data.unit} (${data.tenantName})에서 수리 요청서를 작성했습니다.`,
      timestamp: '방금 전',
      isRead: false,
      caseId: newId,
    };
    setDoc(doc(db, 'notifications', newNotif.id), cleanData(newNotif));

    setActiveRepairIdState(newId);
    return newId;
  };

  const addEstimateToCase = (caseId: string, estimateData: Omit<Estimate, 'id' | 'isApproved'>) => {
    const newEstId = `est-${Date.now()}`;
    const targetCase = repairCases.find((c) => c.id === caseId);

    if (targetCase) {
      const updatedEstimates = [...targetCase.estimates, { ...estimateData, id: newEstId, isApproved: false }];
      const updatedCase: RepairCase = {
        ...targetCase,
        estimates: updatedEstimates,
        status: 'QUOTE_UPLOADED',
        updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16).replace(/-/g, '.'),
      };
      setDoc(doc(db, 'repairCases', caseId), cleanData(updatedCase));
    }

    sendChatMessage(
      caseId,
      'TENANT',
      '김지우 님',
      `새로운 비교 견적서 [${estimateData.vendorName} - ₩${estimateData.amount.toLocaleString()}]가 등록되었습니다.`,
      'QUOTE_PROPOSAL'
    );
  };

  const approveEstimate = (caseId: string, estimateId: string) => {
    let approvedVendor = '';
    let approvedAmount = 0;

    const targetCase = repairCases.find((c) => c.id === caseId);

    if (targetCase) {
      const updatedEsts = targetCase.estimates.map((e) => {
        if (e.id === estimateId) {
          approvedVendor = e.vendorName;
          approvedAmount = e.amount;
          return { ...e, isApproved: true };
        }
        return { ...e, isApproved: false };
      });

      const updatedCase: RepairCase = {
        ...targetCase,
        estimates: updatedEsts,
        status: 'LANDLORD_APPROVED',
        updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16).replace(/-/g, '.'),
      };

      setDoc(doc(db, 'repairCases', caseId), cleanData(updatedCase));
    }

    sendChatMessage(
      caseId,
      'LANDLORD',
      '임대인 김지수',
      `[견적 승인 완료] ${approvedVendor} (₩${approvedAmount.toLocaleString()}) 견적을 승인하였습니다. 수리가 진행될 예정입니다.`,
      'APPROVAL_NOTICE'
    );

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      type: 'REPAIR',
      title: '견적 승인 완료!',
      message: `${approvedVendor} 업체의 견적(₩${approvedAmount.toLocaleString()})이 승인되었습니다.`,
      timestamp: '방금 전',
      isRead: false,
      caseId: caseId,
    };
    setDoc(doc(db, 'notifications', newNotif.id), cleanData(newNotif));
  };

  const completeRepair = (caseId: string, reportData: NonNullable<RepairCase['completionReport']>) => {
    const targetCase = repairCases.find((c) => c.id === caseId);

    if (targetCase) {
      const updatedCase: RepairCase = {
        ...targetCase,
        status: 'COMPLETED',
        completionReport: reportData,
        updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16).replace(/-/g, '.'),
      };
      setDoc(doc(db, 'repairCases', caseId), cleanData(updatedCase));
    }

    sendChatMessage(
      caseId,
      'SYSTEM',
      '든든집사 알림',
      `수리가 성공적으로 완료되었습니다! 수리 완료 보고서가 발행되었습니다.`,
      'TEXT'
    );
  };

  const sendChatMessage = (
    repairCaseId: string,
    sender: ChatMessage['sender'],
    senderName: string,
    message: string,
    type: ChatMessage['type'] = 'TEXT',
    attachmentUrl?: string
  ) => {
    const now = Date.now();
    const newMsg: ChatMessage = {
      id: `msg-${now}`,
      repairCaseId,
      sender,
      senderName,
      message,
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      type,
      createdAt: now,
      ...(attachmentUrl ? { attachmentUrl } : {}),
    };

    setDoc(doc(db, 'chatMessages', newMsg.id), cleanData(newMsg));
  };

  const markNotificationRead = (id: string) => {
    const notif = notifications.find((n) => n.id === id);
    if (notif) {
      setDoc(doc(db, 'notifications', id), cleanData({ ...notif, isRead: true }));
    }
  };

  const markAllNotificationsRead = () => {
    notifications.forEach((n) => {
      setDoc(doc(db, 'notifications', n.id), cleanData({ ...n, isRead: true }));
    });
  };

  const addPropertyUnit = (unitData: Omit<PropertyUnit, 'id'>) => {
    const newId = `unit-${Date.now()}`;
    const newUnit: PropertyUnit = {
      ...unitData,
      id: newId,
    };
    setDoc(doc(db, 'propertyUnits', newId), cleanData(newUnit));
  };

  const inviteVendorToCase = (
    caseId: string,
    vendorName: string,
    phone: string,
    memo?: string
  ): string => {
    const inviteCode = `v-${Date.now().toString().slice(-6)}`;
    const newVendor: InvitedVendor = {
      id: `vendor-${Date.now()}`,
      vendorName,
      phone,
      memo,
      invitedAt: new Date().toISOString().replace('T', ' ').slice(0, 16).replace(/-/g, '.'),
      inviteCode,
      status: 'INVITED',
    };

    const targetCase = repairCases.find((c) => c.id === caseId);

    if (targetCase) {
      const updatedInvited = [...(targetCase.invitedVendors || []), newVendor];
      const updatedCase: RepairCase = {
        ...targetCase,
        invitedVendors: updatedInvited,
        status: targetCase.status === 'REQUESTED' ? 'CHATTING' : targetCase.status,
        updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16).replace(/-/g, '.'),
      };
      setDoc(doc(db, 'repairCases', caseId), cleanData(updatedCase));
    }

    sendChatMessage(
      caseId,
      'SYSTEM',
      '든든집사 알림',
      `[수리업체 초대] '${vendorName}' (${phone}) 님에게 3자 대화방 초대 링크가 발송되었습니다. 수리 기사님은 로그인 없이 전송된 링크만 누르면 대화방에 즉시 참여하실 수 있습니다.`,
      'TEXT'
    );

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      type: 'REPAIR',
      title: '수리업체 대화방 초대 발송',
      message: `'${vendorName}' 님에게 대화방 초대 링크를 발송했습니다.`,
      timestamp: '방금 전',
      isRead: false,
      caseId: caseId,
    };
    setDoc(doc(db, 'notifications', newNotif.id), cleanData(newNotif));

    return inviteCode;
  };

  const joinAsVendor = (caseId: string, vendorName: string) => {
    const targetCase = repairCases.find((c) => c.id === caseId);

    if (targetCase) {
      const updatedInvited = (targetCase.invitedVendors || []).map((v) =>
        v.vendorName === vendorName || v.status === 'INVITED' ? { ...v, status: 'JOINED' as const } : v
      );
      const updatedCase: RepairCase = { ...targetCase, invitedVendors: updatedInvited };
      setDoc(doc(db, 'repairCases', caseId), cleanData(updatedCase));
    }

    setRoleState('VENDOR');
    setActiveRepairIdState(caseId);
    setActiveTabState('chat');

    sendChatMessage(
      caseId,
      'SYSTEM',
      '든든집사 알림',
      `[입장 알림] 수리업체 '${vendorName}' 님이 별도의 회원가입 없이 초대 링크로 대화방에 참여하셨습니다.`,
      'TEXT'
    );
  };

  const addRealtorInquiry = async (inquiryType: string, contactPhone: string, inquiryContent: string) => {
    const newId = `inquiry-${Date.now()}`;
    const newInquiry: RealtorInquiry = {
      id: newId,
      inquiryType,
      contactPhone,
      inquiryContent,
      status: 'PENDING',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16).replace(/-/g, '.'),
    };
    await setDoc(doc(db, 'realtorInquiries', newId), cleanData(newInquiry));
  };

  const updateUserProfile = async (profileData: UserProfileData) => {
    await setDoc(doc(db, 'users', profileData.userId), cleanData(profileData));
  };

  const resetAllData = async () => {
    INITIAL_PROPERTY_UNITS.forEach((unit) => setDoc(doc(db, 'propertyUnits', unit.id), cleanData(unit)));
    INITIAL_REPAIR_CASES.forEach((rc) => setDoc(doc(db, 'repairCases', rc.id), cleanData(rc)));
    INITIAL_CHAT_MESSAGES.forEach((msg) => setDoc(doc(db, 'chatMessages', msg.id), cleanData(msg)));
    INITIAL_NOTIFICATIONS.forEach((n) => setDoc(doc(db, 'notifications', n.id), cleanData(n)));
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        activeTab,
        setActiveTab,
        activeRepairId,
        setActiveRepairId,
        repairCases,
        chatMessages,
        notifications,
        propertyUnits,
        realtorInquiries,
        searchQuery,
        setSearchQuery,
        addRepairCase,
        addEstimateToCase,
        approveEstimate,
        completeRepair,
        sendChatMessage,
        markNotificationRead,
        markAllNotificationsRead,
        addPropertyUnit,
        inviteVendorToCase,
        joinAsVendor,
        addRealtorInquiry,
        updateUserProfile,
        logout,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
