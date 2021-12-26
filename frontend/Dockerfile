FROM node:16-alpine

COPY . /usr/front
RUN chmod +x /usr/front/build_front.sh

ENTRYPOINT ["/usr/front/build_front.sh"]