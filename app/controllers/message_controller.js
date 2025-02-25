const whatsapp = require("wa-multi-session");
const ValidationError = require("../../utils/error");
const { responseSuccessWithData } = require("../../utils/response");

exports.sendMessage = async (req, res, next) => {
  try {
    let to = req.body.to || req.query.to;
    let text = req.body.text || req.query.text;
    let isGroup = req.body.isGroup || req.query.isGroup;
    const sessionId =
      req.body.session || req.query.session || req.headers.session;

    if (!to || !text) throw new ValidationError("Missing Parameters");

    const receiver = to;
    if (!sessionId) throw new ValidationError("Session Not Founds");
    const send = await whatsapp.sendTextMessage({
      sessionId,
      to: receiver,
      isGroup: !!isGroup,
      text,
    });

    res.status(200).json(
      responseSuccessWithData({
        id: send?.key?.id,
        status: send?.status,
        message: send?.message?.extendedTextMessage?.text || "Not Text",
        remoteJid: send?.key?.remoteJid,
      })
    );
  } catch (error) {
    next(error);
  }
};
exports.sendBulkMessage = async (req, res, next) => {
  try {
    const sessionId =
      req.body.session || req.query.session || req.headers.session;
    const delay = req.body.delay || req.query.delay || req.headers.delay;
    if (!sessionId) {
      return res.status(400).json({
        status: false,
        data: {
          error: "Session Not Found",
        },
      });
    }
    res.status(200).json({
      status: true,
      data: {
        message: "Bulk Message is Processing",
      },
    });
    for (const dt of req.body.data) {
      const to = dt.to;
      const text = dt.text;
      const isGroup = !!dt.isGroup;

      await whatsapp.sendTextMessage({
        sessionId,
        to: to,
        isGroup: isGroup,
        text: text,
      });
      await whatsapp.createDelay(delay ?? 1000);
    }
    console.log("SEND BULK MESSAGE WITH DELAY SUCCESS");
  } catch (error) {
    next(error);
  }
};
exports.sendDocument = async (req, res, next) => {
  try {
    let to = req.body.to || req.query.to;
    let text = req.body.text || req.query.text;
    let document = req.body.document || req.query.document;
    let isGroup = req.body.isGroup || req.query.isGroup;
    let parts = document.split("/");
    let filename = parts[parts.length - 1];
    const sessionId =
      req.body.session || req.query.session || req.headers.session;

    if (!to || !text) throw new ValidationError("Missing Parameters");

    const receiver = to;
    if (!sessionId) throw new ValidationError("Session Not Founds");
    const send = await whatsapp.sendDocument({
      sessionId,
      to: receiver,
      filename: filename,
      media: document,
      isGroup: !!isGroup,
      text:text,
    });

    res.status(200).json(
      responseSuccessWithData({
        id: send?.key?.id,
        status: send?.status,
        message: send?.message?.extendedTextMessage?.text || "Not Text",
        remoteJid: send?.key?.remoteJid,
      })
    );
  } catch (error) {
    next(error);
  }
};

exports.sendImage = async (req, res, next) => {
  try {
    let to = req.body.to || req.query.to;
    let text = req.body.text || req.query.text;
    let document = req.body.document || req.query.document;
    let isGroup = req.body.isGroup || req.query.isGroup;
    let parts = document.split("/");
    let filename = parts[parts.length - 1];
    const sessionId =
      req.body.session || req.query.session || req.headers.session;

    if (!to || !text) throw new ValidationError("Missing Parameters");

    const receiver = to;
    if (!sessionId) throw new ValidationError("Session Not Founds");
    const send = await whatsapp.sendDocument({
      sessionId,
      to: receiver,
      media: document,
      isGroup: !!isGroup,
      text:text,
    });

    res.status(200).json(
      responseSuccessWithData({
        id: send?.key?.id,
        status: send?.status,
        message: send?.message?.extendedTextMessage?.text || "Not Text",
        remoteJid: send?.key?.remoteJid,
      })
    );
  } catch (error) {
    next(error);
  }
};

exports.sendBulkDocument = async (req, res, next) => {
  try {
    const sessionId =
      req.body.session || req.query.session || req.headers.session;
    const delay = req.body.delay || req.query.delay || req.headers.delay;

    if (!sessionId) {
      return res.status(400).json({
        status: false,
        data: {
          error: "Session Not Found",
        },
      });
    }

    res.status(200).json({
      status: true,
      data: {
        message: "Bulk Message Documents are being processed in the background",
      },
    });

    const errors = [];

    for (const dt of req.body.data) {
      try {
        const to = dt.to;
        const filename = dt.filename;
        const document = dt.document;
        const isGroup = !!dt.isGroup;
        const text = dt.text;

        // Send document via whatsapp service
        await whatsapp.sendDocument({
          sessionId,
          to: to,
          filename: filename,
          media: document,
          isGroup: !!isGroup,
          text: text,
        });

        await whatsapp.createDelay(delay ?? 1000);

      } catch (error) {
        errors.push({
          to: dt.to,
          error: error.message,
        });
        console.log(`Error sending document to ${dt.to}: ${error.message}`);
      }
    }

    if (errors.length > 0) {
      console.log("Errors encountered during bulk message processing:", errors);
      return res.status(400).json({
        status: false,
        data: {
          error: errors,
        },
      });
    }
    
    console.log("SEND DOCUMENT BULK MESSAGE PROCESS COMPLETED");
    return res.status(200).json({
      status: true,
      data: {
        message: "Bulk Message with Images are being processed in the background",
      },
    });
  } catch (error) {
    console.error("Error in sendBulkImage:", error);
    return res.status(500).json({
      status: false,
      data: { error: "Internal server error" },
    });
  }
};

exports.sendBulkImage = async (req, res, next) => {
  try {
    const sessionId =
      req.body.session || req.query.session || req.headers.session;
    const delay = req.body.delay || req.query.delay || req.headers.delay;

    if (!sessionId) {
      return res.status(400).json({
        status: false,
        data: {
          error: "Session Not Found",
        },
      });
    }

    const errors = [];

    for (const dt of req.body.data) {
      try {
        const to = dt.to;
        const image = dt.image;
        const isGroup = !!dt.isGroup;
        const text = dt.text;

        // Send image via whatsapp service
        await whatsapp.sendImage({
          sessionId,
          to: to,
          media: image,
          isGroup: !!isGroup,
          text: text,
        });

        await whatsapp.createDelay(delay ?? 1000);

      } catch (error) {
        errors.push({
          to: dt.to,
          error: error.message,
        });
        console.log(`Error sending image to ${dt.to}: ${error.message}`);
      }
    }

    if (errors.length > 0) {
      console.log("Errors encountered during bulk message processing:", errors);
      return res.status(400).json({
        status: false,
        data: {
          error: errors,
        },
      });
    }
    
    console.log("SEND IMAGE BULK MESSAGE PROCESS COMPLETED");
    return res.status(200).json({
      status: true,
      data: {
        message: "Bulk Message with Images are being processed in the background",
      },
    });
  } catch (error) {
    console.error("Error in sendBulkImage:", error);
    return res.status(500).json({
      status: false,
      data: { error: "Internal server error" },
    });
  }
};