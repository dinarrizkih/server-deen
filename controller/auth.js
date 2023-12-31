var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");
var User = require("../model/model");

exports.signup = (req, res) => {
	const user = new User({
		fullName: req.body.fullName,
		email: req.body.email,
		role: req.body.role,
		password: bcrypt.hashSync(req.body.password, 8),
	});

	user.save((err, user) => {
		if (err) {
			res.status(500).send({
				message: err,
			});
			return;
		} else {
			res.status(200).send({
				message: "User Registered successfully",
			});
		}
	});
};

exports.signin = (req, res) => {
	User.findOne({
		email: req.body.email,
	}).exec((err, user) => {
		if (err) {
			res.status(500).send({
				message: err,
			});
			return;
		}
		if (!user) {
			return res.status(404).send({
				message: "User Not found.",
			});
		}

		//comparing passwords
		var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
		// checking if password was valid and send response accordingly
		if (!passwordIsValid) {
			return res.status(401).send({
				accessToken: null,
				message: "Invalid Password!",
			});
		}
		//signing token with user id
		var token = jwt.sign(
			{
				id: user.id,
			},
			process.env.API_SECRET,
			{
				expiresIn: 86400,
			}
		);

		//responding to client request with user profile success message and  access token .
		res.status(200).send({
			user: {
				id: user._id,
				email: user.email,
				fullName: user.fullName,
			},
			message: "Login successfull",
			accessToken: token,
		});
	});
};

exports.update = (req, res) => {
	if (!req.body) {
		return res.status(400).send({ message: "Data to update can not be empty" });
	}

	const id = req.params.id;
	User.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
		.then((data) => {
			if (!data) {
				res.status(404).send({
					message: `Cannot Update user with ${id}. Maybe user not found!`,
				});
			} else {
				res.send(data);
			}
		})
		.catch((err) => {
			res.status(500).send({ message: "Error Update user information" });
		});
};
