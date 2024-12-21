FROM python:3.12

# Install necessary packages
RUN apt-get update && apt-get install -y \
gcc \
curl \
build-essential \
patch \
libgl1-mesa-glx \
libglib2.0-0 \
&& rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .

RUN pip3 install --upgrade pip setuptools

RUN pip3 install --default-timeout=200 -r requirements.txt

COPY . .

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
