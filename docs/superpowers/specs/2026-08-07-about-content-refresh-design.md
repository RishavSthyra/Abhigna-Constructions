# About Content Refresh Design

Date: 2026-08-07
Project: `abhigna-constructions`
Scope: Replace placeholder About copy on the homepage and `/about` page with Abhigna Constructions brand content supplied by the user.

## Goal

Refresh the site's About messaging so it accurately reflects Abhigna Constructions as a Bangalore-based real estate developer established in 2007, with a focus on residential communities, sustainability, and quality of life.

## Current Problem

The homepage About section and `/about` page still use generic placeholder real-estate language. The current copy also contains conflicting company details, including references to other cities and a different founding timeline.

## In Scope

- Update the homepage About section in `components/Home/ExperienceExcellence.tsx`.
- Update the `/about` page hero copy in `app/about/page.tsx`.
- Update the long-form About story content in `components/About/AboutStory.tsx`.
- Replace generic realtor-style messaging with developer-focused language aligned to the user-provided brand description.
- Remove conflicting references to Hyderabad, 2003, agents, ratings, and generic property-selection language where those appear in the About experience.

## Out of Scope

- Redesigning the layout, spacing, or animations of the homepage or About page.
- Replacing imagery, icons, or interaction behavior.
- Introducing new factual claims beyond the user-provided content.

## Content Direction

The refreshed copy should communicate:

- Abhigna Constructions is one of the leading real estate developers in Bangalore.
- The company was established in 2007.
- It has a strong record of completed residential developments across Bangalore.
- Its offering includes apartments and 1BHK, 2BHK, 3BHK, and 4BHK homes.
- Its broader purpose is building homes as part of an overall community.
- Quality of life and sustainable communities are central themes.
- The team emphasizes high standards in residential development and client service.

## Recommended Approach

Keep the current visual structure intact and swap only the content layer.

Implementation direction:

- Rewrite the homepage left and right column copy so it reads as a company introduction instead of a broker pitch.
- Replace secondary labels that imply agents, reviews, or property-marketplace behavior with trust, community, and development-focused messaging.
- Update the `/about` hero headline and paragraph to align with Bangalore, 2007, and the community-building mission.
- Rewrite the About page story, stats, and supporting sections so they remain editorial in tone but reflect only the verified information the user supplied.

## Assumptions

- "Upgrade the data" means improving the wording while staying faithful to the provided business description.
- Because no project counts, square footage, or partner names were provided, stats and supporting labels should avoid invented numeric claims.
- The current design system and section structure should remain unchanged.

## Expected Result

- The homepage About section reads as a polished introduction to Abhigna Constructions.
- The `/about` page no longer conflicts with the homepage or with the user-provided company history.
- The overall brand voice feels more credible, location-specific, and aligned with a residential developer rather than a generic broker site.

## Testing

- Verify the homepage About section renders the new copy without layout overflow on mobile and desktop.
- Verify the `/about` hero and story sections render updated text cleanly.
- Verify no outdated references to Hyderabad, 2003, agents, or customer ratings remain in the updated About surfaces.
