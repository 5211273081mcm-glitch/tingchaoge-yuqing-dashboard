import type { EChartsOption } from 'echarts';
import { colors } from './julyDashboardData';

// 5月 104 / 6月 83 / 7月 83
export const trendMonths = ['5月', '6月', '7月'];
export const trendValues = [104, 83, 83];

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
  { name: '危险信号', value: 1, color: colors.warning },
  { name: '吐槽主播', value: 77, color: colors.accent },
  { name: '体验作为', value: 5, color: colors.secondary },
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
      data: riskTypeData.map((d) => ({
        name: d.name,
        value: d.value,
        itemStyle: { color: d.color },
      })),
    },
  ],
};

// 豆瓣相对热度（汇报第五节排序与趋势）
export const doubanHeatData = [
  { name: '徐来', heat: 100, changeValue: '公会赛被抬 · 关注', color: colors.accent },
  { name: '姜添', heat: 82, changeValue: '被翻旧账 · 高位', color: colors.warning },
  { name: '六月', heat: 70, changeValue: '前3 · 量级下降', color: colors.success },
  { name: 'Js', heat: 62, changeValue: '讨论上升', color: colors.accent },
  { name: '萨满', heat: 55, changeValue: '中高位 · 下降', color: colors.success },
  { name: '尹妹', heat: 48, changeValue: '中高位 · 下降', color: colors.success },
  { name: '哈哈', heat: 40, changeValue: '7·7言论 · 长尾', color: colors.warning },
  { name: '元一', heat: 34, changeValue: '睡粉争议 · 新增', color: colors.danger },
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
