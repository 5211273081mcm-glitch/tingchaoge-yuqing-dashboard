import type { EChartsOption } from 'echarts';
import { colors } from './octoberDashboardData';

// 7月 83 / 8月 90 / 9月 100 / 10月 86
export const trendMonths = ['7月', '8月', '9月', '10月'];
export const trendValues = [83, 90, 100, 86];

export const trendOption: EChartsOption = {
  backgroundColor: 'transparent',
  grid: { left: 40, right: 24, top: 30, bottom: 28 },
  tooltip: {
    trigger: 'axis',
    backgroundColor: colors.header,
    borderColor: colors.border,
    textStyle: { color: colors.text, fontSize: 12 },
  },
  xAxis: {
    type: 'category',
    data: trendMonths,
    axisLine: { lineStyle: { color: colors.border } },
    axisTick: { show: false },
    axisLabel: { color: colors.textMuted, fontSize: 12 },
  },
  yAxis: {
    type: 'value',
    splitLine: { lineStyle: { color: colors.border, type: 'dashed' } },
    axisLabel: { color: colors.textMuted, fontSize: 11 },
  },
  series: [
    {
      type: 'line',
      data: trendValues,
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      lineStyle: { color: colors.accent, width: 3 },
      itemStyle: { color: colors.accent, borderColor: colors.bg, borderWidth: 2 },
      label: { show: true, position: 'top', color: colors.text, fontSize: 12, fontWeight: 'bold' },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: `${colors.accent}50` },
            { offset: 1, color: `${colors.accent}00` },
          ],
        },
      },
    },
  ],
};

export const riskTypeData = [
  { name: '舆情事件', value: 0, color: colors.danger },
  { name: '危险信号', value: 4, color: colors.warning },
  { name: '吐槽主播', value: 73, color: colors.accent },
  { name: '体验作为', value: 9, color: colors.secondary },
];

export const riskRatioOption: EChartsOption = {
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'item',
    backgroundColor: colors.header,
    borderColor: colors.border,
    textStyle: { color: colors.text, fontSize: 12 },
    formatter: '{b}: {c} 起 ({d}%)',
  },
  legend: {
    orient: 'vertical',
    right: 8,
    top: 'center',
    textStyle: { color: colors.textMuted, fontSize: 12 },
    itemWidth: 10,
    itemHeight: 10,
  },
  series: [
    {
      type: 'pie',
      radius: ['52%', '74%'],
      center: ['38%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: { borderColor: colors.surface, borderWidth: 3 },
      label: { show: false },
      emphasis: {
        label: { show: true, fontSize: 16, fontWeight: 'bold', color: colors.text, formatter: '{b}\n{c}起' },
      },
      data: riskTypeData
        .filter((d) => d.value > 0)
        .map((d) => ({
          name: d.name,
          value: d.value,
          itemStyle: { color: d.color },
        })),
    },
  ],
};

export const doubanHeatData = [
  { name: '姜添', heat: 100, changeValue: '头部竞争 · 升温', color: colors.warning },
  { name: '萨满', heat: 96, changeValue: '榜单分歧 · 升温', color: colors.warning },
  { name: '九叔', heat: 88, changeValue: '破圈+旧怨 · 上升', color: colors.danger },
  { name: '哈哈', heat: 80, changeValue: '旧怨复燃 · 上升', color: colors.danger },
  { name: '张秋水', heat: 72, changeValue: '露脸围观 · 上升', color: colors.accent },
  { name: '六月', heat: 40, changeValue: '司庆退潮 · 回落', color: colors.success },
  { name: '徐来', heat: 36, changeValue: '日常经营 · 回落', color: colors.success },
  { name: '麦麦', heat: 32, changeValue: '退赛/关系 · 局部', color: colors.secondary },
];

export const heatChartOption: EChartsOption = {
  color: [colors.accent],
  backgroundColor: 'transparent',
  grid: { left: 90, right: 140, top: 10, bottom: 10 },
  xAxis: {
    type: 'value',
    max: 120,
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { show: false },
    splitLine: { show: false },
  },
  yAxis: {
    type: 'category',
    data: doubanHeatData.map((d) => d.name).reverse(),
    axisLine: { lineStyle: { color: colors.border } },
    axisTick: { show: false },
    axisLabel: { color: colors.text, fontSize: 11 },
  },
  series: [
    {
      type: 'bar',
      data: doubanHeatData
        .map((d) => ({
          value: d.heat,
          itemStyle: {
            color: {
              type: 'linear' as const,
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                { offset: 0, color: d.color },
                { offset: 1, color: `${d.color}60` },
              ],
            },
            borderRadius: [0, 4, 4, 0],
          },
        }))
        .reverse(),
      barWidth: 12,
      label: {
        show: true,
        position: 'right',
        formatter: (params: { dataIndex: number }) => {
          const item = doubanHeatData[doubanHeatData.length - 1 - params.dataIndex];
          return `{change|${item.changeValue}}`;
        },
        rich: {
          change: { color: colors.textMuted, fontSize: 10 },
        },
      },
    },
  ],
};
