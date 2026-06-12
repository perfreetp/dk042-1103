export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/calendar/index',
    'pages/shooting/index',
    'pages/community/index',
    'pages/registrations/index',
    'pages/activity-detail/index',
    'pages/shooting-publish/index',
    'pages/shooting-detail/index',
    'pages/user-detail/index',
    'pages/chat/index',
    'pages/photo-upload/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#FFFFFF',
    navigationBarTitleText: '汉服同城',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#999999',
    selectedColor: '#C81D25',
    backgroundColor: '#FFFFFF',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页'
      },
      {
        pagePath: 'pages/calendar/index',
        text: '活动日历'
      },
      {
        pagePath: 'pages/shooting/index',
        text: '约拍广场'
      },
      {
        pagePath: 'pages/community/index',
        text: '同袍名片'
      },
      {
        pagePath: 'pages/registrations/index',
        text: '我的报名'
      }
    ]
  }
})
