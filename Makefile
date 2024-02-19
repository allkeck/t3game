server:
	go build -o bin/server .

front:
	cd web && yarn build && cd ..