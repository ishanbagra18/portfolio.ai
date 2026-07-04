import { Dots, Tag, Card, TornDivider } from './Brutal';

const About = ({ data }) => {
  return (
    <section className="relative w-full overflow-hidden bg-[#F6F1E4] px-4 sm:px-6 lg:px-10 py-24">
      <TornDivider color="#12110F" />
      <Dots />

      <div className="relative z-10 mx-auto max-w-7xl pt-12">
        <Tag bg="#B6F24B" rotate="rotate-1">
          02 · About
        </Tag>

        <h3 className="mt-6 max-w-2xl font-['Archivo_Black'] text-3xl sm:text-4xl lg:text-5xl leading-tight text-[#12110F]">
          A little more about me
        </h3>

        <div className="mt-12 grid gap-8 lg:grid-cols-5">
          <Card rotate="-rotate-1" className="lg:col-span-3 p-7 sm:p-9">
            <p className="font-['Inter'] text-base sm:text-lg leading-8 text-[#12110F]/80">
              {data.about_paragraph}
            </p>
          </Card>

          <div className="lg:col-span-2 flex flex-col gap-6">
            <Card rotate="rotate-1" className="p-6" shadow="#3B5BFF">
              <p className="font-['Space_Mono'] text-[11px] uppercase tracking-widest text-[#12110F]/50">
                Education
              </p>
              <p className="mt-2 font-['Space_Grotesk'] text-lg font-bold text-[#12110F]">
                {data.college_name}
              </p>
              <p className="mt-1 text-sm text-[#12110F]/70">{data.course_name}</p>
            </Card>

            <Card rotate="-rotate-2" className="p-6" shadow="#FF4D9D">
              <p className="font-['Space_Mono'] text-[11px] uppercase tracking-widest text-[#12110F]/50">
                Handles
              </p>
              <p className="mt-2 font-['Space_Grotesk'] text-sm font-bold text-[#12110F]">
                GitHub — @{data.github_username}
              </p>
              <p className="mt-1 font-['Space_Grotesk'] text-sm font-bold text-[#12110F]">
                LeetCode — @{data.leetcode_username}
              </p>
            </Card>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card rotate="rotate-1" className="p-6">
            <Tag bg="#FFD23F" rotate="-rotate-1">
              GitHub Streak
            </Tag>
            <img
              src={`https://github-readme-streak-stats.herokuapp.com/?user=${data.github_username}&theme=dark&hide_border=true`}
              alt="GitHub Streak"
              className="mt-4 w-full border-[3px] border-[#12110F]"
            />
          </Card>

          <Card rotate="-rotate-1" className="p-6">
            <Tag bg="#B6F24B" rotate="rotate-1">
              LeetCode Stats
            </Tag>
            <img
              src={`https://leetcard.jacoblin.cool/${data.leetcode_username}?theme=dark&font=Space+Mono&ext=activity`}
              alt="LeetCode Stats"
              className="mt-4 w-full border-[3px] border-[#12110F]"
            />
          </Card>
        </div>
      </div>
    </section>
  );
};

export default About;