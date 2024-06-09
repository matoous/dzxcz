---
title: Photos
date: 2024-06-09
---

I added a [Photos](/photos/) section to the website, intending to make it a curated gallery of all the photos I keep collecting and sporadically sharing on Insagram, arguably one of the worst platforms for actually sharing photography.

Initially, I wanted to leverage the same setup I already use for other images on this website - [Git LFS](https://git-lfs.com/). This proved to be problematic though, as fetching the repository results in all pictures being downloaded as well. Furthermore, GitHub restricts the LFS space to 2 GB for free accounts which I am afraid of hitting quite early.

After some research I opted for storing all the photos in S3 ([CloudFlare R2](https://www.cloudflare.com/developer-platform/r2/) to be precise) under my own domain. The process of adding a picture has a few steps:

**Pick a picture and a name**. Picking a name proved to be harder than I expected, I would like a consistent naming schemantics but... what? I tried to use location names but my camera doesn't add the longitude and latitude to picture unless it is connected to my phone, which it rarely is, and figuring out the locations manually is a tedious manual task.

Activity/subject of the photo seemed like a good approach but I need to generate unique slugs for the file names. One could have an incrementing counter (e.g. `cycling_0005`) the only issue being that I am not adding the photos in order; at least for now while backfilling.

In the end I decided to give up on consistency for now and see if I find a better approach in the future.

Next step is to **resize and generate thumbnail**. This involves using [ImageMagick](https://imagemagick.org/) to generate 3 different sizes (512, 1024, and 2048 px) in 2 different formats (jpg and webp).

**Upload images to R2** using [rclone](https://rclone.org/).

Last but not least, I store the image metadata in [matoous/dzxcz](https://github.com/matoous/dzxcz) repository (source of this website). The metadata contain the image slug, the date the photo was taken, names of the original file and thumbprints, plus all available [EXIF](https://en.wikipedia.org/wiki/Exif) metadata as stored by the camera, e.g.:

```yaml
---
title: Rocks (Bosnia)
date: '2023-10-02 12:53:27'
params:
  iso: '200'
  focal_length: '26'
  f_number: '5.6'
  ev: '1'
  exposure: '1/500'
  model: RICOH GR IIIx
  make: RICOH IMAGING COMPANY, LTD.
  srcset:
    jpg512: rocks_bosnia_512.jpg
    jpg1024: rocks_bosnia_1024.jpg
    jpg2048: rocks_bosnia_2048.jpg
    webp512: rocks_bosnia_512.webp
    webp1024: rocks_bosnia_1024.webp
    webp2048: rocks_bosnia_2048.webp
    original: rocks_bosnia.jpg
---
```

To make all of this easier I wrote a little [CLI tool](https://github.com/matoous/dzxcz/tree/main/cli) that wraps all of these steps under 1 command:

```sh
dzx --name "Valencia 2023 - Sunset (Spain)" "/Volumes/LaCie 01/2023-12 Valencia/Edited/R0001551.jpg"
```

The [Photos](/photos/) archive is displayed using [CSS grid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout) with [Masonry layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Masonry_layout) that's a new experimental feature in CSS, currently not supported by default by almost any browser. If you want to test it out and have the page display properly you should be able to enable masonry layout in your browser, in Firefox for example under `about:config`, feature `layout.css.grid-template-masonry-value.enabled`.
