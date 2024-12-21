FROM ollama/ollama

RUN apt-get update && apt-get install -y curl

COPY . .

RUN chmod +x wait-for-fastapi.sh && chmod +x pull-model.sh