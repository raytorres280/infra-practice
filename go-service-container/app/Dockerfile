FROM golang:1.21.1

WORKDIR /go/src/app

COPY go-service .

RUN go build -o main main.go

EXPOSE 80

CMD ["./main"]