const yargs = require('yargs');
const shedule = require('./shedule');
const argv = yargs.argv;

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

