# Copyright 2016 Daniel Nüst
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
FROM ubuntu:14.04
MAINTAINER Daniel Nüst <daniel.nuest@uni-muenster.de>

RUN apt-get update \
    && apt-get install -qqy software-properties-common --no-install-recommends \
    && apt-get -qqy update \
    && apt-get install -qqy --no-install-recommends \
        nodejs \
        nodejs-legacy \
        npm \
        git \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN npm upgrade -g npm
RUN npm install -g gulp
RUN npm install -g bower

# https://github.com/Medium/phantomjs#i-am-behind-a-corporate-proxy-that-uses-self-signed-ssl-certificates-to-intercept-encrypted-traffic
RUN npm set strict-ssl false

#RUN mkdir /envirocar
WORKDIR /envirocar
RUN git clone https://github.com/enviroCar/enviroCar-website-ng
  
WORKDIR /envirocar/enviroCar-website-ng
RUN npm install
RUN bower install --allow-root --force-latest

EXPOSE 3000

CMD [ "gulp", "serve" ]