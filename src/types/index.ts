// 活动类型
export type ActivityType = 'tea' | 'garden' | 'makeup' | 'market';

// 朝代风格
export type DynastyStyle = 'tang' | 'song' | 'ming' | 'han' | 'qing' | 'weiJin';

// 报名状态
export type RegistrationStatus = 'pending' | 'confirmed' | 'waitlist' | 'cancelled' | 'checkedIn';

// 约拍类型
export type ShootingType = 'photographer' | 'makeupArtist' | 'model';

// 活动信息
export interface Activity {
  id: string;
  title: string;
  type: ActivityType;
  dynasty: DynastyStyle;
  date: string;
  time: string;
  location: string;
  city: string;
  fee: number;
  maxPeople: number;
  currentPeople: number;
  dressRequirement: string;
  description: string;
  organizer: string;
  organizerAvatar: string;
  coverImage: string;
  images: string[];
  tags: string[];
}

// 报名记录
export interface Registration {
  id: string;
  activityId: string;
  activityTitle: string;
  activityDate: string;
  activityTime: string;
  activityLocation: string;
  coverImage: string;
  status: RegistrationStatus;
  registerTime: string;
}

// 约拍需求
export interface Shooting {
  id: string;
  type: ShootingType;
  title: string;
  description: string;
  city: string;
  date: string;
  budget: string;
  style: DynastyStyle;
  coverImage: string;
  publisher: User;
  publishTime: string;
  tags: string[];
}

// 用户信息
export interface User {
  id: string;
  nickname: string;
  avatar: string;
  gender: 'male' | 'female';
  age: number;
  city: string;
  height: number;
  weight: number;
  bust: number;
  waist: number;
  hips: number;
  usualStyle: DynastyStyle[];
  works: string[];
  bio: string;
  reviews: Review[];
  isVerified: boolean;
}

// 评价
export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  content: string;
  time: string;
  activityTitle?: string;
}

// 筛选条件
export interface FilterOptions {
  city: string;
  date: string;
  dynasty: DynastyStyle | '';
  type: ActivityType | '';
}

// 城市列表
export const CITIES = [
  '北京', '上海', '广州', '深圳', '杭州', '成都', '南京', '苏州',
  '西安', '武汉', '重庆', '长沙', '天津', '青岛', '厦门', '福州'
];

// 活动类型映射
export const ACTIVITY_TYPE_MAP: Record<ActivityType, string> = {
  tea: '茶会',
  garden: '游园',
  makeup: '妆造体验',
  market: '市集'
};

// 朝代风格映射
export const DYNASTY_MAP: Record<DynastyStyle, string> = {
  han: '汉服',
  tang: '唐制',
  song: '宋制',
  ming: '明制',
  qing: '清制',
  weiJin: '魏晋'
};

// 约拍类型映射
export const SHOOTING_TYPE_MAP: Record<ShootingType, string> = {
  photographer: '摄影师',
  makeupArtist: '妆娘',
  model: '模特'
};

// 报名状态映射
export const REGISTRATION_STATUS_MAP: Record<RegistrationStatus, string> = {
  pending: '待确认',
  confirmed: '已报名',
  waitlist: '候补中',
  cancelled: '已取消',
  checkedIn: '已签到'
};
