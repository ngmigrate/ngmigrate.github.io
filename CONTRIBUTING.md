# Contributing to ngMigrate

We would love for you to contribute to ngMigrate and help make it even better than it is
today! As a contributor, here some steps to follow depending on your contribution:

- [Article Submissions](#article-submissions)
- [Issues and Bugs](#issues-and-bugs)

## Article Submissions

We'd love to have an article from you on a related topic, or hear about your ideas. For article submissions we'll work together to decide a topic and let you get started with writing

### Submitting an idea

First, open a new issue and let's discuss your idea for a migration guide.

### Install this project

Follow the steps to setup this repo [here](README.md) so you can run the build locally, write your article, format it properly and add your author contribution links.

### Writing your guide

Guides follow a simple flow:

* Angular 1.x
    * Some feature in Angular 1.x
    * Another feature in Angular 1.x
    * Final code snippet
* Angular 2
    * How to do that feature in Angular 2
    * How to do that other feature in Angular 2
    * Final code snippet

Use [this guide](http://ngmigrate.telerik.com/from-ng-repeat-to-ng-for) as a reference example for your guide structure.

### Code embeds

All code embeds should use Plunker, you can create a new Plunker, press "New" then "AngularJS" then "2.0.x (TS)" as a base. Please remove anything that isn't relevant to the final code. Here's how to embed (grab the unique hash from the URL and paste it into `YOUR_URL`):

```html
<iframe src="https://embed.plnkr.co/YOUR_URL/" frameborder="0" border="0" cellspacing="0" cellpadding="0" width="100%" height="250"></iframe>
```

For Angular 1.x examples, please ensure you're making the JavaScript support non-ES6 browsers, but not as far back as IE9.

### Adding your "Author" section

To get your author bio and links showing up on your migration guide(s), follow these steps:

* Fill out your author details `_data/authors.yaml` following the same format as other authors.
* Drop your avatar picture inside `img/authors/your-image.jpg` at `300px` by `300px` dimensions.
* At the top of your article inside your markdown file, include `author: yourname` at the top, using the same property as created inside `authors.yaml`

### Submitting a PR

Submit a PR to our `master` branch, we'll review, make any necessary additions if needed and then merge once ready. After final review, please squash all commits before we merge.

## Issues and Bugs

If you spot a bug on the website or in any of the code, please open a PR or submit a new issue letting us know, thank you!
