<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Design Standards

## UI & Layout — Google Material Design
All UI elements, layout, spacing, and component patterns must follow [Google Material Design](https://m3.material.io/). Use Material Design 3 (M3) conventions: elevation, color roles, typography scale, shape tokens, and component specs. Do not invent bespoke layout patterns when a Material component exists.

## Data Visualization — Apache ECharts
All charts and data visualizations must use [Apache ECharts](https://echarts.apache.org/). Do not introduce Chart.js, Recharts, D3, or any other charting library. Configure charts with ECharts option objects; prefer declarative config over imperative canvas manipulation.
