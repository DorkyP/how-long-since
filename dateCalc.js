// YYYY-MM-DDTHH:mm:ss+HH:mm

function update() {
	var el = [...document.getElementsByClassName("timeSince")];

	for (var i = 0; i < el.length; i++) updateElement(el[i]);
}

function updateElement(element) {
	var months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
	var time = element.getAttribute("value");
	var title = element.getAttribute("name");

	var then = new Date(time);
	var now = new Date(Date.now());

	var diff = new Date(now - then); // in milliseconds

	// Getting seconds, minutes, hours and years is simples, since that's constant, so calculate it here. Getting months and days is harder since there's a different number of days in each month
	var secondDiff = Math.floor(diff/1000) % 60;
	var minuteDiff = Math.floor(diff/60000) % 60;
	var hourDiff = Math.floor(diff/3600000) % 24;
	var yearDiff = Math.floor(diff/31556952000);

	// Figure out which whole months have elapsed from then -> now.
	var dayDiff = 0;
	var monthDiff = 0;
	var thenDate = then.getUTCDate();
	var nowDate = now.getUTCDate();
	var thenMonth = then.getUTCMonth();
	var nowMonth = now.getUTCMonth();
	// If current date is higher than then date, just do current-then
	// Else do number of days from origin to end of month + current date of month

	if (nowMonth >= thenMonth) { // Month is in the past
		monthDiff = nowMonth - thenMonth;
		if(nowDate >= thenDate) {
			dayDiff = nowDate-thenDate-1;
		} else {
			dayDiff = (months[thenMonth]-thenDate) + nowDate;
		}
	} else { // Month is in the future
		monthDiff = (12 - thenMonth + nowMonth) % 12;
		if (nowDate < thenDate) {
			monthDiff -= 1;
		}
		dayDiff = thenDate +  (months[nowMonth]-nowDate)
	}

	var simple = "";
	var full = "";


	// Figure out full string
	full = 	yearDiff + " years, " + monthDiff + " months, " + 
					dayDiff + " days, " + hourDiff + " hours, " + 
					minuteDiff + " minutes, " + secondDiff + " seconds";

	// Figure out simple string - basically get first value that isn't zero, round it.
	if (yearDiff != 0) {
		if (monthDiff >= 6) {
			simple = "Almost " + (yearDiff+1) + " years"
		} else {
			simple = "Over " + yearDiff + " years"
		}
	} else if (monthDiff != 0) {
		if (dayDiff > 15) {
			simple = "Almost " + (monthDiff+1) + " months"
		} else {
			simple = "Over " + monthDiff + " years"
		}
	} else if (dayDiff != 0) {
		if (hourDiff > 12) {
			simple = "Almost " + (dayDiff+1) + " days"
		} else {
			simple = "Over " + dayDiff + " days"
		}
	} else if (hourDiff != 0) {
		if (minuteDiff > 30) {
			simple = "Almost " + (hourDiff+1) + " hours"
		} else {
			simple = "Over " + hourDiff + " hours"
		}
	} else if (minuteDiff != 0) {
		if (secondDiff > 30) {
			simple = "Almost " + (minuteDiff+1) + " minutes"
		} else {
			simple = "Over " + minuteDiff + " minutes"
		}
	} else {
		simple = "Over " + secondDiff + " seconds"
	}

	element.innerHTML = `
		<span>` + title + `:</span>
		<span>` + simple + ` ago.</span>
		<span>Exactly `+ full + ` ago.</span>`
}