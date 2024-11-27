'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, XCircle, AlertTriangle, Code, Lightbulb, BarChart } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Mock function to simulate LLM review process
const mockReviewProcess = async () => {
  await new Promise(resolve => setTimeout(resolve, 3000)) // Simulate 3 second delay
  return {
    overallScore: 8.5,
    codeQuality: 9,
    performance: 8,
    security: 7,
    suggestions: [
      { type: 'improvement', message: 'Consider using a more efficient sorting algorithm in function sortData()' },
      { type: 'warning', message: 'Potential memory leak detected in class DataProcessor' },
      { type: 'error', message: 'Uncaught exception in error handling block' },
    ],
    improvedCode: `function improvedSortData(data) {
  return data.sort((a, b) => a - b);
}

class ImprovedDataProcessor {
  constructor() {
    this.data = [];
  }

  process(newData) {
    this.data.push(...newData);
    // Process logic here
  }

  cleanup() {
    this.data = []; // Proper cleanup to prevent memory leaks
  }
}

try {
  // Main logic here
} catch (error) {
  console.error('An error occurred:', error);
  // Proper error handling
}`
  }
}

// Add interface for the review data structure
interface ReviewData {
  overallScore: number
  codeQuality: number
  performance: number
  security: number
  suggestions: Array<{
    type: 'improvement' | 'warning' | 'error'
    message: string
  }>
  improvedCode: string
}

export default function ReviewResultPage() {
  const [reviewData, setReviewData] = useState<ReviewData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReviewData = async () => {
      const data = await mockReviewProcess()
      setReviewData(data)
      setLoading(false)
    }
    fetchReviewData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <h2 className="mt-4 text-xl font-semibold text-blue-600">Analyzing your code...</h2>
          <p className="mt-2 text-muted-foreground">This may take a few moments</p>
        </div>
      </div>
    )
  }

  // Add early return if data is not loaded
  if (!reviewData) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-blue-600">&#60;/&#62;</span>
              <span className="font-semibold hidden sm:inline">CodeReview</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <Link 
              href="/new-review" 
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Review</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex justify-center">
        <main className="container max-w-6xl py-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Code Review Results</h1>
            <p className="text-muted-foreground mt-1">Analysis and suggestions for your code</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
            <Card className="bg-gradient-to-br from-blue-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Overall Score
                </CardTitle>
                <BarChart className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reviewData.overallScore.toFixed(1)}/10</div>
                <Progress 
                  value={reviewData.overallScore * 10} 
                  className={`mt-2 ${
                    reviewData.overallScore >= 7 ? 'bg-green-500' : 
                    reviewData.overallScore >= 5 ? 'bg-yellow-500' : 
                    'bg-red-500'
                  }`}
                />
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Code Quality
                </CardTitle>
                <Code className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reviewData.codeQuality.toFixed(1)}/10</div>
                <Progress 
                  value={reviewData.codeQuality * 10} 
                  className="mt-2 bg-green-500" 
                />
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-yellow-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Performance
                </CardTitle>
                <Lightbulb className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reviewData.performance.toFixed(1)}/10</div>
                <Progress 
                  value={reviewData.performance * 10} 
                  className="mt-2 bg-yellow-500"
                />
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="suggestions" className="space-y-6">
            <TabsList className="w-full justify-start sm:w-auto">
              <TabsTrigger value="suggestions" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                <span className="hidden sm:inline">Suggestions</span>
              </TabsTrigger>
              <TabsTrigger value="improvedCode" className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                <span className="hidden sm:inline">Improved Code</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="suggestions">
              <Card>
                <CardHeader>
                  <CardTitle>Code Suggestions</CardTitle>
                  <CardDescription>
                    Improvements and issues found in your code
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {reviewData.suggestions.map((suggestion, index: number) => (
                      <li key={index} className="flex items-start space-x-2 p-2 rounded-md bg-muted">
                        {suggestion.type === 'improvement' && (
                          <CheckCircle className="h-5 w-5 mt-0.5 text-green-500 flex-shrink-0" />
                        )}
                        {suggestion.type === 'warning' && (
                          <AlertTriangle className="h-5 w-5 mt-0.5 text-yellow-500 flex-shrink-0" />
                        )}
                        {suggestion.type === 'error' && (
                          <XCircle className="h-5 w-5 mt-0.5 text-red-500 flex-shrink-0" />
                        )}
                        <span>{suggestion.message}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="improvedCode">
              <Card>
                <CardHeader>
                  <CardTitle>Improved Code</CardTitle>
                  <CardDescription>
                    Suggested improvements to your code
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="p-4 bg-muted rounded-lg overflow-x-auto">
                    <code className="text-sm">{reviewData.improvedCode}</code>
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

