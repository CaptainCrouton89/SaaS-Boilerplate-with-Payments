import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";

export function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-16">
      {/* Hero Section */}
      <section className="text-center py-16">
        <h1 className="text-5xl font-bold text-primary mb-6">About SaaS Boilerplate</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          We built the complete foundation you need to launch your SaaS product, 
          so you can focus on what makes your business unique.
        </p>
      </section>

      {/* Mission Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-muted-foreground mb-6">
            Building a SaaS product shouldn't mean starting from scratch every time. 
            We've taken care of all the foundational elements - authentication, payments, 
            user management, and more - so you can focus on building features that 
            differentiate your product.
          </p>
          <p className="text-muted-foreground">
            This boilerplate represents hundreds of hours of development and best practices 
            learned from building successful SaaS products. We're committed to maintaining 
            and improving it to help developers ship faster.
          </p>
        </div>
        <div className="bg-gray-50 rounded-2xl p-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">500+</div>
            <p className="text-muted-foreground mb-4">Hours of development saved</p>
            <div className="text-4xl font-bold text-primary mb-2">99.9%</div>
            <p className="text-muted-foreground">Uptime guarantee</p>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Built with Modern Technology</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white border rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold mb-2">React 19</h3>
            <p className="text-muted-foreground text-sm">
              Latest React with TypeScript for type-safe frontend development
            </p>
          </div>
          <div className="bg-white border rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold mb-2">Convex</h3>
            <p className="text-muted-foreground text-sm">
              Full-stack TypeScript platform with real-time database
            </p>
          </div>
          <div className="bg-white border rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold mb-2">Stripe</h3>
            <p className="text-muted-foreground text-sm">
              Complete payment processing with subscriptions and billing
            </p>
          </div>
          <div className="bg-white border rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold mb-2">TailwindCSS</h3>
            <p className="text-muted-foreground text-sm">
              Utility-first CSS framework for rapid UI development
            </p>
          </div>
          <div className="bg-white border rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold mb-2">Radix UI</h3>
            <p className="text-muted-foreground text-sm">
              Accessible component primitives for professional interfaces
            </p>
          </div>
          <div className="bg-white border rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold mb-2">Vite</h3>
            <p className="text-muted-foreground text-sm">
              Lightning-fast build tool and development server
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50 rounded-2xl">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">What's Included</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-green-100 rounded-full p-2 mt-1">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Complete Authentication System</h3>
                <p className="text-muted-foreground text-sm">Email/password and anonymous sign-in with session management</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-green-100 rounded-full p-2 mt-1">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Stripe Payment Integration</h3>
                <p className="text-muted-foreground text-sm">Subscriptions, one-time payments, and customer portal</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-green-100 rounded-full p-2 mt-1">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-1">User Dashboard & Profile</h3>
                <p className="text-muted-foreground text-sm">Complete user management with billing and account settings</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-green-100 rounded-full p-2 mt-1">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Responsive Design System</h3>
                <p className="text-muted-foreground text-sm">Mobile-first design with professional UI components</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-green-100 rounded-full p-2 mt-1">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Real-time Database</h3>
                <p className="text-muted-foreground text-sm">Convex backend with type-safe queries and live updates</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-16">
        <h2 className="text-3xl font-bold mb-4">Ready to Start Building?</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
          Get started with our complete SaaS boilerplate and launch your product faster than ever.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/pricing">
            <Button size="lg" className="px-8">
              View Pricing
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="outline" size="lg" className="px-8">
              Contact Us
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}