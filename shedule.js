const fs = require("fs");
const moment = require("moment");
const DATE_FORMAT = "YYYY.MM.DD";
const HOME_PATH = require("os").homedir();
const DATA_PATH = `${HOME_PATH}/.local/share/dayshedule`;
const DATE_PATH = `${DATA_PATH}/shedules`;
const TODAY_DATE = moment();

const tasks = getTasks(TODAY_DATE);
let currentTask = null;
let nextTask = null;

for (const task of tasks) {
      if(currentTask && !nextTask) {
        nextTask = task;
        break;
      }
  
      if(!currentTask && isCurrentTask(task)) {
        currentTask = task;      
      }
}

// let output = "";
// if (currentTask) {
//   const taskDuration = calcTaskDuration(currentTask);
// 
//   const progressDurationDiff = currentTask.start.diff(moment()) *-1;
//   const progressDuration = moment.duration(progressDurationDiff);
//   const progressDurationInMinutes = Math.trunc(progressDuration.asMinutes());
//   output += `${currentTask.title} (${progressDurationInMinutes}/${taskDuration.asMinutes()}m)`;
// }
// 
// if (nextTask) {
//   const taskDuration = calcTaskDuration(nextTask);
//   output += `  ${nextTask.title} (${taskDuration.asMinutes()}m)`;
// }
// 
// console.log(output ? output : "Free Time");

// --------------------------------------------------------------------------

function isCurrentTask(task) {
  return TODAY_DATE.isBetween(task.start, task.end);
}

function getTasks(date) {
  const dateExists = dateFileExists(date);
  if (dateExists) {
    return parseDateFile(date);
  }

  return null;
}

function dateFileExists(date) {
  const filename = dateToText(date);
  const filePath = `${DATE_PATH}/${filename}`;
  return fs.existsSync(filePath);
}

function parseDateFile(date) {
  const data = readDateFile(date);
  if (data) {
    const lines = data.split("\n");
    const tasks = [];
    for (const line of lines) {
      if (line) {
        const parsedTask = parseTask(line);
        const task = {
          title: parsedTask.title,
          start: moment(`${dateToText(date)} ${parsedTask.start}`, `${DATE_FORMAT} HH:mm`),
          end: moment(`${dateToText(date)} ${parsedTask.end}`, `${DATE_FORMAT} HH:mm`),
        };
        
        tasks.push(task);

      }
    }
    return tasks;
  }

  return null;
}

function readDateFile(date) {
  const filename = dateToText(date);
  return fs.readFileSync(`${DATE_PATH}/${filename}`, "utf8");
}

function parseTask(line) {
  const regex = /(?<start>\d{2}:\d{2})\s-\s(?<end>\d{2}:\d{2})\s:\s(?<title>[\w-_]*)/;
  return line.match(regex).groups;
}

function textToDate(text) {
  const date = moment(text, DATE_FORMAT);
  return date;
}

function dateToText(date) {
  return date.format(DATE_FORMAT);
}

function calcTaskDuration(task) {
  const taskDurationDiff = task.end.diff(task.start);
  const taskDuration = moment.duration(taskDurationDiff);
  return taskDuration.asMinutes();
}

function calcTaskProgress() {
  const progressDurationDiff = currentTask.start.diff(moment()) *-1;
  const progressDuration = moment.duration(progressDurationDiff);
  const progressDurationInMinutes = Math.trunc(progressDuration.asMinutes());
  return progressDurationInMinutes;
}

module.exports = {
  currentTask,
  nextTask,
  calcTaskDuration,
  calcTaskProgress,
}