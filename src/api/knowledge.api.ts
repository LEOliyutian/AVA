import { apiClient } from './client';

export interface KnowledgeMedia {
  id: number;
  page_key: string;
  item_key: string;
  file_path: string;
  alt_text: string | null;
  created_at: string;
  sort_order: number;
  is_published: number;
}

export interface KnowledgeNote {
  page_key: string;
  content: string;
  updated_at: string;
  is_published: number;
}

export interface AdminContentResponse {
  content: Record<string, Record<string, string>>;
  publishedItems: string[];
}

// 页面配置：每个页面有哪些图片槽位
export interface MediaSlot {
  item_key: string;
  label: string;
  hint?: string;
}

export const PAGE_SLOTS: Record<string, { label: string; slots: MediaSlot[] }> = {
  problem_types: {
    label: '雪崩问题类型',
    slots: [
      { item_key: 'wind_slab',        label: '风板',   hint: '1200×800px 推荐' },
      { item_key: 'persistent_slab',  label: '持续板', hint: '1200×800px 推荐' },
      { item_key: 'storm_slab',       label: '暴风雪板',hint: '1200×800px 推荐' },
      { item_key: 'wet_slab',         label: '湿雪',   hint: '1200×800px 推荐' },
      { item_key: 'loose',            label: '松雪',   hint: '1200×800px 推荐' },
      { item_key: 'cornice',          label: '雪檐',   hint: '1200×800px 推荐' },
    ],
  },
  danger_scale: {
    label: '危险等级',
    slots: [
      { item_key: 'overview', label: '等级示意图', hint: '建议横向宽图 1600×600px' },
    ],
  },
  terrain: {
    label: '地形管理',
    slots: [
      { item_key: 'slope_angle',    label: '坡度图示' },
      { item_key: 'aspect',         label: '坡向图示' },
      { item_key: 'terrain_traps',  label: '地形陷阱' },
      { item_key: 'runout',         label: '雪崩路径' },
      { item_key: 'exposure',       label: '暴露度示例' },
    ],
  },
  rescue: {
    label: '救援与自救',
    slots: [
      { item_key: 'beacon',    label: '信标搜索示意' },
      { item_key: 'probe',     label: '探杆探测' },
      { item_key: 'shovel',    label: '战略挖掘' },
      { item_key: 'burial',    label: '埋压模式' },
      { item_key: 'companion', label: '伙伴救援流程' },
    ],
  },
  crystal_types: {
    label: '雪晶类型',
    slots: [
      { item_key: 'new_snow',     label: '新雪晶体' },
      { item_key: 'rounded',      label: '圆化颗粒' },
      { item_key: 'faceted',      label: '面角晶体' },
      { item_key: 'depth_hoar',   label: '深霜' },
      { item_key: 'surface_hoar', label: '表面霜' },
      { item_key: 'melt_freeze',  label: '融冻颗粒' },
    ],
  },
  decision: {
    label: '出行决策框架',
    slots: [
      { item_key: 'three_stage',  label: '三阶段决策流程图' },
      { item_key: 'red_flags',    label: '明显线索示意' },
    ],
  },
};

export const PAGE_KEYS = Object.keys(PAGE_SLOTS);

// 各页面可编辑的文字内容字段定义
export interface ContentField { key: string; label: string }
export interface ContentItem {
  item_key: string;
  label: string;
  fields: ContentField[];
  defaults?: Record<string, string>;
}

const PROBLEM_FIELDS: ContentField[] = [
  { key: 'description', label: '描述' },
  { key: 'triggers',    label: '触发条件' },
  { key: 'terrain',     label: '典型地形' },
  { key: 'management',  label: '管理建议' },
  { key: 'trend',       label: '变化趋势' },
];

const DANGER_FIELDS: ContentField[] = [
  { key: 'stability',      label: '稳定性描述' },
  { key: 'naturalTrigger', label: '自然触发概率' },
  { key: 'humanTrigger',   label: '人为触发概率' },
  { key: 'activityScope',  label: '建议活动范围' },
  { key: 'terrainAdvice',  label: '地形选择建议' },
];

const CRYSTAL_FIELDS: ContentField[] = [
  { key: 'shape',        label: '形态特征' },
  { key: 'formation',    label: '形成条件' },
  { key: 'strength',     label: '结合强度' },
  { key: 'significance', label: '雪崩安全意义' },
];

export const PAGE_CONTENT_SCHEMA: Record<string, ContentItem[] | null> = {
  problem_types: [
    { item_key: 'wind_slab', label: '风板', fields: PROBLEM_FIELDS, defaults: {
      description: '由风搬运的雪在背风坡堆积形成的致密雪板。风板通常质地坚硬，覆盖在较软的雪层之上，形成明显的弱层界面。',
      triggers: '人为触发常见，尤其在风板边缘和较薄区域。风力加载后数小时至数天内风险最高。',
      terrain: '背风坡、山脊下方、沟谷上部。常见于高山带和林线带的陡峭地形。',
      management: '避开背风坡面的陡峭地形，注意观察风向标志（雪旗、雪檐方向）。大风过后保持保守路线选择。',
      trend: '风力停止后随时间逐渐稳定，通常在1-3天内风险降低，但低温环境下可持续更久。',
    }},
    { item_key: 'persistent_slab', label: '持续板', fields: PROBLEM_FIELDS, defaults: {
      description: '建立在深层持续弱层（如深霜、表面霜、冰壳）之上的雪板。这类问题可持续数周甚至整个雪季，且难以预测。',
      triggers: '人为触发可能性中等至高。弱层可能被上方较厚的雪板加载后远程触发，触发点可能远离雪崩路径。',
      terrain: '所有坡向的35°以上陡坡。在弱层分布范围内影响面积广，可能导致大规模雪崩。',
      management: '这是最危险的雪崩问题类型之一。建议远离所有陡峭地形，保持极为保守的路线选择。注意雪层剖面中的弱层信号。',
      trend: '随时间缓慢稳定，可能持续数周至数月。新降雪或温度变化可能重新激活。',
    }},
    { item_key: 'storm_slab', label: '暴风雪板', fields: PROBLEM_FIELDS, defaults: {
      description: '由降雪或降雪伴随风形成的新雪板。新雪在旧雪面上快速堆积，来不及与下层结合就形成不稳定的雪板结构。',
      triggers: '暴风雪期间及之后人为触发概率高。降雪强度越大、温度越低，形成不稳定雪板的风险越高。',
      terrain: '所有坡向的陡坡，尤其是35°以上的地形。高山带和林线带风险最高。',
      management: '暴风雪期间和之后24-48小时内避开陡峭地形。关注降雪速率和总量，超过30cm/24h需特别警惕。',
      trend: '通常在暴风雪停止后1-3天内随着新雪沉降和结合而稳定。',
    }},
    { item_key: 'wet_slab', label: '湿雪', fields: PROBLEM_FIELDS, defaults: {
      description: '由液态水渗透进入雪层，弱化雪板内部结构或雪板与地面的界面而导致。常见于春季升温或降雨事件后。',
      triggers: '自然触发为主。当融水到达弱层或地面时可大面积自然释放。极端情况下轨迹路线中的滑雪切割也可能触发。',
      terrain: '阳面坡（南坡、西南坡）在春季白天风险最高。低海拔带和林下带先受影响。',
      management: '关注冻融循环，清晨出行在雪面重新冻结后活动，中午前撤离陡峭阳面坡。避免在雪面湿润变软后进入陡坡。',
      trend: '随昼夜冻融循环变化。持续温暖天气或降雨会使问题加剧，直到雪层完全排水稳定。',
    }},
    { item_key: 'loose', label: '松雪', fields: PROBLEM_FIELDS, defaults: {
      description: '从单一点释放的雪崩，呈倒三角或扇形扩展。分为干松雪（冷干的新雪或表面霜）和湿松雪（融雪）两种类型。',
      triggers: '自然释放或人为触发均常见。干松雪多由滑雪者切割触发，湿松雪多因日照升温自然释放。',
      terrain: '极陡地形（40°以上）。虽然单次松雪雪崩规模通常较小，但在地形陷阱中可能造成严重后果。',
      management: '关注松雪雪崩下方是否存在悬崖、沟道等地形陷阱。小规模松雪雪崩可能触发下方更大的雪板雪崩。',
      trend: '干松雪随雪层沉降快速稳定。湿松雪随日间温度循环变化，午后风险增高。',
    }},
    { item_key: 'cornice', label: '雪檐', fields: PROBLEM_FIELDS, defaults: {
      description: '在山脊或悬崖边缘由风堆积形成的悬挂雪块。雪檐可能在无征兆的情况下断裂，坠落后可能触发下方坡面的雪崩。',
      triggers: '温度升高、额外的风加载或自身重力作用均可导致断裂。人为接近也可能触发。雪檐的实际边缘往往比目视判断更靠后。',
      terrain: '山脊线、悬崖边缘和陡坡顶部。常见于背风一侧的山脊。',
      management: '远离山脊边缘，保持安全距离（至少一个雪檐宽度）。不要在雪檐下方停留或通行。上山接近山脊时从迎风侧靠近。',
      trend: '随温度升高和风力加载逐渐增大。春季升温期间雪檐断裂风险显著增加。',
    }},
  ],
  danger_scale: [
    { item_key: 'level_1', label: '等级 1 — 低', fields: DANGER_FIELDS, defaults: {
      stability: '雪层整体稳定，自然触发和人为触发的可能性都很低。孤立的不稳定区域可能存在于极端陡峭地形。',
      naturalTrigger: '极低 — 自然雪崩活动罕见',
      humanTrigger: '极低 — 仅在孤立地形特征处有微弱可能',
      activityScope: '适合各类野外活动',
      terrainAdvice: '所有地形均可考虑，但极陡峭地形仍需基本评估。',
    }},
    { item_key: 'level_2', label: '等级 2 — 较低', fields: DANGER_FIELDS, defaults: {
      stability: '特定地形特征处雪层稳定性降低。在某些坡向和海拔带可能存在不稳定的雪板结构，尤其在风加载区域。',
      naturalTrigger: '低 — 自然触发雪崩不太可能',
      humanTrigger: '可能 — 在特定的不稳定地形特征处可被人为触发',
      activityScope: '大部分地形可活动，需谨慎评估特定区域',
      terrainAdvice: '避免已识别的不稳定地形特征，在陡峭的背风坡面保持警惕。',
    }},
    { item_key: 'level_3', label: '等级 3 — 中', fields: DANGER_FIELDS, defaults: {
      stability: '多数陡峭坡面雪层不稳定。危险条件可能广泛存在，多个坡向和海拔带均可能受到影响。',
      naturalTrigger: '可能 — 自然触发雪崩有一定概率发生',
      humanTrigger: '很可能 — 人为触发概率显著上升，尤其在陡峭地形',
      activityScope: '需要丰富经验和保守的地形选择',
      terrainAdvice: '仅选择坡度较低的地形，避免所有35°以上的坡面和雪崩路径下方。',
    }},
    { item_key: 'level_4', label: '等级 4 — 高', fields: DANGER_FIELDS, defaults: {
      stability: '大多数陡峭地形非常不稳定。危险条件广泛且严重，大型自然雪崩可能频繁发生。',
      naturalTrigger: '很可能 — 自然触发雪崩可能频繁发生，包括大型雪崩',
      humanTrigger: '非常可能 — 人为触发几乎确定，甚至在较缓坡面',
      activityScope: '强烈建议避开所有雪崩地形',
      terrainAdvice: '远离所有雪崩起始区、路径和堆积区。仅在完全平坦或有森林保护的区域活动。',
    }},
    { item_key: 'level_5', label: '等级 5 — 极端', fields: DANGER_FIELDS, defaults: {
      stability: '广泛的自然雪崩活动，雪层极度不稳定。大规模雪崩随时可能发生，影响范围可能远超正常雪崩路径。',
      naturalTrigger: '确定 — 大量自然雪崩正在发生或即将发生',
      humanTrigger: '确定 — 任何暴露在雪崩地形中的人员都面临极端风险',
      activityScope: '禁止一切野外活动',
      terrainAdvice: '远离所有雪崩路径及其影响范围。此等级下雪崩可能到达非常远的距离。',
    }},
  ],
  crystal_types: [
    { item_key: 'PP', label: '新雪 (PP)', fields: CRYSTAL_FIELDS, defaults: {
      shape: '星形枝状、板状、柱状、针状等多种形态，取决于形成时的温度和湿度条件。',
      formation: '直接由大气中的水汽凝华形成，从云层降落到地面。晶体形态受气温影响显著：-15°C 附近形成经典的六角星形枝晶，-5°C 附近形成针状晶体。',
      strength: '初始结合力弱，晶体间仅有点接触。但随着沉降和圆化过程推进，结合力迅速增强。',
      significance: '大量新雪快速堆积可形成暴风雪板（Storm Slab）。新雪是所有雪层变质过程的起点。',
    }},
    { item_key: 'DF', label: '分解粒雪 (DF)', fields: CRYSTAL_FIELDS, defaults: {
      shape: '新雪晶体的碎片和部分分解形态。原始的枝状结构被破坏，但尚未完全圆化。',
      formation: '新雪在风力作用、自身重力和温度变化下开始分解。枝状末端断裂，晶体逐渐碎裂为不规则颗粒。这是新雪变质的第一阶段。',
      strength: '比新雪稍强，碎片之间开始建立更多接触点。沉降使颗粒间的空隙减小，密度增加。',
      significance: '过渡状态，持续时间取决于温度。在接近 0°C 时分解很快（数小时），在极低温下可能持续数天。',
    }},
    { item_key: 'RG', label: '圆粒雪 (RG)', fields: CRYSTAL_FIELDS, defaults: {
      shape: '均匀的小圆颗粒，直径通常 0.25-1.5mm。表面光滑，形状接近球形。',
      formation: '在等温条件下（温度梯度 < 5°C/m），通过表面能最小化原理，晶体逐渐圆化。大曲率区域（尖角）的分子迁移到小曲率区域（凹处），形成球形。同时颗粒间通过烧结形成冰桥。',
      strength: '结合力强，是最稳定的雪层组成。圆化颗粒间的烧结冰桥提供良好的结构强度。',
      significance: '圆粒雪层是雪层中的"好邻居"——稳定、密实、承载能力强。等温变质的理想终态。',
    }},
    { item_key: 'FC', label: '刻面晶 (FC)', fields: CRYSTAL_FIELDS, defaults: {
      shape: '棱角分明的多面体颗粒，表面平坦有明显的刻面，形状类似立方体或条纹状。直径 1-5mm。',
      formation: '在中等温度梯度（10-20°C/m）下形成。水汽沿温度梯度方向从暖处向冷处迁移，在晶体表面凝华生长。晶体发育出平坦的刻面和锐利的棱角。可由圆粒雪（RG）在温度梯度增强时逆向发育而来。',
      strength: '结合力弱。棱角形状使颗粒间接触面积小，难以形成有效的冰桥。刻面晶层是常见的弱层。',
      significance: '刻面晶是雪崩安全的重大隐患。它可以形成持续弱层，被上方雪板覆盖后长期存在，是持续板（Persistent Slab）雪崩的关键因素。',
    }},
    { item_key: 'DH', label: '深霜 (DH)', fields: CRYSTAL_FIELDS, defaults: {
      shape: '大型杯状或阶梯状晶体，空心棱柱形，直径可达 5-20mm。结构中空，类似酒杯或阶梯。',
      formation: '在强温度梯度（> 20°C/m）下形成，通常出现在薄雪层下方靠近地面处。地面温度接近 0°C 而表面温度很低时，强烈的水汽迁移驱动晶体快速生长为大型杯状结构。',
      strength: '极弱。大型空心晶体之间几乎没有结合力，形成类似"干沙"的松散层。一旦形成很难被消除。',
      significance: '雪层中最危险的弱层类型之一。深霜层可以持续整个雪季，只有被春季融水彻底湿润后才可能被消除。是深层持续板雪崩的主要成因。',
    }},
    { item_key: 'SH', label: '表面霜 (SH)', fields: CRYSTAL_FIELDS, defaults: {
      shape: '在雪面生长的薄片状或羽毛状晶体，高度可达数厘米。外观如同微型蕨类植物叶片。',
      formation: '在晴朗无风的夜晚，雪面通过长波辐射迅速冷却。空气中的水汽在冰冷的雪面上直接凝华，形成精美的片状晶体。类似于窗户上结霜的过程。',
      strength: '暴露时极为脆弱。一旦被新雪覆盖掩埋，会形成极为光滑的薄弱界面，上方雪板极易沿此面滑动。',
      significance: '被掩埋的表面霜是最危险的弱层之一。因为非常薄（仅几毫米），在雪层剖面中容易被忽视，但其对雪板稳定性的破坏力极强。',
    }},
    { item_key: 'MF', label: '融冻粒雪 (MF)', fields: CRYSTAL_FIELDS, defaults: {
      shape: '大型圆形颗粒团簇，直径 1-5mm。多个颗粒通过冰桥结合成葡萄状集合体。表面光滑湿润。',
      formation: '当液态水进入雪层（日照融化或降雨），颗粒表面开始融化。重新冻结时，颗粒间形成粗大的冰桥。反复冻融循环使颗粒不断合并增大。',
      strength: '冻结状态下非常坚固（如同冰）；含水状态下迅速弱化。强度随日间温度循环剧烈变化。',
      significance: '冻融循环是春季雪崩安全评估的核心。清晨冻结的粒雪面稳定坚固，但随日间升温融化后可能触发湿雪雪崩。',
    }},
    { item_key: 'IF', label: '冰层 (IF)', fields: CRYSTAL_FIELDS, defaults: {
      shape: '连续的冰壳或冰层，厚度从薄膜到数厘米不等。表面坚硬光滑。',
      formation: '降雨落在雪面后冻结（雨凇层）、雪面融化后重新冻结（融冻壳）、或风力压实雪面形成（风壳）。不同成因的冰层厚度和特性各异。',
      strength: '冰层本身极为坚固。但作为光滑界面，上方雪板可能沿冰层表面滑动，尤其当冰层上方有刻面晶发育时。',
      significance: '冰层阻止水汽穿透，在其上方和下方容易形成刻面晶弱层。同时作为不透水层，会阻止融水向下渗透，积聚液态水导致湿雪不稳定。',
    }},
  ],
  terrain:  null,
  rescue:   null,
  decision: null,
};

export const knowledgeApi = {
  // 公开接口
  getMedia: (pageKey: string) =>
    apiClient.get<{ media: KnowledgeMedia[] }>(`/knowledge/media/${pageKey}`),

  // Admin 获取图片（含草稿）
  adminGetMedia: (pageKey: string) =>
    apiClient.get<{ media: KnowledgeMedia[] }>(`/knowledge/admin/media/${pageKey}`),

  publishMedia: (id: number) =>
    apiClient.post<{ message: string }>(`/knowledge/admin/media/${id}/publish`),

  getNote: (pageKey: string) =>
    apiClient.get<{ note: KnowledgeNote | null }>(`/knowledge/notes/${pageKey}`),

  // Admin 接口
  uploadMedia: (
    pageKey: string,
    itemKey: string,
    file: File,
    altText?: string
  ) => {
    const form = new FormData();
    form.append('image', file);
    form.append('page_key', pageKey);
    form.append('item_key', itemKey);
    if (altText) form.append('alt_text', altText);
    return apiClient.postFormData<{ media: KnowledgeMedia }>('/knowledge/admin/media', form);
  },

  deleteMedia: (id: number) =>
    apiClient.delete<{ message: string }>(`/knowledge/admin/media/${id}`),

  saveNote: (pageKey: string, content: string) =>
    apiClient.put<{ message: string }>(`/knowledge/admin/notes/${pageKey}`, { content }),

  getContent: (pageKey: string) =>
    apiClient.get<{ content: Record<string, Record<string, string>> }>(`/knowledge/content/${pageKey}`),

  saveContentItem: (pageKey: string, itemKey: string, fields: Record<string, string>) =>
    apiClient.put<{ message: string }>(`/knowledge/admin/content/${pageKey}/${itemKey}`, { fields }),

  adminGetContent: (pageKey: string) =>
    apiClient.get<AdminContentResponse>(`/knowledge/admin/content/${pageKey}`),

  publishContentItem: (pageKey: string, itemKey: string) =>
    apiClient.post<{ message: string }>(`/knowledge/admin/content/${pageKey}/${itemKey}/publish`),

  adminGetNote: (pageKey: string) =>
    apiClient.get<{ note: KnowledgeNote | null }>(`/knowledge/admin/notes/${pageKey}`),

  publishNote: (pageKey: string) =>
    apiClient.post<{ message: string }>(`/knowledge/admin/notes/${pageKey}/publish`),
};

// 图片完整 URL（server 的 /uploads/... 直接用后端地址）
export function mediaUrl(filePath: string): string {
  const base = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api').replace('/api', '');
  return `${base}${filePath}`;
}
