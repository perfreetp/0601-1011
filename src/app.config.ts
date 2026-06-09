export default defineAppConfig({
  pages: [
    'pages/itinerary/index',
    'pages/material/index',
    'pages/production/index',
    'pages/memory/index',
    'pages/shotlist/index',
    'pages/contribution/index',
    'pages/publish/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#FFFFFF',
    navigationBarTitleText: 'TripClip',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#94A3B8',
    selectedColor: '#3B82F6',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/itinerary/index',
        text: '行程'
      },
      {
        pagePath: 'pages/material/index',
        text: '素材'
      },
      {
        pagePath: 'pages/production/index',
        text: '成片'
      },
      {
        pagePath: 'pages/memory/index',
        text: '回忆册'
      }
    ]
  }
})
