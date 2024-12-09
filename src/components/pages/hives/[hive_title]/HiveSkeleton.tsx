import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

export default function HiveSkeleton() {
  return (
    <div className="container mx-auto px-36 py-8">
      {/* Only the header content needs loading state */}
      <div className="mb-8 flex flex-col items-start gap-6 md:flex-row">
        <Skeleton className="h-32 w-32 rounded-full" />
        <div className="flex-1">
          <Skeleton className="mb-2 h-8 w-1/3" />
          <Skeleton className="mb-4 h-5 w-1/3" />
          <div className="mb-4 flex flex-wrap gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-8 w-28" />
        </div>
      </div>

      {/* Real tabs component instead of skeleton */}
      <Tabs defaultValue="questions" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="top-contributors">Top Contributors</TabsTrigger>
        </TabsList>
        <TabsContent value="questions">
          <div className="max-w-7xl pt-8">
            <div className="flex flex-wrap gap-4 md:flex-nowrap">
              <aside className="flex flex-col min-w-[250px] max-w-xs md:basis-1/4 mr-10">
                <div className="mb-6">
                  <Button disabled className="rounded-lg px-4 py-2 w-full">Ask Question</Button>
                </div>
                <div className="rounded-lg border bg-card p-4 pb-10">
                  <h2 className="mb-4 text-p1 font-subHeading">Search and Filter</h2>
                  <div className="mb-4">
                    <div className="relative">
                      <Input
                        disabled
                        placeholder="Search"
                        className="w-full pr-10"
                      />
                      <Search className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-500" />
                    </div>
                  </div>
                  <Skeleton className="h-10 w-full" /> {/* Just the tags input shows loading */}
                </div>
              </aside>

              {/* Questions area with relocated button */}
              <div className="w-full md:w-3/4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <Skeleton className="h-[140px] w-full mb-4" />
                    <Skeleton className="h-[140px] w-full mb-4" />
                    <Skeleton className="h-[140px] w-full mb-4" />
                  </div>

                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="top-contributors">
        </TabsContent>
      </Tabs>
    </div>
  )
}