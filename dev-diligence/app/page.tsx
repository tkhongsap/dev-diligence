import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { ArrowRight, Zap, Shield, LineChart } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex h-16 items-center px-4 bg-white shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold">&#60;/&#62;</span>
            <span className="text-xl font-semibold">CodeReview</span>
          </div>
          <nav>
            <ul className="flex items-center space-x-4">
              <li><Link href="/documentation" className="text-gray-600 hover:text-gray-900">Documentation</Link></li>
              <li>
                <Link href="/dashboard">
                  <Button variant="outline">Login</Button>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main>
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-4">
              Code Review, <span className="text-blue-600">Reimagined</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Elevate your code quality with AI-powered insights. Get instant feedback, collaborate
              seamlessly, and ship with confidence.
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/dashboard">
                <Button className="gap-2" size="lg">
                  Login
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="mt-16 bg-gray-900 text-white p-6 rounded-lg shadow-lg mx-auto max-w-2xl">
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex space-x-1">
                  <div className="w-3 h-3 rounded-full bg-red-500"/>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"/>
                  <div className="w-3 h-3 rounded-full bg-green-500"/>
                </div>
                <span className="text-sm text-gray-400">code-review.ts</span>
              </div>
              <pre className="font-mono text-sm">
                <code>{`function validateCode(code) {
  // AI-powered code analysis
  const analysis = await analyzeCode(code);
  return {
    score: analysis.score,
    suggestions: analysis.suggestions,
    improvements: analysis.improvements
  };
}`}</code>
              </pre>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-gradient-to-b from-blue-50">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI-Powered Analysis</h3>
                <p className="text-gray-600">Get instant feedback on code quality, potential bugs, and performance improvements.</p>
              </div>

              <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-gradient-to-b from-green-50">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Security First</h3>
                <p className="text-gray-600">Identify security vulnerabilities and best practices violations automatically.</p>
              </div>

              <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-gradient-to-b from-purple-50">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <LineChart className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Actionable Metrics</h3>
                <p className="text-gray-600">Track code quality trends and team performance with detailed analytics.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

