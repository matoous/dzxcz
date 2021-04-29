---
title: "This blog weights ~10kb"
date: 2020-06-06
slug: this_blog
draft: false
tags: ["web", "meta", "writing"]
---

_This website is tiny._ 

## How it all started

Over last year I went over multiple iterations of this website and never really liked the result
until now. I started with github pages, but these were restrictive and didn't allow much customization
and neat tricks. Second version was written in [Next.js](https://nextjs.org/) and I liked that quite more.
I could easily do some cool stuff such as burger menu for mobile devices, animate my name in the title and more.
Was it necessary? Nope. Was it cool? I will let you judge. But the page was quite heavy (400kb on first load) and
I am the kind of person that likes things fast and optimized. I went down the rabbit hole of optimising the 💩 out
of it. First, I removed every unnecessary dependency I could, bringing the size to ¾.
Then I refactored the code to do as much as possible at the build time (such as loading info about my
github projects). This reduced the size of the page to ½ of the original size. Better, still quite
heavy though. As I was running out of ideas I also switched some libraries for others, I was using
`moment.js` just to render how long ago was the blog post written, using `timeago.js` instead
removed another 16kb from the first load.

## This blog

Now? The [landing page](/) weights less than ~7kb (~3kb gziped). On the first load your browser will do exactly
2 requests, one for the page itself and second one for favicon (another ~1kb). Here are all the things I
did to get this website to this state:

1. Got rid of javascript, now everything is static
2. Started using native fonts
3. Optimized css
4. Optimized the images
5. Removed all third parties 
6. And finally, deleted everything unnecessary

## Static website

I enjoy tinkering around with javascript, but the cost of doing so for such a simple
site as this blog is too high. No one reads a blog because of the cool slideshows or nice animated menu.
When the site was written in Next.js the client needed whole React juts so I could
have my age displayed as constantly updating float number and load my projects from github
dynamically. Next.js was overkill and didn't allow me to optimize to the extend I
wanted to.

Now this website is build using [hugo](https://gohugo.io/). I can write the posts
in markdown the same way I did before. I can use custom templates, styles,
URLs, etc. the same way I did before but in the end everything gets compiled
into tiny teeny static html files.

## Native fonts

Using native fonts has two huge benefits over custom fonts included either
in the css or loaded from for example [Google fonts](https://fonts.google.com/).
First, the browser doesn't have to download any font files before displaying
the page. This reduces the amount of data transferred when someone visits
your website and allows the browser to render the page as soon as it has the
content instead for waiting for the fonts to load. The second benefit is that
your website will look familiar to the user because they are used to seeing
the font all the time at their device, be it iPhone or Windows PC.

Using native system font stack is super easy:

```css
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif,
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}
```

___
[css-tricks: System Font Stack](https://css-tricks.com/snippets/css/system-font-stack/)

## Optimized CSS

I wanted my page to be nice and minimalistic, not much css was needed. First, I really like big bold headings,
so I made all the heading a little bit more fat and reduced the spacing by a notch.

```css
h1, h2, h3, h4, h5 {
  font-weight: 800;
  letter-spacing: -0.03rem;
}
```

Another little touch was changing the color of highlighted text:

```css
::selection {
	background: #79ffe1;
	color: black;
}
```

Since I want the content to be readable even on large screens I put all the content into wrapper with maximum width
and a little padding to keep some space around on smaller devices:

```css
.wrapper️ {
	max-width: 720px;
	padding: 0 20px;
	margin: 0 auto;
}
```

One thing that I have seen on some other pages and blogs and that I am especially fond off 
is making the images and pictures full width while keeping the content padded. This can be achieved simply
using following style with the previous definition for `.wrapper`.

```css
img {
  width: 100vw;
  max-width: 720px;
  margin: 0 -20px;
}
```

* [Web Typography](http://webtypography.net/3.2.1)

## Support for dark mode

Nowadays adding support for a dark mode is easy peazy. First, you define the colors as global css variables.

```css
:root {
  --foreground: #111;
  --background: #fff;
  --light: #666;
}
``` 

Since this blog is really plain 3 variables were all that was needed. Then you add media query for dark mode
and change the variables accordingly. In my case:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --foreground: #fff;
    --background: #111;
    --light: #aaa;
  }
}
```

Of course this won't work if you don't use the variables anywhere, so the next step was adding a few lines here and
there:

```css
body {
  color: var(--foreground);
  background-color: var(--background);
}

a {
	color: var(--foreground);
}
```

Just like that in a few lines of css your website spares the readers eyes in the evening and respects users preferred color scheme.  

## Optimize images

Optimized images are probably the biggest bandwidth saver. For this blog I have 5 sources for each image.
I always keep the original plus generate `.webp` and `.jpg` images with width `760px` and `1520px` width.
The smaller size should be enough for most devices because the content has max width of `720px` (I left a slight buffer
in case I would like to change that). The bigger images serves devices with higher pixel density.
I then use following [Hugo shortcode](https://gohugo.io/templates/shortcode-templates/) to place the images into the page:

```html
{{ $id := (.Page.Resources.GetMatch (.Get "src")).Name }}
{{ $id = strings.TrimRight (path.Ext $id) $id }}
<figure>
  <a href="{{(.Page.Resources.GetMatch (.Get "src")).RelPermalink}}">
    <picture>
      <source srcset="{{ (.Page.Resources.GetMatch (print $id "_760.webp")).RelPermalink }}, {{ (.Page.Resources.GetMatch (print $id "_1520.webp")).RelPermalink }} 2x" type="image/webp">
      <source srcset="{{ (.Page.Resources.GetMatch (print $id "_760.jpg")).RelPermalink }}, {{ (.Page.Resources.GetMatch (print $id "_1520.jpg")).RelPermalink }} 2x" type="image/webp">
      <img alt="{{ .Get "alt"}}" loading="lazy" src="{{ (.Page.Resources.GetMatch (print $id "_760.jpg")).RelPermalink }}">
    </picture>
  </a>
</figure>
```

Let's break it down:

```html
{{ $id := (.Page.Resources.GetMatch (.Get "src")).Name }}
{{ $id = strings.TrimRight (path.Ext $id) $id }}
```

First line gets the resource (the image in this case) and assigns its name to variable `$id`. This serves the purpose
of returning an error if the resource wasn't available, the name was misspelled or the image wasn't available in any other
way. The second line extracts the file path without the extension, this is then used to obtain links to various versions
of the image: 

```html
    <picture>
      <source srcset="{{ (.Page.Resources.GetMatch (print $id "_760.webp")).RelPermalink }}, {{ (.Page.Resources.GetMatch (print $id "_1520.webp")).RelPermalink }} 2x" type="image/webp">
      <source srcset="{{ (.Page.Resources.GetMatch (print $id "_760.jpg")).RelPermalink }}, {{ (.Page.Resources.GetMatch (print $id "_1520.jpg")).RelPermalink }} 2x" type="image/webp">
      <img alt="{{ .Get "alt"}}" loading="lazy" src="{{ (.Page.Resources.GetMatch (pringt $id "_760.jpg")).RelPermalink }}">
    </picture>
```

Link wraps the whole picture and points to the original full-sized image. This way readers can click and view the
raw image in its whole glory.

I use [imagemagick](https://imagemagick.org/index.php) to generate different sizes and versions. First I did it manually
like so:

```shell script
convert -resize 760 img.jpg img_760.webp && convert -resize 760 img.jpg img_760.jpg
```

But it got quite boring over time so now there's a script in place that does that for me.