FROM python:3.12.10-alpine3.21

WORKDIR /app

# Create non-root user
RUN adduser -D -u 1000 appuser

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .

# Change ownership to non-root user
RUN chown -R appuser:appuser /app

USER appuser

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]