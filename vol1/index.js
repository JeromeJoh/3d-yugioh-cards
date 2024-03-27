// Tilt.js Configuration
$('.js-tilt').tilt({
  glare: true,
  maxGlare: .5
});


// initialization
import { vol1 } from '/data.js';

const init = () => {
  render(vol1);
  bindEvent();
}

function render(vol) {
  // document.title = `${vol.theme} - 3D Yu-Gi-Oh! Cards`;

  const cardList = document.querySelector('.card-list');

  // TODO: port to be a variable
  cardList.innerHTML = vol.cards.reduce((html, card, index) => {
    const filename = `vol${vol.number}-${((index + 1) + '').padStart(2, '0')}`;

    html += `
    <li>
      <a href="./${filename}.html">
        <div class="title">
          <p class="primary">${card}</p>
          <p class="secondary">${card}</p>
        </div>
        <p class="line"></p>
      </a>
    </li>
  `
    return html;
  }, `
    <header class="left-header">Vol ${vol.number}. <em>${vol.theme}</em></header>
  `);
}

function bindEvent() {
  // Toggle Functionality
  const leftToggle = document.querySelector('.left-toggle');
  const rightToggle = document.querySelector('.right-toggle');

  leftToggle.addEventListener('click', () => {
    toggleSidebar('l');
  }, false);

  rightToggle.addEventListener('click', () => {
    toggleSidebar('r');
  }, false);

  // Menu List Animation
  // TODO: use ul tag?
  const links = gsap.utils.toArray('nav li');

  links.forEach(link => {
    const headingStart = link.querySelector('.primary');
    const headingEnd = link.querySelector('.secondary');
    const lineDash = link.querySelector('.line');

    const linkTL = gsap.timeline(link, {
      defaults: {
        duration: .4,
        ease: 'power4.inOut'
      }
    });

    linkTL
      .to(headingStart, {
        yPercent: -100
      })
      .to(headingEnd, {
        yPercent: -100
      }, '<')
      .to(lineDash, {
        scaleX: 1
      }, '<');

    linkTL.pause();

    link.addEventListener('mouseenter', () => {
      linkTL.play();
    }, false);

    link.addEventListener('mouseleave', () => {
      linkTL.reverse();
    }, false);
  });
}

init();


// initial & reload animation
const card = document.querySelector('.container');

const initialAnimation = gsap.timeline({
  defaults: {
    duration: 1,
    ease: 'power4.out'
  }
});

initialAnimation
  .to(card, {
    y: 0
  })
  .to('.left-toggle', {
    opacity: 1,
    x: 0
  }, '=')
  .to('.right-toggle', {
    opacity: 1,
    x: 0
  }, '=');



// Menu Toggle Functionality
const leftMenuTl = gsap.timeline({
  defaults: {
    duration: .6,
    ease: 'power4.inOut'
  }
});

leftMenuTl
  .to('.left-aside', {
    width: '30%',
  })
  .to(['.left-header', '.left-aside li'], {
    x: 0,
    stagger: .1
  }, '=')
  .to('.container', {
    scale: 0.7,
    y: '-10%'
  }, '=')
  .to('.pedestal', {
    y: 0
  }, '=')
  .to('.left-toggle', {
    rotate: 90,
    scale: .8,
    ease: 'power3.out'
  }, '=');

const rightMenuTl = gsap.timeline({
  defaults: {
    duration: .6,
    ease: 'power4.inOut'
  }
});

rightMenuTl
  .to('.right-aside', {
    width: '30%',
  })
  .to(['.right-header', '.right-aside li'], {
    x: 0,
    stagger: .2
  }, '=')
  .to('.container', {
    scale: 0.7,
    y: '-10%'
  }, '=')
  .to('.pedestal', {
    y: 0
  }, '=')
  .to('.right-toggle', {
    rotate: -90,
    scale: .8,
    ease: 'power3.out'
  }, '<');

leftMenuTl.pause();
rightMenuTl.pause();

const menuStatus = {
  l: false,
  r: false
}

const menuTl = {
  l: leftMenuTl,
  r: rightMenuTl
}

const menuController = {
  l: {
    status: false,
    tl: leftMenuTl
  },
  r: {
    status: false,
    tl: rightMenuTl
  }
}

function toggleSidebar(leftOrRight) {
  const currentMenuTl = menuTl[leftOrRight];

  // TODO: 打开一侧，自动关闭另一侧

  if (menuStatus[leftOrRight] === false) {
    menuTl[leftOrRight].play();
    card.style.pointerEvents = 'none';
  } else {
    menuTl[leftOrRight].reverse();
    card.style.pointerEvents = 'auto';
  }

  menuStatus[leftOrRight] = !menuStatus[leftOrRight];
}
