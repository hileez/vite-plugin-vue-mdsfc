# vite-plugin-vue-mdsfc

Language: [简体中文](https://github.com/hileez/vite-plugin-vue-mdsfc/blob/main/docs/zh.md) | [English](https://github.com/hileez/vite-plugin-vue-mdsfc/blob/main/docs/en.md)



# Introduction

`MDSFC` is a Vite builder plugin whose main function is to allow Vue components to import markdown document files as Single File Components (SFC). During the build process, markdown is converted into valid SFCs so that the documents can be processed by Vue compilation.

The `MDSFC` plugin handles markdown documents at build time. The converted markdown documents cannot be changed after the build. You shouldn’t expect to convert markdown into SFC at runtime in Vue, because SFCs must be compiled to be executable. In this article, the processed markdown documents are referred to as markdown components.

## Solution Options

Markdown document rendering can be handled either during Vite build or at runtime in a Vue application. Handling it during the build is a static process, where the markdown document is ultimately compiled into static content for the Vue application, making the processed markdown unchangeable. Runtime handling is dynamic, rendering markdown to HTML while the Vue application is running, allowing for dynamic markdown content.

If your markdown content is variable, you should opt for a dynamic rendering solution, such as integrating the markdown-it library in your Vue application to render markdown content. If you want markdown to replace the static content of Vue components, rather than writing everything in HTML tags, you can use the current `MDSFC` plugin to import and display markdown as components.

## Design Goals

The `MDSFC` plugin is designed to render markdown at build time, with the goal of using markdown as a Vue component. This is intended to replace some of the work involved in designing Vue components, rather than writing all static content purely using the `template` tag.

Another consideration is that the plugin can render fenced code blocks in markdown as child components of the markdown component. This is particularly useful when writing manuals in markdown. For example, when displaying a piece of Vue component example code within a fenced block, the code should not only be displayed as-is, but also allow users to see the rendered result, including the execution of the component's `script`, the rendering of its `template`, and the application of its `style`, similar to the examples shown in the Element Plus official documentation [example](https://element-plus.org/en-US/component/button#basic-usage).



# Quick Start

Install Dependencies

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



# Plugin Configuration

Plugin functions accept a configuration object as a parameter. If no configuration is provided, the plugin will operate with the default settings.

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

The plugin uses MarkdownIt to render markdown documents, so the configuration options are mainly divided into `MDSFC` options and `MarkdownIt` options.

**MDSFC Options**

- `include` : An array of regular expressions to match markdown documents. The documents can have any extension. Default is `[/.md$/]`.
- `fenceToSFCLang` : Specifies language fenced code blocks to be rendered as subcomponents of the markdown component. Default is `['vue']`.
- `before` : A pre-hook before converting markdown documents to SFC, allowing users to process the markdown source.
- `after` : A post-hook after converting markdown documents to SFC, allowing users to process the source after markdown is converted to SFC.

**MarkdownIt Options**

- `markdownItOptions` : Configuration object for MarkdownIt. Please refer to the MarkdownIt documentation for the properties.
- `markdownItPlugins` : An array of MarkdownIt plugins. Multiple plugins are executed from last to first. Users can refer to the MarkdownIt documentation for plugin development.

**Full Configuration Demo**

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



# Features

The `MDSFC` plugin, in addition to converting markdown documents into SFCs, can also extract code blocks of a specified language within the document and render them as child components of that document, provided that the code within the fences is valid SFC code. For example, if there is a Vue component code block within the fences, this code not only should display as-is but also show the rendered effect, including the execution of the component's script, template rendering, and style setting.

This functionality is implemented by the built-in markdownit plugin `markdownitPluginFenceToVSFC`. With the default configuration, this plugin is automatically registered and works out of the box. If you wish to customize this process, you can create a markdownit plugin and add it after the `markdownitPluginFenceToVSFC` plugin. Markdownit plugins execute from back to front, allowing you to process fenced code on top of the built-in plugin’s functionality.

> [!NOTE]
>
> When users register custom markdown-it plugins, the built-in `markdownitPluginFenceToVSFC` plugin is no longer registered automatically. Users need to register this plugin manually. The purpose of this is to allow users to control the execution order of the plugins.

For example, the following custom markdownit plugin `markdownItPluginOne` calls the `markdownitPluginFenceToVSFC` plugin for rendering when the fenced language is `vue` and highlights the code using the `html` language. It finally combines the highlighted code with the rendered output and returns the result.

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



# Fence Highlight

The `MDSFC` plugin uses the `highlight.js` library to highlight fenced code blocks, and requires the user to have the `highlight.js` library installed in their project.

```shell
npm i -D highlight.js
```

Import the highlight code styles in the `main.js` file.

```javascript
// main.js
import 'highlight.js/styles/github.css'
```

