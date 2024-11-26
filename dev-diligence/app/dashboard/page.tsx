import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Bell, User, Filter, ArrowRight, Zap, CheckCircle, Star, Menu } from 'lucide-react'

interface Review {
  id: number
  title: string
  language: string
  lines: number
  issues: number
  updatedAt: string
  status: 'In Review' | 'Completed' | 'Pending'
  score: number
}

const reviews: Review[] = [
  {
    id: 1,
    title: "Authentication Module Updates",
    language: "JavaScript",
    lines: 156,
    issues: 3,
    updatedAt: "2 hours ago",
    status: "In Review",
    score: 8.5
  },
  {
    id: 2,
    title: "API Endpoint Optimization",
    language: "Python",
    lines: 234,
    issues: 0,
    updatedAt: "1 day ago",
    status: "Completed",
    score: 9.2
  },
  {
    id: 3,
    title: "Database Schema Migration",
    language: "SQL",
    lines: 89,
    issues: 2,
    updatedAt: "3 hours ago",
    status: "Pending",
    score: 7.8
  }
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-5xl flex h-14 items-center">
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold">&#60;/&#62;</span>
              <span className="font-semibold hidden sm:inline">CodeReview</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-600" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="User menu"
            >
              <User className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-5xl py-6 space-y-8 w-full px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Code Reviews</h1>
          <Link href="/new-review">
            <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
              + New Review
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-gradient-to-br from-blue-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Reviews
              </CardTitle>
              <Zap className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                +2 from last week
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Completed
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">158</div>
              <p className="text-xs text-muted-foreground">
                +23 from last month
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-yellow-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Score
              </CardTitle>
              <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8.5</div>
              <p className="text-xs text-muted-foreground">
                +0.3 from last week
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border-b">
            <div className="flex-1 w-full">
              <Input
                placeholder="Search code reviews..."
                className="w-full sm:max-w-sm"
              />
            </div>
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
          <div className="divide-y">
            {reviews.map((review) => (
              <Link
                key={review.id}
                href={`/review/${review.id}`}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="space-y-1 mb-2 sm:mb-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-semibold">{review.title}</h2>
                    <Badge variant={
                      review.status === 'Completed' ? 'secondary' :
                      review.status === 'In Review' ? 'default' : 'outline'
                    } className={`
                      ${review.status === 'Completed' ? 'bg-green-500 hover:bg-green-600 text-white' :
                        review.status === 'In Review' ? 'bg-blue-500 hover:bg-blue-600 text-white' :
                        'bg-yellow-500 hover:bg-yellow-600 text-white'}
                    `}>
                      {review.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {review.language} • {review.lines} lines • {review.issues} issues • Updated {review.updatedAt}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-semibold">{review.score}/10</div>
                    <div className="text-sm text-muted-foreground">Score</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

