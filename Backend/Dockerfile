# Backend/Dockerfile
FROM golang:1.24.0-alpine AS builder
WORKDIR /app
RUN apk add --no-cache gcc musl-dev
COPY . .
RUN go mod download
RUN CGO_ENABLED=1 go build -o backend ./cmd/main.go

FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/backend .
EXPOSE 8080
CMD ["./backend"]