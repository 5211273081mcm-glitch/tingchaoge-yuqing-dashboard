import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { cn } from '@/lib/utils';

import { 
  AlertTriangle, 
  Activity, 
  Target, 
  Shield,
  Users,
  Zap,
  Flag,
  BarChart3,
  Flame,
  AlertCircle,
  Info,
  Clock,
  ChevronDown,
  Lightbulb,
  Cpu,
  Signal,
  Terminal,
  Siren,
  Megaphone,
  Volume2,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  MapPin,
  Calendar,
  RefreshCw
} from 'lucide-react';

// ============ 琥珀科技配色系统 ============
const colors = {
  bg: '#0d0d12',
  surface: '#16161e',
  header: '#1f1f2a',
  text: '#e2e8f0',
  textMuted: '#64748b',
  accent: '#f97316',
  border: '#2a2a35',
  secondary: '#3b82f6',
  success: '#10b981',
  danger: '#ef4444',
  warning: '#eab308',
  buttonBg: '#252530',
  buttonHover: '#303040',
};

// ============ 各类型事件脉络数据 ============

// 1. 危险信号 - 灏淼再次开播事件
const dangerSignalData = {
  id: 'danger',
  type: '危险信号（一）',
  title: '「灏淼」再次开播事件',
  icon: Siren,
  color: colors.warning,
  events: [
    { id: 'd1', date: '4月1日-13日', phase: '潜伏期', content: '萨满回归后，姜添粉丝持续催促公司披露灏淼事件维权进度，为后续爆发埋下伏笔' },
    { id: 'd2', date: '4月14日晚', phase: '爆发点', content: '灏淼再次开播，引发姜添粉丝强烈不满，讨论从违规个人上升到质疑公司管理约束能力' },
    { id: 'd3', date: '4月15日', phase: '集中投诉期', content: '粉丝集中投诉，诉求扩展为要求披露处理结果与法律进度，延伸至要求下架姜添处罚公告、退还罚款' },
    { id: 'd4', date: '4月16日', phase: '二次刺激', content: '灏淼与T.1277连麦，发表涉及公司管理及其他主播的不当言论，进一步刺激粉丝情绪' },
    { id: 'd5', date: '4月17日起', phase: '持续影响期', content: '进入持续影响期，4.11-4.17当周大小秘书投诉量升至400+条，形成长尾风险' },
    { id: 'd6', date: '当前状态', phase: '长尾监控', content: '公司已同步法律进展，但粉丝仍有三类核心诉求，存在二次激活风险' },
  ]
};

// 2. 核心舆情 - T.Itt与T.瞬口角升级事件
const coreEventData = {
  id: 'core',
  type: '核心舆情事件',
  title: '「T.Itt & T.瞬」冲突事件',
  icon: Megaphone,
  color: colors.accent,
  events: [
    { id: 'c1', date: '4月13日', phase: '口角爆发', content: 'T.Itt与T.瞬在哈哈厅直播过程中，因公屏聊天是否影响演唱及直播礼仪问题发生公开口角' },
    { id: 'c2', date: '4月14日', phase: '公司介入', content: '公司介入核查，对涉事主播作出扣除佣金、批评警告、要求公开道歉处理，同时暂停T.Itt当月考官职务。但粉丝认为处罚过轻' },
    { id: 'c3', date: '4月15日中午', phase: '站队争议', content: 'T.蛮牛、T.王登登等主播公屏发问，其余主播大笑附和，被粉丝认定为站队T.Itt，二次刺激情绪，投诉升级为"多主播抱团""厅内霸凌""公司纵容霸凌"' },
    { id: 'c4', date: '4月15日晚-17日', phase: '二次发酵', content: '涉事主播陆续道歉后，粉丝不满道歉质量，形成二次发酵，累计大小秘书投诉超过400余条' },
    { id: 'c5', date: '4月17日-20日', phase: '焦点升级', content: '舆情焦点转向处罚力度、标准统一性、公司是否正视厅内小团体问题，主热度逐步下降但标签仍存' },
    { id: 'c6', date: '当前状态', phase: '降温收尾', content: '公司已统一口径回复粉丝，所有涉事主播均已完成批评警告、扣除佣金和道歉，后续将加强主播管理与监督' },
  ]
};

// 3. 线下活动 - 泸州音乐节资源争议
const offlineEventData = {
  id: 'offline',
  type: '线下活动问题',
  title: '「泸州音乐节」线下应援点位争议',
  icon: MapPin,
  color: colors.secondary,
  events: [
    { id: 'o1', date: '4月11日', phase: '投诉发起', content: '崔十八粉丝投诉泸州音乐节注水旗资源分配不公，认为注水旗属于公共资源，不应由北夜粉丝单独占用' },
    { id: 'o2', date: '4月12日-13日', phase: '粉丝对线', content: '北夜、崔十八粉丝因应援资源形成对立对线，双方对资源分配产生争议，开始传播大字报和聊天记录' },
    { id: 'o3', date: '4月13日-14日', phase: '外溢升级', content: '泸州音乐节资源争议外溢至社媒，事件升级为"听潮阁线下活动管理混乱"，崔十八直播相关发言进一步激化情绪' },
    { id: 'o4', date: '4月14日-15日', phase: '公司介入', content: '公司介入协调泸州音乐节争议，协调资源，提示风险，劝导删除大字报，发布有序应援提示' },
    { id: 'o5', date: '4月15日晚', phase: '争议压降', content: '经公司协调后争议逐步压降，但"线下活动管理混乱"的标签已在外部形成印象' },
    { id: 'o6', date: '当前状态', phase: '风险遗留', content: '事件已平息，但暴露了线下活动资源分配机制和风险预警的不足，需完善相关流程' },
  ]
};

// 4. 线上活动 - 公会赛规则争议与数据质疑
const onlineEventData = {
  id: 'online',
  type: '危险信号（二）',
  title: '「公会赛」"星守护&回流票"争议',
  icon: Calendar,
  color: colors.warning,
  events: [
    { id: 'n1', date: '4月20日', phase: '规则发布', content: '公会赛发布规则，星守护赋分机制引发公平性质疑，粉丝质疑兑换比例不公，偏向高ACU主播，存在"价值倒挂"' },
    { id: 'n2', date: '4月20日晚-21日', phase: '争议升级', content: '星守护规则争议升级，粉丝集中投诉，争议转向对公会赛整体公正性的质疑' },
    { id: 'n3', date: '4月21日', phase: '规则调整', content: '公司调整星守护机制，调整单次开通活动值为12.8，设置单主播星守护活动值上限1000；争议压降，但出现"临时改规则""向大消滑跪"次生评价' },
    { id: 'n4', date: '4月22日-24日', phase: '数据争议', content: '舆情焦点转向姜添赛期数据异常，外部质疑姜添存在回流票、机房号，数据不匹配，事件升级为违规参赛质疑' },
    { id: 'n5', date: '4月24日晚-公会赛结束', phase: '外溢风险', content: '出现抖音客服违规反馈截图、异常账号等证据，部分投诉表示将向平台/监管举报，公会赛结束姜添第5，该讨论热度逐步消退' },
    { id: 'n6', date: '当前状态', phase: '长尾影响', content: '公会赛已结束，但"规则不公""数据存疑"的标签仍存，需对接抖音平台获取官方核验结果，形成统一对外回复口径' },
  ]
};

// 5. 长尾舆情 - 吐槽主播类事件
const longTailData = {
  id: 'longtail',
  type: '长尾舆情',
  title: '「Ka」议论澈清录音曝光',
  icon: Volume2,
  color: colors.success,
  events: [
    { id: 'l1', date: '4月上旬', phase: '私生活讨论', content: '围绕Ka相关"大姐"私生活爆料进行后续讨论，主要围绕早前私生活爆料的后续，影响可控' },
    { id: 'l2', date: '4月6日晚', phase: '直播爆料', content: 'Ka"大姐"开直播讲述私生活相关事件，讨论及影响相对可控' },
    { id: 'l3', date: '4月中旬', phase: '复播预期', content: 'Ka复播预期升温，粉丝对明确复播时间、官方澄清、撤销处罚的诉求增加' },
    { id: 'l4', date: '4月24日', phase: '录音曝光', content: 'Ka在非公开场合议论前CP澈清的录屏在抖音曝光，内容具象，直接刺激澈清粉丝情绪，事件从Ka个人复播争议升级为主播间公开冲突' },
    { id: 'l5', date: '4月24日当日及后续', phase: '公司处置', content: '公司引导Ka规范回应，同时协调双方粉丝停止对线，将话题收束为"到此为止、往前看"' },
    { id: 'l6', date: '当前状态', phase: '复燃风险', content: '事件影响已经回落，但Ka相关"大姐"仍有可能进行其余爆料，存在激发澈清与Ka进一步矛盾的复燃风险' },
  ]
};

// 所有事件模块数据（按指定顺序：核心舆情→危险信号一→危险信号二→线下活动→长尾舆情）
const allEventModules = [coreEventData, dangerSignalData, onlineEventData, offlineEventData, longTailData];

// ============ KPI数据 ============
const kpiData = [
  { label: '风险投诉量', value: 76, color: colors.accent, icon: AlertTriangle },
  { label: '核心舆情', value: 1, color: colors.accent, icon: Flame },
  { label: '危险信号', value: 2, color: colors.warning, icon: Siren },
  { label: '线下舆情', value: 1, color: colors.secondary, icon: BarChart3 },
  { label: '长尾舆情', value: 1, color: colors.success, icon: Volume2 },
];

// 部门风险数据
const departmentRisks = [
  { name: '事业一部', from: 42, to: 35, change: -17, trend: '↓', description: '风险量级回落，主要来自姜添数据争议', status: '中风险' },
  { name: '事业二部', from: 30, to: 48, change: 60, trend: '↑↑', description: '高风险集中，T.Itt冲突、灏淼开播、Ka录音三起事件', status: '高风险' },
  { name: '公司侧', from: 7, to: 18, change: 157, trend: '↑↑', description: '活动类场景成为新风险源，公会赛和线下活动管理问题突出', status: '中风险' },
];

// 豆瓣讨论热度数据
const doubanHeatData = [
  { name: '姜添', heat: 4700, change: 'up', changeValue: '登顶', color: colors.accent },
  { name: '萨满', heat: 3200, change: 'up', changeValue: '上升', color: colors.warning },
  { name: '北夜', heat: 2800, change: 'up', changeValue: '上升', color: colors.warning },
  { name: '崔十八', heat: 2600, change: 'up', changeValue: '上升', color: colors.warning },
  { name: '六月', heat: 2400, change: 'up', changeValue: '上升', color: colors.warning },
  { name: '尹妹', heat: 2100, change: 'steady', changeValue: '持续', color: colors.secondary },
  { name: '澈清', heat: 1900, change: 'up', changeValue: '上升', color: colors.warning },
  { name: '徐来', heat: 1500, change: 'down', changeValue: '下降', color: colors.success },
  { name: '阳总', heat: 1200, change: 'down', changeValue: '下降', color: colors.success },
  { name: '麦麦', heat: 1000, change: 'down', changeValue: '下降', color: colors.success },
];

// 5月动作板任务
const tasks = [
  { priority: 'p1-now', label: 'P1立刻', labelColor: colors.accent, meaning: '核心紧急任务', content: '针对姜添公会赛上票数据的"客服误导性回复"，统一对外口径平息误导' },
  { priority: 'p1-month', label: 'P1本月', labelColor: colors.warning, meaning: '本月内必须完成', content: '持续监测灏淼账号言论，在法律允许范围内定期公开同步诉讼进展' },
  { priority: 'p1-follow', label: 'P1跟进', labelColor: colors.warning, meaning: '持续监测跟进', content: '跟踪涉事T.Itt等主播后续言行，完善考官等关键岗位风控标准' },
  { priority: 'p2-follow', label: 'P2跟进', labelColor: colors.secondary, meaning: '常规推进任务', content: '加强全平台主播言行规范培训，明确直播互动边界' },
];

// 核心事件详细数据
const coreEventsData = [
  {
    id: 'event1',
    label: '',
    labelColor: colors.accent,
    title: 'T.Itt与T.瞬冲突事件',
    icon: Megaphone,
    riskLevel: '🔥舆情事件（当月最高风险）',
    trigger: '4月13日，T.Itt与T.瞬在哈哈厅直播过程中，因公屏聊天是否影响演唱及直播礼仪问题发生公开口角。',
    timeline: [
      '4.13：双方发生公开口角，初期聚焦冲突本身，很快被解读为主播矛盾公开化',
      '4.14：公司介入核查，对涉事主播作出扣除佣金、批评警告、要求公开道歉处理，同时暂停T.Itt当月考官职务。但粉丝认为处罚过轻',
      '4.15中午：T.蛮牛、T.王登登等主播公屏发问，其余主播大笑附和，被粉丝认定为站队T.Itt，二次刺激情绪',
      '4.15晚-4.17：涉事主播陆续道歉后，粉丝不满道歉质量，形成二次发酵，投诉超过400余条',
      '4.17-4.20：舆情焦点转向处罚力度、标准统一性、公司是否正视厅内小团体问题'
    ],
    current: '公司已统一口径回复粉丝，所有涉事主播均已完成批评警告、扣除佣金和道歉，后续将加强主播管理与监督。事件主热度已大幅下降，但"处罚偏轻""考官不公""霸凌厅"等负面标签仍存在长尾传播风险。',
    meaning: '表面为主播口角冲突，实质暴露出直播言行边界模糊、厅内互动秩序缺失、关键岗位（考官）公信力不足的管理短板。腰尾部主播矛盾若不及时处置，很容易被放大为对公司管理公正性的整体质疑。',
    requirements: [
      '持续跟踪涉事主播言行，防止阴阳怪气、拉踩站队、挑衅粉丝等问题反复',
      '完善考官等关键岗位的风控标准，通过持续可见的管理动作修复粉丝对厅内生态及公司治理的信任'
    ]
  },
  {
    id: 'event2',
    label: '',
    labelColor: colors.warning,
    title: '灏淼再次开播事件',
    icon: Siren,
    riskLevel: '⚠️危险信号（存在长尾二次激活风险）',
    trigger: '1. 4月14日晚灏淼再次开播，引发姜添粉丝强烈不满；2. 4月16日灏淼与T.1277连麦，发表涉及公司管理及其他主播的不当言论，进一步刺激粉丝情绪。',
    timeline: [
      '4.1-4.13：萨满回归后，姜添粉丝持续催促公司披露灏淼事件维权进度',
      '4.14晚：灏淼再次开播，讨论从违规个人上升到质疑公司管理约束能力',
      '4.15：粉丝集中投诉，诉求扩展为要求披露处理结果与法律进度，延伸至要求下架姜添处罚公告',
      '4.16：灏淼发表不当言论，再刺激情绪',
      '4.17：进入持续影响期，4.11-4.17当周大小秘书投诉量升至400+条'
    ],
    current: '公司已同步法律进展：证据梳理完成、诉状已递交法院、案件依法审理中，并提示司法程序有法定周期。但粉丝仍有三类核心诉求：1. 进一步限制灏淼账号发声、开播、造谣行为；2. 撤销姜添处罚公告、退还罚款；3. 持续披露诉讼进度，回应外部质疑。事件已阶段性回应，但仍存在长尾风险。',
    meaning: '事件核心不在开播本身，而在粉丝对公司账号管控、处罚结果和法律追责进度的信任疑虑。暴露了Q1遗留舆情的长尾风险，即便完成阶段性处置，只要核心争议未闭环，仍会随时因相关动作重新激活舆论。',
    requirements: [
      '持续监测灏淼账号、作品、直播及评论区言论，避免制造新舆情',
      '在法律允许范围内定期同步可公开进展，减少"公司拖延/不作为"的外部想象',
      '警惕灏淼再次发声或诉讼节点变化时，"管控不力""维权进度不明"标签被重新放大'
    ]
  },
  {
    id: 'event3',
    label: '',
    labelColor: colors.danger,
    title: 'Ka议论澈清录音曝光事件',
    icon: Volume2,
    riskLevel: '❗️吐槽主播（存在后续复燃可能）',
    trigger: '4月24日，Ka在非公开场合议论前CP澈清的录屏在抖音曝光，内容具象，直接刺激澈清粉丝情绪。',
    timeline: [
      '4月上旬：围绕Ka相关"大姐"私生活爆料进行后续讨论，影响可控',
      '4月中旬：Ka复播预期升温，粉丝对明确复播时间、官方澄清、撤销处罚的诉求增加',
      '4.24：议论澈清的录屏曝光，事件从Ka个人复播争议升级为主播间公开冲突，引发大量投诉',
      '4.24当日及后续：公司引导Ka规范回应，同时协调双方粉丝停止对线，将话题收束为"到此为止、往前看"'
    ],
    current: '事件影响已经回落，但Ka相关"大姐"仍有可能进行其余爆料，存在激发澈清与Ka进一步矛盾的复燃风险。',
    meaning: '头腰部主播的私域言行、情感关系和复播节奏仍是舆情易燃点，即便旧有热度逐步消退，一旦出现新的负面物料，仍会快速升级为跨粉丝阵营对立，消耗主播及组合形象。',
    requirements: [
      '重点防范两类复燃点：1. 相关"大姐"后续爆料重新引发三次情感讨论；2. 澈清粉丝围绕"背后议论""不尊重前CP"标签进行二次传播'
    ]
  },
  {
    id: 'event4',
    label: '',
    labelColor: colors.secondary,
    title: '泸州音乐节资源争议事件',
    icon: MapPin,
    riskLevel: '⚠️危险信号（牵涉头部主播、潜在发酵概率高）',
    trigger: '泸州音乐节线下应援资源对接阶段，北夜粉丝通过自有渠道取得30面注水旗点位资源，由于资源归属、分配原则及公司介入机制未提前明确，引发其他主播粉丝不满，崔十八粉丝于4月11日向大秘书集中投诉，认为注水旗属于听潮阁参演歌手的公共资源，不应由单一粉丝群体自行分配，要求公司介入协调。',
    timeline: [
      '前期：泸州音乐节线下应援资源启动对接，北夜粉丝自行获取30面注水旗点位，因规则不明确埋下争议隐患',
      '4/11：崔十八粉丝正式发起投诉，事件从粉丝内部争执转为官方投诉',
      '4/12-4/13：双方形成对立，北夜粉丝主张"先到先得"，崔十八粉丝主张"公共资源共享"，随后双方传播大字报和聊天记录截图，舆情升级为公开对线',
      '4/13-4/14：事件外溢至豆瓣、抖音等公开平台，被外部解读为"听潮阁内部粉丝抢资源""公司线下活动管理混乱"；崔十八直播中"粉丝难受他也难受"的表述被北夜粉丝解读为阴阳事件，进一步放大情绪对立',
      '4/14-4/15：公司舆情及粉运部门介入协调，沟通调整资源配置，向粉丝提示线下饭圈冲突对后续合作的风险，劝导粉丝删除/隐藏大字报，同步发布有序应援提示',
      '4/15后：双方陆续删除大字报，舆情热度回落，音乐节合作项目正常推进'
    ],
    current: '舆情热度已回落，合作正常推进，但仍保留"资源协调不前置、粉丝冲突管理不足、内部撕扯影响外部合作"的负面观感，存在负面标签长尾传播风险。',
    meaning: '该事件表面为资源分配争议，实质暴露出公司大型线下活动管理短板：应援报备规则缺失、资源归属口径不清晰、公司协调介入时机偏晚、粉丝冲突线上化预警不足。事件暴露了公司在面对"主播—粉丝—平台—外部合作方"多方利益交织时，规则设计和风险推演不足，容易导致业务问题外溢为阵营对立型舆情，进而影响公司治理公信力和外部合作信用。',
    requirements: [
      '完善大型线下活动的应援报备规则、资源协调机制和粉丝冲突前置干预机制',
      '提前明确资源归属和分配原则，避免同类问题再次发生',
      '建立线下活动风险预警机制，防止内部冲突外溢至公开平台'
    ]
  },
  {
    id: 'event5',
    label: '',
    labelColor: colors.warning,
    title: '公会赛规则争议与数据质疑事件',
    icon: Calendar,
    riskLevel: '⚠️危险信号（外溢风险逐步升高）',
    trigger: '规则争议触发：2026年4月20日公会赛规则发布后，"星守护"被设置为较高活动值，粉丝质疑其与直接送礼打票的换算比例不公，存在"价值倒挂"。数据争议触发：规则争议平息后，姜添在公会赛中取得高排名，外部质疑其赛期上票数据异常，引发"回流票、机房刷票"的性质疑。',
    timeline: [
      '4/20：公会赛规则发布，星守护高活动值设置引发粉丝集中质疑，外部认为该规则对低ACU直播间不利，偏向高ACU主播，存在"捧皇族"嫌疑',
      '4/20晚-4/21：粉丝通过大秘书、豆瓣、抖音等渠道集中投诉，诉求从"换算比例不合理"扩展为"规则服务特定主播""诱导机房刷票""比赛公平性不足"，舆情从规则技术争议转向对公会赛公正性的整体质疑',
      '4/21：公司调整星守护机制：单次开通星守护活动值从20调整为12.8，设置每位主播星守护活动值上限为1000（超出不计入）；调整后比例争议压降，但产生"临时改规则""向大消费者滑跪"的次生负面评价',
      '4/22-4/24：规则争议回落后，舆情焦点转向姜添赛期数据异常，外部质疑其复播后数据增长过快、千分榜异常账号多、疑似使用回流票/机房号、总流水与榜单表现不匹配，事件升级为"主播数据真实性与违规参赛质疑"',
      '4/24晚-公会赛结束：公会赛进入关键阶段，姜添持续位居靠前排名，质疑进一步升级：外部新增三类"证据"（抖音客服违规反馈截图、千分榜匿名/封禁账号、流水结构与榜单不匹配），部分投诉出现"向平台/监管持续举报""公司不处理即视为包庇"的升级表述，外溢风险升高'
    ],
    current: '舆情已从"星守护规则争议"转变为"姜添赛期数据真实性争议"，规则争议已阶段性降温，但数据真实性质疑持续发酵，外溢风险不断升高，外部质疑已经从单个主播违规扩展到对整个公会赛公平性、公司数据核查能力的质疑。',
    meaning: '本次事件暴露了公司活动规则设计不足、异常数据核查公信力不足的问题：初始规则设计未充分推演不同体量主播的利益平衡，引发初始公平性质疑；规则调整后未完全消除负面观感，后续数据争议进一步放大了外部对公司治理公平性的质疑。事件容易将个别主播的数据争议，扩大为"公司纵容违规、比赛不公"的整体公信力危机，影响外界对公司机制公平性的信任。',
    requirements: [
      '尽快对接平台侧，获取姜添上票数据的官方核验结果',
      '形成可对外引用的官方说明和统一回复口径',
      '避免外部将个别主播的数据争议进一步扩大为对公司整体公信力的质疑',
      '防范事件发酵出圈影响公司品牌形象'
    ]
  }
];

// ============ 工具函数 ============

const useCountUp = (end: number, duration: number = 1500) => {
  const [count, setCount] = useState(0);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration]);

  return count;
};

// ============ 子组件 ============

const KPICard: React.FC<{ label: string; value: number; color: string; icon: any; delay: number }> = ({ label, value, color, icon: Icon, delay }) => {
  const animatedValue = useCountUp(value, 1500 + delay);
  
  return (
    <div 
      className="relative p-4 rounded-xl group transition-all duration-300 hover:-translate-y-1 flex items-center gap-3"
      style={{ 
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        boxShadow: '0 0 15px rgba(249, 115, 22, 0.05)'
      }}
    >
      <div className="p-2.5 rounded-lg shrink-0" style={{ backgroundColor: `${color}15` }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div className="min-w-0 flex-1">
        <div 
          className="text-2xl font-bold tracking-tighter mb-0.5"
          style={{ 
            color,
            fontFamily: 'Orbitron, Inter, sans-serif',
            textShadow: `0 0 20px ${color}40`
          }}
        >
          {animatedValue}
        </div>
        <div className="text-[9px] uppercase tracking-wider truncate" style={{ color: colors.textMuted }}>{label}</div>
      </div>
    </div>
  );
};

const CompareProgressBar: React.FC<{ from: number; to: number; max: number }> = ({ from, to, max }) => {
  const fromPercent = Math.min((from / max) * 100, 100);
  const toPercent = Math.min((to / max) * 100, 100);
  
  return (
    <div className="w-full space-y-2">
      <div className="flex items-center gap-3">
        <span className="text-[10px] uppercase tracking-wider w-10" style={{ color: colors.textMuted }}>4月初</span>
        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: colors.buttonBg }}>
          <div 
            className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${fromPercent}%`, background: colors.textMuted }}
          />
        </div>
        <span className="text-xs w-8" style={{ color: colors.textMuted }}>{from}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[10px] uppercase tracking-wider w-10" style={{ color: colors.textMuted }}>4月末</span>
        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: colors.buttonBg }}>
          <div 
            className="h-full rounded-full transition-all duration-1000"
            style={{ 
              width: `${toPercent}%`,
              background: `linear-gradient(90deg, ${colors.accent}, ${colors.warning})`,
              boxShadow: `0 0 10px ${colors.accent}50`
            }}
          />
        </div>
        <span className="text-sm font-bold w-8" style={{ color: colors.accent }}>{to}</span>
      </div>
    </div>
  );
};

const StatusIndicator: React.FC<{ color: string; pulse?: boolean }> = ({ color, pulse = false }) => (
  <div className="relative">
    <div 
      className="w-2 h-2 rounded-full"
      style={{ 
        backgroundColor: color,
        boxShadow: `0 0 8px ${color}`
      }}
    />
    {pulse && (
      <div 
        className="absolute inset-0 rounded-full animate-ping"
        style={{ backgroundColor: `${color}40` }}
      />
    )}
  </div>
);

// 可展开收起的事件时间脉络模块
const EventTimelineModule: React.FC<{ 
  data: typeof dangerSignalData; 
  isExpanded: boolean; 
  onToggle: () => void;
}> = ({ data, isExpanded, onToggle }) => {
  const Icon = data.icon;
  
  return (
    <div 
      className="rounded-xl overflow-hidden transition-all duration-300"
      style={{ 
        background: colors.surface,
        border: `1px solid ${isExpanded ? data.color : colors.border}`,
        boxShadow: isExpanded ? `0 0 20px ${data.color}20` : 'none'
      }}
    >
      {/* 头部 - 始终显示 */}
      <button 
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between hover:bg-opacity-50 transition-all"
        style={{ background: isExpanded ? `${data.color}10` : 'transparent' }}
      >
        <div className="flex items-center gap-4">
          <div 
            className="p-2.5 rounded-lg"
            style={{ background: `${data.color}15` }}
          >
            <Icon className="w-5 h-5" style={{ color: data.color }} />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span 
                className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                style={{ background: `${data.color}15`, color: data.color }}
              >
                {data.type}时间脉络
              </span>
            </div>
            <h3 className="text-base font-semibold mt-1" style={{ color: colors.text }}>
              {data.title}
            </h3>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-[10px]" style={{ color: colors.textMuted }}>
            {data.events.length}个节点
          </span>
          <div 
            className="p-1.5 rounded-lg transition-transform duration-300"
            style={{ 
              background: colors.header,
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
            }}
          >
            <ChevronDown className="w-4 h-4" style={{ color: colors.textMuted }} />
          </div>
        </div>
      </button>
      
      {/* 展开内容 - 时间线详情 */}
      {isExpanded && (
        <div 
          className="px-4 pb-4 border-t"
          style={{ borderColor: colors.border }}
        >
          <div className="pt-4 relative">
            {/* 时间线 */}
            <div 
              className="absolute left-[60px] top-4 bottom-4 w-px"
              style={{ background: `linear-gradient(to bottom, ${data.color}, ${colors.border})` }}
            />
            
            <div className="space-y-4">
              {data.events.map((event, index) => (
                <div key={event.id} className="relative flex gap-4 group">
                  <div className="w-14 text-right shrink-0 pt-0.5">
                    <span className="text-[10px] font-mono" style={{ color: colors.textMuted }}>
                      {event.date}
                    </span>
                  </div>
                  
                  <div className="relative z-10 shrink-0">
                    <div 
                      className="w-3 h-3 rounded-full border-2 transition-all duration-200 group-hover:scale-125"
                      style={{ 
                        backgroundColor: colors.surface,
                        borderColor: data.color,
                        boxShadow: `0 0 0 2px ${colors.surface}, 0 0 8px ${data.color}`
                      }} 
                    />
                  </div>
                  
                  <div className="flex-1 pb-2">
                    <div 
                      className="text-[10px] font-bold uppercase tracking-wider mb-1"
                      style={{ color: data.color }}
                    >
                      {event.phase}
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: colors.text }}>
                      {event.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 核心事件详情卡片 - 全宽横向布局
const EventDetailCard: React.FC<{ data: any }> = ({ data }) => {
  const Icon = data.icon;
  
  return (
    <div 
      className="rounded-xl overflow-hidden w-full"
      style={{ 
        background: colors.surface,
        border: `1px solid ${colors.border}`
      }}
    >
      {/* 头部 */}
      <div className="p-4 border-b" style={{ borderColor: colors.border }}>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg shrink-0" style={{ background: `${data.labelColor}15` }}>
            <Icon className="w-5 h-5" style={{ color: data.labelColor }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span 
                className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border"
                style={{ 
                  backgroundColor: `${data.labelColor}15`, 
                  color: data.labelColor,
                  borderColor: `${data.labelColor}30`
                }}
              >
                {data.label}
              </span>
              <span className="text-[10px]" style={{ color: colors.textMuted }}>{data.riskLevel}</span>
            </div>
            <h3 className="text-lg font-bold truncate" style={{ color: colors.text }}>{data.title}</h3>
          </div>
        </div>
      </div>
      
      {/* 内容 - 横向网格布局 */}
      <div className="p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* 左侧：触发点 + 发展脉络 */}
          <div className="space-y-4">
            {/* 触发点 */}
            <div 
              className="p-3 rounded-lg border-l-2"
              style={{ 
                background: `${data.labelColor}08`,
                borderLeftColor: data.labelColor
              }}
            >
              <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: data.labelColor }}>
                触发点
              </div>
              <p className="text-xs leading-relaxed" style={{ color: colors.text }}>{data.trigger}</p>
            </div>
            
            {/* 发展脉络 */}
            <div className="p-3 rounded-lg" style={{ background: colors.header }}>
              <div className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: colors.secondary }}>
                发展脉络
              </div>
              <div className="space-y-1.5 max-h-[180px] overflow-y-auto custom-scrollbar">
                {data.timeline.map((item: string, i: number) => (
                  <div key={i} className="flex gap-2 text-xs" style={{ color: colors.textMuted }}>
                    <ChevronRight className="w-3 h-3 mt-0.5 shrink-0" style={{ color: colors.secondary }} />
                    <span className="leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* 右侧：当前阶段 + 管理含义 + 后续要求 */}
          <div className="space-y-4">
            {/* 当前阶段 */}
            <div 
              className="p-3 rounded-lg"
              style={{ background: colors.header }}
            >
              <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: colors.secondary }}>
                当前阶段
              </div>
              <p className="text-xs leading-relaxed" style={{ color: colors.text }}>{data.current}</p>
            </div>
            
            {/* 管理含义 */}
            <div 
              className="p-3 rounded-lg"
              style={{ background: colors.header }}
            >
              <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: colors.success }}>
                管理含义
              </div>
              <p className="text-xs leading-relaxed" style={{ color: colors.textMuted }}>{data.meaning}</p>
            </div>
            
            {/* 后续要求 */}
            <div className="p-3 rounded-lg" style={{ background: colors.header }}>
              <div className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: colors.warning }}>
                后续要求
              </div>
              <div className="space-y-1.5">
                {data.requirements.filter((req: string) => !req.includes('尽快对接平台侧')).map((req: string, i: number) => (
                  <div key={i} className="flex gap-2 text-xs" style={{ color: colors.textMuted }}>
                    <CheckCircle2 className="w-3 h-3 mt-0.5 shrink-0" style={{ color: colors.warning }} />
                    <span className="leading-relaxed">{req}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============ 主组件 ============

const DashboardAprilPage: React.FC = () => {
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [expandedDept, setExpandedDept] = useState<string | null>(null);

  const toggleModule = (id: string) => {
    setExpandedModules(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  // 豆瓣热度图配置
  const heatChartOption: EChartsOption = {
    color: [colors.accent],
    backgroundColor: 'transparent',
    grid: { left: 80, right: 80, top: 20, bottom: 20 },
    xAxis: {
      type: 'value',
      max: 5000,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { show: false },
      splitLine: { show: false }
    },
    yAxis: {
      type: 'category',
      data: doubanHeatData.map(d => d.name).reverse(),
      axisLine: { lineStyle: { color: colors.border } },
      axisTick: { show: false },
      axisLabel: { color: colors.text, fontSize: 11 }
    },
    series: [{
      type: 'bar',
      data: doubanHeatData.map(d => ({
        value: d.heat,
        itemStyle: {
          color: {
            type: 'linear' as const,
            x: 0, y: 0, x2: 1, y2: 0,
            colorStops: [
              { offset: 0, color: d.color },
              { offset: 1, color: `${d.color}60` }
            ]
          },
          borderRadius: [0, 4, 4, 0]
        }
      })).reverse(),
      barWidth: 12,
      label: {
        show: true,
        position: 'right',
        formatter: (params: any) => {
          const item = doubanHeatData[9 - params.dataIndex];
          return `{value|${params.value}} {change|${item.changeValue}}`;
        },
        rich: {
          value: { color: colors.text, fontSize: 11, fontWeight: 'bold' },
          change: { color: colors.textMuted, fontSize: 10 }
        }
      }
    }]
  };

  // 部门风险雷达图配置
  const radarChartOption: EChartsOption = {
    color: [colors.accent],
    backgroundColor: 'transparent',
    radar: {
      indicator: departmentRisks.map(d => ({ name: d.name, max: 60 })),
      axisName: { color: colors.textMuted, fontSize: 10 },
      splitArea: {
        areaStyle: { color: [colors.surface, colors.header] }
      },
      axisLine: { lineStyle: { color: colors.border } },
      splitLine: { lineStyle: { color: colors.border } }
    },
    series: [{
      type: 'radar',
      data: [{
        value: departmentRisks.map(d => d.to),
        name: '风险量级',
        areaStyle: { color: `${colors.accent}40` },
        lineStyle: { color: colors.accent, width: 2 },
        itemStyle: { color: colors.accent }
      }]
    }]
  };

  return (
    <>
      <style jsx global>{`
        .tech-font {
          font-family: Orbitron, Inter, 'DIN Alternate', 'Arial Narrow', 'Microsoft YaHei', 'PingFang SC', sans-serif;
        }
        
        ::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        ::-webkit-scrollbar-track {
          background: ${colors.bg};
        }
        ::-webkit-scrollbar-thumb {
          background: ${colors.border};
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: ${colors.textMuted};
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${colors.border};
          border-radius: 10px;
        }
      `}</style>
      
      <style jsx>{`
        .dashboard-container {
          min-height: 100vh;
          background: ${colors.bg};
          font-family: 'Inter', sans-serif;
        }
        .glass-card {
          background: ${colors.surface};
          border: 1px solid ${colors.border};
          border-radius: 12px;
          box-shadow: 0 0 15px rgba(249, 115, 22, 0.05);
        }
        .metric-value {
          font-family: 'Orbitron', 'Inter', sans-serif;
          font-weight: 700;
          letter-spacing: -0.02em;
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.4); }
          50% { box-shadow: 0 0 0 10px rgba(249, 115, 22, 0); }
        }
        .pulse-orange {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>

      <div className="dashboard-container" style={{ color: colors.text }}>
        {/* Header */}
        <header 
          className="w-full border-b"
          style={{ background: `${colors.surface}80`, borderColor: colors.border, backdropFilter: 'blur(10px)' }}
        >
          <div className="max-w-[1600px] mx-auto px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight tech-font" style={{ color: colors.text }}>
                  听潮阁 <span style={{ color: colors.accent }}>2026年4月</span> 舆情监控
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest" style={{ color: colors.textMuted }}>
                <Signal className="w-3 h-3" style={{ color: colors.success }} />
                <span>系统正常</span>
              </div>
              <div 
                className="flex items-center gap-2 px-3 py-1.5 rounded-full pulse-orange"
                style={{ 
                  background: `${colors.accent}15`,
                  color: colors.accent,
                  border: `1px solid ${colors.accent}40`
                }}
              >
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: colors.accent }} />
                <span className="text-[10px] font-bold uppercase tracking-wider">高敏监控中</span>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-[1600px] mx-auto p-6 space-y-6">
          
          {/* 核心指标 KPI */}
          <section className="grid grid-cols-3 md:grid-cols-5 gap-3">
            {kpiData.map((kpi, index) => (
              <KPICard key={kpi.label} {...kpi} delay={index * 200} />
            ))}
          </section>

          {/* 核心结论摘要 */}
          <section className="glass-card p-5">
            <div className="flex items-start gap-3">
              <Cpu className="w-5 h-5 mt-0.5 shrink-0" style={{ color: colors.accent }} />
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: colors.accent }}>
                  本月核心结论
                </div>
                <p className="text-sm leading-relaxed" style={{ color: colors.textMuted }}>
                  4月整体风险较Q1<span style={{ color: colors.success }}>持续回落</span>，未出现破圈大事件，但仍不属于低风险月份。
                  风险触发点从"头部主播个人违规"转向<span style={{ color: colors.warning }}>"公司规则设计、资源协调、治理能力"</span>。
                  当前最大风险是<span className="font-semibold" style={{ color: colors.accent }}>姜添数据争议的长尾影响</span>，
                  已经形成"主播争议拖累公司机制公信力"的负面解读。
                </p>
              </div>
            </div>
          </section>

          {/* 各类事件时间脉络模块 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5" style={{ color: colors.accent }} />
              <h2 className="text-base font-bold tech-font tracking-tight" style={{ color: colors.text }}>
                事件时间脉络
              </h2>
              <span className="text-[10px] ml-2" style={{ color: colors.textMuted }}>
                点击展开查看详情
              </span>
            </div>
            
            {allEventModules.map((module) => (
              <EventTimelineModule
                key={module.id}
                data={module}
                isExpanded={expandedModules.includes(module.id)}
                onToggle={() => toggleModule(module.id)}
              />
            ))}
          </section>

          {/* 核心事件详情卡片 */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5" style={{ color: colors.accent }} />
              <h2 className="text-base font-bold tech-font tracking-tight" style={{ color: colors.text }}>
                核心事件详情
              </h2>
            </div>
            <div className="flex flex-col gap-4">
              {coreEventsData.map((event) => (
                <EventDetailCard key={event.id} data={event} />
              ))}
            </div>
          </section>

          {/* 部门归因与场景热力 */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-5">
                <BarChart3 className="w-5 h-5" style={{ color: colors.accent }} />
                <h2 className="text-base font-bold tech-font tracking-tight" style={{ color: colors.text }}>
                  部门归因与场景热力
                </h2>
              </div>
              <div className="space-y-4">
                {departmentRisks.map((dept) => (
                  <div 
                    key={dept.name} 
                    className="p-4 rounded-xl cursor-pointer transition-all"
                    style={{ background: colors.header, border: `1px solid ${colors.border}` }}
                    onClick={() => setExpandedDept(expandedDept === dept.name ? null : dept.name)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold" style={{ color: colors.text }}>{dept.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="metric-value text-lg" style={{ color: dept.change > 0 ? colors.accent : colors.success }}>
                          {dept.trend}
                        </span>
                        <span 
                          className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                          style={{ 
                            backgroundColor: dept.change > 0 ? `${colors.accent}15` : `${colors.success}15`, 
                            color: dept.change > 0 ? colors.accent : colors.success 
                          }}
                        >
                          {dept.change > 0 ? '+' : ''}{dept.change}%
                        </span>
                      </div>
                    </div>
                    <div className="text-[10px] mb-3" style={{ color: colors.textMuted }}>{dept.description}</div>
                    <CompareProgressBar from={dept.from} to={dept.to} max={60} />
                    {expandedDept === dept.name && (
                      <div className="mt-4 pt-4 space-y-3" style={{ borderTop: `1px solid ${colors.border}` }}>
                        <div className="text-[10px] uppercase tracking-widest" style={{ color: colors.textMuted }}>当前状态</div>
                        <p className="text-xs" style={{ color: colors.textMuted }}>{dept.status}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 风险分布已移除 */}
          </section>

          {/* 豆瓣讨论热度 */}
          <section className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" style={{ color: colors.accent }} />
                <h2 className="text-base font-bold tech-font tracking-tight" style={{ color: colors.text }}>
                  豆瓣舆情分析
                </h2>
              </div>
              <span className="text-[10px] uppercase tracking-widest" style={{ color: colors.textMuted }}>
                讨论热度TOP10
              </span>
            </div>
            <div className="h-[300px]">
              <ReactECharts option={heatChartOption} style={{ height: '100%' }} />
            </div>
          </section>

          {/* 5月动作板 */}
          <section className="glass-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <Flag className="w-5 h-5" style={{ color: colors.accent }} />
              <h2 className="text-lg font-bold tech-font tracking-tight" style={{ color: colors.text }}>
                5月动作板
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {tasks.map((task, index) => (
                <div 
                  key={index} 
                  className="p-4 rounded-xl transition-all hover:-translate-y-1"
                  style={{ background: colors.header, border: `1px solid ${colors.border}` }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span 
                      className="text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded"
                      style={{ 
                        backgroundColor: `${task.labelColor}15`, 
                        color: task.labelColor,
                        border: `1px solid ${task.labelColor}30`
                      }}
                    >
                      {task.label}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider" style={{ color: colors.textMuted }}>{task.meaning}</span>
                  </div>
                  <p className="text-sm leading-relaxed mb-3" style={{ color: colors.text }}>{task.content}</p>

                </div>
              ))}
            </div>
          </section>

        </main>

        {/* Footer */}
        <footer 
          className="w-full mt-8 border-t"
          style={{ background: `${colors.bg}80`, borderColor: colors.border }}
        >
          <div className="max-w-[1600px] mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <StatusIndicator color={colors.success} pulse />
                <span className="text-[10px] uppercase tracking-widest" style={{ color: colors.textMuted }}>系统正常</span>
              </div>
              <span className="text-[10px]" style={{ color: colors.textMuted }}>
                数据更新: 2026-04-30 23:59
              </span>
            </div>
            <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest" style={{ color: colors.textMuted }}>
              <span className="tech-font">TINGCHAOGECLOUD v2.6.0</span>
              <span style={{ opacity: 0.3 }}>|</span>
              <span>节点: CN-SH-01</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default DashboardAprilPage;
