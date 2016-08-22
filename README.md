## EnviroCar Website Alpha

## Getting started

Clone project:

Install dependencies:

    $ npm install

Install bower packages:

    $ bower install

Install gem 'sass'

    $ gem install sass

Run development web-server:

    $  node node_modules/gulp/bin/gulp serve

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

## Known Issues

1) During installation of npm modules, it is possible that phantomJS does not get installed. Ignore the warning and run the command again to get the other modules. Karma is also known to throw issues with peer dependencies, ignore the messages and continue.

2) In the single track analsysis page, functionality has been provided to place a marker at a corresponding point when a tooltip over the nvd3 time series graph is generated. This functionality does not work in Google chrome at the moment.

3) A development server is being used with 'gulp serve'. The production server 'gulp serve:dist' currently runs into module errors.

## Motivation Behind the project

This project was built as a part of the Google Summer of Code 2016 project. You can follow the work done during this period in the following links

1) [Initial blog post](http://blog.52north.org/2016/05/23/envirocar-visual-analytics-overview/)
2) [Mid term blog post](http://blog.52north.org/2016/06/27/envirocar-visual-analytics-mid-term-report/)
3) 
4) [Weekly Blog posts](https://wiki.52north.org/Projects/GSoC2016VisualAnalyticsOfEnviroCarTracks)


## Future Roadmap

1) Deploying the application to a production server is not complete yet. The application is completely functional in a development server, setup instructions can be found in the readme in the Github repository above.

2) Segment Analysis page can provide more functionality and flexibility compared to the current implementation. Features can include but no restricted to allowing users to select time range from which statistics are needed, this also gives the user functionality to explore statistics through time segments in the course of the day. 

