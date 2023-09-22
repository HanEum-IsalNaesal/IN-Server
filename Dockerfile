# 사용할 베이스 이미지
FROM node:18.15.0

# 작업 디렉토리 생성후 이동
WORKDIR /app

# port 80
EXPOSE 80
# 처음 실행때 패키지 깔리기
COPY package*.json ./
COPY . ./
RUN npm install

# 
CMD ["pm2-runtime","start","sever.js"]