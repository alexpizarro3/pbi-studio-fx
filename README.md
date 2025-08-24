# Glowlytics – Power BI Theme Studio

A sophisticated web application for creating, visualizing, exporting and sharing custom themes for Power BI, with a focus on minimalist design, glassmorphism effects, and professional theme creation capabilities.

## ✨ Features

### 🎨 Theme Creation
- **Interactive Palette Selector** - Choose from curated color palettes organized by style
- **Real-time Preview** - See your theme changes instantly
- **Palette-Adaptive Accents** - UI elements automatically adapt to selected colors
- **Accessibility Compliant** - All palettes meet WCAG 4.5 contrast requirements

### 📤 Export & Management
- **Power BI Export** - Generate JSON theme files ready for Power BI Desktop
- **Custom Palette Manager** - Save, load, and organize your custom color palettes
- **Custom Palette Builder** - Create palettes with color harmony generators (complementary, triadic, analogous)
- **Interactive Color Picker** - Advanced color selection with predefined quick colors
- **Real-time Theme Preview** - See your colors applied to mock dashboard elements
- **Professional Export Dialog** - Preview theme details before export
- **Local Storage** - Your custom palettes are saved locally for future use

### 🎭 Visual Modes
- **Elegant** - Sophisticated with soft shadows and refined animations
- **Minimal** - Clean and understated design
- **Vivid** - Bold colors with enhanced visual effects

### ⚡ Animation Presets
- **Smooth** - Gentle, professional transitions (300ms)
- **Bouncy** - Playful spring animations with scale effects
- **Crisp** - Fast, responsive interactions (150ms)

### 🔮 Advanced UI
- **Glassmorphism Effects** - Modern translucent design
- **Animated Gradient Borders** - Subtle rotating gradients
- **Ripple Microinteractions** - Touch-responsive button feedback
- **Framer Motion Transitions** - Smooth page and component animations

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation & Setup
```bash
# Clone the repository
git clone https://github.com/your-username/pbi-studio-fx.git
cd pbi-studio-fx

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Basic Usage
1. **Select a Palette**: Choose from curated color palettes in the sidebar
2. **Customize Theme**: Adjust visual mode (Elegant/Minimal/Vivid) and animation preset
3. **Preview**: See real-time preview of your theme applied to dashboard mockups
4. **Export**: Click "Export Theme" to generate Power BI JSON file
5. **Import to Power BI**: View → Themes → Browse for themes → Select your JSON file

## 🎯 Technology Stack

### Current Implementation
- **Frontend:** Next.js 15.5.0 with Turbopack, React 18, TypeScript
- **Styling:** Tailwind CSS, Framer Motion for animations
- **Color Engine:** Native JavaScript with WCAG contrast calculations
- **Storage:** Browser localStorage for palette persistence
- **Focus Management:** focus-trap-react for accessibility

### Planned Architecture (Roadmap)
- **Color Engine:** culori or colorjs.io (OKLCH/HCT color spaces)
- **Backend:** Next.js API Routes, Postgres/Supabase
- **Auth:** Supabase Auth (email/password + OAuth Microsoft/Google)
- **Payments:** Stripe (subscriptions + marketplace)
- **Storage:** Supabase or S3-compatible for .pbix/.pbit files
- **Infrastructure:** Vercel (frontend + API), Supabase/Neon (database)

## 🎨 Design Philosophy

Glowlytics embraces a **minimalist aesthetic** with **glassmorphism effects** while maintaining professional standards for business intelligence applications. The design balances visual appeal with functional clarity, ensuring themes work effectively in corporate environments.

### Color Approach
- **Accessibility First** - All palettes meet WCAG 4.5+ contrast requirements
- **Perceptual Uniformity** - Future OKLCH/HCT color space support for consistent brightness
- **Seasonal Inspiration** - Trending palettes from Pantone, fashion, and design communities
- **Business Context** - Colors that work well for charts, KPIs, and dashboards

### UI Principles
- **Glassmorphism** - Subtle transparency and blur effects
- **Smooth Animations** - Framer Motion for professional transitions
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Dark/Light Modes** - Adaptive interface for different environments

## 📁 Project Architecture

### Current Structure
```
/pbi-studio-fx
├── app/
│   ├── page.tsx                    # Main application component
│   ├── layout.tsx                  # Root layout
│   └── globals.css                 # Global styles and animations
├── src/
│   ├── components/
│   │   ├── ExportModal.tsx        # Power BI theme export dialog
│   │   ├── PaletteManager.tsx     # Custom palette management
│   │   ├── CustomPaletteBuilder.tsx # Palette creation with harmony
│   │   ├── ThemePreview.tsx       # Mock dashboard preview
│   │   ├── ColorPicker.tsx        # Color selection component
│   │   └── Icon.tsx               # Icon component library
│   └── utils/
│       └── powerbi-export.ts      # Export utilities and types
├── scripts/
│   ├── contrast-audit.js          # Color accessibility auditing
│   └── find-safe-purple.js        # Color optimization scripts
└── package.json
```

### Planned Modular Architecture
```
/pbi-theme-studio
├── app/                           # Next.js 14+ app directory
├── components/                    # Shared UI components (shadcn/ui)
├── modules/                       # Feature modules
│   ├── theme-builder/            # Core theme creation
│   ├── preview/                  # Theme visualization
│   ├── export/                   # Multi-format export
│   ├── marketplace/              # Theme marketplace
│   ├── auth/                     # User authentication
│   └── integrations/             # Coolors, Figma APIs
├── lib/                          # Utilities and config
│   ├── seasonal-palettes.json   # Predefined trending palettes
│   ├── color-engine.ts          # OKLCH/HCT color utilities
│   └── supabase.ts              # Database client
├── store/                        # Zustand state management
└── styles/                       # Tailwind config and themes
```

## 🛣️ Roadmap & Planned Modules

### Phase 1: Enhanced Core Features (Current)
- ✅ **Theme Builder MVP** - Interactive palette selection and real-time preview
- ✅ **Export System** - Power BI JSON generation with validation
- ✅ **Custom Palette Manager** - Save/load/delete custom palettes
- ✅ **Accessibility** - WCAG compliant contrast checking
- 🔄 **Focus Management** - Enhanced keyboard navigation (in progress)

### Phase 2: Advanced Generation
- **Palette Generation** - Create palettes from seed colors, images, Coolors URLs
- **Figma Integration** - Import variables and design tokens
- **Seasonal Palettes** - Trending color schemes (Pantone 2025, Neon 80s, etc.)
- **Color Harmony** - Complementary, triadic, analogous generators
- **Advanced Color Engine** - OKLCH/HCT color space support

### Phase 3: Preview & Export
- **Enhanced Preview** - Power BI Embedded integration
- **Multiple Export Formats** - CSS variables, Tailwind config, Style Dictionary
- **Template System** - PBIT/PBIX file generation
- **Theme Versioning** - Save and rollback theme versions

### Phase 4: Collaboration & Marketplace
- **User Authentication** - Supabase Auth with Microsoft/Google OAuth
- **Cloud Storage** - Sync palettes across devices
- **Theme Library** - Public/private theme collections
- **Premium Marketplace** - Buy/sell custom themes with Stripe integration
- **Team Features** - Collaborative theme creation

### Phase 5: Enterprise Features
- **API Access** - Programmatic theme generation
- **Bulk Operations** - Apply themes to multiple reports
- **Brand Guidelines** - Corporate color compliance
- **Analytics** - Theme usage insights

## � Planned Dataset - Seasonal Palettes

The application will include curated seasonal and trending color palettes:

### Initial Palette Collection (`/lib/seasonal-palettes.json`)
- **Pantone 2025** - Colors of the year and seasonal trends
- **Neon 80s** - Retro-futuristic cyberpunk aesthetics  
- **Minimal Pastel** - Soft, contemporary minimalism
- **Gradient Sunset** - Warm, organic color transitions
- **Dark Elegance** - Sophisticated dark mode palettes
- **Nature Green** - Earth-inspired environmental themes
- **Cyberpunk** - High-contrast tech aesthetics
- **Desert Sand** - Warm, neutral earth tones
- **Ocean Wave** - Cool blues and aquatic themes
- **Future Tech** - Modern, clean corporate colors

Each palette includes 8-12 colors with semantic assignments for:
- Primary data visualization
- Secondary/accent colors  
- Background and surface colors
- Text and annotation colors
- Success/warning/error states

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## 📄 License

MIT License - Feel free to use in your projects!

---

**Glowlytics** – Crafting beautiful Power BI themes with precision and style. 🎨✨

