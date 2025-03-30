# MCP Configuration Tool Dashboard

This directory contains the implementation of the new dashboard for the MCP Configuration Tool.

## Component Structure

- `NewDashboard.jsx` - Main dashboard component
- `WelcomeBanner.jsx` - Banner with beta badge
- `ServiceCard.jsx` - Cards for File System and Web Search services
- `PricingTier.jsx` - Pricing plan cards
- `ModelCard.jsx` - Premium model cards
- `ExampleShowcase.jsx` - Interactive examples of model capabilities
- `TestimonialCard.jsx` - User testimonials
- `EmptyState.jsx` - Empty state for configurations
- `ComingSoon.jsx` - Coming soon features section

## Assets

The dashboard uses the following assets:
- `src/assets/images/Santa.webp` - Santa on the beach example image
- `src/assets/audio/tropical-christma.wav` - Holiday beach music
- `src/assets/videos/` - Directory for video examples (to be added later)

## Responsive Design

The dashboard is fully responsive and optimized for:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## Adding a Video Example

To add a video example to the dashboard:

1. Add your video file to the `src/assets/videos/` directory
2. Uncomment and update the video example code in `NewDashboard.jsx`
3. Test to make sure the video plays correctly

## Styling

Each component has its own CSS file with component-specific styles. The main dashboard styles are in `NewDashboard.css`.

Design variables (colors, spacing, etc.) are defined using CSS variables in the `:root` selector.

## Future Enhancements

- Add animations for smoother transitions between sections
- Implement dashboard search functionality
- Add more interactive elements to the model cards
- Integrate real-time analytics once the backend is ready
