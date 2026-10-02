import fs from "fs";
import path from "path";


function getDateTime() {

    const now =
        new Date();


    const year =
        now.getFullYear();

    const month =
        String(now.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(now.getDate())
            .padStart(2, "0");

    const hours =
        String(now.getHours())
            .padStart(2, "0");

    const minutes =
        String(now.getMinutes())
            .padStart(2, "0");

    const seconds =
        String(now.getSeconds())
            .padStart(2, "0");


    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

}



function writeErrorLog(
    statusCode,
    message
) {

    const logsFolder =
        path.join(
            process.cwd(),
            "logs"
        );


    if (!fs.existsSync(logsFolder)) {

        fs.mkdirSync(
            logsFolder,
            {
                recursive: true
            }
        );

    }


    const logFile =
        path.join(
            logsFolder,
            "error.log"
        );


    const logMessage =
        `${getDateTime()} | ERROR | ${statusCode} | ${message}\n`;


    fs.appendFileSync(
        logFile,
        logMessage
    );


    console.error(
        logMessage.trim()
    );

}



function errorHandler(
    err,
    req,
    res,
    next
) {

    const statusCode =
        err.statusCode || 500;


    let message =
        err.message ||
        "Internal Server Error";


    if (statusCode === 500) {

        message =
            "Internal Server Error";

    }


    const messageToLog =
        err.logMessage ||
        err.message ||
        "Internal Server Error";


    writeErrorLog(
        statusCode,
        messageToLog
    );


    res.status(statusCode).json({

        success: false,

        message: message,

        statusCode: statusCode

    });

}



export {
    writeErrorLog
};


export default errorHandler;