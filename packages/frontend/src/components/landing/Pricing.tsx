import { Check } from 'lucide-react'

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for trying out ChatFlow',
    features: [
      '100 AI requests per month',
      'Multi-provider AI access',
      'Secure credential vault',
      'Community support',
      'Basic integrations',
    ],
    cta: 'Get Started',
    href: '/app',
    featured: false,
  },
  {
    name: 'Pro',
    price: '$29',
    description: 'For power users and small teams',
    features: [
      'Unlimited AI requests',
      'All AI providers (Claude, GPT-4, Gemini)',
      'Advanced MCP integrations',
      'Priority support',
      'Team collaboration (coming soon)',
      'Custom workflows',
    ],
    cta: 'Coming Soon',
    href: '#',
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For organizations at scale',
    features: [
      'Everything in Pro',
      'Dedicated support',
      'Custom MCP servers',
      'SSO & advanced security',
      'SLA guarantees',
      'On-premise deployment option',
    ],
    cta: 'Contact Sales',
    href: '#',
    featured: false,
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Simple,
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Transparent Pricing
            </span>
          </h2>
          <p className="text-xl text-slate-600">
            Start free, upgrade when you need more. No hidden fees.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl p-8 ${
                plan.featured
                  ? 'bg-gradient-to-b from-blue-600 to-purple-600 text-white shadow-2xl scale-105'
                  : 'bg-white border-2 border-slate-200 hover:border-slate-300'
              } transition-all duration-300`}
            >
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-sm font-semibold rounded-full">
                  Most Popular
                </div>
              )}

              {/* Plan name */}
              <div className="mb-6">
                <h3 className={`text-2xl font-bold mb-2 ${plan.featured ? 'text-white' : 'text-slate-900'}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm ${plan.featured ? 'text-blue-100' : 'text-slate-600'}`}>
                  {plan.description}
                </p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className={`text-5xl font-bold ${plan.featured ? 'text-white' : 'text-slate-900'}`}>
                    {plan.price}
                  </span>
                  {plan.price !== 'Custom' && (
                    <span className={`${plan.featured ? 'text-blue-100' : 'text-slate-600'}`}>
                      /month
                    </span>
                  )}
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <Check className={`h-5 w-5 flex-shrink-0 mt-0.5 ${plan.featured ? 'text-white' : 'text-green-500'}`} />
                    <span className={`text-sm ${plan.featured ? 'text-blue-50' : 'text-slate-600'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href={plan.href}
                className={`block w-full text-center py-3 rounded-lg font-semibold transition-all ${
                  plan.featured
                    ? 'bg-white text-blue-600 hover:bg-blue-50'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        {/* Additional note */}
        <div className="text-center mt-12">
          <p className="text-slate-600">
            All plans include access to our open-source MCP servers.{' '}
            <a href="https://github.com/prerit-with-ai/chatflow" className="text-blue-600 hover:text-blue-700 font-medium">
              View on GitHub →
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
