export default {
    trailingComma: 'es5',
    tabWidth: 4,
    semi: false,
    singleQuote: true,
    useTabs: false,
    endOfLine: 'lf',
    printWidth: 80,
    htmlWhitespaceSensitivity: 'ignore',
    singleAttributePerLine: false,
    vueIndentScriptAndStyle: false,
    bracketSameLine: false,
    overrides: [
        {
            files: '*.json',
            options: {
                tabWidth: 2,
                printWidth: 100,
                proseWrap: 'always',
            },
        },
    ],
}
