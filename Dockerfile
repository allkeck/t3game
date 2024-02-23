FROM node:20-alpine as nodebuilder
WORKDIR /app
RUN apk add yarn
COPY web .
RUN yarn && yarn build

FROM golang:1.22.0-alpine
COPY --from=nodebuilder /app/dist ./web/dist
COPY go.mod ./go.mod
COPY go.sum ./go.sum
COPY main.go ./main.go
COPY internal/ ./internal
RUN go build -o bin/server .
CMD ["bin/server"]
EXPOSE 7000
