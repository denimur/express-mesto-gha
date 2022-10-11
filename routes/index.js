const router = require("express").Router();

router.get("/", (req, res) => {
  res.send(
    `<html>
			<body>
				<p>Main Page</p>
			</body>
		</html>`
  );
});

module.exports = router;
