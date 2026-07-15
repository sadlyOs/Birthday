const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const inputQueue = [];
const waiters = [];

rl.on('line', (line) => {
  if (waiters.length > 0) {
    waiters.shift()(line);
  } else {
    inputQueue.push(line);
  }
});

function ask(question) {
  process.stdout.write(question);
  return new Promise((resolve) => {
    if (inputQueue.length > 0) {
      resolve(inputQueue.shift());
    } else {
      waiters.push(resolve);
    }
  });
}


function getDayOfWeek(day, month, year) {
  const days = [
    'воскресенье', 'понедельник', 'вторник', 'среда',
    'четверг', 'пятница', 'суббота',
  ];
  const date = new Date(year, month - 1, day);
  return days[date.getDay()];
}


function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}


function calculateAge(day, month, year) {
  const today = new Date();
  let age = today.getFullYear() - year;

  const birthdayPassedThisYear =
    today.getMonth() + 1 > month ||
    (today.getMonth() + 1 === month && today.getDate() >= day);

  if (!birthdayPassedThisYear) {
    age -= 1;
  }
  return age;
}

const DIGIT_PATTERNS = {
  '0': ['***', '* *', '* *', '* *', '***'],
  '1': [' * ', '** ', ' * ', ' * ', '***'],
  '2': ['***', '  *', '***', '*  ', '***'],
  '3': ['***', '  *', '***', '  *', '***'],
  '4': ['* *', '* *', '***', '  *', '  *'],
  '5': ['***', '*  ', '***', '  *', '***'],
  '6': ['***', '*  ', '***', '* *', '***'],
  '7': ['***', '  *', '  *', '  *', '  *'],
  '8': ['***', '* *', '***', '* *', '***'],
  '9': ['***', '* *', '***', '  *', '***'],
  ' ': ['   ', '   ', '   ', '   ', '   '],
};

function printDigitalDate(day, month, year) {
  const dateString = `${String(day).padStart(2, '0')} ${String(month).padStart(2, '0')} ${year}`;

  const rows = ['', '', '', '', ''];

  for (const char of dateString) {
    const pattern = DIGIT_PATTERNS[char] || DIGIT_PATTERNS[' '];
    for (let i = 0; i < 5; i++) {
      rows[i] += pattern[i] + '  '; 
    }
  }

  console.log('\nДата рождения на электронном табло:\n');
  rows.forEach((row) => console.log(row));
  console.log('');
}


async function main() {
  const dayStr = await ask('Введите день рождения (число): ');
  const monthStr = await ask('Введите месяц рождения (число): ');
  const yearStr = await ask('Введите год рождения (число): ');

  rl.close();

  const day = parseInt(dayStr, 10);
  const month = parseInt(monthStr, 10);
  const year = parseInt(yearStr, 10);

  if (
    Number.isNaN(day) || Number.isNaN(month) || Number.isNaN(year) ||
    day < 1 || day > 31 || month < 1 || month > 12 || year < 1900
  ) {
    console.log('Ошибка: введены некорректные значения даты.');
    return;
  }

  console.log(`\nВы ввели дату: ${day}.${month}.${year}`);
  console.log(`День недели: ${getDayOfWeek(day, month, year)}`);
  console.log(`${year} год ${isLeapYear(year) ? 'является' : 'не является'} високосным`);
  console.log(`Ваш текущий возраст: ${calculateAge(day, month, year)} лет`);

  printDigitalDate(day, month, year);
}

main();
