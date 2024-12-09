import { Badge } from '@/components/ui/badge'
import { type Project } from '@/types/Projects'

interface ProjectHeaderProps {
  project: Project
}

export default function ProjectHeader({ project }: ProjectHeaderProps) {
  return (
    <div className="mb-4 flex flex-col items-start md:flex-row">
      <div className="flex-1">
        {/* Project title and description */}
        <h1 className="mb-2 text-h5 font-heading">{project.title}</h1>
        <p className="mb-16 text-p1 font-body">{project.description}</p>
        {/* Project visibility badge */}
        <Badge variant='secondary'>
          {project.public ? 'Public' : 'Private'}
        </Badge>
        {/* Project owner */}
        <p className="mt-1 font-body text-p15">
          Owner: {project.owner_info?.username ?? 'Anonymous User'}
        </p>
      </div>
    </div>
  )
}
