import React, { useState, useEffect, useRef } from 'react';
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
  Siren,
  Megaphone,
  Volume2,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  MapPin,
  Calendar,
  Music,
  Gift,
  UserX,
  Crown,
  Video,
  Layers
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

// 1. 危险信号（一）- 司命新歌前奏被质疑抄袭
const dangerSignal1Data = {
  id: 'danger1',
  type: '危险信号（一）',
  title: '「司命」新歌前奏被质疑抄袭《剑网3》',
  icon: Music,
  color: colors.warning,
  events: [
    { id: 'd1a', date: '5月15日上午', phase: '事件爆发', content: '小红书出现"听潮阁抄袭剑网3"质疑内容，网友对比司命新歌《孤剑定三山五岳》前奏与《剑网3》曲目《当战》，质疑前奏高度相似、未获授权' },
    { id: 'd1b', date: '5月15日中午', phase: '舆情发酵', content: '小红书持续发酵，司命粉丝情绪升高，暂停司命开播观察趋势；法务/音乐/舆情判断仅前奏听感相似、词曲不重叠' },
    { id: 'd1c', date: '5月15日下午', phase: '公司介入', content: '大小秘书投诉量上升，用户诉求集中在要求公告、澄清、下架；最终拉齐口径：承认前奏听感相似，为审核问题致歉，申请下架争议歌曲' },
    { id: 'd1d', date: '5月15日晚间', phase: '公告发布', content: '发布公告致歉，明确：争议仅集中在前奏、歌曲主体不构成抄袭、下架争议版本整改、内部追责、司命仅参与演唱不参与词曲编曲' },
    { id: 'd1e', date: '5月16-18日', phase: '逐步回落', content: '舆论在大秘书、小红书、抖音继续发酵，讨论扩展至"公司是否明知故犯""司命是否知情"，随后热度逐步回落，进入阶段性收尾' },
    { id: 'd1f', date: '当前状态', phase: '阶段性收尾', content: '已下架争议版本、完成内部追责，但外部仍可能存在长尾追问，需统一口径回应' },
  ]
};

// 2. 吐槽主播类（一）- 澈清&六月PK局误拉节奏
const tucao1Data = {
  id: 'tucao1',
  type: '吐槽主播类（一）',
  title: '「澈清&六月」PK局误拉节奏事件',
  icon: Crown,
  color: colors.accent,
  events: [
    { id: 't1a', date: '前置背景', phase: '前置矛盾', content: '六月与皮皮猪存在旧节奏，双方粉丝对同局互动敏感；澈清与六月过往关系深厚，外界认为六月曾扶持澈清' },
    { id: 't1b', date: '5月20日晚', phase: '事件发生', content: '澈清将六月拉入已有皮皮猪在场的PK局，引发六月粉丝不满；局内出现尴尬讨论，六月被迫打完比赛' },
    { id: 't1c', date: 'PK结束后', phase: '争议升级', content: '粉丝认为澈清未第一时间公开解释道歉，反而继续正常直播，争议升级为对澈清处理方式的不满' },
    { id: 't1d', date: '5月21-22日', phase: '主播回应', content: '六月克制回应安抚粉丝，但粉丝感知到其委屈疲惫，进一步强化舆论情绪' },
    { id: 't1e', date: '5月22-23日', phase: '大字报发酵', content: '抖音出现大量大字报，形成支持六月、替澈清解释、认为双方粉丝被拱火三类观点，已完成高热内容清理' },
    { id: 't1f', date: '当前状态', phase: '暂时平息', content: '高热内容已清理，粉丝撕裂暂告一段落，但暴露出主播组局需要提前规避旧矛盾的管理短板' },
  ]
};

// 3. 体验作为类（一）- 徐来&崔十八队决季规则争议
const tiyan1Data = {
  id: 'tiyan1',
  type: '体验作为类（一）',
  title: '「徐来&崔十八」《队决季》比赛争议',
  icon: Video,
  color: colors.secondary,
  events: [
    { id: 'ty1a', date: '前置背景', phase: '前置矛盾', content: '崔十八是礼厅开创型主播，徐来是后起高流水主播，双方粉丝本就存在资历与流水的隐性比较' },
    { id: 'ty1b', date: '5月11日晚', phase: '规则争议', content: '队决季比赛要求20:00整下播，徐来队卡点20:00:00下播，崔十八队20:00:59下播，双方围绕成绩有效性、规则公平性产生分歧' },
    { id: 'ty1c', date: '争议发酵', phase: '争议升级', content: '双方围绕公平性持续争议，旧的公会赛、拉票争议被重新串联，逐步升级为"崔十八被针对""徐来被质疑"的对立' },
    { id: 'ty1d', date: '后续', phase: '外溢讨论', content: '争议从规则扩展到主播关系、礼厅内部排序，双方粉丝互相攻击，成为长期积怨的集中释放' },
    { id: 'ty1e', date: '当前状态', phase: '争议暂歇', content: '争议暂歇，积怨未完全消除，暴露出同厅赛事规则必须提前明确口径的管理要求' },
  ]
};

// 4. 吐槽主播类（二）- T.唐瘾多线程情感争议
const tucao2Data = {
  id: 'tucao2',
  type: '吐槽主播类（二）',
  title: '「T.唐瘾」多线程情感争议',
  icon: UserX,
  color: colors.accent,
  events: [
    { id: 't2a', date: '前期背景', phase: '长期私联', content: '唐瘾自2025年8-9月起与粉丝私联，以亲密称呼互动，同时疑似对多名女性粉丝保持同类关系' },
    { id: 't2b', date: '5月6日', phase: '粉丝投诉', content: '粉丝向大秘书投诉T.唐瘾长期与自己保持恋爱暧昧关系并获得经济支持，同时疑似同时维护多名女性粉丝' },
    { id: 't2c', date: '5月8-14日', phase: '争议扩散', content: '公司要求唐瘾说明问题、补充证据，但唐瘾不愿公开承认处理不当，导致投诉方保留发声空间；争议向抖音扩散，以大字报形式发酵' },
    { id: 't2d', date: '当前状态', phase: '风险未闭环', content: '已安排唐瘾停播止损，事件未闭环，投诉方仍有继续爆料风险；暴露出主播私联粉丝、利用亲密关系诱导消费的合规风险' },
  ]
};

// 5. 危险信号（二）- 饶子粉丝追问奖励兑现
const dangerSignal2Data = {
  id: 'danger2',
  type: '危险信号（二）',
  title: '「饶子」粉丝追问奖励兑现与商务资源',
  icon: Gift,
  color: colors.warning,
  events: [
    { id: 'd2a', date: '前期积累', phase: '权益积压', content: '2024年生日单曲延期、2025年6月承诺的团综/单曲、大电人项目进度长期无明确进展，粉丝形成"承诺多、落地慢、解释少"的不满' },
    { id: 'd2b', date: '5月19日', phase: '集中追问', content: '以英雄召唤夜奖励兑现滞后为爆点引发集中追问，粉丝核心追问：排名奖励落地进度、歌曲奖励推进情况、综艺排期、过往承诺为何无进展' },
    { id: 'd2c', date: '5月20-21日', phase: '公平性质疑', content: '事件升级为"资源公平性"质疑，粉丝认为饶子公会赛、流水、粉丝贡献突出，但获得的商务、宣发、资源扶持不足' },
    { id: 'd2d', date: '后续发酵', phase: '系统性不信任', content: '粉丝诉求扩展至资源分配逻辑：主动上门商务未落地、缺少个人代言、资源向其他主播倾斜，舆论转向对公司资源配置机制的系统性不信任' },
    { id: 'd2e', date: '当前状态', phase: '风险未闭环', content: '粉丝已形成"饶子被区别对待"的固化认知，风险未完全闭环，需明确各项奖励的兑现节点' },
  ]
};

// 6. 危险信号（三）- 梦响营朔朔大王未成年身份
const dangerSignal3Data = {
  id: 'danger3',
  type: '危险信号（三）',
  title: '「梦响营朔朔大王」未成年身份入会',
  icon: AlertCircle,
  color: colors.warning,
  events: [
    { id: 'd3a', date: '5月13日', phase: '线索曝光', content: '外部出现疑似未成年线索，包含过往视频中年龄、生日、青少年比赛相关内容，已有粉丝察觉讨论，存在放大风险' },
    { id: 'd3b', date: '5月13日中午', phase: '内部复核', content: '内部复核发现，平台实名、财务登记、收款主体等多个信息不一致，事件升级为"身份真实性无法确认"' },
    { id: 'd3c', date: '5月13日下午', phase: '风险外溢', content: '风险外溢至线下：朔朔大王曾参与线下活动，被提及与男主播同住同行，若放大将升级为"未成年参与线下活动"的高敏舆情' },
    { id: 'd3d', date: '5月14-15日', phase: '完成清退', content: '要求补充身份证明，但材料前后矛盾，无法通过官方方式核验；因不符合主播合规要求，解除合作，完成清退、下线相关标识' },
    { id: 'd3e', date: '5月26日后', phase: '长尾管理', content: '朔朔大王申请补充材料回归，公司因前期信息异常、沟通风险拒绝，转为长尾管理' },
    { id: 'd3f', date: '当前状态', phase: '监控中', content: '已完成清退止损，转为长尾风险监控；暴露出主播入会审核不严的合规漏洞' },
  ]
};

// 7. 体验作为类（二）- 凌音/凌熙厅作品问题
const tiyan2Data = {
  id: 'tiyan2',
  type: '体验作为类（二）',
  title: '「凌音/凌熙」厅作品问题',
  icon: Layers,
  color: colors.secondary,
  events: [
    { id: 'ty2a', date: '凌音线', phase: '萨满争议', content: '公会赛结算感谢作品中，萨满作为头部高流水主播，被粉丝认为缺少单人镜头、单独立绘、明确C位，粉丝认为高贡献未获得对应呈现' },
    { id: 'ty2b', date: '凌熙线', phase: 'Js争议', content: 'Js粉丝投诉其长期缺席大头作品、个人作品断更、新立绘未使用、banner安排不合理，诉求延伸至要求公开作品准入、站位、宣发的标准' },
    { id: 'ty2c', date: '凌熙线', phase: '姜添争议', content: '姜添粉丝投诉大头分配不均、banner安排、合唱音量被调小，和Js事件共同指向作品分配标准不透明的问题' },
    { id: 'ty2d', date: '其他问题', phase: '叠加瑕疵', content: '启作品AI使用问题、凌熙作品出现AI水印后重发等单点瑕疵，叠加后强化"上线前审核不足"的整体印象' },
    { id: 'ty2e', date: '当前状态', phase: '调整中', content: '部分调整已完成，凌熙已完成banner调整和主播安抚，风险仍可能反复；暴露出厅作品上线前舆情校验不足的问题' },
  ]
};

// 8. 长尾舆情
const longTailData = {
  id: 'longtail',
  type: '长尾舆情',
  title: '多项持续风险点',
  icon: Volume2,
  color: colors.success,
  events: [
    { id: 'l1', date: '持续监控', phase: '维权追问', content: '《剑网3》抄袭事件后续维权追问' },
    { id: 'l2', date: '持续监控', phase: '群名风险', content: '徐来"不当"粉丝群名风险' },
    { id: 'l3', date: '持续监控', phase: '版权争议', content: 'AI歌曲及AI作品版权争议' },
    { id: 'l4', date: '持续监控', phase: '长尾发声', content: '梦响营朔朔大王清退后的长尾发声/线下细节复炒风险' },
    { id: 'l5', date: '持续监控', phase: '对比触发', content: '饶子资源争议后续对比触发风险' },
  ]
};

// 所有事件模块数据（按危险信号→吐槽主播→体验作为顺序）
const allEventModules = [
  dangerSignal1Data, 
  dangerSignal2Data, 
  dangerSignal3Data, 
  tucao1Data, 
  tucao2Data, 
  tiyan1Data, 
  tiyan2Data, 
  longTailData
];

// ============ KPI数据 ============
const kpiData = [
  { label: '风险投诉量', value: 104, color: colors.accent, icon: AlertTriangle },
  { label: '核心舆情', value: 0, color: colors.accent, icon: Flame },
  { label: '危险信号', value: 3, color: colors.warning, icon: Siren },
  { label: '吐槽主播', value: 85, color: colors.danger, icon: Megaphone },
  { label: '体验作为', value: 17, color: colors.secondary, icon: Video },
];

// 部门风险数据
const departmentRisks = [
  { 
    name: '事业一部', 
    events: 6, 
    description: '本月主要承压部门，涉及司命抄袭争议、饶子奖励争议、澈清六月PK争议、T.唐瘾情感争议、队决季争议、凌音凌熙厅作品问题', 
    status: '高风险'
  },
  { 
    name: '事业二部', 
    events: 1, 
    description: '仅1起高敏感事件：梦响营朔朔大王未成年身份问题，触及未成年合规红线', 
    status: '中风险'
  },
];

// 豆瓣讨论热度数据
const doubanHeatData = [
  { name: '徐来', heat: 3200, change: 'up', changeValue: '升至第一', color: colors.accent },
  { name: '六月', heat: 2800, change: 'steady', changeValue: '维持高位', color: colors.warning },
  { name: '澈清', heat: 2500, change: 'up', changeValue: '明显上升', color: colors.warning },
  { name: '萨满', heat: 1800, change: 'down', changeValue: '回落至出事前', color: colors.success },
  { name: '姜添', heat: 1600, change: 'down', changeValue: '回落至出事前', color: colors.success },
  { name: '饶子', heat: 1200, change: 'down', changeValue: '明显下降', color: colors.success },
  { name: '崔十八', heat: 1000, change: 'down', changeValue: '明显下降', color: colors.success },
];

// 6月动作板任务
const tasks = [
  { priority: 'p1', label: '制度建设', labelColor: colors.accent, meaning: '核心紧急', content: '落地音乐/AI/作品上线前审核SOP，建立厅作品"上线前内容审核+舆情校验+权益核对"发布机制' },
  { priority: 'p1', label: '权益管理', labelColor: colors.accent, meaning: '核心紧急', content: '建立粉丝权益兑现台账，将所有未落地的奖励、商务、作品事项整理入库，明确责任人、交付节点' },
  { priority: 'p1', label: '赛事筹备', labelColor: colors.warning, meaning: '重点推进', content: '对后续重要赛事提前明确规则口径，提前规避模糊空间，避免引发公平性质疑' },
  { priority: 'p1', label: '合规排查', labelColor: colors.warning, meaning: '重点推进', content: '开展全平台主播合规排查，覆盖主播入会身份核验、主播私联边界、主播组局避嫌、粉丝群命名合规' },
];

// 核心事件详细数据（按危险信号→吐槽主播→体验作为顺序）
const coreEventsData = [
  // 危险信号一二三
  {
    id: 'event1',
    label: '',
    labelColor: colors.warning,
    title: '司命新歌前奏被质疑抄袭《剑网3》事件',
    icon: Music,
    riskLevel: '⚠️危险信号（外部扩散性最强）',
    trigger: '2026年5月15日上午，小红书出现"听潮阁抄袭剑网3"质疑内容，网友对比司命新歌《孤剑定三山五岳》前奏与《剑网3》曲目《当战》，质疑前奏高度相似、未获授权。',
    timeline: [
      '5/15中午：小红书持续发酵，司命粉丝情绪升高，暂停司命开播观察趋势；法务/音乐/舆情判断仅前奏听感相似、词曲不重叠',
      '5/15下午：大小秘书投诉量上升，用户诉求集中在要求公告、澄清、下架；最终拉齐口径：承认前奏听感相似，为审核问题致歉，申请下架争议歌曲',
      '5/15晚间：发布公告致歉，明确：争议仅集中在前奏、歌曲主体不构成抄袭、下架争议版本整改、内部追责、司命仅参与演唱不参与词曲编曲',
      '5/16-5/18：舆论在大秘书、小红书、抖音继续发酵，讨论扩展至"公司是否明知故犯""司命是否知情"，随后热度逐步回落'
    ],
    current: '阶段性收尾，已下架争议版本、完成内部追责，但外部仍可能存在长尾追问，需统一口径回应潜在追问。',
    meaning: '暴露公司自制音乐在demo风险反馈、原创性审核和上线复核方面存在流程缺口，若不整改容易外溢为对公司创作能力与管理可信度的质疑。',
    requirements: [
      '统一口径，压实音乐内容审核SOP',
      '避免版权争议进一步发酵',
      '建立作品上线前舆情校验机制'
    ]
  },
  {
    id: 'event2',
    label: '',
    labelColor: colors.warning,
    title: '饶子粉丝追问奖励兑现与商务资源',
    icon: Gift,
    riskLevel: '⚠️危险信号（固化认知风险）',
    trigger: '前期饶子多项权益兑现周期拉长、沟通不足，粉丝积压不满；2026年5月19日前后以英雄召唤夜奖励兑现滞后为爆点引发集中追问。',
    timeline: [
      '前期积累：2024年生日单曲延期、2025年6月承诺的团综/单曲、大电人项目进度长期无明确进展，粉丝形成"承诺多、落地慢、解释少"的不满',
      '5/19：粉丝核心追问：英雄召唤夜排名奖励落地进度、歌曲奖励推进情况、综艺排期、过往承诺为何无进展',
      '5/20-5/21：事件升级为"资源公平性"质疑，粉丝认为饶子公会赛、流水、粉丝贡献突出，但获得的商务、宣发、资源扶持不足',
      '后续发酵：粉丝诉求扩展至资源分配逻辑，舆论转向对公司资源配置机制的系统性不信任'
    ],
    current: '粉丝已形成"饶子被区别对待"的固化认知，风险未完全闭环。缺少明确节点的权益承诺，容易从单一催进度升级为信任危机。',
    meaning: '缺少明确节点的权益承诺，容易从单一催进度升级为信任危机，粉丝会将长期未落地事项统一归因为公司重视不足。',
    requirements: [
      '明确各项奖励的兑现节点',
      '同步降低商务宣发的对比风险',
      '建立粉丝权益兑现台账',
      '避免固化认知进一步强化'
    ]
  },
  {
    id: 'event3',
    label: '',
    labelColor: colors.warning,
    title: '梦响营朔朔大王未成年身份入会',
    icon: AlertCircle,
    riskLevel: '⚠️危险信号（触及合规红线）',
    trigger: '外部线索曝光朔朔大王小号长期暴露年龄信息，指向其为未成年人。',
    timeline: [
      '5/13：外部出现疑似未成年线索，包含过往视频中年龄、生日、青少年比赛相关内容，已有粉丝察觉讨论，存在放大风险',
      '5/13中午：内部复核发现，平台实名、财务登记、收款主体等多个信息不一致，事件升级为"身份真实性无法确认"',
      '5/13下午：风险外溢至线下：朔朔大王曾参与线下活动，被提及与男主播同住同行，若放大将升级为"未成年参与线下活动"的高敏舆情',
      '5/14-5/15：要求补充身份证明，但材料前后矛盾，无法通过官方方式核验；因不符合主播合规要求，解除合作，完成清退',
      '5/26后：朔朔大王申请补充材料回归，公司因前期信息异常、沟通风险拒绝，转为长尾管理'
    ],
    current: '已完成清退止损，转为长尾风险监控。若后续外部复炒，围绕"身份信息复核不通过、无法满足合规要求"回应，避免放大未成年、线下等高敏标签。',
    meaning: '暴露公司主播入会审核不严的合规漏洞，未成年、线下住宿属于高敏风险点，容易引发监管层面的问题。',
    requirements: [
      '全面修复入会审核机制',
      '监控朔朔大王发声风险',
      '避免放大未成年、线下等高敏标签'
    ]
  },
  // 吐槽主播一二
  {
    id: 'event4',
    label: '',
    labelColor: colors.accent,
    title: '澈清&六月PK局误拉节奏事件',
    icon: Crown,
    riskLevel: '🔥吐槽主播类（粉丝撕裂）',
    trigger: '5月20日晚，澈清将六月拉入已有皮皮猪（六月与皮皮猪存在旧矛盾）在场的PK局，引发六月粉丝不满。',
    timeline: [
      '前置背景：六月与皮皮猪存在旧节奏，双方粉丝对同局互动敏感；澈清与六月过往关系深厚，外界认为六月曾扶持澈清',
      '5/20晚：澈清拉人入局后，局内出现尴尬讨论，六月被迫打完比赛，粉丝认为澈清未提前判断风险',
      'PK结束后：粉丝认为澈清未第一时间公开解释道歉，反而继续正常直播，争议升级为对澈清处理方式的不满',
      '5/21-5/22：六月克制回应安抚粉丝，但粉丝感知到其委屈疲惫，进一步强化舆论情绪',
      '5/22-5/23：抖音出现大量大字报，形成支持六月、替澈清解释、认为双方粉丝被拱火三类观点，已完成高热内容清理'
    ],
    current: '高热内容已清理，粉丝撕裂暂告一段落。但暴露出主播组局需要提前规避旧矛盾，满足粉丝对关系的预期；出现问题后需要及时通过正主沟通降温。',
    meaning: '主播组局需要提前规避旧矛盾，满足粉丝对关系的预期；出现问题后需要及时通过正主沟通降温，仅强调"无心之失"无法止损。',
    requirements: [
      '后续类似问题需快速推动主播沟通，缓解粉丝情绪',
      '避免长期粉丝撕裂',
      '建立主播组局避嫌机制'
    ]
  },
  {
    id: 'event5',
    label: '',
    labelColor: colors.accent,
    title: 'T.唐瘾多线程情感争议',
    icon: UserX,
    riskLevel: '🔥吐槽主播类（触及合规底线）',
    trigger: '2026年5月6日，粉丝向大秘书投诉T.唐瘾长期与自己保持恋爱暧昧关系并获得经济支持，同时疑似同时维护多名女性粉丝。',
    timeline: [
      '前期背景：唐瘾自2025年8-9月起与该粉丝私联，以亲密称呼互动，同时疑似对多名女性粉丝保持同类关系',
      '5/6：粉丝投诉后，公司要求唐瘾说明问题、补充证据，但唐瘾不愿公开承认处理不当，导致投诉方保留发声空间，未能早期截断风险',
      '5/8-5/14：争议向抖音扩散，以大字报形式发酵，投诉方诉求升级为要求当面线下沟通'
    ],
    current: '已安排唐瘾停播止损，事件未闭环，投诉方仍有继续爆料风险。主播私联粉丝、利用亲密关系诱导消费属于触及合规底线的风险。',
    meaning: '主播私联粉丝、利用亲密关系诱导消费属于触及合规底线的风险，早期处理不当容易外溢为对公司管理的质疑。',
    requirements: [
      '根据投诉方发声风险、主播配合程度，评估是否进一步下T标识',
      '考虑去公会关联甚至清退',
      '避免个人争议影响公司声誉'
    ]
  },
  // 体验作为一二
  {
    id: 'event6',
    label: '',
    labelColor: colors.secondary,
    title: '徐来&崔十八《队决季》比赛争议',
    icon: Video,
    riskLevel: '🔵体验作为类（规则争议）',
    trigger: '2026年5月11日晚队决季比赛，要求20:00整下播，徐来队卡点20:00:00下播，崔十八队20:00:59下播，双方围绕成绩有效性、规则公平性产生分歧。',
    timeline: [
      '前置背景：崔十八是礼厅开创型主播，徐来是后起高流水主播，双方粉丝本就存在资历与流水的隐性比较',
      '5/11晚：时间偏差引发争议：徐来粉丝要求严格执行规则，崔十八粉丝认为规则存在解释空间',
      '争议发酵：双方围绕公平性持续争议，旧的公会赛、拉票争议被重新串联，逐步升级为"崔十八被针对""徐来被质疑"的对立',
      '外溢讨论：争议从规则扩展到主播关系、礼厅内部排序，双方粉丝互相攻击，成为长期积怨的集中释放'
    ],
    current: '争议暂歇，积怨未完全消除。暴露出同厅赛事规则必须提前明确口径的管理要求。',
    meaning: '同厅赛事规则必须提前明确口径，模糊规则会被解读为偏袒或双标，引爆粉丝长期积怨。',
    requirements: [
      '后续同厅活动需提前明确规则口径',
      '避免同类争议反复发生',
      '建立赛事规则前置确认机制'
    ]
  },
  {
    id: 'event7',
    label: '',
    labelColor: colors.secondary,
    title: '凌音/凌熙厅作品问题',
    icon: Layers,
    riskLevel: '🔵体验作为类（作品分配争议）',
    trigger: '凌音萨满粉丝、凌熙Js粉丝先后针对厅作品内容安排发起投诉，多厅作品瑕疵叠加引发集中质疑。',
    timeline: [
      '凌音线（萨满争议）：公会赛结算感谢作品中，萨满作为头部高流水主播，被粉丝认为缺少单人镜头、单独立绘、明确C位，粉丝认为高贡献未获得对应呈现',
      '凌熙线（Js争议）：Js粉丝投诉其长期缺席大头作品、个人作品断更、新立绘未使用、banner安排不合理，诉求延伸至要求公开作品准入、站位、宣发的标准',
      '凌熙线（姜添争议）：姜添粉丝投诉大头分配不均、banner安排、合唱音量被调小，和Js事件共同指向作品分配标准不透明的问题',
      '其他问题：启作品AI使用问题、凌熙作品出现AI水印后重发等单点瑕疵，叠加后强化"上线前审核不足"的整体印象'
    ],
    current: '部分调整已完成，凌熙已完成banner调整和主播安抚，风险仍可能反复；暴露出厅作品上线前舆情校验不足的问题。',
    meaning: '厅作品不只是审美问题，承载了粉丝对打投回报、主播地位、公司重视度的期待，标准不清容易引发公平性质疑。',
    requirements: [
      '将公会赛结算片、头部主播物料、立绘/banner、歌词镜头分配纳入上线前舆情校验',
      '明确作品分配标准，避免问题外溢为信任危机'
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
  data: typeof dangerSignal1Data; 
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
                {data.type}
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
              {data.label && (
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
              )}
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
                {data.requirements.map((req: string, i: number) => (
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

const DashboardMayPage: React.FC = () => {
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
      max: 4000,
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
          const item = doubanHeatData[6 - params.dataIndex];
          return `{value|${params.value}} {change|${item.changeValue}}`;
        },
        rich: {
          value: { color: colors.text, fontSize: 11, fontWeight: 'bold' },
          change: { color: colors.textMuted, fontSize: 10 }
        }
      }
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
                  听潮阁 <span style={{ color: colors.accent }}>2026年5月</span> 舆情监控
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
                <span className="text-[10px] font-bold uppercase tracking-wider">监控中</span>
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
                  5月整体舆情风险较3月、4月<span style={{ color: colors.success }}>进一步下降</span>，未形成高等级舆情事件。
                  风险集中在<span style={{ color: colors.warning }}>内容审核、权益兑现、厅作品体验和主播基础管理</span>四条线，
                  呈现<span className="font-semibold" style={{ color: colors.accent }}>"单点不大、分布较散、容易累积成公司管理质疑"</span>的特点。
                  5月不是高风险爆发月，而是一次<span style={{ color: colors.secondary }}>"管理链路体检月"</span>。
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

          {/* 部门归因与风险分布 */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-5">
                <BarChart3 className="w-5 h-5" style={{ color: colors.accent }} />
                <h2 className="text-base font-bold tech-font tracking-tight" style={{ color: colors.text }}>
                  部门风险分布
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
                        <span 
                          className="text-2xl font-bold metric-value"
                          style={{ color: dept.events >= 5 ? colors.accent : colors.warning }}
                        >
                          {dept.events}
                        </span>
                        <span 
                          className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                          style={{ 
                            backgroundColor: dept.status === '高风险' ? `${colors.accent}15` : `${colors.warning}15`, 
                            color: dept.status === '高风险' ? colors.accent : colors.warning 
                          }}
                        >
                          {dept.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-[10px] mb-3" style={{ color: colors.textMuted }}>{dept.description}</div>
                    {expandedDept === dept.name && (
                      <div className="mt-4 pt-4 space-y-3" style={{ borderTop: `1px solid ${colors.border}` }}>
                        <div className="text-[10px] uppercase tracking-widest" style={{ color: colors.textMuted }}>核心问题</div>
                        <p className="text-xs" style={{ color: colors.textMuted }}>{dept.description}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 风险分布已移除 */}
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" style={{ color: colors.accent }} />
                  <h2 className="text-base font-bold tech-font tracking-tight" style={{ color: colors.text }}>
                    豆瓣舆情分析
                  </h2>
                </div>
                <span className="text-[10px] uppercase tracking-widest" style={{ color: colors.textMuted }}>
                  讨论热度TOP7
                </span>
              </div>
              <div className="h-[280px]">
                <ReactECharts option={heatChartOption} style={{ height: '100%' }} />
              </div>
            </div>
          </section>

          {/* 6月动作板 */}
          <section className="glass-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <Flag className="w-5 h-5" style={{ color: colors.accent }} />
              <h2 className="text-lg font-bold tech-font tracking-tight" style={{ color: colors.text }}>
                6月动作板
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
                  <p className="text-sm leading-relaxed" style={{ color: colors.text }}>{task.content}</p>
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
                数据更新: 2026-05-31 23:59
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

export default DashboardMayPage;
