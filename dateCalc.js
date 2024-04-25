// YYYY-MM-DDTHH:mm:ss+HH:mm

function update() {
	var el = [...document.getElementsByClassName("timeSince")];

	for (var i = 0; i < el.length; i++) updateElement(el[i]);
}

function updateElement(element) {
	var months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
	var time = element.getAttribute("value");
	var title = element.getAttribute("name");

	var short;
	var long;

	// If time is blank, event hasn't happened yet.
	if(!time) {
		console.log("asdf" + title);
		short = "Hasn't happened";
		long = "";
	} else {
		var then = new Date(time);
		var now = new Date(Date.now());
		var short = calculateShortAnswer(then, now);
		var long = calculateLongAnswer(then, now);
	}

	element.innerHTML = `
		<span>` + title + `:</span>
		<span>` + short + `</span>
		<span>Exactly `+ long + `</span>`
}

function calculateShortAnswer(then, now) {
	// Calculate the difference in milliseconds
	var milliseconds = now - then;

	// Define time units in milliseconds
	var unitsInMilliseconds = {
		year: 365 * 24 * 60 * 60 * 1000,
		month: 30 * 24 * 60 * 60 * 1000,
		day: 24 * 60 * 60 * 1000,
		hour: 60 * 60 * 1000,
		minute: 60 * 1000,
		second: 1000,
	};

	// Initialize short answer
	var shortAnswer = '';

	// Find the first unit that's non-zero
	for (const unit of ['year', 'month', 'day', 'hour', 'minute', 'second']) {
		var unitInMilliseconds = unitsInMilliseconds[unit];
		var unitValue = Math.floor(milliseconds / unitInMilliseconds);

		if (unitValue > 0) {
			// Calculate the remaining milliseconds
			milliseconds -= unitValue * unitInMilliseconds;

			// Check if it's almost the next unit
			if (milliseconds >= unitInMilliseconds / 2) {
				shortAnswer = `Almost ${unitValue + 1} ${unit}${unitValue !== 1 ? 's' : ''} ago`;
			} else {
				shortAnswer += `Over ${unitValue} ${unit}${unitValue !== 1 ? 's' : ''} ago`;
			}
			break;
		}
	}

	return shortAnswer;
}

function calculateLongAnswer(then, now) {
	//NOTE: Unclear if it accounts for leap years. ¯\_(ツ)_/¯
	// Calculate the difference in milliseconds
	var milliseconds = now - then;

	// Define time units in milliseconds
	var unitsInMilliseconds = {
		year: 365 * 24 * 60 * 60 * 1000,
		month: [
			31 * 24 * 60 * 60 * 1000, // January
			28 * 24 * 60 * 60 * 1000, // February (non-leap year)
			31 * 24 * 60 * 60 * 1000, // March
			30 * 24 * 60 * 60 * 1000, // April
			31 * 24 * 60 * 60 * 1000, // May
			30 * 24 * 60 * 60 * 1000, // June
			31 * 24 * 60 * 60 * 1000, // July
			31 * 24 * 60 * 60 * 1000, // August
			30 * 24 * 60 * 60 * 1000, // September
			31 * 24 * 60 * 60 * 1000, // October
			30 * 24 * 60 * 60 * 1000, // November
			31 * 24 * 60 * 60 * 1000, // December
		],
		day: 24 * 60 * 60 * 1000,
		hour: 60 * 60 * 1000,
		minute: 60 * 1000,
		second: 1000,
	};

	// Initialize an empty array to store the time components
	var timeComponents = [];

	// Calculate the number of years
	var years = Math.floor(milliseconds / unitsInMilliseconds.year);
	if (years > 0) {
		timeComponents.push(years + ' year' + (years > 1 ? 's' : ''));
		milliseconds -= years * unitsInMilliseconds.year;
	}

	// Calculate the number of months
	var months = 0;
	while (milliseconds >= unitsInMilliseconds.month[months]) {
		months++;
		milliseconds -= unitsInMilliseconds.month[months];
	}

	if (months > 0) {
		timeComponents.push(months + ' month' + (months > 1 ? 's' : ''));
	}

	// Calculate the number of days
	var days = Math.floor(milliseconds / unitsInMilliseconds.day);
	if (days > 0) {
		timeComponents.push(days + ' day' + (days > 1 ? 's' : ''));
		milliseconds -= days * unitsInMilliseconds.day;
	}

	// Calculate the number of hours
	var hours = Math.floor(milliseconds / unitsInMilliseconds.hour);
	if (hours > 0) {
		timeComponents.push(hours + ' hour' + (hours > 1 ? 's' : ''));
		milliseconds -= hours * unitsInMilliseconds.hour;
	}

	// Calculate the number of minutes
	var minutes = Math.floor(milliseconds / unitsInMilliseconds.minute);
	if (minutes > 0) {
		timeComponents.push(minutes + ' minute' + (minutes > 1 ? 's' : ''));
		milliseconds -= minutes * unitsInMilliseconds.minute;
	}

	// Calculate the number of seconds
	var seconds = Math.floor(milliseconds / unitsInMilliseconds.second);
	if (seconds > 0) {
		timeComponents.push(seconds + ' second' + (seconds > 1 ? 's' : ''));
	}

	// Combine the time components into the long answer
	var longAnswer = timeComponents.join(', ');

	return longAnswer ? longAnswer : 'Less than a second';
}