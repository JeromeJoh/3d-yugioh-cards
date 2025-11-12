import imagesLoaded from 'imagesloaded';

/**
 * 加载图片并追踪进度的 Hook / 工具函数
 * @param {string|NodeList|HTMLElement[]} selector - 要加载的图片选择器或元素集合
 * @param {Object} options
 * @param {boolean} [options.background=false] - 是否检测 CSS 背景图
 * @param {function(number):void} [options.onProgress] - 每张图片加载时触发 (progress: 0~1)
 * @param {function():void} [options.onComplete] - 所有图片加载完成时触发
 * @returns {Promise<void>} 等待所有图片加载完成
 */
export function useImageLoader(selector = 'img', options = {}) {
    const { background = false, onProgress, onComplete } = options;

    return new Promise((resolve) => {
        const elements =
            typeof selector === 'string'
                ? document.querySelectorAll(selector)
                : selector;

        const loader = imagesLoaded(elements, { background });

        loader.on('progress', (instance) => {
            const progress = instance.progressedCount / instance.images.length;
            onProgress?.(progress);
        });

        loader.on('always', (instance) => {
            onProgress?.(1);
            onComplete?.();
            resolve(instance);
        });
    });
}
