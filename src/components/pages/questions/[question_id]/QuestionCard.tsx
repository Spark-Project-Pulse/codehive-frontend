import Link from 'next/link'
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
import { CalendarIcon, UserIcon } from 'lucide-react'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import { type TagOption } from '@/types/Tags'
import { getAllTags } from '@/api/tags'
import { useRouter } from 'next/navigation'
import { Editor } from '@monaco-editor/react'
import { Skeleton } from '@/components/ui/skeleton'
import { useUser } from '@/app/contexts/UserContext'
import UpdateDeleteQuestionDialog from './UpdateDeleteQuestionDialog'
import { GitHubLogoIcon } from '@radix-ui/react-icons'
import DynamicMarkdownPreview from '@/components/universal/code/DynamicMarkdownPreview'
import { useTheme } from 'next-themes'
import { getLanguageFromFilename } from '@/utils/codeEditorHelpers'

interface QuestionCardProps {
  question: Question
  href?: string // Optional prop for link
  codeLine?: string | null
  isLoadingCodeLine?: boolean
  codeLineError?: string | null
  onUpdate?: (updatedQuestion: Question) => void
}

export default function QuestionCard({
  question,
  href,
  onUpdate,
}: QuestionCardProps) {
  const { user: currentUser } = useUser()
  const router = useRouter()
  const { theme } = useTheme() // Get the current theme (light or dark)

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

  // Function to handle community navigation
  const handleCommunityClick = () => {
    if (!href && question.related_community_info) {
      router.push(`/communities/${question.related_community_info.title}`)
    }
  }

  // Function to handle question deletion
  const handleQuestionDelete = () => {
    router.push('/') // Navigate to the home page upon deletion
  }

  const QuestionCardContent = (
    // <Card
    //   className={`relative w-full ${
    //     href &&
    //     'cursor-pointer transition-transform duration-200 hover:scale-105 hover:shadow-lg'
    //   }`}
    // >
    //   <CardHeader>
    //     {question.related_community_info ? (
    //       <div
    //         className={`flex items-center space-x-3 rounded-t-lg pb-2 ${
    //           !href &&
    //           `cursor-pointer rounded-md p-2 transition-transform duration-200 ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`
    //         }`}
    //         onClick={handleCommunityClick}
    //       >
    //         <Avatar className="h-10 w-10">
    //           <AvatarImage
    //             src={question.related_community_info.avatar_url}
    //             alt="Community avatar"
    //           />
    //           <AvatarFallback>
    //             {question.related_community_info.title[0]}
    //           </AvatarFallback>
    //         </Avatar>
    //         <span className="text-sm font-normal">
    //           {question.related_community_info.title}
    //         </span>
    //       </div>
    //     ) : null}
    //     <CardTitle className="text-2xl font-bold">{question.title}</CardTitle>
    //     <CardDescription className="mt-2 text-base">
    //       <DynamicMarkdownPreview value={question.description} />
    //     </CardDescription>
    //   </CardHeader>
    //   <CardContent>
    //     {/* Display the specific line of code if available */}
    //     {question.related_project_info?.project_id &&
    //       question.code_context_full_pathname &&
    //       typeof question.code_context_line_number === 'number' &&
    //       question.code_context && (
    //         <div className="rounded-lg p-4 shadow">
    //           <h2 className="mb-2 flex items-center">Code Context:</h2>
    //           <h3
    //             className={`inline-block cursor-pointer items-center rounded-md p-2 transition-transform duration-200 ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`}
    //             onClick={() =>
    //               router.push(
    //                 `/projects/${question.related_project_info?.project_id}`
    //               )
    //             }
    //           >
    //             <div className="flex items-center">
    //               {/* GitHub Icon */}
    //               <GitHubLogoIcon />
    //               &nbsp;
    //               <span>{question.related_project_info?.title}</span>
    //             </div>
    //           </h3>
    //           <Editor
    //             loading={<Skeleton className="h-full w-full" />}
    //             height="20px"
    //             language={getLanguageFromFilename(
    //               question.code_context_full_pathname
    //             )}
    //             value={question.code_context}
    //             theme={theme === 'dark' ? 'vs-dark' : 'light'}
    //             options={{
    //               lineNumbers: (num) =>
    //                 (num + question.code_context_line_number).toString(),
    //               automaticLayout: true,
    //               selectOnLineNumbers: true,
    //               readOnly: true,
    //               minimap: { enabled: false },
    //               renderLineHighlight: 'all',
    //               scrollBeyondLastLine: false,
    //               cursorStyle: 'block',
    //             }}
    //           />
    //         </div>
    //       )}
    //     {question.tags && question.tags.length > 0 && (
    //       <div className="mt-4 flex flex-wrap items-center gap-2">
    //         <TagIcon className="mr-2 h-4 w-4 text-gray-500" />
    //         {question.tags.map((tagId, index) => {
    //           const tag = tags.find((t) => t.value === tagId)
    //           return tag ? (
    //             <Badge key={index} variant="secondary">
    //               {tag.label}
    //             </Badge>
    //           ) : null
    //         })}
    //       </div>
    //     )}
    //   </CardContent>
    //   <CardFooter className="flex items-center justify-between">
    //     <div
    //       className={`flex items-center space-x-4 ${
    //         question.asker_info && !href
    //           ? `cursor-pointer rounded-md p-2 transition-transform duration-200 ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`
    <div className="to-tertiary rounded-lg bg-gradient-to-b from-primary p-[2px]">
      <Card
        className={`relative w-full ${
          href &&
          'cursor-pointer transition-transform duration-200 hover:scale-105 hover:shadow-lg'
        }`}
      >
        <CardHeader>
          {question.related_community_info ? (
            <div
              className={`flex items-center space-x-3 rounded-t-lg pb-2 ${
                !href &&
                'cursor-pointer rounded-md p-2 transition-transform duration-200 hover:bg-gray-100'
              }`}
              onClick={handleCommunityClick}
            >
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={question.related_community_info.avatar_url}
                  alt="Community avatar"
                />
                <AvatarFallback>
                  {question.related_community_info.title[0]}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-normal">
                {question.related_community_info.title}
              </span>
            </div>
          ) : null}
          <CardTitle className="text-p1 font-subHeading">
            {question.title}
          </CardTitle>
          <CardDescription className="text-p15 mt-2 font-body">
            <DynamicMarkdownPreview value={question.description} />
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Display the specific line of code if available */}
          {question.related_project_info?.project_id &&
            question.code_context_full_pathname &&
            typeof question.code_context_line_number === 'number' &&
            question.code_context && (
              <div className="rounded-lg bg-gray-50 p-4 shadow">
                <h2 className="mb-2 flex items-center font-body">
                  Code Context:
                </h2>
                <h3
                  className="inline-block cursor-pointer items-center rounded-md p-2 transition-transform duration-200 hover:bg-gray-100"
                  onClick={() =>
                    router.push(
                      `/projects/${question.related_project_info?.project_id}`
                    )
                  }
                >
                  <div className="flex items-center">
                    {/* GitHub Icon */}
                    <GitHubLogoIcon />
                    &nbsp;
                    <span>{question.related_project_info?.title}</span>
                  </div>
                </h3>
                <Editor
                  loading={<Skeleton className="h-full w-full" />}
                  height="20px"
                  language={getLanguageFromFilename(
                    question.code_context_full_pathname
                  )}
                  value={question.code_context}
                  theme={theme === 'dark' ? 'vs-dark' : 'light'}
                  options={{
                    lineNumbers: (num) =>
                      (num + question.code_context_line_number).toString(),
                    automaticLayout: true,
                    selectOnLineNumbers: true,
                    readOnly: true,
                    minimap: { enabled: false },
                    renderLineHighlight: 'all',
                    scrollBeyondLastLine: false,
                    cursorStyle: 'block',
                  }}
                />
              </div>
            )}
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <div
            className={`flex items-center space-x-4 ${
              question.asker_info && !href
                ? 'cursor-pointer rounded-md p-2 transition-transform duration-200 hover:bg-gray-100'
                : ''
            }`}
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

        {isCurrentUser && !href && (
          <div className="absolute right-4 top-4">
            <UpdateDeleteQuestionDialog
              question={question}
              onUpdate={(updatedQuestion) => onUpdate?.(updatedQuestion)}
              onDelete={handleQuestionDelete}
            />
          </div>
        )}
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
