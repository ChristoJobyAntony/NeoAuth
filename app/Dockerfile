FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:stable-alpine
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
# Static SEO assets served from the web root
COPY public/robots.txt public/sitemap.xml public/favicon.svg \
     public/favicon-32.png public/apple-touch-icon.png public/og-image.png \
     /usr/share/nginx/html/
