import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import AboutShapes from "./AboutShapes";
import { cn } from "../../lib/utils";
import { burst } from "../../lib/burst";

import styles from "./AboutSection.module.css";
import yasaHeader1 from "../../assets/yasa_header_1.webp?url";
import yasaHeader2 from "../../assets/yasa_header_2.webp?url";

function Highlight2({
  color,
  children,
}: {
  color: string;
  children: ReactNode;
}) {
  return (
    <span
      style={
        {
          "--highlight-color": color,
        } as CSSProperties
      }
      className={`${styles.highlight2} font-semibold`}
    >
      {children}
    </span>
  );
}

function SquigglyLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      className="inline-block font-semibold underline decoration-sky-400 decoration-wavy decoration-2 underline-offset-4 transition-[rotate,text-decoration-color] duration-200 ease-out hover:-rotate-4 hover:decoration-sky-600 focus-visible:-rotate-4 focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      {children}
    </a>
  );
}

function SlickLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <p className="text-center text-lg md:text-left lg:text-xl">
      <a
        href={href}
        className="group bg-[linear-gradient(var(--color-pink-300),var(--color-pink-300))] bg-size-[100%_0.25em] bg-bottom bg-no-repeat px-0.5 font-semibold whitespace-nowrap transition-[background-size] duration-200 ease-out hover:bg-size-[100%_100%] focus-visible:bg-size-[100%_100%] focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        {children}{" "}
        <span
          aria-hidden="true"
          className="inline-block transition-transform duration-200 group-hover:translate-x-1"
        >
          &darr;
        </span>
      </a>
    </p>
  );
}

export default function AboutSection({ random }: { random: number }) {
  const poses = useMemo(() => [yasaHeader1, yasaHeader2], []);
  const [poseIdx, setPoseIdx] = useState(+(random < 0.5));

  const aboutSection = useRef<HTMLDivElement>(null);
  const avatarButton = useRef<HTMLButtonElement>(null);

  const onSectionPointerMove = useCallback(
    ((e) => {
      if (!aboutSection.current) return;

      const rect = aboutSection.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      aboutSection.current.style.setProperty("--pointer-x", `${x}px`);
      aboutSection.current.style.setProperty("--pointer-y", `${y}px`);
      aboutSection.current.style.setProperty(
        "--pointer-nx",
        ((x / rect.width) * 2 - 1).toFixed(3),
      );
      aboutSection.current.style.setProperty(
        "--pointer-ny",
        ((y / rect.height) * 2 - 1).toFixed(3),
      );
      aboutSection.current.dataset.pointer = "";
    }) satisfies React.PointerEventHandler<HTMLElement>,
    [],
  );

  const onSectionPointerLeave = useCallback(
    ((e) => {
      if (!aboutSection.current) return;
      delete aboutSection.current.dataset.pointer;
      aboutSection.current.style.removeProperty("--pointer-nx");
      aboutSection.current.style.removeProperty("--pointer-ny");
    }) satisfies React.PointerEventHandler<HTMLElement>,
    [],
  );

  const onAvatarButtonClick = useCallback(
    ((e) => {
      if (!avatarButton.current) return;

      avatarButton.current.animate([{ scale: "1 0.94" }, { scale: "1" }], {
        duration: 350,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      });

      const origin =
        e.detail > 0
          ? e
          : {
              clientX: 0,
              clientY: 0,
            };
      const rect = avatarButton.current.getBoundingClientRect();
      burst(
        avatarButton.current,
        origin.clientX - rect.left,
        origin.clientY - rect.top,
      );

      setPoseIdx((poseIdx) => {
        return +!poseIdx;
      });
    }) satisfies React.MouseEventHandler<HTMLButtonElement>,
    [],
  );

  return (
    <section
      ref={aboutSection}
      id="about"
      className={`isolate flex flex-col gap-8 overflow-hidden md:flex-row ${styles.bgDots} ${styles.bgDotsSpotlight}`}
      onPointerMove={onSectionPointerMove}
      onPointerLeave={onSectionPointerLeave}
      onPointerCancel={onSectionPointerLeave}
    >
      <div className="mt-10 flex shrink flex-col gap-4 self-center px-6 md:gap-10 md:py-8 md:pr-0 md:pl-8 lg:pl-12 xl:pl-16">
        <div>
          <h1 className="text-center text-4xl font-semibold md:text-left md:text-5xl xl:text-7xl">
            <span
              className={`relative before:rotate-3 before:bg-blue-300 ${styles.highlight}`}
            >
              Yasa's
            </span>{" "}
            humble site
          </h1>
          <p className="text-center italic md:text-left lg:text-lg">
            Web developer by day, game development by heart~
          </p>
        </div>

        <p className="text-center text-lg md:text-left lg:text-xl xl:text-2xl">
          I'm a{" "}
          <Highlight2 color="var(--color-green-200)">
            frontend web developer
          </Highlight2>
          , mostly working with React and its ecosystems. In my spare time, I'm
          doing{" "}
          <Highlight2 color="var(--color-orange-200)">game engine</Highlight2>{" "}
          and{" "}
          <Highlight2 color="var(--color-purple-200)">
            graphics rendering
          </Highlight2>{" "}
          development for my long term project. I also{" "}
          <SquigglyLink href="/blog">blog!</SquigglyLink>
        </p>

        {/* <a
          href="#works"
          className="group inline-flex items-center gap-2 self-center border-2 border-black bg-white px-5 py-2.5 text-lg font-semibold shadow-[4px_4px_0_0_var(--color-pink-300)] transition-[translate,box-shadow] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_var(--color-pink-300)] focus-visible:outline-2 focus-visible:outline-offset-4 active:translate-0 active:shadow-[2px_2px_0_0_var(--color-pink-300)] md:self-start lg:text-xl"
        >
          My Works
          <span
            aria-hidden="true"
            className="transition-transform duration-150 group-hover:translate-x-1"
          >
            &rarr;
          </span>
        </a> */}

        <SlickLink href="#works">My Works</SlickLink>

        <p className="text-center font-semibold italic md:text-left">
          Oh yeah also website still unfinished lol, will be finished
          soon&trade;
        </p>
      </div>

      <div className="relative isolate shrink-0 grow self-end md:w-[50%] md:max-w-150 md:pt-8">
        <AboutShapes className="absolute inset-0 -z-10" />
        <button
          ref={avatarButton}
          type="button"
          aria-label="Yasa's avatar. Press to switch poses"
          className="relative grid w-full origin-bottom cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-4"
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
