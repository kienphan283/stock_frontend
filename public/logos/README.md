# Company Logos

This folder contains company logo images for stock tickers.

## Adding New Logos

To add a logo for a company:

1. Save the logo image (preferably PNG format with transparent background) with the naming convention: `{company-name}.png`
   - Example: `apple.png`, `microsoft.png`, `google.png`

2. Recommended specifications:
   - Format: PNG with transparent background
   - Size: 200x200px to 512x512px
   - Aspect ratio: Square (1:1)

3. Update the `companiesData` in `/src/data/companies.ts` to reference the new logo:
   ```typescript
   logo: "/logos/{company-name}.png"
   ```

## Where to Find Logos

You can find official company logos from:
- Company official websites (usually in press/media kits)
- [Clearbit Logo API](https://logo.clearbit.com/company.com) - Quick browser download
- [Brandfetch](https://brandfetch.com/) - High-quality brand assets
- Company investor relations pages

## Fallback Behavior

If a logo is not available, the application will automatically:
- Display a default company emoji (🏢), or
- Show the first letter of the company name

No errors will be thrown if a logo is missing.

