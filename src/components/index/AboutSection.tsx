import { useCallback, useMemo, useRef, useState } from "react";
import { cn } from "../../lib/utils";

import styles from "./AboutSection.module.css";
import yasaHeader1 from "../../assets/yasa_header_1.png?url";
import yasaHeader2 from "../../assets/yasa_header_2.png?url";

export default function AboutSection({ random }: { random: number }) {
  const poses = useMemo(() => [yasaHeader1, yasaHeader2], []);
  const [poseIdx, setPoseIdx] = useState(+(random < 0.5));

  const avatarButton = useRef<HTMLButtonElement>(null);

  const onAvatarButtonClick = useCallback(() => {
    if (!avatarButton.current) return;

    avatarButton.current.animate([{ scale: "1 0.94" }, { scale: "1" }], {
      duration: 350,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    });

    setPoseIdx((poseIdx) => {
      return +!poseIdx;
    });
  }, []);

  return (
    <section
      id="about"
      className={`isolate flex flex-col gap-8 overflow-hidden md:flex-row ${styles.bgDots} ${styles.bgDotsSpotlight}`}
    >
      <div className="mt-10 flex shrink flex-col gap-4 self-center px-6 md:gap-10 md:py-8 md:pr-0 md:pl-8 lg:pl-12 xl:pl-16">
        <div>
          <h1 className="text-center text-4xl font-semibold md:text-left md:text-5xl xl:text-7xl">
            <span className={`relative ${styles.highlight}`}>Yasa's</span>{" "}
            humble site
          </h1>
          <p className="text-center italic md:text-left lg:text-lg">
            Web developer by day, game development by heart~
          </p>
        </div>

        <p className="text-center text-lg md:text-left lg:text-xl xl:text-2xl">
          I am a frontend web developer, mostly working with React and its
          ecosystems. In my spare time, I'm currently learning game development,
          engine, and graphics rendering for my long term project. I also blog!
        </p>

        <p className="text-center font-semibold italic md:text-left">
          Oh yeah also website still unfinished lol, will be finished
          soon&trade;
        </p>
      </div>

      <div className="relative isolate shrink-0 grow self-end md:w-[50%] md:max-w-150 md:pt-8">
        {/* <AboutShapes className="absolute inset-0 -z-10" /> */}
        <button
          ref={avatarButton}
          type="button"
          aria-label="Yasa's avatar. Press to switch poses"
          className="grid w-full origin-bottom cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-4"
          onClick={onAvatarButtonClick}
        >
          {poses.map((pose, i) => (
            <img
              key={pose}
              src={pose}
              alt="Yasa's avatar"
              className={cn([
                "col-start-1 row-start-1 h-auto w-full self-end transition-opacity duration-150",
                i !== poseIdx && "opacity-0",
              ])}
            />
          ))}
        </button>
      </div>
    </section>
  );
}
