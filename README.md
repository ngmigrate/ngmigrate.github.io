<img src="https://cloud.githubusercontent.com/assets/1655968/16382145/8170d8bc-3c77-11e6-8dc0-f89fabb3e0ca.jpg" style="max-width: 50%; margin: 0 auto;">

## Build this project

### Install jekyll

Ensure `jekyll` is installed:

```
gem install jekyll
```

If you need XCode dependencies, follow the [Jekyll installation guide](https://jekyllrb.com/docs/installation/). For Windows, follow the [Windows installation guide](https://jekyllrb.com/docs/windows/#installation).

### Installing the project

If you're submitting an article, you can follow these steps to clone the project, otherwise you can download the [.zip bundle](https://github.com/ngmigrate/ngmigrate.github.io/archive/master.zip).

#### Forking

If you're a project collaborator, see the next step. If not, you'll need to `Fork` this repository to your own GitHub account, then `git clone` your copy before submitting a PR:

```
mkdir ngmigrate
cd ngmigrate
git clone https://github.com/YOUR_USERNAME/ngmigrate.github.io.git
git checkout -b YOUR_BRANCH
```

Push all changes to your branch, and then submit a PR, we'll review and merge your PR once ready.

#### Project collaborators

If you are a project collaborator, you will have direct commit access, therefore you can run this:

```
mkdir ngmigrate
cd ngmigrate
git clone https://github.com/ngmigrate/ngmigrate.github.io.git
git checkout -b YOUR_BRANCH
```

Push all changes to that branch, and then submit a PR before merging to `master`.

### Installing dependencies

First, you'll need to make sure you have `gulp` installed:

```
npm install --global gulp
```

Next, you'll need to `npm install` the other dev-dependencies, run this from the `ngmigrate` root folder:

```
npm install
```

### Running the server

Gulp is setup to make it easier to run all the tasks, to run the project simply run:

```
gulp
```

This will start serving the project from `localhost:4000`, with livereload functionality.

### Ready to make a PR?

Follow our [contribution guidelines](CONTRIBUTING.MD) first.
