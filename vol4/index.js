import { gsap } from "gsap";
import VanillaTilt from 'vanilla-tilt';
import { preloadImages } from "./js/utils.js";

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

import { vol4 } from "/data.js";

function bindEvent() {
  let currentCardIdx = null;

  const cardList = gsap.utils.toArray(".card");

  cardList.forEach((card, index) => {

    const layers = gsap.utils.toArray(`.wrapper .card-${index + 1}`);

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
        zIndex: 2000,
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
        z: (index) => (index + 1) * 8,
        scale: (index) => 1 + index * 0.05,
        opacity: 1,
        stagger: 0.1,
        ease: "power.inOut",
      })
      .to('.color-block', {
        scaleX: 1,
        opacity: 1,
        background: vol4.cards[index].color,
        ease: 'power3.inOut',
        duration: 1
      }, '<')
      .to('.caption', {
        top: '12%',
        opacity: 1,
        ease: 'power.inOut',
      }, '<');


    card.addEventListener("click", (e) => {
      const caption = document.querySelector(".caption");
      caption.innerText = vol4.cards[index].name;

      if (!isZoomed) {
        currentCardIdx = index;
        zoomTl.play();
      } else {
        zoomTl.reverse();
        currentCardIdx = null;
      }
      isZoomed = !isZoomed;
    });
  });

  const booth = document.querySelector(".booth");
  booth.addEventListener("click", () => {
    currentCardIdx !== null && cardList[currentCardIdx].click();
  });
}

preloadImages().then(() => {
  document.body.classList.remove("loading");
  VanillaTilt.init(document.querySelectorAll('.container'), {
    glare: true,
    "max-glare": 0.5
  });
  init();
});
