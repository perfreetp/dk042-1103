import type { User } from '@/types';

export const mockUsers: User[] = [
  {
    id: '1',
    nickname: '霓裳羽衣',
    avatar: 'https://picsum.photos/id/64/200/200',
    gender: 'female',
    age: 26,
    city: '杭州',
    height: 165,
    weight: 48,
    bust: 84,
    waist: 62,
    hips: 88,
    usualStyle: ['tang', 'song'],
    works: [
      'https://picsum.photos/id/103/300/300',
      'https://picsum.photos/id/119/300/300',
      'https://picsum.photos/id/220/300/300',
      'https://picsum.photos/id/225/300/300',
      'https://picsum.photos/id/230/300/300',
      'https://picsum.photos/id/250/300/300'
    ],
    bio: '热爱汉服的摄影师，穿汉服5年，擅长唐制和宋制。喜欢用镜头记录汉服之美，约拍可私信。',
    reviews: [
      {
        id: 'r1',
        userId: '2',
        userName: '云想衣裳',
        userAvatar: 'https://picsum.photos/id/91/200/200',
        rating: 5,
        content: '摄影师技术超好，构图很有韵味，出片率很高！下次还会约。',
        time: '2026-05-28',
        activityTitle: '西湖汉服春日茶会'
      },
      {
        id: 'r2',
        userId: '3',
        userName: '清风明月',
        userAvatar: 'https://picsum.photos/id/177/200/200',
        rating: 5,
        content: '人特别好，沟通顺畅，拍摄过程很愉快，照片修得也很自然。',
        time: '2026-05-15'
      }
    ],
    isVerified: true
  },
  {
    id: '2',
    nickname: '云想衣裳',
    avatar: 'https://picsum.photos/id/91/200/200',
    gender: 'female',
    age: 28,
    city: '北京',
    height: 168,
    weight: 50,
    bust: 86,
    waist: 64,
    hips: 90,
    usualStyle: ['ming', 'tang'],
    works: [
      'https://picsum.photos/id/225/300/300',
      'https://picsum.photos/id/230/300/300',
      'https://picsum.photos/id/582/300/300',
      'https://picsum.photos/id/598/300/300'
    ],
    bio: '专业汉服妆造师，国家级化妆师认证。从事汉服妆造5年，精通各朝代妆容。承接各类汉服活动妆造。',
    reviews: [
      {
        id: 'r3',
        userId: '1',
        userName: '霓裳羽衣',
        userAvatar: 'https://picsum.photos/id/64/200/200',
        rating: 5,
        content: '妆造太绝了！妆容精致，发型做得特别好，一整天都没乱。',
        time: '2026-06-02',
        activityTitle: '明制汉服妆造体验课'
      }
    ],
    isVerified: true
  },
  {
    id: '3',
    nickname: '清风明月',
    avatar: 'https://picsum.photos/id/177/200/200',
    gender: 'male',
    age: 30,
    city: '上海',
    height: 180,
    weight: 68,
    bust: 96,
    waist: 78,
    hips: 94,
    usualStyle: ['ming', 'han'],
    works: [
      'https://picsum.photos/id/250/300/300',
      'https://picsum.photos/id/103/300/300',
      'https://picsum.photos/id/119/300/300'
    ],
    bio: '汉服商家，经营汉服品牌5年。喜欢明制圆领袍，偶尔客串模特。欢迎同好交流。',
    reviews: [
      {
        id: 'r4',
        userId: '4',
        userName: '锦绣年华',
        userAvatar: 'https://picsum.photos/id/338/200/200',
        rating: 5,
        content: '合作很愉快，商家很专业，衣服质量很好。',
        time: '2026-05-20'
      }
    ],
    isVerified: true
  },
  {
    id: '4',
    nickname: '锦绣年华',
    avatar: 'https://picsum.photos/id/338/200/200',
    gender: 'female',
    age: 24,
    city: '成都',
    height: 162,
    weight: 45,
    bust: 82,
    waist: 60,
    hips: 86,
    usualStyle: ['song', 'weiJin'],
    works: [
      'https://picsum.photos/id/1015/300/300',
      'https://picsum.photos/id/1036/300/300',
      'https://picsum.photos/id/1039/300/300'
    ],
    bio: '川妹子一枚，爱汉服爱摄影。宋制和魏晋风是本命，喜欢清冷雅致的风格。',
    reviews: [],
    isVerified: false
  },
  {
    id: '5',
    nickname: '梦里花开',
    avatar: 'https://picsum.photos/id/1027/200/200',
    gender: 'female',
    age: 22,
    city: '广州',
    height: 160,
    weight: 44,
    bust: 80,
    waist: 58,
    hips: 84,
    usualStyle: ['tang', 'han'],
    works: [
      'https://picsum.photos/id/103/300/300',
      'https://picsum.photos/id/119/300/300'
    ],
    bio: '刚入坑的新人，正在学习汉服知识。喜欢唐制的华丽，也喜欢汉服的端庄。',
    reviews: [],
    isVerified: false
  },
  {
    id: '6',
    nickname: '水墨丹青',
    avatar: 'https://picsum.photos/id/1027/200/200',
    gender: 'female',
    age: 25,
    city: '深圳',
    height: 168,
    weight: 48,
    bust: 85,
    waist: 62,
    hips: 88,
    usualStyle: ['ming', 'song', 'tang'],
    works: [
      'https://picsum.photos/id/250/300/300',
      'https://picsum.photos/id/225/300/300',
      'https://picsum.photos/id/230/300/300',
      'https://picsum.photos/id/582/300/300'
    ],
    bio: '专业模特，接汉服商拍、走秀。身高168，体重48，穿M码。有3年汉服拍摄经验，表现力强。',
    reviews: [
      {
        id: 'r5',
        userId: '3',
        userName: '清风明月',
        userAvatar: 'https://picsum.photos/id/177/200/200',
        rating: 5,
        content: '很专业的模特，镜头感强，出片率高。',
        time: '2026-06-01',
        activityTitle: '明制汉服新品拍摄'
      }
    ],
    isVerified: true
  },
  {
    id: '7',
    nickname: '兰亭序',
    avatar: 'https://picsum.photos/id/177/200/200',
    gender: 'male',
    age: 27,
    city: '南京',
    height: 178,
    weight: 65,
    bust: 94,
    waist: 76,
    hips: 92,
    usualStyle: ['weiJin', 'song'],
    works: [
      'https://picsum.photos/id/1036/300/300',
      'https://picsum.photos/id/1039/300/300'
    ],
    bio: '中文系研究生，喜欢魏晋风度和宋韵文化。穿汉服是一种生活态度。',
    reviews: [],
    isVerified: false
  },
  {
    id: '8',
    nickname: '长安月',
    avatar: 'https://picsum.photos/id/91/200/200',
    gender: 'female',
    age: 29,
    city: '西安',
    height: 166,
    weight: 52,
    bust: 88,
    waist: 66,
    hips: 90,
    usualStyle: ['tang', 'qing'],
    works: [
      'https://picsum.photos/id/1018/300/300',
      'https://picsum.photos/id/1082/300/300',
      'https://picsum.photos/id/787/300/300'
    ],
    bio: '在西安做汉服妆造的西安人，最爱唐制的雍容华贵。我们团队有8位专业妆造师，欢迎来体验！',
    reviews: [
      {
        id: 'r6',
        userId: '1',
        userName: '霓裳羽衣',
        userAvatar: 'https://picsum.photos/id/64/200/200',
        rating: 5,
        content: '在大唐不夜城体验了她们的妆造，真的太绝了！朋友都说像从唐朝穿越过来的。',
        time: '2026-05-10',
        activityTitle: '大唐芙蓉园汉服游园会'
      }
    ],
    isVerified: true
  },
  {
    id: '9',
    nickname: '姑苏客',
    avatar: 'https://picsum.photos/id/64/200/200',
    gender: 'male',
    age: 32,
    city: '苏州',
    height: 175,
    weight: 68,
    bust: 92,
    waist: 80,
    hips: 94,
    usualStyle: ['song', 'ming'],
    works: [
      'https://picsum.photos/id/1015/300/300',
      'https://picsum.photos/id/1039/300/300'
    ],
    bio: '园林设计师，热爱宋式美学。着宋制逛园林是我最大的爱好。',
    reviews: [],
    isVerified: false
  },
  {
    id: '10',
    nickname: '海棠依旧',
    avatar: 'https://picsum.photos/id/338/200/200',
    gender: 'female',
    age: 23,
    city: '武汉',
    height: 164,
    weight: 46,
    bust: 83,
    waist: 61,
    hips: 87,
    usualStyle: ['han', 'tang'],
    works: [
      'https://picsum.photos/id/119/300/300',
      'https://picsum.photos/id/220/300/300'
    ],
    bio: '武汉大学汉服社成员，喜欢和同袍们一起参加活动。欢迎武汉的同袍约起来！',
    reviews: [],
    isVerified: false
  }
];

export const mockRegistrations = [
  {
    id: 'reg1',
    activityId: '1',
    activityTitle: '大唐芙蓉园汉服游园会',
    activityDate: '2026-06-15',
    activityTime: '09:00-18:00',
    activityLocation: '西安市雁塔区大唐芙蓉园',
    coverImage: 'https://picsum.photos/id/1018/200/200',
    status: 'confirmed',
    registerTime: '2026-06-01 10:30'
  },
  {
    id: 'reg2',
    activityId: '2',
    activityTitle: '清明上河园宋代雅集茶会',
    activityDate: '2026-06-18',
    activityTime: '14:00-17:00',
    activityLocation: '开封市龙亭区清明上河园',
    coverImage: 'https://picsum.photos/id/1015/200/200',
    status: 'confirmed',
    registerTime: '2026-06-05 14:20'
  },
  {
    id: 'reg3',
    activityId: '6',
    activityTitle: '故宫紫禁汉服摄影游园',
    activityDate: '2026-06-28',
    activityTime: '08:00-16:00',
    activityLocation: '北京市东城区故宫博物院',
    coverImage: 'https://picsum.photos/id/1082/200/200',
    status: 'waitlist',
    registerTime: '2026-06-10 09:15'
  },
  {
    id: 'reg4',
    activityId: '3',
    activityTitle: '明制汉服妆造体验课',
    activityDate: '2026-06-20',
    activityTime: '10:00-16:00',
    activityLocation: '北京市朝阳区三里屯SOHO',
    coverImage: 'https://picsum.photos/id/103/200/200',
    status: 'pending',
    registerTime: '2026-06-12 16:45'
  },
  {
    id: 'reg5',
    activityId: '4',
    activityTitle: '南京夫子庙汉服文化市集',
    activityDate: '2026-06-22',
    activityTime: '10:00-20:00',
    activityLocation: '南京市秦淮区夫子庙步行街',
    coverImage: 'https://picsum.photos/id/1082/200/200',
    status: 'cancelled',
    registerTime: '2026-06-08 11:30'
  }
];
