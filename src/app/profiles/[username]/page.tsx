'use client'

import ProfileSkeleton from '@/components/pages/profiles/ProfileSkeleton'
import ProjectsSkeleton from '@/components/pages/profiles/ProjectsSkeleton'
import QuestionsSkeleton from '@/components/pages/profiles/QuestionsSkeleton'
import { type User } from '@/types/Users'
import { type Question } from '@/types/Questions'
import { type Project } from '@/types/Projects'
import { type UserBadge, type UserBadgeProgress } from '@/types/Badges'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Badge as BadgeComponent } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getUserBadges, getUserBadgeProgress } from '@/api/badges'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useEffect, useState } from 'react'
import { getUserByUsername, uploadProfileImage } from '@/api/users'
import { getQuestionsByUserId } from '@/api/questions'
import { getProjectsByUserId } from '@/api/projects'
import { useRouter } from 'next/navigation'
import { useUser } from '@/app/contexts/UserContext'
import { useToast } from '@/components/ui/use-toast'
import { AvatarFallback } from '@radix-ui/react-avatar'
import UpdateDeleteQuestionDialog from '@/components/pages/questions/[question_id]/UpdateDeleteQuestionDialog'
import { Pencil } from 'lucide-react'
import { useTheme } from 'next-themes'

export default function ProfilePage({
  params,
}: {
  params: { username: string }
}) {
  const { user: currentUser } = useUser()
  const [user, setUser] = useState<User | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [showUploadFiles, setShowUploadFiles] = useState<boolean>(false)
  const [badges, setBadges] = useState<UserBadge[]>([])
  const [isUserLoading, setIsUserLoading] = useState(true)
  const [isProjectsLoading, setIsProjectsLoading] = useState(true)
  const [isQuestionsLoading, setIsQuestionsLoading] = useState(true)
  const [isBadgesLoading, setIsBadgesLoading] = useState(true)
  const isCurrentUser = user?.user === currentUser?.user

  const { toast } = useToast()
  const router = useRouter()

  const { theme } = useTheme() // Get the current theme (light or dark)
  const getHoverClass = () =>
    theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
  const getSelectedClass = () =>
    theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'

  useEffect(() => {
    const fetchUser = async () => {
      setIsUserLoading(true)
      try {
        const response = await getUserByUsername(params.username)
        if (response.errorMessage) {
          console.error('Error fetching user:', response.errorMessage)
          return
        }

        // Set the user state with the fetched data
        setUser(response.data ?? null)
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setIsUserLoading(false)
      }
    }
    void fetchUser()
  }, [params.username])

  useEffect(() => {
    const fetchProjects = async () => {
      // Check if user id is defined before proceeding
      if (!user?.user) {
        console.error('User ID is undefined.')
        return
      }
      setIsProjectsLoading(true)

      try {
        const response = await getProjectsByUserId(user.user)
        if (response.errorMessage) {
          console.error('Error fetching projects:', response.errorMessage)
          return
        }
        // Set the projects state with the fetched data
        setProjects(response.data ?? [])
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setIsProjectsLoading(false)
      }
    }

    const fetchQuestions = async () => {
      if (!user?.user) {
        console.error('User ID is undefined.')
        return
      }
      setIsQuestionsLoading(true)

      try {
        const response = await getQuestionsByUserId(user.user) // Fetch questions for the user
        if (response.errorMessage) {
          console.error('Error fetching questions:', response.errorMessage)
          return
        }
        // Set the questions state with the fetched data
        setQuestions(response.data ?? [])
      } catch (error) {
        console.error('Error fetching questions:', error)
      } finally {
        setIsQuestionsLoading(false)
      }
    }

    const fetchBadges = async () => {
      if (!user?.user) {
        console.error('User ID is undefined.')
        return
      }
      setIsBadgesLoading(true)

      try {
        // Fetch UserBadges and UserBadgeProgress
        const response = await getUserBadges(user.user)
        const progressResponse = await getUserBadgeProgress(user.user)

        if (response.errorMessage || progressResponse.errorMessage) {
          console.error(
            'Error fetching badges or progress:',
            response.errorMessage ?? progressResponse.errorMessage
          )
          return
        }

        const userBadges: UserBadge[] = response.data!
        const userBadgeProgress: UserBadgeProgress[] = progressResponse.data!

        // Merge progress data into badges
        const badgesWithProgress = userBadges.map((badge) => {
          const progress = userBadgeProgress.find(
            (p) => p.badge_info.badge_id === badge.badge_info.badge_id
          )

          return {
            ...badge,
            progress_value: progress?.progress_value ?? 0,
            progress_target: progress?.progress_target ?? 0,
          }
        })

        setBadges(badgesWithProgress)
      } catch (error) {
        console.error('Error fetching badges or progress:', error)
      } finally {
        setIsBadgesLoading(false)
      }
    }

    // Only fetch questions/projects/profileImage if user is set
    if (user) {
      void fetchProjects()
      void fetchQuestions()
      void fetchBadges()
    }
  }, [user])

  // Handle navigation on click for projects
  const handleProjectClick = (projectId: string) => {
    router.push(`/projects/${projectId}`)
  }

  // Handle navigation on click for questions
  const handleQuestionClick = (questionId: string) => {
    router.push(`/questions/${questionId}`)
  }

  // Handle show edit profile on click
  function handleShowEditProfileClick() {
    // If the show upload files button is there, then hide it. Else show it
    if (showUploadFiles) {
      setShowUploadFiles(false)
    } else {
      setShowUploadFiles(true)
    }
  }

  async function handlePhotoUpload(photo: React.ChangeEvent<HTMLInputElement>) {
    const file = photo.target.files?.[0]
    if (file && user) {
      try {
        const formData = new FormData()
        formData.append('profile_image', file)
        const { errorMessage } = await uploadProfileImage(user.user, formData)
        setShowUploadFiles(false)
        if (errorMessage) {
          // Show innapropriate content toast if there is innapropriate content
          toast({
            variant: 'destructive',
            title: 'Error',
            description: errorMessage,
          })
        }
      } catch (error) {
        console.error('File upload failed:', error)
      }
    } else {
      console.error('File upload error')
    }
  }
  // Conditional rendering for loading state
  if (isUserLoading) {
    return <ProfileSkeleton />
  }

  // Function to update the question state when a question is updated
  const handleQuestionUpdate = (updatedQuestion: Question) => {
    const updatedQuestions = questions.map((question) =>
      question.question_id === updatedQuestion.question_id
        ? updatedQuestion
        : question
    )
    setQuestions(updatedQuestions)
  }

  // Function to delete a question from the state when a question is deleted
  const handleQuestionDelete = (questionId: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.filter((question) => question.question_id !== questionId)
    )
  }

  return (
    <div className="container mx-auto">
      <div className="flex flex-col gap-8 md:flex-row">
        <div className="md:w-1/3">
          {/* <Card>
            <CardHeader className="flex flex-col items-center">
              <div className="relative h-32 w-32">
                <Avatar className="h-32 w-32 rounded-full bg-muted">
                  <AvatarImage
                    src={`${user?.profile_image_url}?t=${Date.now()}`}
                    alt="User profile picture"
                  />
                  <AvatarFallback className="flex h-full w-full items-center justify-center bg-muted text-2xl font-bold text-muted-foreground">
                    {user?.username?.charAt(0).toUpperCase() ?? 'G'}
                  </AvatarFallback>
                </Avatar>
                {isCurrentUser && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        className="edit-icon absolute bottom-2 right-2 flex h-6 w-6 items-center justify-center border-none p-0"
                        aria-label="Edit Profile"
                      >
                        <Pencil className="h-5 w-5" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="absolute top-full z-10 mt-2 max-w-xs rounded-md p-3 shadow-lg sm:max-w-sm md:max-w-md">
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <h4 className="font-medium leading-none">
                            Profile Picture
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            A picture helps people recognize you and lets you
                            know when you signed in to your account
                          </p>
                        </div>
                        <div className="grid gap-2">
                          <div className="grid grid-cols-3 items-center gap-4">
                            <Button
                              variant="outline"
                              onClick={() => handleShowEditProfileClick()}
                              id="width"
                              className="col-span-2 h-10"
                            >
                              {' '}
                              Change Image
                              <Pencil />
                            </Button> */}
          <div className="to-tertiary rounded-md bg-gradient-to-b from-primary p-[2px]">
            <Card>
              <CardHeader className="flex flex-col items-center">
                <div className="relative h-32 w-32">
                  <Avatar className="h-32 w-32 rounded-full bg-muted">
                    <AvatarImage
                      src={`${user?.profile_image_url}?t=${Date.now()}`}
                      alt="User profile picture"
                    />
                    <AvatarFallback className="flex h-full w-full items-center justify-center bg-muted text-2xl font-bold text-muted-foreground">
                      {user?.username?.charAt(0).toUpperCase() ?? 'G'}
                    </AvatarFallback>
                  </Avatar>
                  {isCurrentUser && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          className="edit-icon absolute bottom-2 right-2 h-6 w-6 cursor-pointer border-none bg-transparent p-0"
                          aria-label="Edit Profile"
                        >
                          <img
                            src="/edit_pencil.svg"
                            alt="Edit Profile"
                            className="h-full w-full"
                          />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="grid gap-4">
                          <div className="space-y-2">
                            <h4 className="font-medium leading-none">
                              Profile Picture
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              A picture helps people recognize you and lets you
                              know when you signed in to your account
                            </p>
                          </div>
                          <div className="grid gap-2">
                            <div className="grid grid-cols-3 items-center gap-4">
                              <Button
                                variant="outline"
                                onClick={() => handleShowEditProfileClick()}
                                id="width"
                                className="col-span-2 h-10"
                              >
                                {' '}
                                Change Image
                                <img
                                  src="/edit_pencil.svg"
                                  alt="Edit Profile"
                                  className="h-full w-full"
                                />
                              </Button>
                            </div>
                            {/* )}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
              <CardTitle className="mt-4 text-2xl">{user?.username}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <BadgeComponent variant="secondary" className="px-3 py-1 text-lg">
                Reputation: {user?.reputation}
              </BadgeComponent>
              {!isBadgesLoading && badges.length > 0 && (
                <div className="mt-4 grid grid-cols-6 justify-items-center gap-x-4 gap-y-4">
                  {badges.map((userBadge) => {
                    const {
                      badge_info,
                      badge_tier_info,
                      progress_value,
                      progress_target,
                    } = userBadge

                    // Determine which badge info to display
                    const displayBadge = badge_tier_info ?? badge_info

                    return (
                      <Popover key={userBadge.id}>
                        <PopoverTrigger asChild>
                          <div className="relative">
                            <img
                              src={
                                displayBadge.image_url ?? '/default-badge.png'
                              }
                              alt={displayBadge.name}
                              className="h-8 w-8 cursor-pointer transition-transform duration-200 hover:scale-110"
                            />
                            {badge_tier_info && (
                              <span className="absolute bottom-0 right-0 inline-flex items-center justify-center rounded-full bg-primary px-1 text-xs font-bold leading-none text-primary-foreground">
                                {badge_tier_info.tier_level}
                              </span>
                            )}
                          </div>
                        </PopoverTrigger>
                        <PopoverContent className="absolute top-full z-10 mt-2 max-w-xs rounded-md bg-card p-3 text-card-foreground shadow-lg sm:max-w-sm md:max-w-md">
                          <h4 className="break-words text-base font-medium">
                            {displayBadge.name || 'Unnamed Badge'}
                          </h4>
                          <p className="mt-2 break-words text-sm text-muted-foreground">
                            {displayBadge.description ||
                              'No description available.'}
                          </p>
                          {badge_tier_info && (
                            <p className="mt-1 text-sm text-muted-foreground">
                              Tier {badge_tier_info.tier_level}
                            </p>
                          )}
                          {progress_target ? (
                            <div className="mt-2 text-sm">
                              <p className="text-muted-foreground">
                                Progress: {progress_value}/{progress_target}
                              </p>
                              <div className="relative mt-1 h-2 w-full overflow-hidden rounded-full bg-muted">
                                <div
                                  className="absolute h-full rounded-full bg-chart-1"
                                  style={{
                                    width: `${((progress_value ?? 0) / (progress_target ?? 1)) * 100}%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                          ) : (
                            <p className="mt-2 text-sm text-accent">
                              Congratulations! You&apos;ve reached the highest
                              tier!
                            </p>
                          )}
                        </PopoverContent>
                      </Popover>
                    )
                  })} */}
                            {showUploadFiles && (
                              <div className="grid grid-cols-3 items-center gap-4">
                                <Input
                                  type="file"
                                  id="height"
                                  className="col-span-2 h-10"
                                  onChange={handlePhotoUpload}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
                <CardTitle className="text-h5 mt-4 font-subHeading">
                  {user?.username}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <BadgeComponent
                  variant="tertiary"
                  className="text-p20 ml-2 px-2.5 py-1 font-body"
                >
                  Reputation: {user?.reputation}
                </BadgeComponent>
                {!isBadgesLoading && badges.length > 0 && (
                  <div className="mt-4 grid grid-cols-6 justify-items-center gap-x-4 gap-y-4">
                    {badges.map((userBadge) => {
                      const {
                        badge_info,
                        badge_tier_info,
                        progress_value,
                        progress_target,
                      } = userBadge

                      // Determine which badge info to display
                      const displayBadge = badge_tier_info ?? badge_info

                      return (
                        <Popover key={userBadge.id}>
                          <PopoverTrigger asChild>
                            <div className="relative">
                              <img
                                src={
                                  displayBadge.image_url ?? '/default-badge.png'
                                }
                                alt={displayBadge.name}
                                className="h-8 w-8 cursor-pointer transition-transform duration-200 hover:scale-110"
                              />
                              {badge_tier_info && (
                                <span className="absolute bottom-0 right-0 inline-flex items-center justify-center rounded-full bg-primary px-1 text-xs font-bold leading-none text-primary-foreground">
                                  {badge_tier_info.tier_level}
                                </span>
                              )}
                            </div>
                          </PopoverTrigger>
                          <PopoverContent className="absolute top-full z-10 mt-2 max-w-xs rounded-md bg-card p-3 text-card-foreground shadow-lg sm:max-w-sm md:max-w-md">
                            <h4 className="break-words text-base font-medium">
                              {displayBadge.name || 'Unnamed Badge'}
                            </h4>
                            <p className="mt-2 break-words text-sm text-muted-foreground">
                              {displayBadge.description ||
                                'No description available.'}
                            </p>
                            {badge_tier_info && (
                              <p className="mt-1 text-sm text-muted-foreground">
                                Tier {badge_tier_info.tier_level}
                              </p>
                            )}
                            {progress_target ? (
                              <div className="mt-2 text-sm">
                                <p className="text-muted-foreground">
                                  Progress: {progress_value}/{progress_target}
                                </p>
                                <div className="relative mt-1 h-2 w-full overflow-hidden rounded-full bg-muted">
                                  <div
                                    className="absolute h-full rounded-full bg-chart-1"
                                    style={{
                                      width: `${((progress_value ?? 0) / (progress_target ?? 1)) * 100}%`,
                                    }}
                                  ></div>
                                </div>
                              </div>
                            ) : (
                              <p className="mt-2 text-sm text-accent">
                                Congratulations! You&apos;ve reached the highest
                                tier!
                              </p>
                            )}
                          </PopoverContent>
                        </Popover>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="md:w-2/3">
          <Tabs defaultValue="projects" className="w-full">
            <TabsList className="mb-8 grid w-full grid-cols-2">
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="questions">Questions</TabsTrigger>
            </TabsList>
            <TabsContent value="projects">
              <Card>
                <CardHeader>
                  <CardTitle className="text-h6">Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  {isProjectsLoading ? (
                    <ProjectsSkeleton />
                  ) : projects.length === 0 && isCurrentUser ? (
                    <div className="flex items-center justify-center py-8">
                      <Button
                        onClick={() => router.push('/projects/add-project')}
                      >
                        Add your first project
                      </Button>
                    </div>
                  ) : (
                    <ul className="space-y-4">
                      {projects.map((project, index) => (
                        <li
                          // key={project.project_id}
                          // className={`cursor-pointer rounded-md p-4 transition-colors duration-300 ${getHoverClass()} ${
                          //   project.project_id === currentUser?.user
                          //     ? getSelectedClass()
                          //     : ''
                          // }`}
                          key={index}
                          className="cursor-pointer rounded-md border-b p-4 transition-colors duration-300 last:border-b-0 hover:bg-secondary"
                          onClick={() => handleProjectClick(project.project_id)}
                        >
                          <h3 className="text-lg font-semibold">
                            {project.title}
                          </h3>
                          <p className="text-sm">{project.description}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="questions">
              <Card>
                <CardHeader>
                  <CardTitle className="text-h6">Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  {isQuestionsLoading ? (
                    <QuestionsSkeleton />
                  ) : (
                    <ul className="ml-4 space-y-4">
                      {questions.map((question) => (
                        // <div key={question.question_id} className="relative">
                        //   <li
                        //     key={question.question_id}
                        //     className={`cursor-pointer rounded-md p-4 transition-colors duration-300 ${getHoverClass()} ${
                        //       question.question_id === currentUser?.user
                        //         ? getSelectedClass()
                        //         : ''
                        //     }`}
                        //     onClick={() =>
                        //       handleQuestionClick(question.question_id)
                        //     }
                        //   >
                        //     <h3 className="text-lg font-semibold">
                        //       {question.title}
                        //     </h3>
                        //   </li>
                        <div
                          key={question.question_id}
                          className="flex items-center justify-between"
                        >
                          <div className="mr-4 flex-grow border-b border-primary">
                            <li
                              className="cursor-pointer rounded-md p-4 transition-colors duration-300 last:border-b-0 hover:bg-secondary"
                              onClick={() =>
                                handleQuestionClick(question.question_id)
                              }
                            >
                              <h3 className="text-p15 font-body font-semibold">
                                {question.title}
                              </h3>
                            </li>
                          </div>
                          {isCurrentUser && (
                            <div className="">
                              <UpdateDeleteQuestionDialog
                                question={question}
                                onUpdate={handleQuestionUpdate}
                                onDelete={handleQuestionDelete}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
