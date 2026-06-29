# 听潮阁 2026 舆情大盘（静态站点）

基于飞书妙搭导出的源码改造而成的**纯前端静态网站**，不依赖任何后端接口、数据库或密钥。
包含 4 月、5 月、6 月三个月度舆情大盘页面，默认首页为 **6 月**。

## 技术栈

- React 19 + TypeScript
- Vite 7（标准构建，产物为静态 `dist/`）
- Tailwind CSS v4 + styled-jsx（沿用妙搭页面写法）
- ECharts（`echarts-for-react`）
- lucide-react 图标
- react-router-dom（HashRouter，刷新不 404，无需服务端重写）

## 本地开发与构建

```bash
npm install      # 安装依赖（已移除妙搭平台 postinstall，可正常安装）
npm run dev      # 本地开发，默认 http://localhost:8080
npm run type:check   # TypeScript 类型检查
npm run build    # 产出标准静态目录 dist/（index.html + assets/）
npm run preview  # 本地预览构建产物
```

## 路由

- `/`、`/#/june` —— 2026 年 6 月舆情大盘（默认首页）
- `/#/may` —— 2026 年 5 月舆情大盘
- `/#/april` —— 2026 年 4 月舆情大盘

使用 HashRouter，所有地址直接刷新均可打开，不出现 404。

## 目录结构（关键部分）

```
client/
  index.html                     # 入口 HTML（干净，无妙搭水印/编辑器）
  src/
    index.tsx                    # 应用入口（HashRouter）
    app.tsx                      # 路由表（默认 6 月）
    index.css                    # 全局样式（本地系统字体降级，无 Google Fonts 硬依赖）
    pages/
      DashboardJunePage/         # ★ 6 月页面
        DashboardJunePage.tsx    # 页面结构 / 交互（复用 5 月视觉体系）
        juneDashboardData.ts     # 6 月文字数据：KPI / 事件 / 部门 / 动作板等
        juneChartData.ts         # 6 月图表数据：趋势 / 类型比例 / 豆瓣热度
      DashboardMayPage/          # 5 月页面（保留）
      DashboardAprilPage/        # 4 月页面（保留）
vite.config.ts                   # 标准 Vite 配置（输出 dist/）
vercel.json                      # Vercel 静态部署配置
render.yaml                      # Render Static Site 配置
.env.example                     # 环境变量示例（无真实值；静态站点无需）
```

## 如何更新 / 新增 7 月数据

7 月页面建议直接复制 6 月目录：

1. 复制 `client/src/pages/DashboardJunePage/` 为 `client/src/pages/DashboardJulyPage/`，
   将文件改名为 `DashboardJulyPage.tsx` / `julyDashboardData.ts` / `julyChartData.ts`。
2. 在 `julyDashboardData.ts` 中修改：
   - `kpiData`（顶部五项指标数值）
   - 核心结论文案（在 `DashboardJulyPage.tsx` 的"本月核心结论"段落）
   - `allEventModules` / `coreEventsData`（事件时间脉络与核心事件详情）
   - `departmentRisks` / `topProblems` / `tasks`（部门风险 / 核心问题 TOP / 动作板）
3. 在 `julyChartData.ts` 中修改：
   - `trendValues`（风险事件总量趋势，追加 7 月）
   - `riskTypeData`（风险类型比例）
   - `doubanHeatData`（豆瓣讨论热度）
4. 在 `client/src/app.tsx` 中新增路由 `/july`，并按需将默认首页切换为 7 月。
5. `npm run build` 重新构建即可。

> 仅更新 6 月数值时，直接修改 `juneDashboardData.ts` 与 `juneChartData.ts` 两个文件即可，
> 页面结构与样式无需改动。

## 安全说明

- 不包含任何密钥、Token、数据库连接（`SUDA_DATABASE_URL` 等均不使用）。
- `.env` 已从版本控制中排除（见 `.gitignore`），仓库仅保留无真实值的 `.env.example`。
- 构建产物 `dist/` 为纯静态资源，可托管于任意静态站点平台。
