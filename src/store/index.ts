import { create } from 'zustand';
import dayjs from 'dayjs';
import type {
  Activity,
  Registration,
  RegistrationStatus,
  Shooting,
  ShootingType,
  DynastyStyle,
  ChatMessage,
  ActivityPhoto,
  User,
  ActivityDynamic,
  ActivityDynamicType,
  Review,
  CheckInCode,
  ShootingCooperation,
  CooperationStatus,
  ShootingFilterState
} from '@/types';
import { mockActivities } from '@/data/activities';
import { mockShootings } from '@/data/shootings';
import { mockUsers, mockRegistrations } from '@/data/users';

const CURRENT_USER_ID = 'me';

interface AppState {
  activities: Activity[];
  registrations: Registration[];
  shootings: Shooting[];
  users: User[];
  blacklist: string[];
  reports: string[];
  messages: ChatMessage[];
  activityPhotos: ActivityPhoto[];
  activityDynamics: ActivityDynamic[];
  checkInCodes: CheckInCode[];
  cooperations: ShootingCooperation[];
  shootingFilter: ShootingFilterState;

  getRegistrationByActivityId: (activityId: string) => Registration | undefined;
  getActivityById: (activityId: string) => Activity | undefined;
  getUserById: (userId: string) => User | undefined;
  getShootingById: (shootingId: string) => Shooting | undefined;
  getMessagesWithUser: (userId: string) => ChatMessage[];
  getPhotosByActivityId: (activityId: string) => ActivityPhoto[];
  getDynamicsByActivityId: (activityId: string) => ActivityDynamic[];
  getCheckInCodeByActivityId: (activityId: string) => CheckInCode | undefined;
  getCooperationById: (cooperationId: string) => ShootingCooperation | undefined;
  getCooperationsByShootingId: (shootingId: string) => ShootingCooperation[];
  getCooperationsByUserId: (userId: string) => ShootingCooperation[];
  getCooperationByShootingAndUser: (shootingId: string, userId: string) => ShootingCooperation | undefined;
  isUserBlocked: (userId: string) => boolean;
  isUserReported: (userId: string) => boolean;
  isActivityOrganizer: (activityId: string, userId: string) => boolean;

  registerActivity: (activityId: string) => { success: boolean; message: string };
  waitlistActivity: (activityId: string) => { success: boolean; message: string };
  cancelRegistration: (registrationId: string) => { success: boolean; message: string };
  checkInActivity: (registrationId: string) => { success: boolean; message: string };
  generateCheckInCode: (activityId: string) => CheckInCode;
  verifyCheckInCode: (activityId: string, code: string) => { success: boolean; message: string };

  addShooting: (data: {
    type: ShootingType;
    title: string;
    description: string;
    city: string;
    date: string;
    budget: string;
    style: DynastyStyle;
  }) => Shooting;
  toggleFavoriteShooting: (shootingId: string) => { isFavorited: boolean };
  markShootingContacted: (shootingId: string) => void;
  setShootingFilter: (filter: Partial<ShootingFilterState>) => void;

  createCooperation: (data: {
    shootingId: string;
    shootingTitle: string;
    accepterId: string;
    accepterName: string;
    accepterAvatar: string;
    role: ShootingType;
    date: string;
    time: string;
    location: string;
    budget: string;
  }) => ShootingCooperation;
  updateCooperationStatus: (cooperationId: string, status: CooperationStatus) => void;

  sendMessage: (receiverId: string, content: string, shootingId?: string) => ChatMessage;
  blockUser: (userId: string) => void;
  unblockUser: (userId: string) => void;
  reportUser: (userId: string) => void;
  addReviewForUser: (targetUserId: string, data: {
    rating: number;
    content: string;
    shootingId?: string;
    shootingTitle?: string;
    cooperationId?: string;
  }) => Review;

  addActivityPhoto: (activityId: string, url: string) => ActivityPhoto;
  addActivityDynamic: (activityId: string, data: {
    type: ActivityDynamicType;
    title: string;
    content: string;
  }) => ActivityDynamic;
}

const generateId = () => Math.random().toString(36).substring(2, 10);

export const useAppStore = create<AppState>((set, get) => ({
  activities: mockActivities,
  registrations: [...mockRegistrations],
  shootings: [...mockShootings.map((s) => ({ ...s, isFavorited: false, isContacted: false }))],
  users: mockUsers,
  blacklist: [],
  reports: [],
  messages: [],
  activityPhotos: [
    {
      id: 'p1',
      activityId: '1',
      url: 'https://picsum.photos/id/1018/400/400',
      uploaderId: '1',
      uploaderName: '霓裳羽衣',
      uploadTime: '2026-06-12 10:30'
    },
    {
      id: 'p2',
      activityId: '1',
      url: 'https://picsum.photos/id/1039/400/400',
      uploaderId: '2',
      uploaderName: '云想衣裳',
      uploadTime: '2026-06-12 11:15'
    }
  ],
  activityDynamics: [
    {
      id: 'd1',
      activityId: '1',
      type: 'reminder',
      title: '集合时间提醒',
      content: '请大家于明天早上8:30准时在公园南门集合，签到后统一入园。记得穿舒适的鞋子哦~',
      publisherName: '汉服雅集组委会',
      publisherAvatar: 'https://picsum.photos/id/1001/100/100',
      publishTime: '2026-06-12 18:00'
    },
    {
      id: 'd2',
      activityId: '1',
      type: 'weather',
      title: '天气更新',
      content: '明日晴转多云，气温24-32°C，建议带一把遮阳伞，注意防晒补水。',
      publisherName: '汉服雅集组委会',
      publisherAvatar: 'https://picsum.photos/id/1001/100/100',
      publishTime: '2026-06-12 16:30'
    },
    {
      id: 'd3',
      activityId: '1',
      type: 'route',
      title: '交通路线提示',
      content: '地铁10号线「牡丹园」站C口出，步行500米即到公园南门。自驾的同袍可停公园西门停车场。',
      publisherName: '汉服雅集组委会',
      publisherAvatar: 'https://picsum.photos/id/1001/100/100',
      publishTime: '2026-06-11 20:00'
    }
  ],
  checkInCodes: [],
  cooperations: [],
  shootingFilter: {
    statusTab: 'all',
    typeTab: 'all',
    styleTab: 'all'
  },

  getRegistrationByActivityId: (activityId) => {
    return get().registrations.find(
      (r) => r.activityId === activityId && r.status !== 'cancelled'
    );
  },

  getActivityById: (activityId) => {
    return get().activities.find((a) => a.id === activityId);
  },

  getUserById: (userId) => {
    return get().users.find((u) => u.id === userId);
  },

  getMessagesWithUser: (userId) => {
    return get()
      .messages.filter(
        (m) =>
          (m.senderId === CURRENT_USER_ID && m.receiverId === userId) ||
          (m.senderId === userId && m.receiverId === CURRENT_USER_ID)
      )
      .sort((a, b) => a.time.localeCompare(b.time));
  },

  getPhotosByActivityId: (activityId) => {
    return get().activityPhotos.filter((p) => p.activityId === activityId);
  },

  getDynamicsByActivityId: (activityId) => {
    return get()
      .activityDynamics.filter((d) => d.activityId === activityId)
      .sort((a, b) => b.publishTime.localeCompare(a.publishTime));
  },

  getShootingById: (shootingId) => {
    return get().shootings.find((s) => s.id === shootingId);
  },

  isUserBlocked: (userId) => {
    return get().blacklist.includes(userId);
  },

  isUserReported: (userId) => {
    return get().reports.includes(userId);
  },

  registerActivity: (activityId) => {
    const state = get();
    const activity = state.activities.find((a) => a.id === activityId);
    if (!activity) return { success: false, message: '活动不存在' };

    const existing = state.registrations.find(
      (r) => r.activityId === activityId && r.status !== 'cancelled'
    );
    if (existing) return { success: false, message: '您已报名该活动' };

    const isFull = activity.currentPeople >= activity.maxPeople;
    const status: RegistrationStatus = isFull ? 'waitlist' : 'confirmed';

    const newReg: Registration = {
      id: generateId(),
      activityId: activity.id,
      activityTitle: activity.title,
      activityDate: activity.date,
      activityTime: activity.time,
      activityLocation: activity.location,
      coverImage: activity.coverImage,
      status,
      registerTime: dayjs().format('YYYY-MM-DD HH:mm')
    };

    set({
      registrations: [...state.registrations, newReg],
      activities: state.activities.map((a) =>
        a.id === activityId
          ? { ...a, currentPeople: isFull ? a.currentPeople : a.currentPeople + 1 }
          : a
      )
    });

    return {
      success: true,
      message: isFull ? '名额已满，已加入候补队列' : '报名成功'
    };
  },

  waitlistActivity: (activityId) => {
    const state = get();
    const activity = state.activities.find((a) => a.id === activityId);
    if (!activity) return { success: false, message: '活动不存在' };

    const existing = state.registrations.find(
      (r) => r.activityId === activityId && r.status !== 'cancelled'
    );
    if (existing) return { success: false, message: '您已报名该活动' };

    const newReg: Registration = {
      id: generateId(),
      activityId: activity.id,
      activityTitle: activity.title,
      activityDate: activity.date,
      activityTime: activity.time,
      activityLocation: activity.location,
      coverImage: activity.coverImage,
      status: 'waitlist',
      registerTime: dayjs().format('YYYY-MM-DD HH:mm')
    };

    set({ registrations: [...state.registrations, newReg] });
    return { success: true, message: '已加入候补队列' };
  },

  cancelRegistration: (registrationId) => {
    const state = get();
    const reg = state.registrations.find((r) => r.id === registrationId);
    if (!reg) return { success: false, message: '报名记录不存在' };
    if (reg.status === 'cancelled') return { success: false, message: '已取消，无需重复操作' };

    const wasConfirmed = reg.status === 'confirmed';

    set({
      registrations: state.registrations.map((r) =>
        r.id === registrationId ? { ...r, status: 'cancelled' } : r
      ),
      activities: wasConfirmed
        ? state.activities.map((a) =>
            a.id === reg.activityId
              ? { ...a, currentPeople: Math.max(0, a.currentPeople - 1) }
              : a
          )
        : state.activities
    });

    return { success: true, message: '已取消报名' };
  },

  checkInActivity: (registrationId) => {
    const state = get();
    const reg = state.registrations.find((r) => r.id === registrationId);
    if (!reg) return { success: false, message: '报名记录不存在' };
    if (reg.status !== 'confirmed') return { success: false, message: '仅已报名活动可签到' };

    set({
      registrations: state.registrations.map((r) =>
        r.id === registrationId ? { ...r, status: 'checkedIn' } : r
      )
    });

    return { success: true, message: '签到成功' };
  },

  addShooting: (data) => {
    const state = get();
    const publisher = state.users[0] || mockUsers[0];
    const newShooting: Shooting = {
      id: generateId(),
      ...data,
      coverImage: `https://picsum.photos/id/${Math.floor(Math.random() * 100) + 100}/750/400`,
      publisher,
      publishTime: dayjs().format('YYYY-MM-DD HH:mm'),
      tags: []
    };

    set({ shootings: [newShooting, ...state.shootings] });
    return newShooting;
  },

  toggleFavoriteShooting: (shootingId) => {
    const state = get();
    const shooting = state.shootings.find((s) => s.id === shootingId);
    if (!shooting) return { isFavorited: false };

    const newIsFavorited = !shooting.isFavorited;
    set({
      shootings: state.shootings.map((s) =>
        s.id === shootingId ? { ...s, isFavorited: newIsFavorited } : s
      )
    });
    return { isFavorited: newIsFavorited };
  },

  markShootingContacted: (shootingId) => {
    const state = get();
    set({
      shootings: state.shootings.map((s) =>
        s.id === shootingId
          ? { ...s, isContacted: true, contactTime: dayjs().format('YYYY-MM-DD HH:mm') }
          : s
      )
    });
  },

  sendMessage: (receiverId, content, shootingId) => {
    const state = get();
    const newMsg: ChatMessage = {
      id: generateId(),
      senderId: CURRENT_USER_ID,
      receiverId,
      content,
      time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      isRead: false
    };

    if (shootingId) {
      get().markShootingContacted(shootingId);
    }

    set({ messages: [...state.messages, newMsg] });
    return newMsg;
  },

  blockUser: (userId) => {
    const state = get();
    if (!state.blacklist.includes(userId)) {
      set({ blacklist: [...state.blacklist, userId] });
    }
  },

  unblockUser: (userId) => {
    const state = get();
    set({ blacklist: state.blacklist.filter((id) => id !== userId) });
  },

  reportUser: (userId) => {
    const state = get();
    if (!state.reports.includes(userId)) {
      set({ reports: [...state.reports, userId] });
    }
  },

  addReviewForUser: (targetUserId, data) => {
    const state = get();
    const targetUser = state.users.find((u) => u.id === targetUserId);
    if (!targetUser) {
      throw new Error('用户不存在');
    }

    const newReview: Review = {
      id: generateId(),
      userId: CURRENT_USER_ID,
      userName: '我',
      userAvatar: 'https://picsum.photos/id/1005/200/200',
      rating: data.rating,
      content: data.content,
      time: dayjs().format('YYYY-MM-DD HH:mm'),
      shootingId: data.shootingId,
      shootingTitle: data.shootingTitle
    };

    set({
      users: state.users.map((u) =>
        u.id === targetUserId ? { ...u, reviews: [newReview, ...u.reviews] } : u
      )
    });

    return newReview;
  },

  addActivityPhoto: (activityId, url) => {
    const state = get();
    const photo: ActivityPhoto = {
      id: generateId(),
      activityId,
      url,
      uploaderId: CURRENT_USER_ID,
      uploaderName: '我',
      uploadTime: dayjs().format('YYYY-MM-DD HH:mm')
    };

    set({ activityPhotos: [...state.activityPhotos, photo] });
    return photo;
  },

  addActivityDynamic: (activityId, data) => {
    const state = get();
    const activity = state.activities.find((a) => a.id === activityId);
    if (!activity) {
      throw new Error('活动不存在');
    }

    const newDynamic: ActivityDynamic = {
      id: generateId(),
      activityId,
      type: data.type,
      title: data.title,
      content: data.content,
      publisherName: activity.organizer,
      publisherAvatar: activity.organizerAvatar,
      publishTime: dayjs().format('YYYY-MM-DD HH:mm')
    };

    set({ activityDynamics: [newDynamic, ...state.activityDynamics] });
    return newDynamic;
  },

  isActivityOrganizer: (activityId, userId) => {
    const activity = get().activities.find((a) => a.id === activityId);
    if (!activity) return false;
    return activity.organizer === '汉服雅集组委会' || userId === 'organizer';
  },

  getCheckInCodeByActivityId: (activityId) => {
    return get().checkInCodes
      .filter((c) => c.activityId === activityId)
      .sort((a, b) => b.generateTime.localeCompare(a.generateTime))[0];
  },

  generateCheckInCode: (activityId) => {
    const state = get();
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const newCode: CheckInCode = {
      id: generateId(),
      activityId,
      code,
      generateTime: dayjs().format('YYYY-MM-DD HH:mm'),
      expireTime: dayjs().add(1, 'day').format('YYYY-MM-DD HH:mm'),
      generatedBy: CURRENT_USER_ID
    };
    set({ checkInCodes: [newCode, ...state.checkInCodes] });
    return newCode;
  },

  verifyCheckInCode: (activityId, code) => {
    const state = get();
    const validCode = state.checkInCodes.find(
      (c) => c.activityId === activityId && c.code === code && dayjs().isBefore(dayjs(c.expireTime))
    );
    if (!validCode) {
      return { success: false, message: '签到码无效或已过期' };
    }
    const reg = state.getRegistrationByActivityId(activityId);
    if (!reg) {
      return { success: false, message: '您未报名该活动' };
    }
    if (reg.status === 'checkedIn') {
      return { success: false, message: '您已签到' };
    }
    if (reg.status !== 'confirmed') {
      return { success: false, message: '仅已报名用户可签到' };
    }
    const result = state.checkInActivity(reg.id);
    return result;
  },

  setShootingFilter: (filter) => {
    const state = get();
    set({ shootingFilter: { ...state.shootingFilter, ...filter } });
  },

  getCooperationById: (cooperationId) => {
    return get().cooperations.find((c) => c.id === cooperationId);
  },

  getCooperationsByShootingId: (shootingId) => {
    return get().cooperations.filter((c) => c.shootingId === shootingId);
  },

  getCooperationsByUserId: (userId) => {
    return get().cooperations.filter(
      (c) => c.requesterId === userId || c.accepterId === userId
    );
  },

  getCooperationByShootingAndUser: (shootingId, userId) => {
    return get().cooperations.find(
      (c) =>
        c.shootingId === shootingId &&
        (c.requesterId === userId || c.accepterId === userId)
    );
  },

  createCooperation: (data) => {
    const state = get();
    const me = state.getUserById(CURRENT_USER_ID) || mockUsers[0];
    const newCooperation: ShootingCooperation = {
      id: generateId(),
      shootingId: data.shootingId,
      shootingTitle: data.shootingTitle,
      requesterId: CURRENT_USER_ID,
      requesterName: me?.nickname || '我',
      requesterAvatar: me?.avatar || 'https://picsum.photos/id/1005/200/200',
      accepterId: data.accepterId,
      accepterName: data.accepterName,
      accepterAvatar: data.accepterAvatar,
      role: data.role,
      date: data.date,
      time: data.time,
      location: data.location,
      budget: data.budget,
      status: 'pending',
      createTime: dayjs().format('YYYY-MM-DD HH:mm'),
      requesterReviewed: false,
      accepterReviewed: false
    };
    set({ cooperations: [newCooperation, ...state.cooperations] });
    return newCooperation;
  },

  updateCooperationStatus: (cooperationId, status) => {
    const state = get();
    const now = dayjs().format('YYYY-MM-DD HH:mm');
    set({
      cooperations: state.cooperations.map((c) =>
        c.id === cooperationId
          ? {
              ...c,
              status,
              confirmTime: status === 'confirmed' ? now : c.confirmTime,
              completeTime: status === 'completed' ? now : c.completeTime
            }
          : c
      )
    });
  },

  addReviewForUser: (targetUserId, data) => {
    const state = get();
    const targetUser = state.users.find((u) => u.id === targetUserId);
    if (!targetUser) {
      throw new Error('用户不存在');
    }

    const shootingTitle = data.shootingTitle ||
      (data.cooperationId
        ? state.getCooperationById(data.cooperationId)?.shootingTitle
        : undefined);

    const newReview: Review = {
      id: generateId(),
      userId: CURRENT_USER_ID,
      userName: '我',
      userAvatar: 'https://picsum.photos/id/1005/200/200',
      rating: data.rating,
      content: data.content,
      time: dayjs().format('YYYY-MM-DD HH:mm'),
      shootingId: data.shootingId,
      shootingTitle,
      cooperationId: data.cooperationId
    };

    set({
      users: state.users.map((u) =>
        u.id === targetUserId ? { ...u, reviews: [newReview, ...u.reviews] } : u
      ),
      cooperations: data.cooperationId
        ? state.cooperations.map((c) =>
            c.id === data.cooperationId
              ? c.requesterId === CURRENT_USER_ID
                ? { ...c, requesterReviewed: true }
                : { ...c, accepterReviewed: true }
              : c
          )
        : state.cooperations
    });

    return newReview;
  }
}));
