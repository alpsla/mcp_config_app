# Video Assets

This directory is for storing video files that will be used in the MCP Configuration Tool dashboard.

## Adding a New Video

1. Place your video file (MP4 format recommended) in this directory
2. Update the examples array in `src/components/dashboard/NewDashboard.jsx` to include your video
3. Uncomment the video example code and update the properties as needed

Example:
```javascript
{
  id: 'virtual-world',
  title: 'Virtual Beach World',
  model: 'LargeWorldModel',
  prompt: 'Create a virtual beach resort with palm trees and interactive elements',
  assetPath: '../../assets/videos/your-video-filename.mp4',
  type: 'video'
}
```

## Video Guidelines

- Keep file sizes reasonably small (under 10MB if possible)
- Use MP4 format with H.264 encoding for best browser compatibility
- Recommended dimensions: 1280x720 or 1920x1080
- Include a relevant poster/thumbnail image in the images directory
