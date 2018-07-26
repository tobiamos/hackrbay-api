FROM node:9.4.0

# Creating base "src" directory where the source repo will reside in our container.
RUN mkdir /src

# Code is copied from the host machine to this "src" folder in the container as a last step.
WORKDIR /src

# Copy from cache unless the package.json file has changed
COPY package.json /src

# Install node dependencies
RUN npm install  && npm install -g pm2

# Copy entire file to docker
COPY . /src

VOLUME ['/src']

# Expose web service 
EXPOSE  4000

CMD ["pm2-runtime", "--raw", "src/app.js"]