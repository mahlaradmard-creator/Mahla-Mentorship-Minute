# Mahla's Mentorship Minute

Short mentorship conversations for radiology trainees and early-career faculty.
One mentor. One question. Three takeaways. One action.

Live site: https://dyousem1.github.io/Mentorship-minute/

## Files

| File | Purpose |
|---|---|
| `index.html` | The whole site. Do not edit to add episodes. |
| `episodes.js` | The episode list. **This is the only file to edit when adding an episode.** |
| `videos/` | MP4 files (each must be under 100 MB — GitHub's per-file limit) |
| `posters/` | Still images shown before play |

## Adding an episode

1. Add the video to `videos/` (under 100 MB) **or** upload it to YouTube (unlisted is fine) and use the YouTube link.
2. Add a poster image to `posters/` (optional).
3. Open `episodes.js`, copy the top block, paste it above, fill in the fields.
4. Commit. The site updates within a minute or two.

## Keeping videos under 100 MB

Run on the Mac before uploading (installs ffmpeg once with Homebrew):

```
brew install ffmpeg
ffmpeg -i "input.mp4" -vf scale=1280:-2 -c:v libx264 -preset veryfast -crf 26 -c:a aac -b:a 96k -movflags +faststart "episode 02.mp4"
```

Typical result for a 12-minute Zoom recording: roughly 30 to 50 MB.
