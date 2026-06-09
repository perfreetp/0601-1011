import dayjs from 'dayjs';

export const formatDate = (date: string, format = 'YYYY-MM-DD') => {
  return dayjs(date).format(format);
};

export const formatTime = (date: string, format = 'HH:mm') => {
  return dayjs(date).format(format);
};

export const formatDateTime = (date: string) => {
  return dayjs(date).format('MM-DD HH:mm');
};

export const getDayLabel = (dayIndex: number) => {
  return `第${dayIndex}天`;
};

export const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const getCategoryLabel = (category: string) => {
  const map: Record<string, string> = {
    portrait: '人像',
    landscape: '风景',
    group: '合影',
    other: '其他'
  };
  return map[category] || '其他';
};

export const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    draft: '草稿',
    processing: '处理中',
    ready: '待发布',
    published: '已发布',
    pending: '待拍摄',
    completed: '已完成',
    skipped: '已跳过'
  };
  return map[status] || status;
};

export const getPriorityLabel = (priority: string) => {
  const map: Record<string, string> = {
    high: '必拍',
    medium: '建议',
    low: '可选'
  };
  return map[priority] || priority;
};

export const generateShareLink = (id: string) => {
  return `https://tripclip.app/album/${id}`;
};
