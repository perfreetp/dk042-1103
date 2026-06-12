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
  User
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

  getRegistrationByActivityId: (activityId: string) => Registration | undefined;
  getActivityById: (activityId: string) => Activity | undefined;
  getUserById: (userId: string) => User | undefined;
  getMessagesWithUser: (userId: string) => ChatMessage[];
  getPhotosByActivityId: (activityId: string) => ActivityPhoto[];
  isUserBlocked: (userId: string) => boolean;
  isUserReported: (userId: string) => boolean;

  registerActivity: (activityId: string) => { success: boolean; message: string };
  waitlistActivity: (activityId: string) => { success: boolean; message: string };
  cancelRegistration: (registrationId: string) => { success: boolean; message: string };
  checkInActivity: (registrationId: string) => { success: boolean; message: string };

  addShooting: (data: {
    type: ShootingType;
    title: string;
    description: string;
    city: string;
    date: string;
    budget: string;
    style: DynastyStyle;
  }) => Shooting;

  sendMessage: (receiverId: string, content: string) => ChatMessage;
  blockUser: (userId: string) => void;
  unblockUser: (userId: string) => void;
  reportUser: (userId: string) => void;

  addActivityPhoto: (activityId: string, url: string) => ActivityPhoto;
}

const generateId = () => Math.random().toString(36).substring(2, 10);

export const useAppStore = create<AppState>((set, get) => ({
  activities: mockActivities,
  registrations: [...mockRegistrations],
  shootings: [...mockShootings],
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

  sendMessage: (receiverId, content) => {
    const state = get();
    const newMsg: ChatMessage = {
      id: generateId(),
      senderId: CURRENT_USER_ID,
      receiverId,
      content,
      time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      isRead: false
    };

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
  }
}));
