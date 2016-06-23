## EnviroCar Website Alpha

## Getting started

Clone project:

Install dependencies:

    $ npm install

Install gem 'sass'

    $ gem install sass

Run development web-server:

    $ gulp serve

### Run in a Docker container

To have a quick look without cluttering your own system, a Dockerfile is provided in this repository. Build the image and run it with these commands:

```
docker build -t envirocar-website-ng .
docker run --rm envirocar-website-ng
```

The second command will output an IP and port that you can open in your browser.

## Project structure and credits

Project structure based on [gulp-angular yeoman generator](https://github.com/Swiip/generator-gulp-angular).
If you have any questions about the build or project structure please check out their documentation.

UI components built with [Angular Material](https://material.angularjs.org/).

Design by [flatlogic.com](http://flatlogic.com/)
