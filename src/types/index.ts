// 活动类型
export type ActivityType = 'tea' | 'garden' | 'makeup' | 'market';

// 朝代风格
export type DynastyStyle = 'tang' | 'song' | 'ming' | 'han' | 'qing' | 'weiJin';

// 报名状态
export type RegistrationStatus = 'pending' | 'confirmed' | 'waitlist' | 'cancelled' | 'checkedIn';

// 约拍类型
export type ShootingType = 'photographer' | 'makeupArtist' | 'model';

// 活动动态类型
export type ActivityDynamicType = 'reminder' | 'weather' | 'route' | 'notice';

// 活动动态
export interface ActivityDynamic {
  id: string;
  activityId: string;
  type: ActivityDynamicType;
  title: string;
  content: string;
  publisherName: string;
  publisherAvatar: string;
  publishTime: string;
}

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
  isFavorited?: boolean;
  isContacted?: boolean;
  contactTime?: string;
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

// 活动动态类型映射
export const ACTIVITY_DYNAMIC_TYPE_MAP: Record<ActivityDynamicType, { label: string; icon: string; color: string }> = {
  reminder: { label: '集合提醒', icon: '⏰', color: '#FF6B6B' },
  weather: { label: '天气提醒', icon: '☀️', color: '#4ECDC4' },
  route: { label: '路线提示', icon: '🗺️', color: '#45B7D1' },
  notice: { label: '活动通知', icon: '📢', color: '#96CEB4' }
};

// 合作单状态映射
export const COOPERATION_STATUS_MAP: Record<CooperationStatus, { label: string; color: string }> = {
  pending: { label: '待确认', color: '#E6A23C' },
  confirmed: { label: '已确认', color: '#409EFF' },
  inProgress: { label: '进行中', color: '#67C23A' },
  completed: { label: '已完成', color: '#909399' },
  cancelled: { label: '已取消', color: '#F56C6C' }
};

// 聊天消息
export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  time: string;
  isRead: boolean;
}

// 聊天会话
export interface ChatSession {
  id: string;
  userId: string;
  lastMessage: string;
  lastTime: string;
  unreadCount: number;
}

// 相册照片
export interface ActivityPhoto {
  id: string;
  activityId: string;
  url: string;
  uploaderId: string;
  uploaderName: string;
  uploadTime: string;
}

// 活动签到码
export interface CheckInCode {
  id: string;
  activityId: string;
  code: string;
  generateTime: string;
  expireTime: string;
  generatedBy: string;
}

// 合作单状态
export type CooperationStatus = 'pending' | 'confirmed' | 'inProgress' | 'completed' | 'cancelled';

// 约拍合作单
export interface ShootingCooperation {
  id: string;
  shootingId: string;
  shootingTitle: string;
  requesterId: string;
  requesterName: string;
  requesterAvatar: string;
  accepterId: string;
  accepterName: string;
  accepterAvatar: string;
  role: ShootingType;
  date: string;
  time: string;
  location: string;
  budget: string;
  status: CooperationStatus;
  createTime: string;
  confirmTime?: string;
  completeTime?: string;
  requesterReviewed?: boolean;
  accepterReviewed?: boolean;
}

// 约拍广场筛选状态
export interface ShootingFilterState {
  statusTab: 'all' | 'favorited' | 'contacted';
  typeTab: ShootingType | 'all';
  styleTab: DynastyStyle | 'all';
}

// 评价（扩展合作单关联）
export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  content: string;
  time: string;
  activityTitle?: string;
  shootingId?: string;
  shootingTitle?: string;
  cooperationId?: string;
}

