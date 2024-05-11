FROM python:3.9

WORKDIR /app

COPY ./requirements.txt /app/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt

COPY . .

COPY ./app /app/routers
COPY ./app /app/services

EXPOSE 5000

CMD ["fastapi", "run", "app.main:app", "--port", "5000"]