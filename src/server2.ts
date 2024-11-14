import { createServer } from "http";
import { json } from "stream/consumers";

const PORT = process.env.PORT;

type User = {
	id: number,
	name: string
}

const users: User[] = [
	{ id: 1, name: "John Doe" },
	{ id: 2, name: "John Doe" },
	{ id: 3, name: "John Doe" }
]

// logger middleware
const logger = (req, res, next) => {
	console.log(`${req.method} ${req.url}`)
	next();
}

// json middleware
const jsonMiddleware = (req, res, next) => {
	res.setHeader("Content-Type", "application/json");
	next()
}

// route handler for Get /api/users
const getUsersHandler = (req, res) => {
	res.write(JSON.stringify(users))
	res.end()
}

// route handler for Get /api/users/id
const getUserByIdHandler = (req, res) => {
	const id = req.url.split('/')[3];
	const user = users.find((user) => user.id === parseInt(id))
	if (user) {
		res.write(JSON.stringify(user))
	} else {
		res.statusCode = 404;
		res.write(JSON.stringify({ message: "User Not Found" }));
	}
	res.end()
}

// not found handler
const notFoundHandler = (req, res) => {
	res.statusCode = 404;
	res.write(JSON.stringify({ message: "Route not found" }));
	res.end()
}

// route handler for POST /api/users
const createUserHandler = (req, res) => {
	let body = "";
	// listen for the data
	req.on("data", (chunk) => {
		body += chunk.toString();
	})

	req.on("end", () => {
		const newUser = JSON.parse(body);
		users.push(newUser)
		res.statusCode = 201;
		res.write(JSON.stringify(newUser));
		res.end();
	})
}

const server = createServer((req, res) => {
	logger(req, res, () => {
		jsonMiddleware(req, res, () => {
			if (req.url === "/api/users" && req.method === "GET") {
				getUsersHandler(req, res)
			} else if (req.url?.match(/\api\/users\/([0-9]+)/) && req.method === "GET") {
				getUserByIdHandler(req, res)
			} else if (req.url === "/api/users" && req.method === "POST") {
				createUserHandler(req, res);
			} else {
				notFoundHandler(req, res)
			}
		})
	})
});


server.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
