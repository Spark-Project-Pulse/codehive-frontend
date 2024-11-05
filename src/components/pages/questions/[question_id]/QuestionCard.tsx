import Link from 'next/link' // Only needed if using Next.js's Link component
import { type Question } from '@/types/Questions'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  CardContent,
} from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { CalendarIcon, TagIcon, UserIcon } from 'lucide-react'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import { type TagOption } from '@/types/Tags'
import { getAllTags } from '@/api/tags'
import { useRouter } from 'next/navigation'

interface QuestionCardProps {
  question: Question
  href?: string // Optional prop for link
}

export default function QuestionCard({ question, href }: QuestionCardProps) {
  const [tags, setTags] = useState<TagOption[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const fetchedTags = await getAllTags()
        setTags(fetchedTags)
      } catch (error) {
        console.error('Error fetching tags:', error)
      }
    }
    void fetchTags()
  }, [])

  // Function to handle profile navigation
  const handleProfileClick = () => {
    if (!href && question.asker_info) {
      router.push(`/profiles/${question.asker_info.username}`)
    }
  }

  const QuestionCardContent = (
    <Card
      className={`w-full ${href && 'cursor-pointer transition-transform duration-200 hover:scale-105 hover:shadow-lg'}`}
    >
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{question.title}</CardTitle>
        <CardDescription className="mt-2 text-base">
          {question.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {question.tags && question.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <TagIcon className="mr-2 h-4 w-4 text-gray-500" />
            {question.tags?.map((tagId, index) => {
              const tag = tags.find((t) => t.value === tagId)
              return tag ? (
                <Badge key={index} variant="secondary">
                  {tag.label}
                </Badge>
              ) : null
            })}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div
          className={`flex items-center space-x-4 ${question.asker_info && !href ? 'cursor-pointer rounded-md p-2 transition-transform duration-200 hover:bg-gray-100' : ''}`}
          onClick={handleProfileClick}
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={question.asker_info?.profile_image_url} />
            <AvatarFallback>
              {question.asker_info?.username?.[0] ?? (
                <UserIcon className="h-4 w-4" />
              )}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">
              {question.asker_info?.username ?? 'Anonymous User'}
            </p>
          </div>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {format(new Date(question.created_at), 'PPP')}
        </div>
      </CardFooter>
    </Card>
  )

  return href ? (
    <Link href={href} passHref>
      {QuestionCardContent}
    </Link>
  ) : (
    QuestionCardContent
  )
}
