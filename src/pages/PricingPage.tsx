import { PricingSection } from "../components/PricingSection";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";

export function PricingPage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-16">
        <h1 className="text-5xl font-bold text-primary mb-6">Simple, Transparent Pricing</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Choose the plan that works best for your needs. All plans include access to 
          the complete boilerplate with full source code.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/">
            <Button variant="outline" size="lg">
              Back to Home
            </Button>
          </Link>
        </div>
      </section>

      {/* Pricing Section */}
      <section>
        <PricingSection />
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50 rounded-2xl">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">What's included in the boilerplate?</h3>
                <p className="text-muted-foreground text-sm">
                  Complete React + TypeScript frontend, Convex backend, Stripe payments, 
                  authentication system, user dashboard, and responsive design components.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Can I modify the source code?</h3>
                <p className="text-muted-foreground text-sm">
                  Yes! You get full access to all source code and can modify, extend, 
                  and customize it however you need for your project.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Do you provide documentation?</h3>
                <p className="text-muted-foreground text-sm">
                  Absolutely! We provide comprehensive documentation covering setup, 
                  deployment, customization, and best practices.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Is there ongoing support?</h3>
                <p className="text-muted-foreground text-sm">
                  Yes, we provide email support, regular updates, and access to our 
                  developer community for all subscribers.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
                <p className="text-muted-foreground text-sm">
                  We accept all major credit cards and PayPal through our secure 
                  Stripe payment processing.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Can I cancel anytime?</h3>
                <p className="text-muted-foreground text-sm">
                  Yes, you can cancel your subscription at any time. You'll continue 
                  to have access until the end of your billing period.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">What You Get</h2>
          <div className="bg-white rounded-lg border overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
              <div className="bg-gray-50 p-6 border-b md:border-b-0 md:border-r">
                <h3 className="font-semibold text-lg mb-4">Features</h3>
              </div>
              <div className="p-6 text-center border-b md:border-b-0 md:border-r bg-primary/5">
                <h3 className="font-semibold text-lg mb-2">Starter</h3>
                <p className="text-sm text-muted-foreground">Perfect for getting started</p>
              </div>
              <div className="p-6 text-center border-b md:border-b-0 md:border-r bg-primary/10">
                <h3 className="font-semibold text-lg mb-2">Pro</h3>
                <p className="text-sm text-muted-foreground">Most popular choice</p>
              </div>
              <div className="p-6 text-center bg-primary/15">
                <h3 className="font-semibold text-lg mb-2">Enterprise</h3>
                <p className="text-sm text-muted-foreground">For large scale projects</p>
              </div>
            </div>
            
            <div className="divide-y">
              {[
                { feature: "Full Source Code Access", starter: true, pro: true, enterprise: true },
                { feature: "Authentication System", starter: true, pro: true, enterprise: true },
                { feature: "Stripe Payment Integration", starter: true, pro: true, enterprise: true },
                { feature: "Responsive UI Components", starter: true, pro: true, enterprise: true },
                { feature: "Email Support", starter: false, pro: true, enterprise: true },
                { feature: "Priority Support", starter: false, pro: false, enterprise: true },
                { feature: "Custom Integration Help", starter: false, pro: false, enterprise: true },
                { feature: "White-label License", starter: false, pro: false, enterprise: true },
              ].map((row, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-0">
                  <div className="p-4 font-medium border-r">{row.feature}</div>
                  <div className="p-4 text-center border-r">
                    {row.starter ? (
                      <svg className="w-5 h-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <span className="text-gray-400">–</span>
                    )}
                  </div>
                  <div className="p-4 text-center border-r">
                    {row.pro ? (
                      <svg className="w-5 h-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <span className="text-gray-400">–</span>
                    )}
                  </div>
                  <div className="p-4 text-center">
                    {row.enterprise ? (
                      <svg className="w-5 h-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <span className="text-gray-400">–</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary rounded-2xl text-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-4">Still Have Questions?</h2>
          <p className="text-xl mb-8 opacity-90">
            Get in touch with our team and we'll help you choose the right plan
          </p>
          <Link to="/contact">
            <Button size="lg" variant="outline" className="bg-white text-primary hover:bg-gray-100 px-8">
              Contact Sales
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}