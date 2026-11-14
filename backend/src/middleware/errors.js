export function notFound(req, res) {
  res.status(404).json({ message: "Route not found." });
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern || {})[0] || "value";
    return res.status(409).json({ message: `${field} is already in use.` });
  }
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Invalid JSON request body." });
  }
  if (error.type === "entity.too.large") {
    return res.status(413).json({ message: "Request body is too large." });
  }
  if (error.name === "ValidationError") {
    return res.status(400).json({ message: "Invalid request data." });
  }
  if (process.env.NODE_ENV === "production") {
    console.error("Unhandled API error:", error.name || "Error");
  } else {
    console.error(error);
  }
  return res.status(500).json({ message: "An unexpected server error occurred." });
}
