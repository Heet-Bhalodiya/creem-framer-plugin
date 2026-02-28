// React Import
import { useState, useEffect } from 'react'

// Third-party Imports
import { ArrowUpRight } from 'lucide-react'
import { addPropertyControls, ControlType, RenderTarget } from 'framer'

type Tier = {
  name: string
  monthlyPrice: number
  yearlyPrice: number
  description: string
  features: string[]
  featuresTitle: string
  productId: string
  monthlyProductId?: string
  yearlyProductId?: string
  ctaText: string
  ctaVariant: 'default' | 'outline' | 'ghost' | 'gradient' | 'shadow' | 'shimmer' | 'icon-slide'
  ctaBackground?: string
  ctaTextColor?: string
  highlighted: boolean
}

type Props = {
  tiers: Tier[]
  type: 'embed' | 'new-tab'

  // Header
  showHeader: boolean
  headerTitle: string
  headerDescription: string
  headerTitleFontSize: number
  headerDescriptionFontSize: number
  headerTitleColor: string
  headerDescriptionColor: string
  headerAlignment: 'left' | 'center' | 'right'

  // Toggle settings
  showYearlyToggle: boolean
  toggleMonthlyLabel: string
  toggleYearlyLabel: string
  toggleStyle: 'pill' | 'segmented'

  // Colors - Background
  pageBackground: string
  cardBackground: string

  // Colors - Borders
  borderColor: string
  featuredBorderColor: string
  dividerColor: string

  // Colors - Text
  textColor: string
  mutedTextColor: string

  // Colors - Buttons
  primaryButtonBackground: string
  primaryButtonTextColor: string
  secondaryButtonBackground: string
  secondaryButtonTextColor: string
  buttonBorderColor: string

  // Colors - Toggle
  toggleBackground: string
  toggleBorderColor: string
  toggleActiveBackground: string
  toggleActiveTextColor: string
  toggleTextColor: string

  // Colors - Features
  bulletColor: string

  // Typography
  titleFontSize: number
  descriptionFontSize: number
  priceFontSize: number
  featuresTitleFontSize: number
  featureFontSize: number
  buttonFontSize: number

  // Spacing & Layout
  cardRadius: number
  cardBorderWidth: number
  featuredCardBorderWidth: number
  cardPadding: number
  cardGap: number
  gridGap: number
  minCardWidth: number
  maxWidth: number

  // Button styling
  buttonHeight: number
  buttonRadius: number

  // Feature bullets
  bulletSize: number

  // Other
  testMode: boolean
}

export function CreemPricingTable({
  tiers,
  type,

  // Header
  showHeader,
  headerTitle,
  headerDescription,
  headerTitleFontSize,
  headerDescriptionFontSize,
  headerTitleColor,
  headerDescriptionColor,
  headerAlignment,

  // Toggle settings
  showYearlyToggle,
  toggleMonthlyLabel,
  toggleYearlyLabel,
  toggleStyle,

  // Colors - Background
  pageBackground,
  cardBackground,

  // Colors - Borders
  borderColor,
  featuredBorderColor,
  dividerColor,

  // Colors - Text
  textColor,
  mutedTextColor,

  // Colors - Buttons
  primaryButtonBackground,
  primaryButtonTextColor,
  secondaryButtonBackground,
  secondaryButtonTextColor,
  buttonBorderColor,

  // Colors - Toggle
  toggleBackground,
  toggleBorderColor,
  toggleActiveBackground,
  toggleActiveTextColor,
  toggleTextColor,

  // Colors - Features
  bulletColor,

  // Typography
  titleFontSize,
  descriptionFontSize,
  priceFontSize,
  featuresTitleFontSize,
  featureFontSize,
  buttonFontSize,

  // Spacing & Layout
  cardRadius,
  cardBorderWidth,
  featuredCardBorderWidth,
  cardPadding,
  cardGap,
  gridGap,
  minCardWidth,
  maxWidth,

  // Button styling
  buttonHeight,
  buttonRadius,

  // Feature bullets
  bulletSize,

  // Other
  testMode
}: Props) {
  const [yearly, setYearly] = useState(false)
  const [breakpoint, setBreakpoint] = useState<'mobile' | 'tablet' | 'desktop'>('desktop')
  const isCanvas = RenderTarget.current() === RenderTarget.canvas

  // Responsive breakpoint detection with resize listener
  useEffect(() => {
    if (typeof window === 'undefined') return

    const updateBreakpoint = () => {
      const width = window.innerWidth

      if (width < 480) setBreakpoint('mobile')
      else if (width < 1024) setBreakpoint('tablet')
      else setBreakpoint('desktop')
    }

    updateBreakpoint()
    window.addEventListener('resize', updateBreakpoint)

    return () => window.removeEventListener('resize', updateBreakpoint)
  }, [])

  // Responsive spacing using user-defined values
  const getResponsiveSpacing = () => {
    if (breakpoint === 'mobile')
      return {
        padding: `${Math.round(cardPadding * 0.75)}px ${Math.round(cardPadding * 0.6)}px`,
        gap: Math.round(gridGap * 0.7),
        cardPadding: `${Math.round(cardPadding * 0.75)}px ${Math.round(cardPadding * 0.6)}px`
      }
    if (breakpoint === 'tablet')
      return {
        padding: `${Math.round(cardPadding * 0.85)}px ${Math.round(cardPadding * 0.75)}px`,
        gap: Math.round(gridGap * 0.85),
        cardPadding: `${Math.round(cardPadding * 0.85)}px ${Math.round(cardPadding * 0.75)}px`
      }

    return {
      padding: `${cardPadding}px ${Math.round(cardPadding * 0.75)}px`,
      gap: gridGap,
      cardPadding: `${cardPadding}px ${Math.round(cardPadding * 0.9)}px`
    }
  }

  const spacing = getResponsiveSpacing()

  // Responsive font sizes using user-defined values
  const getFontSizes = () => {
    if (breakpoint === 'mobile')
      return {
        title: Math.round(titleFontSize * 0.85),
        price: Math.round(priceFontSize * 0.85),
        description: Math.round(descriptionFontSize * 0.93),
        cta: Math.round(buttonFontSize * 0.93),
        featuresTitle: Math.round(featuresTitleFontSize * 0.85),
        feature: Math.round(featureFontSize * 0.93)
      }
    if (breakpoint === 'tablet')
      return {
        title: Math.round(titleFontSize * 0.93),
        price: Math.round(priceFontSize * 0.93),
        description: Math.round(descriptionFontSize * 0.96),
        cta: Math.round(buttonFontSize * 0.96),
        featuresTitle: Math.round(featuresTitleFontSize * 0.93),
        feature: Math.round(featureFontSize * 0.96)
      }

    return {
      title: titleFontSize,
      price: priceFontSize,
      description: descriptionFontSize,
      cta: buttonFontSize,
      featuresTitle: featuresTitleFontSize,
      feature: featureFontSize
    }
  }

  const fonts = getFontSizes()

  // Check for reduced motion preference
  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const transitionDuration = prefersReducedMotion ? '0s' : '0.3s'

  const handleCheckout = (tier: Tier) => {
    if (isCanvas) return

    let productId = tier.productId

    // If both monthly and yearly IDs exist, use the appropriate one
    if (tier.monthlyProductId && tier.yearlyProductId) {
      productId = yearly ? tier.yearlyProductId : tier.monthlyProductId
    }

    // If only one exists, use it regardless of toggle state
    else if (tier.monthlyProductId) {
      productId = tier.monthlyProductId
    } else if (tier.yearlyProductId) {
      productId = tier.yearlyProductId
    }

    const url = testMode ? `https://creem.io/test/payment/${productId}` : `https://creem.io/payment/${productId}`

    if (type === 'embed') {
      window.open(url, '_blank', 'popup,width=600,height=800,left=200,top=100')
    } else {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100%',
        background: pageBackground,
        display: 'flex',
        justifyContent: 'center',
        fontFamily: 'inherit',
        padding: spacing.padding,
        boxSizing: 'border-box'
      }}
    >
      {/* ARIA live region for toggle changes */}
      <div
        aria-live='polite'
        aria-atomic='true'
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0
        }}
      >
        {showYearlyToggle && `Billing interval: ${yearly ? 'yearly' : 'monthly'}`}
      </div>
      <div
        style={{
          width: '100%',
          maxWidth: maxWidth,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxSizing: 'border-box'
        }}
      >
        {/* Header Title & Description */}
        {showHeader && (
          <div
            style={{
              width: '100%',
              marginBottom: 40,
              textAlign: headerAlignment
            }}
          >
            {headerTitle && (
              <h2
                style={{
                  fontSize: headerTitleFontSize,
                  fontWeight: 700,
                  color: headerTitleColor,
                  margin: 0,
                  marginBottom: headerDescription ? 12 : 0,
                  lineHeight: 1.2,
                  letterSpacing: '-0.02em'
                }}
              >
                {headerTitle}
              </h2>
            )}
            {headerDescription && (
              <p
                style={{
                  fontSize: headerDescriptionFontSize,
                  color: headerDescriptionColor,
                  margin: 0,
                  lineHeight: 1.6,
                  maxWidth: 600,
                  marginLeft: headerAlignment === 'center' ? 'auto' : 0,
                  marginRight: headerAlignment === 'center' ? 'auto' : 0
                }}
              >
                {headerDescription}
              </p>
            )}
          </div>
        )}

        {/* Monthly/Yearly Toggle */}
        {showYearlyToggle && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 32,
              background: toggleBackground,
              border: `2px solid ${toggleBorderColor}`,
              borderRadius: toggleStyle === 'pill' ? 999 : 10,
              padding: 4,
              position: 'relative'
            }}
            role='group'
            aria-label='Billing interval selector'
          >
            <button
              onClick={() => !isCanvas && setYearly(false)}
              onKeyDown={e => {
                if ((e.key === 'Enter' || e.key === ' ') && !isCanvas) {
                  e.preventDefault()
                  setYearly(false)
                }
              }}
              disabled={isCanvas}
              aria-pressed={!yearly}
              type='button'
              role='button'
              style={{
                height: 38,
                padding: '0 20px',
                minWidth: 80,
                borderRadius: toggleStyle === 'pill' ? 999 : 8,
                fontSize: breakpoint === 'mobile' ? 13 : 14,
                fontWeight: 600,
                border: 'none',
                cursor: isCanvas ? 'default' : 'pointer',
                transition: `all ${transitionDuration}`,
                background: !yearly ? toggleActiveBackground : 'transparent',
                color: !yearly ? toggleActiveTextColor : toggleTextColor,
                outline: 'none',
                userSelect: 'none',
                whiteSpace: 'nowrap'
              }}
              onFocus={e => {
                if (!isCanvas) {
                  e.currentTarget.style.outline = `2px solid ${toggleActiveBackground}`
                  e.currentTarget.style.outlineOffset = '2px'
                }
              }}
              onBlur={e => {
                e.currentTarget.style.outline = 'none'
              }}
              id='billing-monthly-label'
            >
              {toggleMonthlyLabel}
            </button>
            <button
              onClick={() => !isCanvas && setYearly(true)}
              onKeyDown={e => {
                if ((e.key === 'Enter' || e.key === ' ') && !isCanvas) {
                  e.preventDefault()
                  setYearly(true)
                }
              }}
              disabled={isCanvas}
              aria-pressed={yearly}
              type='button'
              role='button'
              style={{
                height: 38,
                padding: '0 20px',
                minWidth: 80,
                borderRadius: toggleStyle === 'pill' ? 999 : 8,
                fontSize: breakpoint === 'mobile' ? 13 : 14,
                fontWeight: 600,
                border: 'none',
                cursor: isCanvas ? 'default' : 'pointer',
                transition: `all ${transitionDuration}`,
                background: yearly ? toggleActiveBackground : 'transparent',
                color: yearly ? toggleActiveTextColor : toggleTextColor,
                outline: 'none',
                userSelect: 'none',
                whiteSpace: 'nowrap'
              }}
              onFocus={e => {
                if (!isCanvas) {
                  e.currentTarget.style.outline = `2px solid ${toggleActiveBackground}`
                  e.currentTarget.style.outlineOffset = '2px'
                }
              }}
              onBlur={e => {
                e.currentTarget.style.outline = 'none'
              }}
              id='billing-yearly-label'
            >
              {toggleYearlyLabel}
            </button>
          </div>
        )}

        {/* Pricing Cards with Flexbox Wrap */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: spacing.gap,
            width: '100%',
            boxSizing: 'border-box'
          }}
        >
          {tiers.map((tier, idx) => {
            // Determine what's available
            const hasMonthly = !!tier.monthlyProductId
            const hasYearly = !!tier.yearlyProductId
            const hasBoth = hasMonthly && hasYearly

            // Show appropriate price based on what exists
            let price = tier.monthlyPrice
            let period = 'month'

            if (hasBoth) {
              // Both exist, respect toggle
              price = yearly ? tier.yearlyPrice : tier.monthlyPrice
              period = yearly ? 'year' : 'month'
            } else if (hasYearly && !hasMonthly) {
              // Only yearly exists
              price = tier.yearlyPrice
              period = 'year'
            } else {
              // Only monthly exists or fallback
              price = tier.monthlyPrice
              period = 'month'
            }

            const buttonBg =
              tier.ctaBackground || (tier.highlighted ? primaryButtonBackground : secondaryButtonBackground)

            const buttonColor =
              tier.ctaTextColor || (tier.highlighted ? primaryButtonTextColor : secondaryButtonTextColor)

            // Helper function to adjust color brightness for gradient/shimmer
            const adjustColorBrightness = (color: string, percent: number): string => {
              const num = parseInt(color.replace('#', ''), 16)
              const amt = Math.round(2.55 * percent)
              const R = (num >> 16) + amt
              const G = ((num >> 8) & 0x00ff) + amt
              const B = (num & 0x0000ff) + amt

              return (
                '#' +
                (
                  0x1000000 +
                  (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
                  (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
                  (B < 255 ? (B < 1 ? 0 : B) : 255)
                )
                  .toString(16)
                  .slice(1)
              )
            }

            // Get variant-specific button styles
            const getButtonVariantStyles = (): React.CSSProperties => {
              const baseStyles: React.CSSProperties = {
                width: '100%',
                padding: breakpoint === 'mobile' ? '12px 20px' : '14px 24px',
                minHeight: buttonHeight,
                borderRadius: buttonRadius,
                fontSize: fonts.cta,
                fontWeight: 600,
                cursor: isCanvas ? 'default' : 'pointer',
                transition: prefersReducedMotion ? 'none' : 'all 0.3s ease',
                marginBottom: 24,
                outline: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                position: 'relative',
                overflow: 'hidden'
              }

              switch (tier.ctaVariant) {
                case 'outline':
                  return {
                    ...baseStyles,
                    background: 'transparent',
                    color: buttonBg,
                    border: `2px solid ${buttonBg}`
                  }
                case 'ghost':
                  return {
                    ...baseStyles,
                    background: 'transparent',
                    color: buttonBg,
                    border: 'none'
                  }
                case 'gradient':
                  return {
                    ...baseStyles,
                    background: `linear-gradient(135deg, ${buttonBg} 0%, ${adjustColorBrightness(buttonBg, -20)} 100%)`,
                    color: buttonColor,
                    border: 'none'
                  }
                case 'shadow':
                  return {
                    ...baseStyles,
                    background: buttonBg,
                    color: buttonColor,
                    border: 'none',
                    boxShadow: `0 4px 14px 0 ${buttonBg}4d, 0 10px 20px 0 ${buttonBg}33`
                  }
                case 'shimmer':
                  return {
                    ...baseStyles,
                    background: `linear-gradient(110deg, ${buttonBg} 0%, ${adjustColorBrightness(buttonBg, 20)} 50%, ${buttonBg} 100%)`,
                    backgroundSize: '200% 100%',
                    color: buttonColor,
                    border: 'none'
                  }
                case 'icon-slide':
                  return {
                    ...baseStyles,
                    background: buttonBg,
                    color: buttonColor,
                    border: 'none',
                    borderRadius: 9999,
                    paddingRight: breakpoint === 'mobile' ? '52px' : '60px'
                  }
                default:
                  return {
                    ...baseStyles,
                    background: buttonBg,
                    color: buttonColor,
                    border: tier.highlighted ? 'none' : `1px solid ${buttonBorderColor}`
                  }
              }
            }

            // Check if this is the last card and if it should take full width
            // Only apply full width on tablet when odd number of cards
            const isLastCard = idx === tiers.length - 1
            const shouldTakeFullWidth = isLastCard && breakpoint === 'tablet' && tiers.length % 2 !== 0

            return (
              <div
                key={idx}
                style={{
                  position: 'relative',
                  background: cardBackground,
                  border: tier.highlighted
                    ? `${featuredCardBorderWidth}px solid ${featuredBorderColor}`
                    : `${cardBorderWidth}px solid ${borderColor}`,
                  borderRadius: cardRadius,
                  padding: spacing.cardPadding,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: cardGap,
                  boxShadow: tier.highlighted ? '0 8px 24px rgba(0,0,0,0.12)' : 'none',
                  transition: prefersReducedMotion ? 'none' : 'all 0.3s ease',
                  boxSizing: 'border-box',
                  flex:
                    breakpoint === 'mobile' ? '1 1 100%' : shouldTakeFullWidth ? '1 1 100%' : `1 1 ${minCardWidth}px`,
                  minWidth: breakpoint === 'mobile' ? '100%' : shouldTakeFullWidth ? '100%' : `${minCardWidth}px`,
                  maxWidth:
                    breakpoint === 'mobile'
                      ? '100%'
                      : shouldTakeFullWidth
                        ? '100%'
                        : `${Math.min(minCardWidth + 80, 420)}px`
                }}
              >
                {/* Tier Name */}
                <h3
                  style={{
                    fontSize: fonts.title,
                    fontWeight: 700,
                    color: textColor,
                    margin: '0 0 12px 0',
                    lineHeight: 1.2
                  }}
                >
                  {tier.name}
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontSize: fonts.description,
                    color: mutedTextColor,
                    margin: '0 0 24px 0',
                    lineHeight: 1.5,
                    minHeight: 42
                  }}
                >
                  {tier.description}
                </p>

                {/* Price */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, margin: '0 0 24px 0' }}>
                  <span style={{ fontSize: fonts.price * 0.32, fontWeight: 500, color: mutedTextColor }}>$</span>
                  <span
                    style={{
                      fontSize: fonts.price,
                      fontWeight: 700,
                      color: textColor,
                      lineHeight: 1,
                      letterSpacing: '-0.02em'
                    }}
                  >
                    {price}
                  </span>
                  <span style={{ fontSize: fonts.price * 0.29, color: mutedTextColor, fontWeight: 500 }}>
                    /{period}
                  </span>
                </div>

                {/* CTA Button */}
                <style>{`
                  .pricing-btn-shimmer-${idx} {
                    animation: shimmer-${idx} 2s linear infinite;
                  }
                  @keyframes shimmer-${idx} {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                  }
                  .pricing-icon-circle-${idx} {
                    position: absolute;
                    right: ${breakpoint === 'mobile' ? '8px' : '10px'};
                    width: ${buttonHeight * 0.6}px;
                    height: ${buttonHeight * 0.6}px;
                    background: ${buttonColor === '#FFFFFF' ? '#000000' : '#FFFFFF'};
                    color: ${buttonColor === '#FFFFFF' ? '#FFFFFF' : '#000000'};
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                  }
                  .pricing-btn-icon-slide-${idx}:hover .pricing-icon-circle-${idx} {
                    right: calc(100% - ${buttonHeight * 0.6 + (breakpoint === 'mobile' ? 8 : 10)}px);
                    transform: rotate(45deg);
                  }
                `}</style>
                <button
                  onClick={() => handleCheckout(tier)}
                  onKeyDown={e => {
                    if ((e.key === 'Enter' || e.key === ' ') && !isCanvas) {
                      e.preventDefault()
                      handleCheckout(tier)
                    }
                  }}
                  disabled={isCanvas}
                  aria-label={`${tier.ctaText} - ${tier.name} plan for $${price}/${period}`}
                  aria-disabled={isCanvas}
                  type='button'
                  className={`${tier.ctaVariant === 'shimmer' ? `pricing-btn-shimmer-${idx}` : ''} ${tier.ctaVariant === 'icon-slide' ? `pricing-btn-icon-slide-${idx}` : ''}`}
                  style={getButtonVariantStyles()}
                  onMouseEnter={e => {
                    if (!isCanvas && !prefersReducedMotion && tier.ctaVariant !== 'shimmer') {
                      e.currentTarget.style.opacity = '0.85'

                      if (tier.ctaVariant === 'ghost') {
                        e.currentTarget.style.background = 'rgba(0,0,0,0.05)'
                      }
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isCanvas && !prefersReducedMotion) {
                      e.currentTarget.style.opacity = '1'

                      if (tier.ctaVariant === 'ghost') {
                        e.currentTarget.style.background = 'transparent'
                      }
                    }
                  }}
                  onFocus={e => {
                    if (!isCanvas) {
                      e.currentTarget.style.outline = `2px solid ${tier.highlighted ? primaryButtonBackground : secondaryButtonBackground}`
                      e.currentTarget.style.outlineOffset = '2px'
                    }
                  }}
                  onBlur={e => {
                    e.currentTarget.style.outline = 'none'
                  }}
                >
                  {tier.ctaText}
                  {tier.ctaVariant === 'icon-slide' && (
                    <div className={`pricing-icon-circle-${idx}`}>
                      <ArrowUpRight size={buttonHeight * 0.35} strokeWidth={2.5} />
                    </div>
                  )}
                </button>

                {/* Separator */}
                <div
                  style={{
                    width: '100%',
                    height: 1,
                    background: dividerColor,
                    margin: '0 0 24px 0'
                  }}
                />

                {/* Features */}
                <div style={{ flex: 1 }}>
                  <h4
                    style={{
                      fontSize: fonts.featuresTitle,
                      fontWeight: 600,
                      color: textColor,
                      margin: '0 0 16px 0'
                    }}
                  >
                    {tier.featuresTitle || 'Features'}
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {tier.features.map((feature, fIdx) => (
                      <div
                        key={fIdx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10
                        }}
                      >
                        <div
                          style={{
                            width: bulletSize,
                            height: bulletSize,
                            borderRadius: '50%',
                            background: bulletColor,
                            flexShrink: 0
                          }}
                        />
                        <span
                          style={{
                            fontSize: fonts.feature,
                            color: mutedTextColor,
                            lineHeight: 1.5
                          }}
                        >
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Defaults & Controls ──────────────────────────────────────────────────────

CreemPricingTable.defaultProps = {
  type: 'embed',
  tiers: [
    {
      name: 'Free',
      monthlyPrice: 0,
      yearlyPrice: 0,
      description: 'Recommended for people with at least 1 year experience in crypto markets.',
      features: [
        'Access to real-time inventory tracking',
        'Integration with Digital Marketing email',
        'Basic analytics and email support',
        'Custom dashboards and Phone support',
        'Real-time data tracking and 24/7 support'
      ],
      featuresTitle: 'Features',
      productId: 'prod_free',
      ctaText: 'Free plan',
      highlighted: false
    },
    {
      name: 'Premium',
      monthlyPrice: 99,
      yearlyPrice: 950,
      description: 'Everything in the Basic Plan plus advanced search, better analytics.',
      features: [
        'All Premium Plan features',
        'Advanced data filtering search capabilities',
        'Custom branding options',
        'Extended API access for integrations',
        'Real-time data tracking and 24/7 support',
        'Dedicated account manager'
      ],
      featuresTitle: 'Features',
      productId: 'prod_premium',
      ctaText: 'Purchase plan',
      highlighted: true
    },
    {
      name: 'Enterprise',
      monthlyPrice: 299,
      yearlyPrice: 2990,
      description: 'Includes all Professional Plan features plus full logistics automation etc.',
      features: [
        'Custom onboarding process',
        'Priority support response',
        'Access to exclusive webinars',
        'Monthly performance reviews',
        'Real-time data tracking and 24/7 support',
        'Dedicated account manager',
        'Tailored training sessions and resources'
      ],
      featuresTitle: 'Features',
      productId: 'prod_enterprise',
      ctaText: 'Purchase plan',
      highlighted: false
    }
  ],
  showYearlyToggle: true,
  toggleMonthlyLabel: 'Monthly',
  toggleYearlyLabel: 'Yearly',
  toggleStyle: 'pill',

  pageBackground: 'transparent',
  cardBackground: '#FFFFFF',

  borderColor: '#E6E6E6',
  featuredBorderColor: '#111111',
  dividerColor: '#EDEDED',

  textColor: '#000000',
  mutedTextColor: '#7A7A7A',

  primaryButtonBackground: '#111111',
  primaryButtonTextColor: '#FFFFFF',
  secondaryButtonBackground: '#EDEDED',
  secondaryButtonTextColor: '#000000',
  buttonBorderColor: '#E1E1E1',

  toggleBackground: '#FFFFFF',
  toggleBorderColor: '#E6E6E6',
  toggleActiveBackground: '#111111',
  toggleActiveTextColor: '#FFFFFF',
  toggleTextColor: '#111111',

  bulletColor: '#111111',

  titleFontSize: 28,
  descriptionFontSize: 14,
  priceFontSize: 56,
  featuresTitleFontSize: 20,
  featureFontSize: 15,
  buttonFontSize: 15,

  cardRadius: 14,
  cardBorderWidth: 2,
  featuredCardBorderWidth: 2,
  cardPadding: 26,
  cardGap: 18,
  gridGap: 22,
  minCardWidth: 300,
  maxWidth: 1200,

  buttonHeight: 44,
  buttonRadius: 8,

  bulletSize: 8,

  testMode: false
}

addPropertyControls(CreemPricingTable, {
  type: {
    type: ControlType.Enum,
    title: 'Checkout Type',
    options: ['embed', 'new-tab'],
    optionTitles: ['Embed', 'New Tab'],
    defaultValue: 'embed',
    description: 'How to open checkout'
  },

  // Header
  showHeader: {
    type: ControlType.Boolean,
    title: 'Show Header',
    defaultValue: true,
    enabledTitle: 'Yes',
    disabledTitle: 'No'
  },
  headerTitle: {
    type: ControlType.String,
    title: 'Title',
    defaultValue: 'Monetize Your Framer Projects',
    hidden: props => !props.showHeader
  },
  headerDescription: {
    type: ControlType.String,
    title: 'Description',
    defaultValue: 'Launch subscriptions, one-time payments, and billing portals in minutes - no backend needed.',
    displayTextArea: true,
    hidden: props => !props.showHeader
  },
  headerAlignment: {
    type: ControlType.Enum,
    title: 'Alignment',
    options: ['left', 'center', 'right'],
    optionTitles: ['Left', 'Center', 'Right'],
    defaultValue: 'center',
    hidden: props => !props.showHeader
  },
  headerTitleFontSize: {
    type: ControlType.Number,
    title: 'Title Font Size',
    defaultValue: 48,
    min: 24,
    max: 80,
    step: 2,
    unit: 'px',
    displayStepper: true,
    hidden: props => !props.showHeader
  },
  headerDescriptionFontSize: {
    type: ControlType.Number,
    title: 'Description Size',
    defaultValue: 18,
    min: 12,
    max: 28,
    step: 1,
    unit: 'px',
    displayStepper: true,
    hidden: props => !props.showHeader
  },
  headerTitleColor: {
    type: ControlType.Color,
    title: 'Title Color',
    defaultValue: '#000000',
    hidden: props => !props.showHeader
  },
  headerDescriptionColor: {
    type: ControlType.Color,
    title: 'Description Color',
    defaultValue: '#9CA3AF',
    hidden: props => !props.showHeader
  },

  tiers: {
    type: ControlType.Array,
    title: 'Pricing Tiers',
    control: {
      type: ControlType.Object,
      title: 'Tier',
      controls: {
        name: { type: ControlType.String, title: 'Name', defaultValue: 'Premium' },
        monthlyPrice: { type: ControlType.Number, title: 'Monthly Price', min: 0, defaultValue: 99, step: 1 },
        yearlyPrice: { type: ControlType.Number, title: 'Yearly Price', min: 0, defaultValue: 950, step: 1 },
        description: {
          type: ControlType.String,
          title: 'Description',
          defaultValue: 'Perfect for growing teams',
          displayTextArea: true
        },
        featuresTitle: {
          type: ControlType.String,
          title: 'Features Title',
          defaultValue: 'Features'
        },
        features: {
          type: ControlType.Array,
          title: 'Features',
          control: { type: ControlType.String, title: 'Feature', defaultValue: 'Feature item' },
          defaultValue: ['Feature 1', 'Feature 2', 'Feature 3']
        },
        productId: { type: ControlType.String, title: 'Product ID', defaultValue: 'prod_abc123' },
        monthlyProductId: {
          type: ControlType.String,
          title: 'Monthly ID (Optional)',
          defaultValue: '',
          description: 'For separate monthly/yearly products'
        },
        yearlyProductId: {
          type: ControlType.String,
          title: 'Yearly ID (Optional)',
          defaultValue: '',
          description: 'For separate monthly/yearly products'
        },
        ctaText: { type: ControlType.String, title: 'Button Text', defaultValue: 'Purchase plan' },
        ctaVariant: {
          type: ControlType.Enum,
          title: 'Button Variant',
          options: ['default', 'outline', 'ghost', 'gradient', 'shadow', 'shimmer', 'icon-slide'],
          optionTitles: ['Default', 'Outline', 'Ghost', 'Gradient', 'Shadow', 'Shimmer', 'Icon Slide'],
          defaultValue: 'default',
          description: 'Button style variant'
        },
        ctaBackground: {
          type: ControlType.Color,
          title: 'Button BG (Optional)',
          optional: true,
          description: 'Leave empty to use default'
        },
        ctaTextColor: {
          type: ControlType.Color,
          title: 'Button Text (Optional)',
          optional: true,
          description: 'Leave empty to use default'
        },
        highlighted: {
          type: ControlType.Boolean,
          title: 'Featured',
          defaultValue: false,
          enabledTitle: 'Yes',
          disabledTitle: 'No'
        }
      }
    }
  },

  // Toggle Settings
  showYearlyToggle: {
    type: ControlType.Boolean,
    title: 'Billing Toggle',
    defaultValue: true,
    enabledTitle: 'Show',
    disabledTitle: 'Hide'
  },
  toggleMonthlyLabel: {
    type: ControlType.String,
    title: 'Monthly Label',
    defaultValue: 'Monthly',
    hidden: (props: Props) => !props.showYearlyToggle
  },
  toggleYearlyLabel: {
    type: ControlType.String,
    title: 'Yearly Label',
    defaultValue: 'Yearly',
    hidden: (props: Props) => !props.showYearlyToggle
  },
  toggleStyle: {
    type: ControlType.Enum,
    title: 'Toggle Style',
    options: ['pill', 'segmented'],
    optionTitles: ['Pill', 'Segmented'],
    defaultValue: 'pill',
    displaySegmentedControl: true,
    hidden: (props: Props) => !props.showYearlyToggle
  },

  // Background Colors
  pageBackground: {
    type: ControlType.Color,
    title: 'Page Background',
    defaultValue: 'transparent'
  },
  cardBackground: {
    type: ControlType.Color,
    title: 'Card Background',
    defaultValue: '#FFFFFF'
  },

  // Border Colors
  borderColor: {
    type: ControlType.Color,
    title: 'Border Color',
    defaultValue: '#E6E6E6'
  },
  featuredBorderColor: {
    type: ControlType.Color,
    title: 'Featured Border',
    defaultValue: '#111111'
  },
  dividerColor: {
    type: ControlType.Color,
    title: 'Divider Color',
    defaultValue: '#EDEDED'
  },

  // Text Colors
  textColor: {
    type: ControlType.Color,
    title: 'Text Color',
    defaultValue: '#000000'
  },
  mutedTextColor: {
    type: ControlType.Color,
    title: 'Muted Text',
    defaultValue: '#7A7A7A'
  },

  // Button Colors
  primaryButtonBackground: {
    type: ControlType.Color,
    title: 'Primary Button BG',
    defaultValue: '#111111'
  },
  primaryButtonTextColor: {
    type: ControlType.Color,
    title: 'Primary Button Text',
    defaultValue: '#FFFFFF'
  },
  secondaryButtonBackground: {
    type: ControlType.Color,
    title: 'Secondary Button BG',
    defaultValue: '#EDEDED'
  },
  secondaryButtonTextColor: {
    type: ControlType.Color,
    title: 'Secondary Button Text',
    defaultValue: '#000000'
  },
  buttonBorderColor: {
    type: ControlType.Color,
    title: 'Button Border',
    defaultValue: '#E1E1E1'
  },

  // Toggle Colors
  toggleBackground: {
    type: ControlType.Color,
    title: 'Toggle BG',
    defaultValue: '#FFFFFF',
    hidden: (props: Props) => !props.showYearlyToggle
  },
  toggleBorderColor: {
    type: ControlType.Color,
    title: 'Toggle Border',
    defaultValue: '#E6E6E6',
    hidden: (props: Props) => !props.showYearlyToggle
  },
  toggleActiveBackground: {
    type: ControlType.Color,
    title: 'Toggle Active BG',
    defaultValue: '#111111',
    hidden: (props: Props) => !props.showYearlyToggle
  },
  toggleActiveTextColor: {
    type: ControlType.Color,
    title: 'Toggle Active Text',
    defaultValue: '#FFFFFF',
    hidden: (props: Props) => !props.showYearlyToggle
  },
  toggleTextColor: {
    type: ControlType.Color,
    title: 'Toggle Text',
    defaultValue: '#111111',
    hidden: (props: Props) => !props.showYearlyToggle
  },

  // Feature Bullets
  bulletColor: {
    type: ControlType.Color,
    title: 'Bullet Color',
    defaultValue: '#111111'
  },
  bulletSize: {
    type: ControlType.Number,
    title: 'Bullet Size',
    defaultValue: 8,
    min: 4,
    max: 14,
    step: 1,
    unit: 'px',
    displayStepper: true
  },

  // Typography
  titleFontSize: {
    type: ControlType.Number,
    title: 'Title Font Size',
    defaultValue: 28,
    min: 16,
    max: 48,
    step: 1,
    unit: 'px',
    displayStepper: true
  },
  descriptionFontSize: {
    type: ControlType.Number,
    title: 'Description Size',
    defaultValue: 14,
    min: 10,
    max: 20,
    step: 1,
    unit: 'px',
    displayStepper: true
  },
  priceFontSize: {
    type: ControlType.Number,
    title: 'Price Font Size',
    defaultValue: 56,
    min: 24,
    max: 80,
    step: 2,
    unit: 'px',
    displayStepper: true
  },
  featuresTitleFontSize: {
    type: ControlType.Number,
    title: 'Features Title Size',
    defaultValue: 20,
    min: 14,
    max: 32,
    step: 1,
    unit: 'px',
    displayStepper: true
  },
  featureFontSize: {
    type: ControlType.Number,
    title: 'Feature Font Size',
    defaultValue: 15,
    min: 10,
    max: 20,
    step: 1,
    unit: 'px',
    displayStepper: true
  },
  buttonFontSize: {
    type: ControlType.Number,
    title: 'Button Font Size',
    defaultValue: 15,
    min: 10,
    max: 20,
    step: 1,
    unit: 'px',
    displayStepper: true
  },

  // Card Styling
  cardRadius: {
    type: ControlType.Number,
    title: 'Card Radius',
    defaultValue: 14,
    min: 0,
    max: 40,
    step: 1,
    unit: 'px',
    displayStepper: true
  },
  cardBorderWidth: {
    type: ControlType.Number,
    title: 'Border Width',
    defaultValue: 2,
    min: 0,
    max: 8,
    step: 1,
    unit: 'px',
    displayStepper: true
  },
  featuredCardBorderWidth: {
    type: ControlType.Number,
    title: 'Featured Border Width',
    defaultValue: 2,
    min: 0,
    max: 10,
    step: 1,
    unit: 'px',
    displayStepper: true
  },
  cardPadding: {
    type: ControlType.Number,
    title: 'Card Padding',
    defaultValue: 26,
    min: 10,
    max: 60,
    step: 1,
    unit: 'px',
    displayStepper: true
  },
  cardGap: {
    type: ControlType.Number,
    title: 'Card Gap',
    defaultValue: 18,
    min: 8,
    max: 40,
    step: 1,
    unit: 'px',
    displayStepper: true
  },

  // Layout
  gridGap: {
    type: ControlType.Number,
    title: 'Grid Gap',
    defaultValue: 22,
    min: 8,
    max: 60,
    step: 1,
    unit: 'px',
    displayStepper: true
  },
  minCardWidth: {
    type: ControlType.Number,
    title: 'Min Card Width',
    defaultValue: 300,
    min: 200,
    max: 520,
    step: 10,
    unit: 'px',
    displayStepper: true
  },
  maxWidth: {
    type: ControlType.Number,
    title: 'Max Width',
    min: 800,
    max: 1600,
    step: 50,
    defaultValue: 1200,
    unit: 'px',
    displayStepper: true
  },

  // Button Styling
  buttonHeight: {
    type: ControlType.Number,
    title: 'Button Height',
    defaultValue: 44,
    min: 34,
    max: 72,
    step: 1,
    unit: 'px',
    displayStepper: true
  },
  buttonRadius: {
    type: ControlType.Number,
    title: 'Button Radius',
    defaultValue: 8,
    min: 0,
    max: 30,
    step: 1,
    unit: 'px',
    displayStepper: true
  },

  // Other
  testMode: {
    type: ControlType.Boolean,
    title: 'Test Mode',
    defaultValue: false,
    enabledTitle: 'On',
    disabledTitle: 'Off'
  }
})

export default CreemPricingTable
