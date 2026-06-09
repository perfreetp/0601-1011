import { DayItinerary, Member } from '@/types';

export const mockMembers: Member[] = [
  { id: '1', name: '张领队', avatar: 'https://picsum.photos/id/64/200/200', role: 'leader' },
  { id: '2', name: '李小明', avatar: 'https://picsum.photos/id/91/200/200', role: 'member' },
  { id: '3', name: '王小红', avatar: 'https://picsum.photos/id/177/200/200', role: 'member' },
  { id: '4', name: '赵大伟', avatar: 'https://picsum.photos/id/338/200/200', role: 'member' },
  { id: '5', name: '陈思琪', avatar: 'https://picsum.photos/id/1027/200/200', role: 'member' },
  { id: '6', name: '刘宇航', avatar: 'https://picsum.photos/id/1005/200/200', role: 'member' }
];

export const mockItinerary: DayItinerary[] = [
  {
    id: 'day1',
    date: '2024-06-10',
    dayIndex: 1,
    title: '成都出发 - 抵达稻城',
    points: [
      {
        id: 'p1',
        name: '双流机场集合',
        location: '成都双流国际机场',
        time: '06:30',
        description: '全员在T2航站楼3号口集合，检查行李和证件',
        completed: true,
        shots: [
          { id: 's1', name: '团队大合影', description: '机场出发前的全员合影', status: 'completed', priority: 'high' },
          { id: 's2', name: '行李特写', description: '整齐排列的行李箱', status: 'completed', priority: 'low' }
        ]
      },
      {
        id: 'p2',
        name: '稻城亚丁机场',
        location: '甘孜稻城亚丁机场',
        time: '09:45',
        description: '抵达世界海拔最高的民用机场，稍作休整',
        completed: true,
        shots: [
          { id: 's3', name: '机场牌打卡', description: '与机场标识牌合影', status: 'completed', priority: 'high' },
          { id: 's4', name: '窗外雪山', description: '飞机上航拍雪山', status: 'completed', priority: 'medium' }
        ]
      },
      {
        id: 'p3',
        name: '稻城县城',
        location: '稻城县香格里拉镇',
        time: '14:00',
        description: '入住酒店，适应高原环境',
        completed: false,
        shots: [
          { id: 's5', name: '酒店外观', description: '藏式风格酒店', status: 'pending', priority: 'medium' },
          { id: 's6', name: '县城街景', description: '藏族风情街道', status: 'pending', priority: 'low' }
        ]
      }
    ]
  },
  {
    id: 'day2',
    date: '2024-06-11',
    dayIndex: 2,
    title: '亚丁景区 - 冲古寺与珍珠海',
    points: [
      {
        id: 'p4',
        name: '亚丁景区入口',
        location: '稻城亚丁风景区',
        time: '07:00',
        description: '乘观光车进入景区',
        completed: false,
        shots: [
          { id: 's7', name: '景区大门', description: '团队在景区入口处合影', status: 'pending', priority: 'high' },
          { id: 's8', name: '观光车上', description: '成员们期待的表情', status: 'pending', priority: 'medium' }
        ]
      },
      {
        id: 'p5',
        name: '冲古寺',
        location: '亚丁村冲古寺',
        time: '09:00',
        description: '参观藏传佛教寺庙，感受宗教文化',
        completed: false,
        shots: [
          { id: 's9', name: '寺庙全景', description: '金顶红墙的冲古寺', status: 'pending', priority: 'high' },
          { id: 's10', name: '转经筒', description: '成员转动转经筒', status: 'pending', priority: 'medium' },
          { id: 's11', name: '经幡飘扬', description: '五彩经幡在风中飘动', status: 'pending', priority: 'medium' }
        ]
      },
      {
        id: 'p6',
        name: '珍珠海',
        location: '卓玛拉措（珍珠海）',
        time: '11:30',
        description: '观赏仙乃日神山倒映在湖中的美景',
        completed: false,
        shots: [
          { id: 's12', name: '神山倒影', description: '仙乃日山倒映湖中', status: 'pending', priority: 'high' },
          { id: 's13', name: '湖边人像', description: '成员在湖边的个人照', status: 'pending', priority: 'high' },
          { id: 's14', name: '环湖步道', description: '团队沿湖漫步', status: 'pending', priority: 'low' }
        ]
      }
    ]
  },
  {
    id: 'day3',
    date: '2024-06-12',
    dayIndex: 3,
    title: '深度徒步 - 五色海与牛奶海',
    points: [
      {
        id: 'p7',
        name: '洛绒牛场',
        location: '亚丁洛绒牛场',
        time: '06:00',
        description: '骑马或徒步开始今天的挑战',
        completed: false,
        shots: [
          { id: 's15', name: '草原晨光', description: '日出时的金色草原', status: 'pending', priority: 'high' },
          { id: 's16', name: '骑马出发', description: '成员们骑马的英姿', status: 'pending', priority: 'medium' }
        ]
      },
      {
        id: 'p8',
        name: '牛奶海',
        location: '俄绒措（牛奶海）',
        time: '10:30',
        description: '海拔4600米的蓝色宝石',
        completed: false,
        shots: [
          { id: 's17', name: '牛奶海全景', description: '碧蓝湖水环绕乳白色边', status: 'pending', priority: 'high' },
          { id: 's18', name: '胜利合影', description: '全员到达后的庆祝合影', status: 'pending', priority: 'high' },
          { id: 's19', name: '徒步过程', description: '成员们攀登的背影', status: 'pending', priority: 'medium' }
        ]
      },
      {
        id: 'p9',
        name: '五色海',
        location: '丹增措（五色海）',
        time: '13:00',
        description: '在光的折射下产生五种不同颜色的神奇湖泊',
        completed: false,
        shots: [
          { id: 's20', name: '五色海奇观', description: '湖面呈现五种色彩', status: 'pending', priority: 'high' },
          { id: 's21', name: '俯瞰视角', description: '从高处拍摄牛奶海与五色海', status: 'pending', priority: 'medium' }
        ]
      }
    ]
  }
];
