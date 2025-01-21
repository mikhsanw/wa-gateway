const { Router } = require("express");
const {
  createSession,
  deleteSession,
  sessions,
  session,
  status,
} = require("../controllers/session_controller");

const SessionRouter = Router();

SessionRouter.all("/start-session", createSession);
SessionRouter.all("/delete-session", deleteSession);
SessionRouter.all("/sessions", sessions);
SessionRouter.all("/session-me", session);
SessionRouter.all("/status", status);

module.exports = SessionRouter;
