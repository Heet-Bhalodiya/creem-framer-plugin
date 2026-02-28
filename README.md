<div align="center">
  
# 💳 Creem Framer Plugin — No-Code Payments & Pricing Tables for Framer Websites

Transform your Framer websites into revenue-generating products with Creem.  
Add checkout buttons, pricing tables, and payment flows directly inside Framer with zero coding.

Perfect for SaaS founders, creators, agencies, and digital product businesses.

### Accept payments in Framer with beautiful, accessible components

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![WCAG 2.1 AA](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA-green.svg)](https://www.w3.org/WAI/WCAG21/quickref/)
[![Built for Creem](https://img.shields.io/badge/Built%20for-Creem-FF6B35.svg)](https://creem.io)

> Creem for Framer is a payment plugin that allows you to accept payments, sell subscriptions, and create pricing pages in Framer using Creem’s checkout system.

[Tutorial](https://dev.to/heet_bhalodiya/how-to-add-payment-buttons-pricing-tables-to-your-framer-website-no-code-required-267) • [Documentation](https://docs.creem.io) • [Report Bug](https://github.com/Heet-Bhalodiya/creem-framer-plugin/issues) • [Request Feature](https://github.com/Heet-Bhalodiya/creem-framer-plugin/issues)

<p align="center">
   <a href="https://creem.io" target="_blank">
      <img src="./images/read-me-image.png" alt="creem-logo" width="700px" height="auto">
   </a>
</p>

</div>

## 🚀 Introduction

Transform your Framer projects into revenue-generating machines with **Creem for Framer**. Accept payments with zero coding—just drag, drop, and customize.

Perfect for SaaS landing pages, online courses, membership sites, and digital products. Built for the **[Creem Scoops Competition](https://creem.io/scoops)** with accessibility and performance at its core.

## ✨ Features

🛒 **Checkout Button** - 7 variants (Default, Outline, Ghost, Gradient, Shadow, Shimmer, Icon Slide)  
💳 **Pricing Tables** - Up to 5 tiers with monthly/yearly toggle & auto-pairing  
♿️ **WCAG 2.1 AA** - Full keyboard nav, screen readers, reduced motion support  
🎨 **60+ Controls** - Colors, typography, spacing—everything customizable  
📱 **Responsive** - Mobile, tablet, desktop breakpoints built-in  
⚡️ **Auto-Setup** - Components created on first insert  
🔒 **Test Mode** - Try before going live with real payments  
🎯 **Two Modes** - Embed popup or new tab checkout

## Why Use Creem with Framer?

Framer is a powerful website builder, but adding payments usually requires custom code or external tools.

Creem for Framer solves this by providing:

- No-code payment integration
- Built-in checkout buttons and pricing tables
- Subscription and one-time payment support
- Fast setup directly inside Framer

This makes it easy to launch SaaS products, sell digital goods, or monetize websites without engineering effort.

## 🧩 Use Cases

Creem for Framer is ideal for:

- SaaS landing pages with subscription checkout
- Online courses and digital products
- Membership websites
- Agencies selling services
- Indie hackers launching MVPs
- Startups validating product ideas

If you want to accept payments in Framer, this plugin provides a complete monetization solution.

## 📦 Installation

> **⚠️ Note:** This plugin is currently in development and not yet published to the Framer marketplace. You can install it manually from GitHub.

### Install from GitHub

```bash
# Clone the repository
git clone https://github.com/Heet-Bhalodiya/creem-framer-plugin.git
cd creem-framer-plugin

# Install dependencies
pnpm install
# or: npm install

# Start development server
pnpm dev
# or: npm run dev

# Build the plugin
pnpm build
# or: npm run build
```

### Load in Framer

1. Open Framer Desktop App
2. Go to your project → **Plugins** panel
3. Click **Development** tab
4. Click **New Plugin from Folder**
5. Select the `creem-framer-plugin` folder
6. Plugin appears in your plugins list!

### Connect to Creem

1. Get your API key from [Creem Dashboard](https://creem.io/dashboard) → Settings → API Keys
2. Open the Creem plugin in Framer
3. Paste your Test Mode key
4. Toggle Test Mode ON
5. Start building! 🎉

## 🎯 Quick Start

### 1. Get API Key

Grab your key from [Creem Dashboard](https://creem.io/dashboard) (test or production).

### 2. Insert Button

Plugin → **Button** tab → Select product → Customize → **Insert**

### 3. Insert Pricing Table

Plugin → **Pricing** tab → Select 1-5 products → Reorder → **Insert**

### 4. Customize

Use Framer's property panel to fine-tune colors, sizes, text, and more.

## 🎨 Components

### Checkout Button

**7 Variants**: Default, Outline, Ghost, Gradient, Shadow, Shimmer, Icon Slide  
**Customization**: Colors, text, sizes, padding, borders, discount codes, success URLs  
**Modes**: Embed (popup) or New Tab

### Pricing Table

**Tiers**: 1-5 pricing tiers with full customization  
**Toggle**: Monthly/yearly billing switcher  
**Auto-Pairing**: Automatically detects matching subscription products  
**60+ Controls**: Separate controls for colors, fonts, spacing, borders, toggle styles  
**Responsive**: Flexbox layout adapts to any screen size

> **💡 SaaS Product Tip:** For subscription products with monthly and yearly billing options, create TWO separate products in Creem:
>
> - Example: "Pro Plan - Monthly" ($29/month) and "Pro Plan - Yearly" ($290/year)
> - The plugin automatically pairs products with matching names that include "monthly/yearly" or "month/year" keywords
> - This enables the billing period toggle in your pricing table!

## ♿️ Accessibility

**WCAG 2.1 Level AA** compliant:

✅ Keyboard navigation (Tab, Enter, Space, Arrows, Escape)  
✅ Screen reader support with ARIA labels & live regions  
✅ Focus indicators with proper contrast  
✅ Reduced motion support  
✅ 44px minimum touch targets

## 🛠️ Tech Stack

- Vite 6 + React 18 + TypeScript
- Tailwind CSS 4
- Framer Plugin SDK v3
- Lucide React icons

## 🐛 Troubleshooting

**Components not inserting?**  
→ Grant file creation permission when prompted

**API key error?**  
→ Verify key from Creem dashboard, check test/prod mode

**Preview not working?**  
→ Components disabled in canvas—use Preview mode or Publish

**Styles not applying?**  
→ Switch to preview mode, clear Framer cache, or republish

## 📚 Resources

- [Creem API Docs](https://docs.creem.io)
- [Creem Dashboard](https://creem.io/dashboard)
- [Framer Plugin SDK](https://www.framer.com/developers/plugins/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## 📝 License

MIT License - Copyright (c) 2026 [Heet Bhalodiya](https://github.com/Heet-Bhalodiya)

See [LICENSE](LICENSE) for full text.

## 🤝 Support

- 🐛 [Report Bug](https://github.com/Heet-Bhalodiya/creem-framer-plugin/issues/new?labels=bug)
- ✨ [Request Feature](https://github.com/Heet-Bhalodiya/creem-framer-plugin/issues/new?labels=enhancement)

## 🌟 Show Support

Give a ⭐️ if this plugin helped you build better payment experiences!

<div align="center">

**Made with ❤️ for Framer & Creem communities**

[Creem](https://creem.io) • [Framer](https://framer.com) • [GitHub](https://github.com/heetbhalodiya/creem-framer-plugin)

</div>
