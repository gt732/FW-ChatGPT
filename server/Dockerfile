# Create server-build stage for Express.js and FastAPI backend servers
FROM nikolaik/python-nodejs:latest

WORKDIR /app
COPY ./package.json ./
RUN npm i
COPY . .
COPY requirements.txt ./
RUN pip install -r requirements.txt
CMD ["sh", "-c", "node server.js & cd fastapi && uvicorn main:app --host 0.0.0.0 --port 9000"]