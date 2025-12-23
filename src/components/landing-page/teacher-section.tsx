/* eslint-disable @next/next/no-img-element */
import { Container } from "@/components/layout/container";
import { SectionWrapper } from "@/components/layout/section-wrapper";

const teachers = [
  {
    name: "Dessy Oktavia, S.Pd.",
    slug: "dessy-oktavia",
    role: "Professional Tutor",
    avatar: "https://alt.tailus.io/images/team/member-one.webp",
  },
  {
    name: "Anna Enriyani",
    slug: "anna-enriyani",
    role: "Professional Tutor",
    avatar: "https://alt.tailus.io/images/team/member-two.webp",
  },
  {
    name: "Shabrina Felia, S.M.",
    slug: "shabrina-felia",
    role: "Professional Tutor",
    avatar: "https://alt.tailus.io/images/team/member-three.webp",
  },
];

export default function TeacherSection() {
  return (
    <SectionWrapper className="bg-background">
      <Container className="py-12 md:py-24">
        <div className="mt-12 gap-6 lg:grid lg:grid-cols-2 md:mt-20">
          <div className="max-w-md mx-auto lg:mx-0">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
              Professional Teachers
            </h2>
          </div>
          <div className="mt-6 lg:mt-0">
            <p className="text-muted-foreground leading-relaxed text-base md:text-lg max-w-2xl mx-auto lg:mx-0">
              Pendidik kami bukan sekadar pengajar, melainkan mentor yang siap
              membimbing siswa dengan kurikulum terukur demi mewujudkan visi dan
              kesuksesan di masa depan.
            </p>
          </div>
        </div>

        <div className="mt-12 md:mt-20">
          <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {teachers.map((member, index) => (
              <div key={index} className="group flex flex-col text-left">
                <div className="relative overflow-hidden rounded-2xl bg-muted">
                  <img
                    className="aspect-4/5 w-full object-cover object-top grayscale transition-all duration-700 ease-in-out group-hover:scale-105 group-hover:grayscale-0"
                    src={member.avatar}
                    alt={member.name}
                    loading="lazy"
                  />
                </div>

                <div className="mt-6">
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <h3 className="text-xl md:text-2xl font-bold text-foreground tracking-tight transition-all duration-500 group-hover:text-primary">
                      {member.name}
                    </h3>
                    <span className="text-xs font-mono text-muted-foreground">
                      / 0{index + 1}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between overflow-hidden">
                    <span className="text-sm md:text-base text-muted-foreground translate-y-0 transition-transform duration-500 group-hover:-translate-y-1">
                      {member.role}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </SectionWrapper>
  );
}
