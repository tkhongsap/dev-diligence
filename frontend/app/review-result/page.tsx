'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/badge"
import { ArrowLeft, Bell, User, Menu, Star, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface Suggestion {
  type: 'improvement' | 'warning' | 'error'
  message: string
}

interface Analysis {
  overall_score: number
  code_quality: number
  performance: number
  suggestions: Suggestion[]
  improved_code?: string | null
}

export default function ReviewResultPage() {
  const [analysis, setAnalysis] = useState<Analysis | null>(null)

  useEffect(() => {
    const savedAnalysis = localStorage.getItem('codeAnalysis')
    if (savedAnalysis) {
      try {
        const parsed = JSON.parse(savedAnalysis) as Analysis
        setAnalysis(parsed)
      } catch (error) {
        console.error('Error parsing analysis:', error)
      }
    }
  }, [])

  if (!analysis) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>No analysis results found.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="flex items-center space-x-2">
            <Link href="/dashboard" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Dashboard</span>
              <span className="sm:hidden">Back</span>
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

      <div className="flex justify-center">
        <main className="container max-w-6xl py-6 space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-3xl font-bold tracking-tight">Code Review Results</h1>
            <Link href="/new-review">
              <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                + New Review
              </Button>
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-gradient-to-br from-blue-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
                <Star className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analysis.overall_score}/10</div>
                <Progress value={analysis.overall_score * 10} className="mt-2" />
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Code Quality</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analysis.code_quality}/10</div>
                <Progress value={analysis.code_quality * 10} className="mt-2" />
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Performance</CardTitle>
                <AlertCircle className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analysis.performance}/10</div>
                <Progress value={analysis.performance * 10} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Suggestions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {analysis.suggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start gap-2 p-4 rounded-lg bg-muted/50">
                  <Badge
                    variant={
                      suggestion.type === 'error'
                        ? 'destructive'
                        : suggestion.type === 'warning'
                        ? 'secondary'
                        : 'success'
                    }
                  >
                    {suggestion.type}
                  </Badge>
                  <p className="text-sm">{suggestion.message}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {analysis.improved_code && typeof analysis.improved_code === 'string' && (
            <Card>
              <CardHeader>
                <CardTitle>Improved Code</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="p-4 bg-muted rounded-lg overflow-x-auto">
                  <code>{analysis.improved_code}</code>
                </pre>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  )
}

