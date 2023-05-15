import moment from "moment";

// generate a time string from 12:00 AM to 11:30 PM
export function generateTime() {
  let times = [];
  let time = moment("12:00 AM", "h:mm A");
  const endTime = moment("11:50 PM", "h:mm A");

  while (time <= endTime) {
    times.push(time.format("h:mm A"));
    time = time.add(30, "minutes");
  }

  return times;
}

export function generateTimeFromRange(openingTime: string, closingTime: string) {
  const startTime = moment(openingTime, 'h:mm A');
  const endTime = moment(closingTime, 'h:mm A');
  const timeIntervals: string[] = [];

  while (startTime.isBefore(endTime)) {
    timeIntervals.push(startTime.format('h:mm A'));
    startTime.add(10, 'minutes');
  }

  timeIntervals.push(endTime.format('h:mm A'));

  return timeIntervals;
}