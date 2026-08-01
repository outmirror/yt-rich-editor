# 第一步：实现可编辑区域与内容获取

> **目标**：在浏览器中渲染一个可编辑区域，能够输入文字，并能通过 API 获取其 HTML 内容。
>
> **技术栈**：HTML + TypeScript + DOM API + CSS（纯原生）
>
> **验证标准**：`npm run dev` 启动后，编辑框内可输入，点击按钮控制台输出当前 HTML。

---

## 📦 项目初始化

- [✅] 创建项目文件夹 `yt-rich-editor`
- [✅] 执行 `npm init -y` 初始化 `package.json`
- [✅] 安装开发依赖：`vite`、`typescript`、`@types/node`
- [✅] 创建 `tsconfig.json` 并配置编译选项（target: ES2020, module: ESNext）
- [✅] 创建 `vite.config.ts` 并配置开发服务器（端口 3000，自动打开）
- [✅] 在 `package.json` 中添加 `dev`、`build`、`preview` 脚本

---

## 🧱 目录结构准备

- [✅] 创建 `src/` 目录
- [✅] 在 `src/` 下创建 `core/` 目录
- [✅] 在 `src/core/` 下创建 `Editor.ts` 文件
- [✅] 在 `src/` 下创建 `index.ts` 文件
- [✅] 在 `src/` 下创建 `style.css` 文件
- [✅] 在项目根目录创建 `index.html` 文件

---

## 🎨 样式实现（`style.css`）

- [ ] 对页面进行基础重置（margin/padding/box-sizing）
- [ ] 设置 body 居中、背景色、字体
- [ ] 为编辑器容器设置样式（白底、边框、圆角、内边距、最小高度）
- [ ] 为编辑器容器设置 focus 状态样式（边框高亮、阴影）
- [ ] 为编辑器容器设置空状态占位文字（`:empty::before`）
- [ ] 为操作按钮设置样式（背景、圆角、悬停效果）
- [ ] 为输出区域设置样式（深色背景、等宽字体、内边距）

---

## 🧩 编辑器核心类（`Editor.ts`）

- [ ] 定义 `EditorOptions` 接口（包含 `element` 和可选的 `initialContent`）
- [ ] 创建 `Editor` 类
- [ ] 在构造函数中通过 `document.querySelector` 获取 DOM 元素
- [ ] 若元素不存在，抛出错误
- [ ] 将获取到的元素保存为私有属性 `element`
- [ ] 实现 `init` 方法：
  - [ ] 将 `element.contentEditable` 设为 `"true"`
  - [ ] 若传入了 `initialContent`，设置 `element.innerHTML`
  - [ ] 否则设置默认内容 `<p></p>`
  - [ ] 监听 `input` 事件（暂时只打印日志）
- [ ] 实现 `getHTML` 方法：返回 `element.innerHTML`
- [ ] 实现 `setHTML` 方法：接收字符串，设置 `element.innerHTML`
- [ ] 实现 `destroy` 方法：关闭 `contentEditable`，清空内容（预留）

---

## 🔌 应用入口（`index.ts`）

- [ ] 导入 `style.css`
- [ ] 从 `./core/Editor` 导入 `Editor` 类
- [ ] 实例化 `Editor`，挂载到 `#editor` 元素，设置初始内容
- [ ] 获取“获取内容”按钮并绑定点击事件：
  - [ ] 调用 `editor.getHTML()`
  - [ ] 将结果显示在页面输出区域
  - [ ] 同时在控制台打印
- [ ] 获取“设置内容”按钮并绑定点击事件：
  - [ ] 调用 `editor.setHTML()`，传入一段新内容
  - [ ] 在输出区域提示“内容已更新”
- [ ] 将 `editor` 实例挂载到 `window` 对象，方便调试

---

## 🧪 测试页面（`index.html`）

- [ ] 创建 HTML 骨架（`<!DOCTYPE html>`、`<html>`、`<head>`、`<body>`）
- [ ] 在 `<head>` 中设置字符编码和视口
- [ ] 在 `<body>` 中创建 `#app` 容器
- [ ] 在 `#app` 中添加标题 `<h1>`
- [ ] 添加 `<div id="editor">` 作为编辑器挂载点
- [ ] 添加操作按钮（“获取内容”和“设置内容”），赋予对应的 `id`
- [ ] 添加 `<div id="output">` 作为内容展示区域
- [ ] 在 `<body>` 末尾引入 `/src/index.ts`（使用 `type="module"`）

---

## ✅ 验收测试

- [ ] 执行 `npm install` 安装所有依赖
- [ ] 执行 `npm run dev`，浏览器自动打开 `http://localhost:3000`
- [ ] 页面正常显示标题、编辑框、两个按钮和输出区域
- [ ] 在编辑框中输入任意文字（如 “Hello World”）
- [ ] 点击“获取内容”按钮：
  - [ ] 输出区域显示当前 HTML
  - [ ] 控制台打印当前 HTML
- [ ] 点击“设置内容”按钮：
  - [ ] 编辑框内容被替换为新内容
  - [ ] 输出区域显示“内容已更新”
- [ ] 打开控制台，输入 `editor.getHTML()`，返回当前内容
- [ ] 编辑器获得焦点时有高亮边框
- [ ] 编辑器为空时显示占位文字

---

## 🎯 第一步完成标志

当以上所有任务都打勾 ✅ 后，第一步就完成了！

你拥有了一个：

- ✔ 可输入文字的富文本编辑器核心
- ✔ 能够获取和设置内容
- ✔ 纯原生、无框架依赖
- ✔ 可通过 `npm run dev` 开发和调试

---

## 🚀 下一步预告

第二步将引入**状态管理**和**内容变化监听**，让编辑器能够感知内容变化并触发回调函数。