# Project Brief: Nuper Platform

## Core Purpose
To build a sustainable digital platform connecting students with career and innovation opportunities, focused on events, news, and project incubation.

## Primary Goal
Achieve financial sustainability by covering all operational costs and generating a surplus to fund an advertising budget.

## Core Constraint
Operational costs must be kept at or near zero in the initial phase. This requires leveraging free tiers (Firebase, Vercel/Netlify) and cost-effective third-party services (ImgBB).

## Target Audience
Students, young professionals, event organizers, startups, and potential investors/sponsors.

## Key Features
1. **Content Management:** Admin panel for managing Events, Bulletins, and Legal Documents.
2. **User Profiles:** Firebase Auth for user registration/login.
3. **Project Submission:** A dashboard for users to upload projects for review.
4. **Content Display:** Public-facing pages for Events, Bulletins, and a dynamic Space-themed Hero section.

## Security Requirements
1. XSS Protection using DOMPurify for all user-generated content
2. Role-based access control for admin features
3. Secure image handling through ImgBB API

## Performance Goals
1. Initial page load under 3 seconds
2. Smooth animations at 60fps
3. Responsive across all device sizes