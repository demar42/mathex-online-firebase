module.exports = {
    pages: {
        'index': {
            entry: './src/pages/index/main.js',
            template: 'public/index.html',
            title: 'Mathex Online - Play',
            chunks: ['chunk-vendors', 'chunk-common', 'index']
        },
        'admin': {
            entry: './src/pages/admin/main.js',
            template: 'public/index.html',
            title: 'Mathex Online - Create',
            chunks: ['chunk-vendors', 'chunk-common', 'index']
        }
    }
}