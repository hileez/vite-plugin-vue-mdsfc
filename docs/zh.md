# vite-plugin-vue-mdsfc

Language: [简体中文](https://github.com/hileez/vite-plugin-vue-mdsfc/blob/main/docs/zh.md) | [English](https://github.com/hileez/vite-plugin-vue-mdsfc/blob/main/docs/en.md)



# 简介

`MDSFC` 是 Vite 构建器插件，主要功能是允许 vue 组件将 markdown 文档文件，作为单文件组件（SFC）导入使用。在构建过程中，将 markdown 转换为合法的 SFC，让文档能够被 vue 编译处理。

`MDSFC` 插件是构建时处理 markdown 文档，构建后的 markdown 文档不可变，不要指望在 vue 运行时把 markdown 转换为 SFC，因为 SFC 必须经过编译才能执行。在本文中，经过处理的 markdown 文档称为 markdown 组件。

## 方案选择

Markdown 文档的渲染，可以在 Vite 构建时中处理，也可以在 Vue 应用运行时处理。构建时是静态处理 markdown 文档，文档最终会被构建为 Vue 应用的静态内容，因此构建时处理的 markdown 文档是不可变的；运行时是动态处理 markdown 文档，在 Vue 应用运行过程中将 markdown 渲染为 HTML 显示，因此可以是动态的 markdown 内容。

若你的 markdown 内容是可变的，那么你应该采用动态渲染方案，例如在 vue 应用中集成 markdownit 库渲染 markdown 内容。若你希望 markdown 代替 vue 组件静态内容的展示，而不是都通过 HTML 标签来编写，那么你可以使用当前的 `MDSFC` 插件，将 markdown 作为组件来导入显示。

## 设计目标

`MDSFC` 插件设计在构建时渲染 markdown，目的是希望 markdown 作为 vue 组件使用，用来代替一部分 vue 组件的设计工作，而不是所有的静态内容都通过 `template` 标签来编写。

另外还有其他考量，那就是插件能把 markdown 的围栏代码，作为 markdown 组件的子组件渲染，这在用 markdown 编写手册的时候特别好用，例如在围栏中展示一段 vue 组件案例代码，这段代码不仅要能原样显示，还要能够看到渲染后的效果，包括组件的 `script` 脚本的执行、`template` 模板的渲染、`style` 样式的应用，就像 element-plus 官方文档的 [案例](https://element-plus.org/en-US/component/button#basic-usage) 展示那样。



# 快速开始

安装依赖

```shell
npm i -D vite-plugin-vue-mdsfc
```

vite.config.js

```javascript
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueMDSFC from "vite-plugin-vue-mdsfc";

export default defineConfig({
    plugins: [
        vueMDSFC(), // use plugin
        vue({
            include: [/\.vue$/, /\.md$/], // compile SFC files prefix.
        }),
    ],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
});
```

App.vue

```vue
<script setup>
import Demo from '@/Demo.md'
</script>

<template>
  <h1>You did it!</h1>
  <Demo/>
</template>

<style scoped></style>

```

Demo.md

```markdown
# Hello mdsfc
```



# 插件配置

插件函数接受一个配置对象参数，在无配置时插件以默认配置工作。

```typescript
import type { Options as MarkdownitOptions, PluginSimple } from 'markdown-it'

/* MDSFC Plugin Options */
interface Options {
    // transform module id regex array.
    include: RegExp[]
    // transform module hook.
    before?: (code: string, id: string) => string
    // transform module hook.
    after?: (code: string, id: string) => string
    // fence to vsfc language.
    fenceToSFCLang?: string[]
    // markdownit options.
    markdownItOptions?: MarkdownitOptions
    // markdownit plugin array.
    markdownItPlugins?: PluginSimple[]
}
```

插件使用 MarkdownIt 渲染 markdown 文档，因此配置选项主要分为 `MDSFC` 插件选项和 `MarkdownIt` 库选项。

 **MDSFC 选项**

- `include` : 匹配 markdown 文档正则表达式数组，文档可以是任意扩展名，默认值 `[/\.md$/]` ；
- `fenceToSFCLang` : 指定语言的围栏代码块，作为 markdown 组件的子组件渲染，默认值 `['vue']`；
- `before` : Markdown 文档转换为 SFC 前置钩子，用户可以处理 markdown 源码；
- `after` : Markdown 文档转换为 SFC 后置钩子，用户可以处理 markdown 转换 SFC 后的源码；

 **MarkdownIt 选项**

- `markdownItOptions` : MarkdownIt 配置对象，该配置对象属性请参考 MarkdownIt 文档；
- `markdownItPlugins` : MarkdownIt 插件数组，多个插件将从后往前执行，用户可以参考 MarkdownIt 文档开发插件；

**全部配置选项演示**

```javascript
// vite.config.js
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueMDSFC from 'vite-plugin-vue-mdsfc'
import { markdownitPluginFenceToVSFC } from 'vite-plugin-vue-mdsfc'

export default defineConfig({
    plugins: [
        vueMDSFC({
            include: [/\.md$/],
            fenceToSFCLang: ['vue'],
            markdownItOptions: {
                html: false, // enable html
                xhtmlOut: false, // close single tag, <br> to <br/>
                breaks: false, // '\n','\r\n','\r' to <br/>
                langPrefix: 'language-', // <pre class=""> classname prefix.
                linkify: false, // URL to link.
                typographer: false,
                quotes: '“”‘’',
                // highlight: function (str, lang) {}
            },
            markdownItPlugins: [
                markdownitPluginFenceToVSFC,
                // markdownItPluginOne, // user markdownit plugin
            ],
            before(code, id) {
                console.log(code)
                return code
            },
            after(code, id) {
                console.log(code)
                return code
            },
        }),
        vue({
            include: [/\.vue$/, /\.md$/], // compile SFC files prefix.
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
})
```



# 特色功能

`MDSFC` 插件除了将 markdown 文档转换为 SFC 外，还可以将文档中指定语言的围栏代码块，提取为这个文档的子组件渲染显示，前提是围栏中是合法的 SFC 代码。例如在围栏中一段 vue 组件代码，这段代码不仅要能原样显示，还要能够看到渲染后的效果，包括组件的 script 脚本的执行、template 模板的渲染、style 样式的应用。

这部分功能，由内置的 markdownit 插件 `markdownitPluginFenceToVSFC` 实现，默认配置情况下这个插件会自动注册并工作。若是希望自定义这个处理过程，你可以创建一个 markdownit 插件，将其添加在  `markdownitPluginFenceToVSFC` 插件之后，markdownit 插件会从后往前执行，从而在内置插件功能基础上加以处理围栏代码。

> [!NOTE]
>
> 当用户注册自定义的 markdownit 插件时，内置的 `markdownitPluginFenceToVSFC` 插件不再自动注册，用户需要手动注册该插件，这样做的目的是让用户控制插件的执行顺序。

例如，以下自定义 markdownit 插件 `markdownItPluginOne` ，当围栏语言是 `vue` 时调用  `markdownitPluginFenceToVSFC` 插件渲染，并且以 `html` 语言高亮代码，最终组合高亮代码和渲染的代码返回。

```javascript
// vite.config.js
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueMDSFC from 'vite-plugin-vue-mdsfc'
import { markdownitPluginFenceToVSFC } from 'vite-plugin-vue-mdsfc'

function markdownItPluginOne(md) {
    const $rules = md.renderer.rules;
    const original = $rules.fence;
    $rules.fence = function (tokens, idx, options, env, self) {
        const token = tokens[idx];
        const language = token.info.trim().toLowerCase();
        if (language === "vue") {
            // fence to sfc
            const sfcResult = original(tokens, idx, options, env, self);
            // highlight fence to html language
            tokens[idx].info = "html";
            const htmlResult = original(tokens, idx, options, env, self);
            return `<div>${sfcResult}</div><div>${htmlResult}</div>`;
        }
        return original(tokens, idx, options, env, self);
    };
}

export default defineConfig({
    plugins: [
        vueMDSFC({
            markdownItPlugins: [
                markdownitPluginFenceToVSFC,
                markdownItPluginOne,
            ],
        }),
        vue({
            include: [/\.vue$/, /\.md$/], // compile SFC files prefix.
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
})
```



# 代码高亮

`MDSFC` 插件使用 `highlight.js` 库高亮围栏代码，并且要求用户项目中安装 `highlight.js` 库。

```shell
npm i -D highlight.js
```

`main.js` 文件中导入高亮代码样式。

```javascript
// main.js
import 'highlight.js/styles/github.css'
```

