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
        <h1 className="mb-2 text-3xl font-bold">{project.title}</h1>
        <p className="mb-4 text-muted-foreground">{project.description}</p>
        {/* Project visibility badge */}
        <Badge variant={project.public ? 'default' : 'secondary'}>
          {project.public ? 'Public' : 'Private'}
        </Badge>
        {/* Project owner */}
        <p className="mt-4 text-sm text-muted-foreground">
          Owner: {project.owner_info?.username ?? 'Anonymous User'}
        </p>
      </div>
    </div>
  )
}
