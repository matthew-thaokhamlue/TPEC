# How to Manually Add Ongoing or Completed Projects to TPEC Website

This guide explains how to manually add new projects to the TPEC website's Projects page.

## Overview

Projects are stored in three places:
1. **Project data file** (`/assets/data/projects.json`) - main project information
2. **Translation files** (`/assets/i18n/en.json` and `/assets/i18n/lo.json`) - multilingual content
3. **Project images** (`/assets/img/projects/`) - cover images and gallery photos

## Step 1: Prepare Project Images

1. **Prepare the images**:
   - **Cover image**: Main project photo (recommended: 800x600 pixels or larger)
   - **Gallery images**: Additional project photos (optional, 2-4 images recommended)
   - Format: JPG or PNG
   - File naming convention: `project-slug-cover.jpg`, `project-slug-1.jpg`, `project-slug-2.jpg`

2. **Upload the images**:
   - Place all images in `/assets/img/projects/` directory
   - Example files:
     - `/assets/img/projects/new-bridge-project-cover.jpg`
     - `/assets/img/projects/new-bridge-project-1.jpg`
     - `/assets/img/projects/new-bridge-project-2.jpg`

## Step 2: Add Project to Data File

Edit `/assets/data/projects.json`:

1. **Find the projects array** (around line 2):
```json
{
  "projects": [
    { existing projects... }
  ]
}
```

2. **Add your new project** before the closing bracket:
```json
{
  "projects": [
    { existing projects... },
    {
      "slug": "new-bridge-project",
      "title": "New Bridge Construction Project",
      "status": "ongoing",
      "location": "Vientiane Province, Laos",
      "scope": "Bridge Design and Construction Supervision",
      "year": "2024-2025",
      "client": "Department of Public Works and Transport",
      "value": "2,500,000,000 Kip",
      "cover": "/assets/img/projects/new-bridge-project-cover.jpg",
      "gallery": [
        "/assets/img/projects/new-bridge-project-1.jpg",
        "/assets/img/projects/new-bridge-project-2.jpg"
      ],
      "summary_i18n_key": "projects.new_bridge_project.summary",
      "featured": true
    }
  ]
}
```

### Project Fields Explained:

- **slug**: Unique identifier (lowercase, hyphens only, no spaces)
- **title**: Project name displayed on cards and modals
- **status**: Either `"ongoing"` or `"completed"`
- **location**: Project location
- **scope**: Brief description of project type/scope
- **year**: Project timeline (e.g., "2024", "2023-2025")
- **client**: Client organization name
- **value**: Project value (optional)
- **funding**: Funding source (optional, e.g., "Japan Funded")
- **cover**: Path to main project image
- **gallery**: Array of additional project images (optional)
- **summary_i18n_key**: Translation key for project summary
- **featured**: Boolean - whether to highlight this project

## Step 3: Add to English Translation File

Edit `/assets/i18n/en.json`:

1. **Find the projects section** (around line 197):
```json
"projects": {
  "national_road_1e_lot1": { ... },
  "national_road_1e_lot2": { ... },
  ...
}
```

2. **Add your project translations**:
```json
"projects": {
  "national_road_1e_lot1": { ... },
  "national_road_1e_lot2": { ... },
  "new_bridge_project": {
    "summary": "Modern bridge construction project featuring advanced engineering design and sustainable construction practices in Vientiane Province.",
    "description": "This comprehensive bridge construction project involves the design and construction supervision of a modern bridge infrastructure. Our team provides expert guidance throughout all phases of the project, ensuring compliance with international standards and local regulations while maintaining the highest quality and safety standards."
  }
}
```

## Step 4: Add to Lao Translation File

Edit `/assets/i18n/lo.json`:

1. **Find the projects section** (around line 204):
```json
"projects": {
  "national_road_1e_lot1": { ... },
  "national_road_1e_lot2": { ... },
  ...
}
```

2. **Add the Lao translations**:
```json
"projects": {
  "national_road_1e_lot1": { ... },
  "national_road_1e_lot2": { ... },
  "new_bridge_project": {
    "summary": "ໂຄງການກໍ່ສ້າງຂົວທີ່ທັນສະໄໝ ມີການອອກແບບວິສະວະກຳຂັ້ນສູງ ແລະ ການປະຕິບັດການກໍ່ສ້າງແບບຍືນຍົງໃນແຂວງວຽງຈັນ.",
    "description": "ໂຄງການກໍ່ສ້າງຂົວແບບຄົບຖ້ວນນີ້ລວມເອົາການອອກແບບ ແລະ ການກວດກາການກໍ່ສ້າງໂຄງສ້າງພື້ນຖານຂົວທີ່ທັນສະໄໝ. ທີມງານຂອງພວກເຮົາໃຫ້ການແນະນຳຈາກຜູ້ຊ່ຽວຊານຕະຫຼອດທຸກໄລຍະຂອງໂຄງການ, ຮັບປະກັນການປະຕິບັດຕາມມາດຕະຖານສາກົນ ແລະ ກົດລະບຽບທ້ອງຖິ່ນ ໃນຂະນະທີ່ຮັກສາມາດຕະຖານຄຸນນະພາບ ແລະ ຄວາມປອດໄພສູງສຸດ."
  }
}
```

## Step 5: Test Your Changes

1. **Open the website** in a browser
2. **Navigate to the Projects page**
3. **Check the appropriate tab**:
   - For ongoing projects: Click "Ongoing" tab
   - For completed projects: Click "Completed" tab
4. **Verify**:
   - New project card appears in the correct tab
   - Cover image displays correctly
   - Clicking opens the modal with full details
   - All information displays correctly in both English and Lao

## Project Categories and Services

The system automatically determines project services based on the scope field:

- **Tourism projects**: Scope contains "tourism" or slug contains "resort"
- **Industrial projects**: Scope contains "industrial" 
- **Infrastructure projects**: Scope contains "infrastructure" or "bridge"
- **Residential projects**: Scope contains "residential"
- **Default**: Commercial projects

Services are automatically pulled from the translation files based on project type.

## Important Notes

- **Slug uniqueness**: Each project must have a unique slug
- **File paths**: Use forward slashes (/) in image paths
- **JSON syntax**: Be careful with commas and brackets
- **Image optimization**: Optimize images for web (compress for faster loading)
- **Translation keys**: Must match between projects.json and translation files

## Troubleshooting

**Project not showing?**
- Check JavaScript console for errors
- Verify JSON syntax is valid
- Ensure status is either "ongoing" or "completed"

**Images not displaying?**
- Check file paths and file names
- Ensure images exist in `/assets/img/projects/`
- Check browser console for 404 errors

**Modal not working?**
- Verify slug matches in all files
- Check translation keys are correct
- Ensure JavaScript syntax is valid

**Wrong tab?**
- Check the "status" field is correct ("ongoing" or "completed")
- Refresh the page after making changes

## Advanced Features

### Optional Project Fields

You can add these optional fields to provide more detailed information:

```json
{
  "slug": "advanced-project",
  "title": "Advanced Project Example",
  "status": "completed",
  "location": "Luang Prabang, Laos",
  "scope": "Infrastructure Development",
  "year": "2023",
  "client": "Ministry of Public Works",
  "value": "5,000,000,000 Kip",
  "funding": "World Bank Funded",
  "challenges": "Complex terrain and environmental considerations required innovative engineering solutions.",
  "outcomes": "Successfully completed on time and under budget, improving regional connectivity.",
  "cover": "/assets/img/projects/advanced-project-cover.jpg",
  "gallery": [
    "/assets/img/projects/advanced-project-1.jpg",
    "/assets/img/projects/advanced-project-2.jpg",
    "/assets/img/projects/advanced-project-3.jpg",
    "/assets/img/projects/advanced-project-4.jpg"
  ],
  "summary_i18n_key": "projects.advanced_project.summary",
  "featured": true
}
```

### Featured Projects

Set `"featured": true` to highlight important projects. Featured projects may be displayed prominently on the homepage or in special sections.

### Project Gallery

You can include up to 6 gallery images. The modal will display them in a grid layout:

```json
"gallery": [
  "/assets/img/projects/project-slug-1.jpg",
  "/assets/img/projects/project-slug-2.jpg",
  "/assets/img/projects/project-slug-3.jpg",
  "/assets/img/projects/project-slug-4.jpg"
]
```

### International Projects

For projects with international funding or partnerships:

```json
{
  "funding": "Japan International Cooperation Agency (JICA)",
  "client": "Government of Lao PDR",
  "value": "15,000 USD",
  "scope": "International Development Project"
}
```

## Quick Reference Examples

### Ongoing Road Project
```json
{
  "slug": "highway-expansion-2024",
  "title": "National Highway Expansion Project",
  "status": "ongoing",
  "location": "Champasak Province, Laos",
  "scope": "Highway Construction and Supervision",
  "year": "2024-2026",
  "client": "Department of Public Works and Transport",
  "value": "8,500,000,000 Kip",
  "cover": "/assets/img/projects/highway-expansion-2024-cover.jpg",
  "summary_i18n_key": "projects.highway_expansion_2024.summary",
  "featured": true
}
```

### Completed Bridge Project
```json
{
  "slug": "mekong-bridge-2023",
  "title": "Mekong River Bridge Construction",
  "status": "completed",
  "location": "Vientiane Capital, Laos",
  "scope": "Bridge Design and Construction Management",
  "year": "2021-2023",
  "client": "Ministry of Public Works and Transport",
  "value": "12,000,000,000 Kip",
  "cover": "/assets/img/projects/mekong-bridge-2023-cover.jpg",
  "outcomes": "Enhanced regional connectivity and reduced travel time by 40%",
  "summary_i18n_key": "projects.mekong_bridge_2023.summary",
  "featured": true
}
```

### Industrial Project
```json
{
  "slug": "industrial-complex-2024",
  "title": "Savannakhet Industrial Complex Development",
  "status": "ongoing",
  "location": "Savannakhet Province, Laos",
  "scope": "Industrial Infrastructure Development",
  "year": "2024-2025",
  "client": "Lao Industrial Development Authority",
  "value": "20,000,000,000 Kip",
  "cover": "/assets/img/projects/industrial-complex-2024-cover.jpg",
  "summary_i18n_key": "projects.industrial_complex_2024.summary",
  "featured": false
}
```

## File Organization Tips

1. **Consistent naming**: Use descriptive, consistent file names
2. **Image sizes**: Keep cover images around 800x600px for optimal loading
3. **Backup**: Always backup files before making changes
4. **Version control**: Consider using git to track changes
5. **Testing**: Test on multiple devices and browsers

## Content Writing Guidelines

### Project Titles
- Be specific and descriptive
- Include location when relevant
- Use proper capitalization

### Project Summaries
- Keep to 1-2 sentences
- Highlight key achievements or unique aspects
- Focus on client benefits

### Project Descriptions
- Provide comprehensive overview
- Include technical details when relevant
- Mention challenges overcome
- Highlight successful outcomes
