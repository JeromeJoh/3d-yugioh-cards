// Tilt.js Configuration
$('.js-tilt').tilt({
  glare: true,
  maxGlare: .5
});


// smooth scroll
const lenis = new Lenis();

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);


// initialize page
import { vol3 } from '/data.js';

const init = () => {
  render(vol3);
};

function render(vol) {
  const containers = document.querySelectorAll('.container');

  vol.cards.forEach((card, index) => {
    const fragmant = document.createDocumentFragment();
    const origin = document.createElement('img');
    origin.classList.add('layer');
    origin.src = `./layers/vol3-0${index + 1}/origin.jpg`;
    fragmant.appendChild(origin);


    for (let i = 0; i < card.layers; i++) {
      const layer = document.createElement('img');
      layer.src = `./layers/vol3-0${index + 1}/layer-${i + 1}.png`;
      layer.classList.add('layer', 'layer-' + (i + 1));
      fragmant.appendChild(layer);
    }
    containers[index].appendChild(fragmant);
  });
}

init();




// scroll animation
gsap.registerPlugin(ScrollTrigger);

const slider = document.querySelector('.slider');
const sections = gsap.utils.toArray('.slider section');

let tl = gsap.timeline({
  defaults: {
    ease: 'none'
  },
  scrollTrigger: {
    trigger: slider,
    pin: true,
    scrub: 2,
    snap: 1 / (sections.length - 1),
    end: () => `+=${slider.offsetWidth}`
  }
});


tl.to(sections, {
  xPercent: -100 * (sections.length - 1),
});

sections.forEach((stop, index) => {
  if (index === 0 || index === sections.length - 1) {
    return;
  }

  tl
    .from(stop.querySelector('.card'), {
      xPercent: 40,
      yPercent: -20,
      scrollTrigger: {
        trigger: stop.querySelector('.card'),
        scrub: 1,
        containerAnimation: tl
      }
    })
    .from(stop.querySelector('.big-picture'), {
      xPercent: 40,
      yPercent: -100,
      opacity: 0,
      ease: 'elastic.out(1,1)',
      scrollTrigger: {
        trigger: stop.querySelector('.big-picture'),
        scrub: 1,
        containerAnimation: tl
      }
    }, '<');
});