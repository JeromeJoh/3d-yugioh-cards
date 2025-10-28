import imagesLoaded from "imagesloaded";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";

const lenis = new Lenis()
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000))
gsap.ticker.lagSmoothing(0)
gsap.registerPlugin(ScrollTrigger)

const config = {
  gap: 0.15,
  speed: 0.6,
  arcRadius: 500
}

const spotlightItems = [
  { name: 'Harpie Lady', image: './images/cards/1.jpg' },
  { name: 'Plant Princess', image: './images/cards/2.jpg' },
  { name: 'Classic Normal Monster', image: './images/cards/3.jpg' },
  { name: 'Crystal Beast', image: './images/cards/4.jpg' },
]

const titlesContainerElement = document.querySelector('.spotlight-titles-container')
const titlesContainer = document.querySelector('.spotlight-titles')
const imagesContainer = document.querySelector('.spotlight-images')
const spotlightHeader = document.querySelector('.spotlight-header')
const introTextElement = document.querySelectorAll('.spotlight-intro-text')

const imageElements = []

spotlightItems.forEach((item, index) => {
  const { name, image } = item
  const titleElement = document.createElement('h1');
  titleElement.textContent = name;
  if (index === 0) titleElement.style.opacity = 1;
  titlesContainer.appendChild(titleElement);

  const imageWrapper = document.createElement('div');
  const link = document.createElement('a');
  link.href = `vol${index + 1}/`;
  link.style.display = 'block';
  imageWrapper.className = 'spotlight-img';
  const imageElement = document.createElement('img');
  imageElement.src = image;
  link.appendChild(imageElement);
  imageWrapper.appendChild(link);
  imagesContainer.appendChild(imageWrapper);
  imageElements.push(imageWrapper);
});

const titleElements = titlesContainer.querySelectorAll('h1');
let currentActiveIndex = 0;

const containerWidth = window.innerWidth * 0.3;
const containerHeight = window.innerHeight;
const arcStartX = containerWidth - 220;
const arcStartY = -200;
const arcEndY = containerHeight + 200;
const arcControlPointX = arcStartX + config.arcRadius;
const arcControlPointY = containerHeight / 2;


function getBezierPosition(t) {
  const x = (1 - t) * (1 - t) * arcStartX + 2 * (1 - t) * t * arcControlPointX + t * t * arcStartX;
  const y = (1 - t) * (1 - t) * arcStartY + 2 * (1 - t) * t * arcControlPointY + t * t * arcEndY;
  return { x, y };
}

function getImgProgressState(index, overallProgress) {
  const startTime = index * config.gap;
  const endTime = startTime + config.speed;

  if (overallProgress < startTime) return -1;
  if (overallProgress > endTime) return 2;

  return (overallProgress - startTime) / config.speed;
}

imageElements.forEach(img => gsap.set(img, { opacity: 0 }))

ScrollTrigger.create({
  trigger: '.spotlight',
  start: 'top top',
  end: `+=${window.innerHeight * 10}px`,
  pin: true,
  pinSpacing: true,
  scrub: 1,
  onUpdate: (self) => {
    const progress = self.progress;
    // console.log(progress.toFixed(2));

    if (progress <= 0.2) {
      const animationProgress = progress / 0.2;

      const moveDistance = window.innerWidth * 0.6;
      gsap.set(introTextElement[0], {
        x: -moveDistance * animationProgress
      });
      gsap.set(introTextElement[1], {
        x: moveDistance * animationProgress
      });
      gsap.set(introTextElement[0], {
        opacity: 1
      });
      gsap.set(introTextElement[1], {
        opacity: 1
      });

      gsap.set('.spotlight-bg-img', {
        scale: animationProgress,
      });
      gsap.set('.spotlight-bg-img img', {
        scale: 1.5 - animationProgress * 0.5,
      });

      imageElements.forEach(img => gsap.set(img, { opacity: 0 }))
      spotlightHeader.style.opacity = 0;
      gsap.set(titlesContainerElement, {
        '--before-opacity': 0,
        '--after-opacity': 0
      });
    }

    else if (progress > 0.2 && progress <= 0.25) {
      gsap.set('.spotlight-bg-img', {
        scale: 1
      });
      gsap.set('.spotlight-bg-img img', {
        scale: 1
      });

      gsap.set(introTextElement[0], {
        opacity: 0
      });
      gsap.set(introTextElement[1], {
        opacity: 0
      });

      imageElements.forEach(img => gsap.set(img, { opacity: 0 }))
      spotlightHeader.style.opacity = 1;
      gsap.set(titlesContainerElement, {
        '--before-opacity': 1,
        '--after-opacity': 1
      });
    }

    else if (progress > 0.25 && progress <= 0.95) {

      gsap.set('.spotlight-bg-img', {
        transform: 'scale(1)'
      });
      gsap.set('.spotlight-bg-img img', {
        transform: 'scale(1)'
      });

      gsap.set(introTextElement[0], {
        opacity: 0
      });
      gsap.set(introTextElement[1], {
        opacity: 0
      });
      spotlightHeader.style.opacity = 1;
      gsap.set(titlesContainerElement, {
        '--before-opacity': 1,
        '--after-opacity': 1
      });

      const switchProgress = (progress - 0.25) / 0.7;
      const viewportHeight = window.innerHeight;
      const titleContainerHeight = titlesContainer.scrollHeight;
      const startPostion = viewportHeight;
      const targetPosition = -titleContainerHeight;
      const totalDistance = startPostion - targetPosition;
      const currentY = startPostion - totalDistance * switchProgress;
      // console.log('SWITCH PROGRESS', switchProgress.toFixed(2));
      // console.log('PROGRESS', progress.toFixed(2));

      gsap.set('.spotlight-titles', {
        transform: `translateY(${currentY}px)`
      });

      imageElements.forEach((img, index) => {
        const imgProgress = getImgProgressState(index, switchProgress);
        // if (index === 0) console.log('IMG PROGRESS', imgProgress.toFixed(2));

        if (imgProgress < 0 || imgProgress >= 1) {
          // gsap.set(img, { opacity: 0 });
        } else {
          const pos = getBezierPosition(imgProgress);
          gsap.set(img, { x: pos.x - 100, y: pos.y - 75, opacity: 1 });
        }
      });

      const viewportMiddle = viewportHeight / 2;
      let closetIndex = 0;
      let closetDistance = Infinity;

      titleElements.forEach((title, index) => {
        const titleRect = title.getBoundingClientRect();
        const titleMiddle = titleRect.top + titleRect.height / 2;
        const distance = Math.abs(viewportMiddle - titleMiddle);

        if (distance < closetDistance) {
          closetDistance = distance;
          closetIndex = index;
        }
      });

      if (closetIndex !== currentActiveIndex) {
        if (titleElements[currentActiveIndex]) {
          titleElements[currentActiveIndex].style.opacity = 0.25;
        }
        titleElements[closetIndex].style.opacity = 1;
        // document.querySelector('.spotlight-bg-img img').src = spotlightItems[closetIndex].image;
        currentActiveIndex = closetIndex;
      }
    }
  }
})


// document.querySelectorAll('a').forEach(link => {
//   link.addEventListener('click', e => {
//     e.preventDefault();
//     document.body.classList.add('page-leave');
//     setTimeout(() => {
//       window.location = link.href;
//     }, 600); // 动画时长
//   });
// });

const preloadImages = (selector = 'img') => {
  return new Promise((resolve) => {
    imagesLoaded(document.querySelectorAll(selector), { background: true }, resolve);
  });
};

// preloadImages('.spotlight-bg-img img').then((res) => {
//   console.log('All images loaded', res);
// });

const progressBar = document.querySelector('.progress-bar');


imagesLoaded(document.querySelector('img'))
  .on('progress', (instance, image) => {
    console.log('One image finished (loaded or failed):', image.img.src);
    console.log('Is loaded?', image.isLoaded);
    const progress = instance.progressedCount / instance.images.length;
    console.log('Progress:', progress);
    progressBar.style.setProperty('--progress', progress);
  })
  .on('always', (instance) => {
    setTimeout(() => {
      document.querySelector('#loader').remove();
    }, 300);
    console.log('All images done!');
    console.log('Total:', instance.images.length);
  });

const blobCount = 7;            // 色块数量
const maxSpeed = 0.08;          // 最大速度（px/ms）
const sizeRange = [500, 620];   // 色块大小范围
const blurRange = [20, 100];    // 模糊范围
const colors = [
  '#68c40c', '#d32297', '#c6c82b'
];

const bg = document.getElementById('bg');
const blobs = [];

// 创建色块
for (let i = 0; i < blobCount; i++) {
  const blob = document.createElement('div');
  blob.className = 'blob';
  const size = rand(sizeRange[0], sizeRange[1]);
  blob.style.setProperty('--size', `${size}px`);
  blob.style.setProperty('--blur', `${rand(blurRange[0], blurRange[1])}px`);
  blob.style.background = colors[i % colors.length];
  bg.appendChild(blob);

  blobs.push({
    el: blob,
    x: rand(window.innerWidth * 0.1, window.innerWidth * 0.9),
    y: rand(window.innerHeight * 0.1, window.innerHeight * 0.9),
    vx: rand(-maxSpeed, maxSpeed),
    vy: rand(-maxSpeed, maxSpeed),
    speedFactor: 0.5 + Math.random() * 1.5
  });
}

// 工具函数
function rand(min, max) {
  return Math.random() * (max - min) + min;
}

// 每隔一段时间改变方向
setInterval(() => {
  blobs.forEach(b => {
    b.vx += rand(-0.1, 0.1);
    b.vy += rand(-0.1, 0.1);
    const mag = Math.hypot(b.vx, b.vy);
    const limit = maxSpeed * b.speedFactor;
    if (mag > limit) {
      b.vx = (b.vx / mag) * limit;
      b.vy = (b.vy / mag) * limit;
    }
  });
}, 2000);

// 动画循环
let lastTime = performance.now();
function animate(t) {
  const dt = t - lastTime;
  lastTime = t;
  const width = window.innerWidth;
  const height = window.innerHeight;

  for (const b of blobs) {
    b.x += b.vx * dt;
    b.y += b.vy * dt;

    // 边界反弹
    if (b.x < -200 || b.x > width + 200) b.vx *= -1;
    if (b.y < -200 || b.y > height + 200) b.vy *= -1;

    b.el.style.transform = `translate3d(${b.x}px, ${b.y}px, 0)`;
  }

  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);