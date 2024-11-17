'use client'

import { LoadingSpinner } from '@/components/ui/loading'
import { type User } from '@/types/Users'
import { type Question } from '@/types/Questions'
import { type Project } from '@/types/Projects'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useEffect, useState } from 'react'
import { getUserByUsername, uploadProfileImage } from '@/api/users'
import { getQuestionsByUserId } from '@/api/questions'
import { getProjectsByUserId } from '@/api/projects'
import { useRouter } from 'next/navigation'
import { useUser } from '@/app/contexts/UserContext'
import { useToast } from '@/components/ui/use-toast'

export default function ProfilePage({
  params,
}: {
  params: { username: string }
}) {
  const { user: currentUser } = useUser();
  const [user, setUser] = useState<User | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [showUploadFiles, setShowUploadFiles] = useState<boolean>(false)

  const [isUserLoading, setIsUserLoading] = useState(true);
  const [isProjectsLoading, setIsProjectsLoading] = useState(true)
  const [isQuestionsLoading, setIsQuestionsLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()
  const isCurrentUser = user?.user === currentUser?.user;

  useEffect(() => {
    const fetchUser = async () => {
      setIsUserLoading(true);
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
        setIsUserLoading(false);
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

    // Only fetch questions/projects/profileImage if user is set
    if (user) {
      void fetchProjects()
      void fetchQuestions()
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
    const file = photo.target.files?.[0];
    if (file && user) {
      try {
        const formData = new FormData();
        formData.append('profile_image', file);
        const response = await uploadProfileImage(user.user, formData);
        const { data } = response;
        setShowUploadFiles(false);
        if (data?.profile_image_nsfw) {
          // Show innapropriate content toast if there is innapropriate content
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Innapropriate content detected in your image.',
          })
        }
      } catch (error) {
        console.error('File upload failed:', error);
      }
    } else {
      console.error('File upload error')
    }
  }
  // Conditional rendering for loading state
  // TODO: Replace user loading spinner with Shadcn skeleton
  if (isUserLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8 md:flex-row">
        <div className="md:w-1/3">
          <Card>
            <CardHeader className="flex flex-col items-center">
              <div className="relative h-32 w-32">
                <Avatar className="h-32 w-32">
                  <AvatarImage
                    src={`${user?.profile_image_url ?? '/anon-user-pfp.jpg'}?t=${Date.now()}`}
                    alt="User profile picture"
                  />
                </Avatar>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="absolute bottom-2 right-2 h-6 w-6 p-0 bg-transparent border-none cursor-pointer edit-icon" aria-label="Edit Profile">
                      <img src="/edit_pencil.svg" alt="Edit Profile" className="h-full w-full" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium leading-none">Profile Picture</h4>
                        <p className="text-sm text-muted-foreground">
                          A picture helps people recognize you and lets you know when you signed in to your account
                        </p>
                      </div>
                      <div className="grid gap-2">
                        <div className="grid grid-cols-3 items-center gap-4">
                          <Button variant="outline" onClick={() => handleShowEditProfileClick()} id="width" className="col-span-2 h-10"> Change Image
                            <img src="/edit_pencil.svg" alt="Edit Profile" className="h-full w-full" />
                          </Button>
                        </div>
                        {showUploadFiles && (
                          <div className="grid grid-cols-3 items-center gap-4">
                            <Input type="file" id="height" className="col-span-2 h-10" onChange={handlePhotoUpload} />
                          </div>
                        )}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <CardTitle className="mt-4 text-2xl">{user?.username}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <Badge variant="secondary" className="px-3 py-1 text-lg">
                Reputation: {user?.reputation}
              </Badge>
            </CardContent>
          </Card>
        </div>
        <div className="md:w-2/3">
          <Tabs defaultValue="projects" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="questions">Questions</TabsTrigger>
            </TabsList>
            <TabsContent value="projects">
              <Card>
                <CardHeader>
                  <CardTitle>Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  {isProjectsLoading ? (
                    <LoadingSpinner />
                  ) : projects.length === 0 && isCurrentUser ? (
                    <div className="flex justify-center items-center py-8">
                      <Button onClick={() => router.push('/projects/add-project')}>
                        Add your first project
                      </Button>
                    </div>
                  ) : (
                    <ul className="space-y-4">
                      {projects.map((project, index) => (
                        <li
                          key={index}
                          className="cursor-pointer rounded-md border-b p-4 transition-colors duration-300 last:border-b-0 hover:bg-gray-200"
                          onClick={() => handleProjectClick(project.project_id)}
                        >
                          <h3 className="text-lg font-semibold">
                            {project.title}
                          </h3>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {project.description}
                          </p>
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
                  <CardTitle>Recent Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  {isQuestionsLoading ? (
                    <LoadingSpinner />
                  ) : (
                    <ul className="space-y-4">
                      {questions.map((question, index) => (
                        <li
                          key={index}
                          className="cursor-pointer rounded-md border-b p-4 transition-colors duration-300 last:border-b-0 hover:bg-gray-200"
                          onClick={() =>
                            handleQuestionClick(question.question_id)
                          }
                        >
                          <h3 className="text-lg font-semibold">
                            {question.title}
                          </h3>
                        </li>
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
