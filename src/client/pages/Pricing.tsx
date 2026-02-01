import { Link } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

const plans = [
  {
    name: 'Free',
    price: 0,
    description: 'Perfect for trying out',
    features: ['3 videos per month', 'Basic clips extraction', 'Watermark on clips', 'Email support'],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Creator',
    price: 15,
    description: 'For content creators',
    features: ['20 videos per month', 'All content formats', 'No watermark', 'Priority processing', 'Chat support'],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Pro',
    price: 29,
    description: 'For agencies & teams',
    features: ['Unlimited videos', 'Team features', 'API access', 'Custom branding', 'Priority support', 'Analytics'],
    cta: 'Contact Sales',
    popular: false,
  },
];

export default function Pricing() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h1>
            <p className="text-xl text-gray-600">Choose the plan that works for you</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <Card key={plan.name} className={plan.popular ? 'border-blue-500 border-2 relative' : ''}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-blue-600 text-white text-sm font-medium px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader className="text-center pt-8">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <p className="text-gray-500 mt-2">{plan.description}</p>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                    <span className="text-gray-500">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center text-gray-600">
                        <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link to="/signup">
                    <Button className="w-full" variant={plan.popular ? 'primary' : 'outline'}>
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-gray-500">
              All plans include a 7-day free trial. No credit card required.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
