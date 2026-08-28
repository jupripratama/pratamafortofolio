import React from 'react';
import { motion } from 'motion/react';
import { soundFx } from '../lib/audio';
import {
  Html5Css3Icon,
  JavaScriptIcon,
  TypeScriptIcon,
  ReactIcon,
  NextjsIcon,
  TailwindIcon,
  NodejsIcon,
  ExpressIcon,
  PostgresIcon,
  MongoDbIcon,
  PrismaIcon,
  GraphQlIcon,
  GitIcon,
  DockerIcon,
  LaravelIcon,
  VercelAwsIcon
} from './TechIcons';

interface SkillItem {
  id: string;
  name: string;
  category: string;
  IconComponent: React.ComponentType;
  iconBg?: string;
  borderColor?: string;
}

export function SkillsSection() {
  const skills: SkillItem[] = [
    // Row 1
    {
      id: 'html5-css3',
      name: 'HTML5 & CSS3',
      category: 'Frontend Core',
      IconComponent: Html5Css3Icon,
      borderColor: 'group-hover:border-orange-500/40'
    },
    {
      id: 'javascript',
      name: 'JavaScript',
      category: 'Programming Language',
      IconComponent: JavaScriptIcon,
      borderColor: 'group-hover:border-yellow-500/40'
    },
    {
      id: 'typescript',
      name: 'TypeScript',
      category: 'Typed JavaScript',
      IconComponent: TypeScriptIcon,
      borderColor: 'group-hover:border-blue-500/40'
    },
    {
      id: 'react',
      name: 'React',
      category: 'Frontend Library',
      IconComponent: ReactIcon,
      borderColor: 'group-hover:border-cyan-400/40'
    },

    // Row 2
    {
      id: 'nextjs',
      name: 'Next.js',
      category: 'Full-stack Framework',
      IconComponent: NextjsIcon,
      borderColor: 'group-hover:border-white/40'
    },
    {
      id: 'tailwind',
      name: 'Tailwind CSS',
      category: 'CSS Framework',
      IconComponent: TailwindIcon,
      borderColor: 'group-hover:border-cyan-400/40'
    },
    {
      id: 'nodejs',
      name: 'Node.js',
      category: 'Backend Runtime',
      IconComponent: NodejsIcon,
      borderColor: 'group-hover:border-emerald-500/40'
    },
    {
      id: 'express',
      name: 'Express.js',
      category: 'REST API Framework',
      IconComponent: ExpressIcon,
      borderColor: 'group-hover:border-slate-400/40'
    },

    // Row 3
    {
      id: 'postgresql',
      name: 'PostgreSQL',
      category: 'Relational Database',
      IconComponent: PostgresIcon,
      borderColor: 'group-hover:border-sky-500/40'
    },
    {
      id: 'mongodb',
      name: 'MongoDB',
      category: 'NoSQL Database',
      IconComponent: MongoDbIcon,
      borderColor: 'group-hover:border-emerald-500/40'
    },
    {
      id: 'prisma',
      name: 'Prisma',
      category: 'Database ORM',
      IconComponent: PrismaIcon,
      borderColor: 'group-hover:border-indigo-400/40'
    },
    {
      id: 'rest-graphql',
      name: 'REST & GraphQL',
      category: 'API Development',
      IconComponent: GraphQlIcon,
      borderColor: 'group-hover:border-pink-500/40'
    },

    // Row 4
    {
      id: 'git-github',
      name: 'Git & GitHub',
      category: 'Version Control',
      IconComponent: GitIcon,
      borderColor: 'group-hover:border-orange-500/40'
    },
    {
      id: 'docker',
      name: 'Docker',
      category: 'Containerization',
      IconComponent: DockerIcon,
      borderColor: 'group-hover:border-sky-500/40'
    },
    {
      id: 'laravel',
      name: 'PHP & Laravel',
      category: 'Backend Framework',
      IconComponent: LaravelIcon,
      borderColor: 'group-hover:border-red-500/40'
    },
    {
      id: 'vercel-aws',
      name: 'Vercel & AWS',
      category: 'Cloud Deployment',
      IconComponent: VercelAwsIcon,
      borderColor: 'group-hover:border-amber-400/40'
    }
  ];

  return (
    <section id="skills" className="py-20 sm:py-24 relative overflow-hidden bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header Matching Reference Image */}
        <motion.div 
          initial={{ opacity: 0, y: 25, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white font-sans">
            Skills &amp; Technologies
          </h2>
        </motion.div>

        {/* 
          Grid Layout:
          - Mobile (< sm): 4 columns banking app style icon grid (clean vertical icon + title layout)
          - Tablet / Desktop (>= sm): 2 to 4 columns horizontal card layout matching reference image
        */}
        <div className="grid grid-cols-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-5">
          {skills.map((skill, idx) => {
            const Icon = skill.IconComponent;
            const colDelay = (idx % 4) * 0.06 + Math.floor(idx / 4) * 0.04;

            return (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 30, scale: 0.95, filter: 'blur(4px)' }}
                whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.5, delay: colDelay, ease: [0.16, 1, 0.3, 1] }}
                onMouseEnter={() => soundFx.playHover()}
                className={`group rounded-xl sm:rounded-2xl bg-[#11151d]/90 backdrop-blur-sm border border-white/[0.07] ${skill.borderColor || 'group-hover:border-cyan-500/40'} transition-all duration-300 flex flex-col sm:flex-row items-center sm:items-center p-2.5 sm:p-4 gap-2 sm:gap-4 cursor-default shadow-lg shadow-black/40 hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(0,0,0,0.6)]`}
              >
                {/* Icon Container: Square dark container with icon */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-lg sm:rounded-xl bg-[#090c12] border border-white/[0.08] flex items-center justify-center p-2 group-hover:scale-105 group-hover:border-white/20 transition-all duration-300 shadow-inner">
                  <Icon />
                </div>

                {/* Text Content */}
                <div className="flex flex-col text-center sm:text-left min-w-0 flex-1">
                  <span className="text-[11px] sm:text-sm lg:text-base font-semibold text-white group-hover:text-cyan-300 transition-colors leading-tight line-clamp-2 sm:line-clamp-1">
                    {skill.name}
                  </span>
                  <span className="hidden sm:block text-xs text-slate-400 font-normal mt-0.5 truncate">
                    {skill.category}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

