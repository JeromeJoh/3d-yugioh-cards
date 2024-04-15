import { preloadImages } from "./utils.js";

const init = () => {
  const debug = false;
  if (debug) {
    document.querySelector("[data-debug]").classList.add("debug");
  }

  entranceAnimation();

  bindEvent();
};

const rouletteTween = gsap.to(".group", {
  rotation: 360,
  duration: 20,
  repeat: -1,
  ease: "none",
  paused: true
});

rouletteTween.delay(1);

function entranceAnimation() {
  const breakPoint = "53em";
  const mm = gsap.matchMedia();

  mm.add(
    {
      isDesktop: `(min-width: ${breakPoint})`,
      isMobile: `(max-width: ${breakPoint})`,
    },
    (context) => {
      let { isDesktop } = context.conditions;

      const image = document.querySelector(".card__img");
      const cardList = gsap.utils.toArray(".card");
      const count = cardList.length;
      const sliceAngle = (2 * Math.PI) / count;

      // Distance from the image center to the screen center.
      const radius1 = 50 + image.clientHeight / 2;
      const radius2 = isDesktop ? 250 - radius1 : 180 - radius1;

      gsap
        .timeline()
        .from(cardList, {
          y: window.innerHeight / 2 + image.clientHeight * 1.5,
          rotateX: -180,
          stagger: 0.1,
          duration: 0.5,
          opacity: 0.8,
          scale: 3,
        })
        .set(cardList, {
          transformOrigin: `center ${radius1 + image.clientHeight / 2}px`,
        })
        .set(".group", {
          transformStyle: "preserve-3d",
        })
        .to(cardList, {
          y: -radius1,
          duration: 0.5,
          ease: "power1.out",
        })
        .to(
          cardList,
          {
            rotation: (index) => {
              return (index * 360) / count;
            },
            rotateY: 15,
            duration: 1,
            ease: "power1.out",
          },
          "<"
        )
        .to(cardList, {
          // Expand the radius
          x: (index) => {
            return Math.round(
              radius2 * Math.cos(sliceAngle * index - Math.PI / 4)
            );
          },
          y: (index) => {
            return (
              Math.round(radius2 * Math.sin(sliceAngle * index - Math.PI / 4)) -
              radius1
            );
          },
          rotation: (index) => {
            return (index + 1) * (360 / count);
          },
        })
        .to(
          cardList,
          {
            rotateY: 180,
            opacity: 0.8,
            duration: 1,
          },
          "<"
        )
        .from(
          ".headings",
          {
            opacity: 0,
            filter: "blur(60px)",
            duration: 1,
            onComplete: () => rouletteTween.play()
          },
          "<"
        );

      return () => { };
    }
  );
}

function bindEvent() {
  let currentCardIdx = null;

  const cardList = gsap.utils.toArray(".card");

  cardList.forEach((card, index) => {

    const layers = gsap.utils.toArray('.wrapper img');

    let isZoomed = false;

    const zoomTl = gsap.timeline({
      paused: true,
    });

    zoomTl
      .to('.group', {
        rotation: 360 - (index + 1) * 45,
        y: 420,

      })
      .to(card, {
        rotateY: -180,
        scale: 2.4,
        onComplete: () => {
          rouletteTween.pause();
        },
        onReverseComplete: () => {
          rouletteTween.play();
        }
      }, '<')
      .to('.headings', {
        scale: .5,
        opacity: 0,
      }, '<')
      .to(layers, {
        z: (index) => (index + 1) * 10,
        scale: 1,
        opacity: 1,
        stagger: 0.1,
        ease: "power.inOut",
      });


    card.addEventListener("click", () => {
      currentCardIdx = index;

      if (!isZoomed) {
        zoomTl.play();
      } else {
        zoomTl.reverse();
      }
      isZoomed = !isZoomed;
    });


  });

  const booth = document.querySelector(".booth");
  booth.addEventListener("click", () => {
    console.log("booth");
    cardList[currentCardIdx].click();
  });
}

import { vol4 } from '/data.js';

function loadLayers() {
  const container = document.createElement("div");
  container.dataset.tilt = '';
  const img = document.createElement("img");
  img.src = '/vol4/layers/vol4-01/origin.jpg';
  container.appendChild(img);

  return container;
}

preloadImages().then(() => {
  document.body.classList.remove("loading");
  loadLayers();
  init();
});
