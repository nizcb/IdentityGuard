import React from "react";
import { useTypewriter, Cursor } from "react-simple-typewriter";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaReact } from "react-icons/fa";
import { SiTailwindcss, SiFigma, SiNextdotjs } from "react-icons/si";

const LeftBanner = () => {
  const [text] = useTypewriter({
    words: [
      "Protégez vos données.",
      "Prouvez votre âge sans la divulguer.",
      "Votez en  gardant votre anonymat.",
    ],
    loop: true,
    typeSpeed: 20,
    deleteSpeed: 10,
    delaySpeed: 2000,
  });
  return (
    <div className="w-full lgl:w-3/5 flex flex-col gap-20">
      <div className="flex flex-col gap-5">
        <h4 className=" text-lg font-normal">IdentityGuard</h4>
        <h1 className="text-6xl font-bold text-black">
          Avec la technologie{" "}
          <span className="text-designColor capitalize">ZKP</span>
        </h1>
        <h2 className="text-4xl font-bold text-black">
          <span>{text}</span>
          <Cursor
            cursorBlinking="false"
            cursorStyle="|"
            cursorColor="#123456"
          />
        </h2>
      </div>
      <div className="flex flex-col xl:flex-row gap-6 lgl:gap-0 justify-between"></div>
    </div>
  );
};

export default LeftBanner;
