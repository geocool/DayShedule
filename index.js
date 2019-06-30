const shedule = require('./shedule');
const argv = require('yargs')
  .alias('c', 'current')
  .describe('c', 'Print current task title')
  .alias('n', 'next')
  .describe('n','Print next task title')
  .alias('d','duration')
  .describe('d','Print task duration')
  .boolean(['c','n','d'])
  .alias('e','edit')
  .describe('e','Edit shedule entry, default: today')
  .alias('h','help')
  .argv

let output = "";
let task = null;

if (argv.edit) {
  // TODO: Get date (Day, DD, DD.MM, DD.MM.YYYY)
  // If no date args, edit today shedule
  shedule.edit(typeof argv.edit === "string" ? argv.edit : "today");
} else {
  print();
}

function print() {
  if (argv.current) {
    task = shedule.currentTask;
  } else if (argv.next) {
    task = shedule.nextTask;
  }
  
  
  if (task) {
    output = task.title;
  }
  
  if (task && argv.duration) {
    let progressDuration = "";
    if (argv.current) {
      progressDuration = shedule.calcTaskProgress() + "/";
    }
  
    output += ` |${progressDuration}${shedule.calcTaskDuration(task)}|`;  
  }

  if (!argv.current && !argv.next) {
    // TODO Get here if no arguments defined
    const tasks = shedule.getTasks();
    for(const task of tasks) {
      const isCurrent = task.id === shedule.currentTask.id;
      const currentTasksOutput = `${task.start.format('HH:mm')} - ${task.end.format('HH:mm')} : ${task.title}`;
      if(isCurrent) {
        output += "\033[0;36m" + currentTasksOutput + "\033[0m" +"\n";
      } else {
        output += currentTasksOutput + "\n";
      }
    }
  }

  console.log(output);
}


// TODO:
// Create --help with yangs
// Print today shedule with empty args
// create --edit-today --edit-tomorrow (touch & open in vim)
// create --notify-on-change

// dayshedule -> TODAY Shedule Print
// --current  -> Current Task
// --next     -> Next Task
// --duration -> Adds (40m)

