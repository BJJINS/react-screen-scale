## react-screen-scale

大屏自适应容器组件，可用于大屏项目开发，实现屏幕自适应，可根据宽度自适应，高度自适应，和宽高等比例自适应，全屏自适应（会存在拉伸问题）

- 仓库地址：[github](https://github.com/BJJINS/react-screen-scale.git)

### 安装

```bash
npm install react-screen-scale
# or
yarn add react-screen-scale
```

#### 使用

```tsx
import ScreenScale from "react-screen-scale";

function App() {
  return (
    <>
      <ScreenScale height={1080} width={1920}>
        ...
      </ScreenScale>
    </>
  );
}
```

### API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| width | 大屏宽度 | `Number` or `String` | 1920 |
| height | 大屏高度 | `Number` or `String` | 1080 |
| autoScale | 自适应配置，配置为 boolean 类型时，为启动或者关闭自适应
| delay | 窗口变化防抖延迟时间 | Number | 500 |
| bkStyle | 修改容器样式，如居中展示时侧边背景色 style 标准格式 | Object | null |
| contentStyle | 修改自适应区域样式 style 标准格式 | Object | null |
