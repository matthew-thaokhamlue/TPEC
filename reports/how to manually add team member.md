# How to Manually Add Team Members to TPEC Website

This guide explains how to manually add new team members to the TPEC website's Leadership Team section.

## Overview

The team members are stored in two places:
1. **Translation files** (`assets/i18n/en.json` and `assets/i18n/lo.json`) - for multilingual content
2. **JavaScript code** in `about.html` - for fallback display and functionality

## Step 1: Add Team Member Photos

1. **Prepare the photo**:
   - Use a square aspect ratio (1:1) for best results
   - Recommended size: 400x400 pixels or larger
   - Format: JPG or PNG
   - File name should be descriptive (e.g., "chief_engineer.jpg")

2. **Upload the photo**:
   - Place the photo in `/assets/img/team/` directory
   - Example: `/assets/img/team/chief_engineer.jpg`

## Step 2: Add to English Translation File

Edit `/assets/i18n/en.json`:

1. **Find the team section** (around line 362):
```json
"team": {
  "founder": { ... },
  "vice_president": { ... },
  "technology_advisor": { ... }
}
```

2. **Add your new team member** before the closing brace:
```json
"team": {
  "founder": { ... },
  "vice_president": { ... },
  "technology_advisor": { ... },
  "chief_engineer": {
    "name": "Dr. Jane Smith",
    "title": "Chief Engineer",
    "bio": "Dr. Jane Smith brings 15+ years of structural engineering expertise to TPEC. She specializes in bridge design and seismic analysis, leading our most complex infrastructure projects.",
    "education": "PhD in Structural Engineering, MIT (2008); Master's in Civil Engineering, Stanford University (2004)",
    "experience": [
      "Senior Structural Engineer, AECOM (2018 - 2023)",
      "Project Engineer, Bechtel Corporation (2012 - 2018)",
      "Design Engineer, Skanska USA (2008 - 2012)"
    ],
    "description": "Dr. Jane Smith serves as Chief Engineer, bringing world-class expertise in structural design and project management. Her innovative approach to complex engineering challenges strengthens TPEC's capabilities in large-scale infrastructure development."
  }
}
```

## Step 3: Add to Lao Translation File

Edit `/assets/i18n/lo.json`:

1. **Find the team section** (around line 362):
```json
"team": {
  "founder": { ... },
  "vice_president": { ... },
  "technology_advisor": { ... }
}
```

2. **Add the Lao translation**:
```json
"team": {
  "founder": { ... },
  "vice_president": { ... },
  "technology_advisor": { ... },
  "chief_engineer": {
    "name": "ດຣ. ເຈນ ສະມິດ",
    "title": "ຫົວໜ້າວິສະວະກອນ",
    "bio": "ດຣ. ເຈນ ສະມິດ ນຳເອົາຄວາມຊ່ຽວຊານດ້ານວິສະວະກຳໂຄງສ້າງ 15+ ປີມາສູ່ TPEC. ນາງຊ່ຽວຊານດ້ານການອອກແບບຂົວ ແລະ ການວິເຄາະແຜ່ນດິນໄຫວ, ນຳພາໂຄງການໂຄງສ້າງພື້ນຖານທີ່ສັບສົນທີ່ສຸດຂອງພວກເຮົາ.",
    "education": "ປະລິນຍາເອກວິສະວະກຳໂຄງສ້າງ, MIT (2008); ປະລິນຍາໂທວິສະວະກຳໂຍທາ, Stanford University (2004)",
    "experience": [
      "ວິສະວະກອນໂຄງສ້າງອາວຸໂສ, AECOM (2018 - 2023)",
      "ວິສະວະກອນໂຄງການ, Bechtel Corporation (2012 - 2018)",
      "ວິສະວະກອນອອກແບບ, Skanska USA (2008 - 2012)"
    ],
    "description": "ດຣ. ເຈນ ສະມິດ ດຳລົງຕຳແໜ່ງຫົວໜ້າວິສະວະກອນ, ນຳເອົາຄວາມຊ່ຽວຊານລະດັບໂລກໃນການອອກແບບໂຄງສ້າງ ແລະ ການຄຸ້ມຄອງໂຄງການ. ວິທີການສ້າງສັນຂອງນາງຕໍ່ກັບສິ່ງທ້າທາຍດ້ານວິສະວະກຳທີ່ສັບສົນເສີມສ້າງຄວາມສາມາດຂອງ TPEC ໃນການພັດທະນາໂຄງສ້າງພື້ນຖານຂະໜາດໃຫຍ່."
  }
}
```

## Step 4: Add to JavaScript Code

Edit `/about.html` and find the `populateTeamGrid()` function (around line 474):

1. **Find the teamMembers array**:
```javascript
const teamMembers = [
  { key: 'founder', ... },
  { key: 'vice_president', ... },
  { key: 'technology_advisor', ... }
];
```

2. **Add your new team member**:
```javascript
const teamMembers = [
  { key: 'founder', ... },
  { key: 'vice_president', ... },
  { key: 'technology_advisor', ... },
  {
    key: 'chief_engineer',
    name: 'Dr. Jane Smith',
    title: 'Chief Engineer',
    bio: 'Dr. Jane Smith brings 15+ years of structural engineering expertise to TPEC. She specializes in bridge design and seismic analysis, leading our most complex infrastructure projects.',
    education: 'PhD in Structural Engineering, MIT (2008); Master\'s in Civil Engineering, Stanford University (2004)',
    experience: [
      'Senior Structural Engineer, AECOM (2018 - 2023)',
      'Project Engineer, Bechtel Corporation (2012 - 2018)',
      'Design Engineer, Skanska USA (2008 - 2012)'
    ],
    description: 'Dr. Jane Smith serves as Chief Engineer, bringing world-class expertise in structural design and project management. Her innovative approach to complex engineering challenges strengthens TPEC\'s capabilities in large-scale infrastructure development.',
    image: '/assets/img/team/chief_engineer.jpg'
  }
];
```

## Step 5: Test Your Changes

1. **Open the website** in a browser
2. **Navigate to the About page**
3. **Scroll to the Leadership Team section**
4. **Verify**:
   - New team member appears in the grid
   - Photo displays correctly (or initials if photo fails)
   - Clicking opens the modal with full details
   - All information displays correctly

## Important Notes

- **File paths**: Use forward slashes (/) in image paths, even on Windows
- **Escaping**: Use `\'` for single quotes inside JavaScript strings
- **JSON syntax**: Be careful with commas and brackets in JSON files
- **Image fallback**: If images don't load, initials will display instead
- **Multilingual**: Always add content to both English and Lao files

## Troubleshooting

**Team member not showing?**
- Check JavaScript console for errors
- Verify JSON syntax is valid
- Ensure image path is correct

**Modal not working?**
- Check that the `key` field matches in all locations
- Verify JavaScript syntax is correct

**Image not displaying?**
- Check file path and file name
- Ensure image file exists in `/assets/img/team/`
- Check browser console for 404 errors
