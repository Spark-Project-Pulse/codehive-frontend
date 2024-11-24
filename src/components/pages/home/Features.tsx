import React from 'react'

import { BellIcon, GitHubLogoIcon, CodeIcon } from '@radix-ui/react-icons'
import { BentoCard, BentoGrid } from '@/components/ui/bento-grid'
import { Hexagon, MessageCircleQuestionIcon } from 'lucide-react'

const features = [
  {
    Icon: MessageCircleQuestionIcon,
    name: 'Find, Ask, and Answer Questions',
    description: 'Get personal feedback on your work.',
    href: '/',
    cta: 'Learn more',
    background: <img src='/home/features/questions.png' className=" opacity-60" />,
    className: 'lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3',
  },
  {
    Icon: GitHubLogoIcon,
    name: 'GitHub Integration',
    description: 'Easily sync your projects with GitHub repos.',
    href: '/',
    cta: 'Learn more',
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: 'lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3',
  },
  {
    Icon: CodeIcon,
    name: 'AI Powered Code Review',
    description: 'Get real-time feedback on your code.',
    href: '/',
    cta: 'Learn more',
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: 'lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4',
  },
  {
    Icon: Hexagon,
    name: 'Hives',
    description: 'Find communities with similar interests.',
    href: '/',
    cta: 'Learn more',
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: 'lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2',
  },
  {
    Icon: BellIcon,
    name: 'Notifications',
    description: 'Get notified when your question is answered.',
    href: '/',
    cta: 'Learn more',
    background: <img src='/home/features/notifications.png' className=" opacity-60" />,
    className: 'lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4',
  },
]

export default function Features() {
  return (
    <section className="w-full px-20">
      <BentoGrid className="lg:grid-rows-3">
        {features.map((feature) => (
          <BentoCard key={feature.name} {...feature} />
        ))}
      </BentoGrid>
    </section>
  )
}
