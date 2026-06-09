FROM node:20.18.1

# تثبيت الحزم والاعتماديات الأساسية للمشروع
RUN apt-get update && apt-get upgrade -y && \
    apt-get install -y \
    ffmpeg \
    curl \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json ./
RUN yarn install

COPY . .

# الأمر البرمجي لتشغيل البوت داخل الحاوية السحابية
CMD ["node", "index.js"]
