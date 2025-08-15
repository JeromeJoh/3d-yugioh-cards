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
import { vol2 } from '/data.js';

const init = () => {
  render(vol2);
};

function render(vol) {
  const cardTitles = document.querySelectorAll('.content h1');
  const cardEffects = document.querySelectorAll('.content p');

  for (let i = 0; i < 4; i++) {
    cardTitles[i].textContent = vol.cards[i].name;
    cardEffects[i].textContent = vol.cards[i].effect;
  }
}

init();




// scroll animation
gsap.registerPlugin(ScrollTrigger);

const slider = document.querySelector('.slider');
const sections = gsap.utils.toArray('.slider section');

const scrollTween = gsap.to(sections, {
  xPercent: -100 * (sections.length - 1),
  ease: 'none',
  scrollTrigger: {
    trigger: slider,
    pin: true,
    scrub: 1,
    snap: 1 / (sections.length - 1),
    end: () => `+=${slider.offsetWidth}`
  }
});

sections.forEach((section) => {
  gsap.from(section.querySelector('h1'), {
    yPercent: 135,
    scrollTrigger: {
      containerAnimation: scrollTween,
      trigger: section.querySelector('h1'),
      start: 'left center',
      toggleActions: 'play none none reverse'
    }
  });

  const pragraph = new SplitType(section.querySelectorAll('p'));

  gsap.from(pragraph.words, {
    y: 40,
    opacity: 0,
    skewX: 30,
    stagger: 0.03,
    scrollTrigger: {
      containerAnimation: scrollTween,
      trigger: section.querySelector('h1'),
      start: 'left center',
      toggleActions: 'play none none reverse'
    }
  });


  gsap.from(section.querySelector('p'), {
    yPercent: 50,
    opacity: 0,
    scrollTrigger: {
      containerAnimation: scrollTween,
      trigger: section.querySelector('p'),
      start: 'left center',
      toggleActions: 'play none none reverse'
    }
  }, '<');

  gsap.from(section.querySelector('.card'), {
    y: 50,
    opacity: 0,
    scrollTrigger: {
      containerAnimation: scrollTween,
      trigger: section,
      start: 'left center',
      toggleActions: 'play none none reverse'
    }
  });

  gsap.to('.inner', {
    scaleX: 1,
    scrollTrigger: {
      scrub: .25
    }
  });

  gsap.from(section.querySelector('.right-col'), {
    scaleY: 0,
    opacity: 0,
    transformOrigin: 'bottom',
    scrollTrigger: {
      containerAnimation: scrollTween,
      trigger: section,
      start: 'left center',
      toggleActions: 'play none none reverse'
    }
  });

});
