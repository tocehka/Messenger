FROM nginx:1.19-alpine

COPY ./nginx.conf /etc/nginx

# COPY ./mime.types /etc/nginx
# RUN chmod +x /etc/nginx/mime.types

EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]