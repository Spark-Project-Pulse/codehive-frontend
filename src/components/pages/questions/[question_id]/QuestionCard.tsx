import Link from 'next/link'
import { type Question } from '@/types/Questions'
import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
  CardContent,
} from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CalendarIcon, TagIcon, UserIcon } from 'lucide-react'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import { type TagOption } from '@/types/Tags'
import { getAllTags } from '@/api/tags'
import { useRouter } from 'next/navigation'
import { useUser } from '@/app/contexts/UserContext'
import UpdateDeleteQuestionDialog from './UpdateDeleteQuestionDialog'
import { GitHubLogoIcon } from '@radix-ui/react-icons'
import DynamicMarkdownPreview from '@/components/universal/code/DynamicMarkdownPreview'
import { useTheme } from 'next-themes'
import { getLanguageFromFilename } from '@/utils/codeEditorHelpers'
import { Badge } from '@/components/ui/badge'
import ReadOnlyEditor from '@/components/universal/code/ReadOnlyEditor'
import { Button } from '@/components/ui/button'

interface QuestionCardProps {
  question: Question
  href?: string
  onUpdate?: (updatedQuestion: Question) => void
}

export default function QuestionCard({
  question,
  href,
  onUpdate,
}: QuestionCardProps) {
  const { user: currentUser } = useUser()
  const router = useRouter()
  const { resolvedTheme } = useTheme() // Get the current theme (light or dark)

  const isCurrentUser = question.asker === currentUser?.user
  const [tags, setTags] = useState<TagOption[]>([])

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

  // Function to handle hive navigation
  const handleHiveClick = () => {
    if (!href && question.related_hive_info) {
      router.push(`/hives/${question.related_hive_info.title}`)
    }
  }

  // Function to handle question deletion
  const handleQuestionDelete = () => {
    router.push('/') // Navigate to the home page upon deletion
  }

  const QuestionCardContent = (
    <div className="gradient-border">
      <Card
        className={`relative w-full border transition-all ${
          href &&
          'cursor-pointer hover:scale-105 hover:border-2 hover:border-primary hover:shadow-lg'
        }`}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            {question.related_hive_info ? (
              <div
                className={`flex items-center space-x-3 rounded-t-lg p-2 ${
                  !href &&
                  `cursor-pointer rounded-md p-2 transition-transform duration-200 ${resolvedTheme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`
                }`}
                onClick={handleHiveClick}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={question.related_hive_info.avatar_url}
                    alt="Hive avatar"
                  />
                  <AvatarFallback>
                    {question.related_hive_info.title[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-normal">
                  {question.related_hive_info.title}
                </span>
              </div>
            ) : null}
            {isCurrentUser && !href && (
              <div className='ml-auto'>
                <UpdateDeleteQuestionDialog
                  question={question}
                  onUpdate={(updatedQuestion) => onUpdate?.(updatedQuestion)}
                  onDelete={handleQuestionDelete}
                />
              </div>
            )}
          </div>
          <CardTitle className="font-subHeading text-p1">
            {question.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <DynamicMarkdownPreview value={question.description} />
          {/* Display the specific line of code if available */}
          {question.related_project_info?.project_id &&
            question.code_context_full_pathname &&
            question.code_context_line_number_start &&
            question.code_context &&
            question.code_context && (
              <div>
                <hr />
                <div className="my-2 flex items-center gap-2">
                  <Link
                    href={`/projects/${question.related_project_info?.project_id}`}
                  >
                    <Button variant="ghost">
                      <GitHubLogoIcon />
                      {question.related_project_info?.title}
                    </Button>
                  </Link>
                  {question.code_context_full_pathname}
                </div>

                {!href && (
                  <ReadOnlyEditor
                    language={getLanguageFromFilename(
                      question.code_context_full_pathname
                    )}
                    value={question.code_context}
                    theme={resolvedTheme === 'dark' ? 'vs-dark' : 'light'}
                    lineNumberStart={
                      question.code_context_line_number_start ?? 1
                    }
                  />
                )}
              </div>
            )}

          {question.tags && question.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <TagIcon className="mr-2 h-4 w-4 text-gray-500" />
              {question.tags.map((tagId, index) => {
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
          {question.asker_info?.user ? (
            <Link href={`/profiles/${question.asker_info.username}`}>
              <Button variant="ghost" className="py-6">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={question.asker_info?.profile_image_url} />
                  <AvatarFallback>
                    {question.asker_info?.username?.[0] ?? (
                      <UserIcon className="h-4 w-4" />
                    )}
                  </AvatarFallback>
                </Avatar>
                {question.asker_info?.username ?? 'Anonymous User'}
              </Button>
            </Link>
          ) : (
            <Button variant="ghost" className="py-6" disabled>
              <UserIcon className="h-4 w-4" />
              {question.asker_info?.username ?? 'Anonymous User'}
            </Button>
          )}

          <div
            className={`flex items-center space-x-4 ${
              question.asker_info && !href
                ? `cursor-pointer rounded-md p-2 transition-transform duration-200 ${resolvedTheme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`
                : ''
            }`}
            onClick={handleProfileClick}
          ></div>
          <div className="flex items-center text-sm text-gray-500">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {format(new Date(question.created_at), 'PPP')}
          </div>
        </CardFooter>
      </Card>
    </div>
  )

  return href ? (
    <Link href={href} passHref>
      {QuestionCardContent}
    </Link>
  ) : (
    QuestionCardContent
  )
}
