import type { CategoryMeta } from '../../types/quiz.types';

export const QUIZ_CATEGORIES: CategoryMeta[] = [
  {
    id: 'problem-types',
    name: '雪崩问题类型',
    subtitle: 'Problem Types',
    icon: 'triangle-alert',
    description: '六种标准雪崩问题类型的特征、触发条件和管理建议',
    totalQuestions: 80,
    relatedPage: '/safety/problem-types',
  },
  {
    id: 'danger-scale',
    name: '危险等级',
    subtitle: 'Danger Scale',
    icon: 'bar-chart',
    description: '国际雪崩危险等级1-5级的含义和活动建议',
    totalQuestions: 60,
    relatedPage: '/safety/danger-scale',
  },
  {
    id: 'terrain',
    name: '地形管理',
    subtitle: 'Terrain',
    icon: 'mountain',
    description: '坡度评估、坡向分析和地形陷阱识别',
    totalQuestions: 70,
    relatedPage: '/safety/terrain',
  },
  {
    id: 'crystal-types',
    name: '雪晶变质',
    subtitle: 'Crystals',
    icon: 'snowflake',
    description: '积雪晶体分类及其演变过程与弱层形成机制',
    totalQuestions: 60,
    relatedPage: '/safety/crystal-types',
  },
  {
    id: 'rescue',
    name: '救援自救',
    subtitle: 'Rescue',
    icon: 'life-buoy',
    description: '信标、探杆、铲子三件套使用和伙伴救援流程',
    totalQuestions: 70,
    relatedPage: '/safety/rescue',
  },
  {
    id: 'decision',
    name: '决策框架',
    subtitle: 'Decision',
    icon: 'compass',
    description: '三阶段决策模型和认知陷阱防范',
    totalQuestions: 60,
    relatedPage: '/safety/decision',
  },
  {
    id: 'weather',
    name: '气象观测',
    subtitle: 'Weather',
    icon: 'cloud-sun',
    description: '天气对雪崩风险的影响及气象数据解读',
    totalQuestions: 50,
    relatedPage: '/safety/terrain',
  },
  {
    id: 'snow-profile',
    name: '雪层分析',
    subtitle: 'Snow Profile',
    icon: 'layers',
    description: '雪坑观测方法和雪层结构分析',
    totalQuestions: 50,
    relatedPage: '/safety/crystal-types',
  },
];

export const CATEGORY_MAP = Object.fromEntries(
  QUIZ_CATEGORIES.map((c) => [c.id, c])
) as Record<string, CategoryMeta>;
