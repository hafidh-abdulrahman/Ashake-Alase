# Replacing placeholder images

Drop the client's real photos into this folder using the filenames below.
They appear automatically. No code changes needed. Until a file exists, the site shows a designed placeholder.

To use different filenames, edit the `image` / `src` fields in:
- `src/data/mock/products.ts`  (product photos)
- `src/data/mock/content.ts`   (hero, gallery, about)

| File | Where it appears | Suggested size |
|------|------------------|----------------|
| `hero.jpg` | Homepage hero (portrait arch) | 1200 x 1500 |
| `october-1st-special.jpg` | Featured offer, menu, product page | 1200 x 1500 |
| `jollof-chicken-box.jpg` | Menu, product page | 1200 x 1500 |
| `small-chops-platter.jpg` | Menu, product page | 1200 x 1500 |
| `party-rice-tray.jpg` | Menu, product page | 1200 x 1500 |
| `gallery/1.jpg` to `gallery/5.jpg` | Homepage gallery | 1200 x 1200 or larger |
| `about.jpg` | About section | 1600 x 1200 |

Tips: use JPG or WebP, keep each file under 300 KB, and shoot food from above or at a slight angle in natural light.

## Hero video (optional)
Put an MP4 in `public/videos/hero.mp4` and set `heroContent.video` to `'/videos/hero.mp4'` in `src/data/mock/content.ts`.
The hero image is used as the poster while the video loads.
