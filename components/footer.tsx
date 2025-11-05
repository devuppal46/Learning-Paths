import Link from "next/link"
import { BookOpen, Github, Twitter, Linkedin } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-card dark:bg-slate-900 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-destructive rounded-lg flex items-center justify-center text-white font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base leading-none">Learning Paths</span>
                <span className="text-xs text-muted-foreground">By Mindflare</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Master tech skills through structured learning paths designed with expert guidance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Learning Paths</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/paths/web-development"
                  className="text-sm text-muted-foreground hover:text-destructive transition-colors"
                >
                  Web Development
                </Link>
              </li>
              <li>
                <Link
                  href="/paths/data-structures"
                  className="text-sm text-muted-foreground hover:text-destructive transition-colors"
                >
                  Data Structures & Algorithms
                </Link>
              </li>
              <li>
                <Link
                  href="/paths/python-aiml"
                  className="text-sm text-muted-foreground hover:text-destructive transition-colors"
                >
                  Python & AIML
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-destructive transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-destructive transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-destructive transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Connect</h3>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-destructive transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-destructive transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-destructive transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; {currentYear} Learning Paths by Mindflare. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/" className="text-sm text-muted-foreground hover:text-destructive transition-colors">
                Privacy Policy
              </Link>
              <Link href="/" className="text-sm text-muted-foreground hover:text-destructive transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
