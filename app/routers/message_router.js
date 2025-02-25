const { Router } = require("express");
const {
  sendMessage,
  sendBulkMessage,
  sendBulkDocument,
  sendBulkImage,
  sendDocument,
  sendImage,
} = require("../controllers/message_controller");
const MessageRouter = Router();

MessageRouter.all("/send-message", sendMessage);
MessageRouter.all("/send-bulk-message", sendBulkMessage);
MessageRouter.all("/send-bulk-message-documents", sendBulkDocument);
MessageRouter.all("/send-bulk-message-images", sendBulkImage);
MessageRouter.all("/send-bulk-image", sendBulkImage);
MessageRouter.all("/send-document", sendDocument);
MessageRouter.all("/send-image", sendImage);

module.exports = MessageRouter;
