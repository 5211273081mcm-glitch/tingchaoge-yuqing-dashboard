import React, { useState, useEffect, useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import {
  Target,
  Flag,
  BarChart3,
  Clock,
  ChevronDown,
  ChevronRight,
  Cpu,
  Signal,
  Users,
  CheckCircle2,
  ListChecks,
  PieChart,
  TrendingUp,
  AlertCircle,
  Gavel,
  Crosshair,
} from 'lucide-react';

import {
  colors,
  kpiData,
  allEventModules,
  coreEventsData,
  departmentRisks,
  topProblems,
  tasks,
  type EventModule,
  type CoreEvent,
} from './augustDashboardData';
import { trendOption, riskRatioOption, riskTypeData, heatChartOption } from './augustChartData';

// ============ 工具函数 ============
const useCountUp = (end: number, duration: number = 1500) => {
  const [count, setCount] = useState(0);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    startTimeRef.current = null;
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

const KPICard: React.FC<{ label: string; value: number; color: string; icon: any; delay: number }> = ({
  label,
  value,
  color,
  icon: Icon,
  delay,
}) => {
  const animatedValue = useCountUp(value, 1500 + delay);

  return (
    <div
      className="relative p-4 rounded-xl group transition-all duration-300 hover:-translate-y-1 flex items-center gap-3"
      style={{
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        boxShadow: '0 0 15px rgba(249, 115, 22, 0.05)',
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
            textShadow: `0 0 20px ${color}40`,
          }}
        >
          {animatedValue}
        </div>
        <div className="text-[9px] uppercase tracking-wider truncate" style={{ color: colors.textMuted }}>
          {label}
        </div>
      </div>
    </div>
  );
};

const StatusIndicator: React.FC<{ color: string; pulse?: boolean }> = ({ color, pulse = false }) => (
  <div className="relative">
    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }} />
    {pulse && (
      <div className="absolute inset-0 rounded-full animate-ping" style={{ backgroundColor: `${color}40` }} />
    )}
  </div>
);

// 可展开收起的事件时间脉络模块
const EventTimelineModule: React.FC<{ data: EventModule; isExpanded: boolean; onToggle: () => void }> = ({
  data,
  isExpanded,
  onToggle,
}) => {
  const Icon = data.icon;

  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-300"
      style={{
        background: colors.surface,
        border: `1px solid ${isExpanded ? data.color : colors.border}`,
        boxShadow: isExpanded ? `0 0 20px ${data.color}20` : 'none',
      }}
    >
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between hover:bg-opacity-50 transition-all"
        style={{ background: isExpanded ? `${data.color}10` : 'transparent' }}
      >
        <div className="flex items-center gap-4">
          <div className="p-2.5 rounded-lg" style={{ background: `${data.color}15` }}>
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
            style={{ background: colors.header, transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            <ChevronDown className="w-4 h-4" style={{ color: colors.textMuted }} />
          </div>
        </div>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 border-t" style={{ borderColor: colors.border }}>
          <div className="pt-4 relative">
            <div
              className="absolute left-[60px] top-4 bottom-4 w-px"
              style={{ background: `linear-gradient(to bottom, ${data.color}, ${colors.border})` }}
            />

            <div className="space-y-4">
              {data.events.map((event) => (
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
                        boxShadow: `0 0 0 2px ${colors.surface}, 0 0 8px ${data.color}`,
                      }}
                    />
                  </div>

                  <div className="flex-1 pb-2">
                    <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: data.color }}>
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

// 小块：带颜色标题的信息盒
const InfoBox: React.FC<{
  title: string;
  titleColor: string;
  children: React.ReactNode;
  accentLeft?: string;
  bg?: string;
}> = ({ title, titleColor, children, accentLeft, bg }) => (
  <div
    className={accentLeft ? 'p-3 rounded-lg border-l-2' : 'p-3 rounded-lg'}
    style={{
      background: bg ?? colors.header,
      ...(accentLeft ? { borderLeftColor: accentLeft } : {}),
    }}
  >
    <div className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: titleColor }}>
      {title}
    </div>
    {children}
  </div>
);

// 核心事件详情卡片（展开含 7 个维度）
const EventDetailCard: React.FC<{ data: CoreEvent }> = ({ data }) => {
  const Icon = data.icon;

  const bulletList = (items: string[], iconColor: string, IconCmp: React.ElementType) => (
    <div className="space-y-1.5">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2 text-xs" style={{ color: colors.textMuted }}>
          <IconCmp className="w-3 h-3 mt-0.5 shrink-0" style={{ color: iconColor }} />
          <span className="leading-relaxed">{item}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="rounded-xl overflow-hidden w-full" style={{ background: colors.surface, border: `1px solid ${colors.border}` }}>
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
                style={{ backgroundColor: `${data.labelColor}15`, color: data.labelColor, borderColor: `${data.labelColor}30` }}
              >
                {data.type}
              </span>
              <span className="text-[10px]" style={{ color: colors.textMuted }}>
                {data.riskLevel}
              </span>
            </div>
            <h3 className="text-lg font-bold truncate" style={{ color: colors.text }}>
              {data.title}
            </h3>
          </div>
        </div>
      </div>

      {/* 内容 - 横向网格布局 */}
      <div className="p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* 左侧：事件简述 + 发展脉络 + 时间节点 */}
          <div className="space-y-4">
            <InfoBox title="事件简述" titleColor={data.labelColor} accentLeft={data.labelColor} bg={`${data.labelColor}08`}>
              <p className="text-xs leading-relaxed" style={{ color: colors.text }}>
                {data.summary}
              </p>
            </InfoBox>

            <InfoBox title="发展脉络" titleColor={colors.secondary}>
              <div className="space-y-1.5 max-h-[200px] overflow-y-auto custom-scrollbar">
                {data.timeline.map((item, i) => (
                  <div key={i} className="flex gap-2 text-xs" style={{ color: colors.textMuted }}>
                    <ChevronRight className="w-3 h-3 mt-0.5 shrink-0" style={{ color: colors.secondary }} />
                    <span className="leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </InfoBox>

            <InfoBox title="时间节点" titleColor={colors.accent}>
              <div className="flex flex-wrap gap-2">
                {data.nodes.map((node, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-mono px-2 py-1 rounded"
                    style={{ background: `${colors.accent}12`, color: colors.text, border: `1px solid ${colors.accent}25` }}
                  >
                    {node}
                  </span>
                ))}
              </div>
            </InfoBox>
          </div>

          {/* 右侧：争议焦点 + 公司处置 + 当前状态 + 舆情结论 */}
          <div className="space-y-4">
            <InfoBox title="争议焦点" titleColor={colors.danger}>
              {bulletList(data.focus, colors.danger, Crosshair)}
            </InfoBox>

            <InfoBox title="公司处置" titleColor={colors.warning}>
              {bulletList(data.handling, colors.warning, Gavel)}
            </InfoBox>

            <InfoBox title="当前状态" titleColor={colors.secondary}>
              <p className="text-xs leading-relaxed" style={{ color: colors.text }}>
                {data.current}
              </p>
            </InfoBox>

            <InfoBox title="舆情结论" titleColor={colors.success}>
              <p className="text-xs leading-relaxed" style={{ color: colors.textMuted }}>
                {data.conclusion}
              </p>
            </InfoBox>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============ 主组件 ============

const DashboardAugustPage: React.FC = () => {
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [expandedDept, setExpandedDept] = useState<string | null>(null);

  const toggleModule = (id: string) => {
    setExpandedModules((prev) => (prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]));
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
          font-family: Inter, 'Microsoft YaHei', 'PingFang SC', sans-serif;
        }
        .glass-card {
          background: ${colors.surface};
          border: 1px solid ${colors.border};
          border-radius: 12px;
          box-shadow: 0 0 15px rgba(249, 115, 22, 0.05);
        }
        .metric-value {
          font-family: Orbitron, Inter, 'DIN Alternate', sans-serif;
          font-weight: 700;
          letter-spacing: -0.02em;
        }
        @keyframes pulse-glow {
          0%,
          100% {
            box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.4);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(249, 115, 22, 0);
          }
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
                  听潮阁 <span style={{ color: colors.accent }}>2026年8月</span> 舆情监控
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
                style={{ background: `${colors.accent}15`, color: colors.accent, border: `1px solid ${colors.accent}40` }}
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
                  8月舆情压力较7月<span style={{ color: colors.warning }}>明显上升</span>，本月风险印象围绕
                  <span style={{ color: colors.accent }}>「权益」</span>
                  展开：主播吐槽下降，公司侧规则、资源与权益交付问题集中抬升。多项争议连续将焦点由「主播个人是否失当」推向
                  <span className="font-semibold" style={{ color: colors.secondary }}>
                    「公司规则是否清晰、承诺是否兑现、管理边界能否有效执行」
                  </span>
                  。
                </p>
              </div>
            </div>
          </section>

          {/* 月风险概况：趋势 + 类型比例 */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5" style={{ color: colors.accent }} />
                <h2 className="text-base font-bold tech-font tracking-tight" style={{ color: colors.text }}>
                  风险事件趋势
                </h2>
                <span className="text-[10px] ml-2" style={{ color: colors.textMuted }}>
                  6月 → 7月 → 8月 风险事件总量
                </span>
              </div>
              <div className="h-[240px]">
                <ReactECharts option={trendOption} style={{ height: '100%' }} notMerge lazyUpdate />
              </div>
            </div>

            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <PieChart className="w-5 h-5" style={{ color: colors.accent }} />
                <h2 className="text-base font-bold tech-font tracking-tight" style={{ color: colors.text }}>
                  风险类型比例
                </h2>
                <span className="text-[10px] ml-2" style={{ color: colors.textMuted }}>
                  舆情事件 / 危险信号 / 吐槽主播 / 体验作为
                </span>
              </div>
              <div className="h-[240px]">
                <ReactECharts option={riskRatioOption} style={{ height: '100%' }} notMerge lazyUpdate />
              </div>
              <div className="flex items-center justify-center gap-5 mt-2">
                {riskTypeData.map((d) => (
                  <div key={d.name} className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                    <span className="text-[10px]" style={{ color: colors.textMuted }}>
                      {d.name} {d.value}起
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 核心问题 TOP */}
          <section className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <ListChecks className="w-5 h-5" style={{ color: colors.accent }} />
              <h2 className="text-base font-bold tech-font tracking-tight" style={{ color: colors.text }}>
                核心问题 TOP8
              </h2>
              <span className="text-[10px] ml-2" style={{ color: colors.textMuted }}>
                本月主要风险事件
              </span>
            </div>
            <div className="space-y-2.5">
              {topProblems.map((p, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: colors.header }}>
                  <span className="text-base font-bold metric-value w-6 shrink-0" style={{ color: p.color }}>
                    {i + 1}
                  </span>
                  <span
                    className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shrink-0"
                    style={{ background: `${p.color}15`, color: p.color, border: `1px solid ${p.color}30` }}
                  >
                    {p.tag}
                  </span>
                  <span className="text-xs leading-relaxed" style={{ color: colors.text }}>
                    {p.content}
                  </span>
                </div>
              ))}
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
              <span className="text-[10px] ml-2" style={{ color: colors.textMuted }}>
                每项含 事件简述 / 发展脉络 / 时间节点 / 争议焦点 / 公司处置 / 当前状态 / 舆情结论
              </span>
            </div>
            <div className="flex flex-col gap-4">
              {coreEventsData.map((event) => (
                <EventDetailCard key={event.id} data={event} />
              ))}
            </div>
          </section>

          {/* 部门归因与豆瓣分析 */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-5">
                <BarChart3 className="w-5 h-5" style={{ color: colors.accent }} />
                <h2 className="text-base font-bold tech-font tracking-tight" style={{ color: colors.text }}>
                  部门 / 厅风险回顾
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
                      <span className="text-sm font-semibold" style={{ color: colors.text }}>
                        {dept.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span
                          className="text-2xl font-bold metric-value"
                          style={{ color: dept.status === '高风险' ? colors.accent : colors.warning }}
                        >
                          {dept.events}
                        </span>
                        <span
                          className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                          style={{
                            backgroundColor: dept.status === '高风险' ? `${colors.accent}15` : `${colors.warning}15`,
                            color: dept.status === '高风险' ? colors.accent : colors.warning,
                          }}
                        >
                          {dept.status}
                        </span>
                      </div>
                    </div>
                    <div
                      className="text-[10px] leading-relaxed"
                      style={{
                        color: colors.textMuted,
                        display: expandedDept === dept.name ? 'block' : '-webkit-box',
                        WebkitLineClamp: expandedDept === dept.name ? 'unset' : 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: expandedDept === dept.name ? 'visible' : 'hidden',
                      }}
                    >
                      {dept.description}
                    </div>
                    <div className="flex items-center gap-1 mt-2 text-[9px] uppercase tracking-widest" style={{ color: colors.textMuted }}>
                      <ChevronDown
                        className="w-3 h-3 transition-transform"
                        style={{ transform: expandedDept === dept.name ? 'rotate(180deg)' : 'rotate(0deg)' }}
                      />
                      {expandedDept === dept.name ? '收起' : '展开'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" style={{ color: colors.accent }} />
                  <h2 className="text-base font-bold tech-font tracking-tight" style={{ color: colors.text }}>
                    豆瓣舆情分析
                  </h2>
                </div>
                <span className="text-[10px] uppercase tracking-widest" style={{ color: colors.textMuted }}>
                  相对讨论热度TOP8
                </span>
              </div>
              <div className="h-[300px]">
                <ReactECharts option={heatChartOption} style={{ height: '100%' }} notMerge lazyUpdate />
              </div>
              <div className="flex items-start gap-2 mt-1">
                <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" style={{ color: colors.textMuted }} />
                <span className="text-[10px] leading-relaxed" style={{ color: colors.textMuted }}>
                  8月豆瓣整体讨论量较7月继续回落，头部主播讨论普遍降温；公司层面讨论明显增多，受禁连控、司庆资源分配、快闪店及《攀峰》等话题带动，呈现"头部降温、公司侧讨论增多"特征。
                </span>
              </div>
            </div>
          </section>

          {/* 9月动作板 */}
          <section className="glass-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <Flag className="w-5 h-5" style={{ color: colors.accent }} />
              <h2 className="text-lg font-bold tech-font tracking-tight" style={{ color: colors.text }}>
                9月动作板
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
                      style={{ backgroundColor: `${task.labelColor}15`, color: task.labelColor, border: `1px solid ${task.labelColor}30` }}
                    >
                      {task.label}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider" style={{ color: colors.textMuted }}>
                      {task.meaning}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: colors.text }}>
                    {task.content}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="w-full mt-8 border-t" style={{ background: `${colors.bg}80`, borderColor: colors.border }}>
          <div className="max-w-[1600px] mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <StatusIndicator color={colors.success} pulse />
                <span className="text-[10px] uppercase tracking-widest" style={{ color: colors.textMuted }}>
                  系统正常
                </span>
              </div>
              <span className="text-[10px]" style={{ color: colors.textMuted }}>
                数据更新: 2026-08-31 23:59
              </span>
            </div>
            <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest" style={{ color: colors.textMuted }}>
              <span className="tech-font">TINGCHAOGECLOUD v2.8.0</span>
              <span style={{ opacity: 0.3 }}>|</span>
              <span>节点: CN-SH-01</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default DashboardAugustPage;
