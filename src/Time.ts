import dayjs from "dayjs";
export var SECONDS_A_MINUTE = 60;
export var SECONDS_A_HOUR = SECONDS_A_MINUTE * 60;
export var SECONDS_A_DAY = SECONDS_A_HOUR * 24;
export var SECONDS_A_WEEK = SECONDS_A_DAY * 7;
export class PeriodicTime {
  private static readonly REGEX_DAY_PARSE =
    /^D-([0-1])-([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
  private static readonly REGEX_WEEK_PARSE =
    /^W-([0-1])-([1-7])-([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
  private static readonly REGEX_MONTH_PARSE =
    /^M-([0-1])-([1-9]|[1-2][0-8])-([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
  private type: "day" | "week" | "month";
  private cycle: number;
  private monthDate?: number;
  private week?: number;
  private hour: number;
  private minute: number;
  private second: number;
  time: dayjs.Dayjs;
  constructor(str?: string) {
    if (str) {
      this.parse(str);
    }
  }

  private parse(str: string) {
    const matchDay = str.match(PeriodicTime.REGEX_DAY_PARSE);
    const matchWeek = str.match(PeriodicTime.REGEX_WEEK_PARSE);
    const matchMonth = str.match(PeriodicTime.REGEX_MONTH_PARSE);
    if (matchDay) {
      [, this.cycle, this.hour, this.minute, this.second] = matchDay
        .slice(1)
        .map(Number);
      this.type = "day";
    } else if (matchWeek) {
      [, this.cycle, this.week, this.hour, this.minute, this.second] = matchWeek
        .slice(1)
        .map(Number);
      this.type = "week";
    } else if (matchMonth) {
      [, this.cycle, this.monthDate, this.hour, this.minute, this.second] =
        matchMonth.slice(1).map(Number);
      this.type = "month";
    } else {
      throw new Error(`Invalid string format: ${str}`);
    }
    this.time = dayjs().hour(this.hour).minute(this.minute).second(this.second);
  }

  toString() {
    switch (this.type) {
      case "day":
        return `D-${this.cycle}-${this.time.format("HH:mm:ss")}`;
      case "week":
        return `W-${this.cycle}-${this.week}-${this.time.format("HH:mm:ss")}`;
      case "month":
        return `M-${this.cycle}-${this.monthDate}-${this.time.format("HH:mm:ss")}`;
      default:
        return "";
    }
  }


  public getPreviousInstance(amount: number): PeriodicTime {
    const { type, cycle, monthDate, week, hour, minute, second } = this;
    const time = dayjs().hour(hour).minute(minute).second(second);

    switch (type) {
      case "day": {
        const totalSeconds =
          cycle * SECONDS_A_DAY +
          hour * SECONDS_A_HOUR +
          minute * SECONDS_A_MINUTE +
          second;
        const diffSeconds = amount * 1;
        const newTotalSeconds = totalSeconds - diffSeconds;
        const newCycle = Math.floor(newTotalSeconds / SECONDS_A_DAY);
        const newHour = Math.floor((newTotalSeconds % (24 * 3600)) / 3600);
        const newMinute = Math.floor((newTotalSeconds % 3600) / 60);
        const newSecond = newTotalSeconds % 60;

        return new PeriodicTime(
          `D-${newCycle}-${String(newHour).padStart(2, "0")}:${String(
            newMinute
          ).padStart(2, "0")}:${String(newSecond).padStart(2, "0")}`
        );
      }

      case "week": {
        const totalSeconds =
          (cycle * 7 + week! - 1) * 24 * 3600 +
          hour * 3600 +
          minute * 60 +
          second;
        const diffSeconds = amount * 1;
        const newTotalSeconds = totalSeconds - diffSeconds;
        const newWeek = (Math.floor(newTotalSeconds / (7 * 24 * 3600)) + 1) % 8;
        const newCycle = Math.floor(
          (Math.floor(newTotalSeconds / (7 * 24 * 3600)) + 1) / 8
        );
        const newHour = Math.floor((newTotalSeconds % (24 * 3600)) / 3600);
        const newMinute = Math.floor((newTotalSeconds % 3600) / 60);
        const newSecond = newTotalSeconds % 60;

        return new PeriodicTime(
          `W-${newCycle}-${newWeek}-${String(newHour).padStart(
            2,
            "0"
          )}:${String(newMinute).padStart(2, "0")}:${String(newSecond).padStart(
            2,
            "0"
          )}`
        );
      }

      case "month": {
        const totalSeconds =
          (cycle * 28 + monthDate! - 1) * 24 * 3600 +
          hour * 3600 +
          minute * 60 +
          second;
        const diffSeconds = amount * 1;
        const newTotalSeconds = totalSeconds - diffSeconds;
        const newMonthDate =
          (Math.floor(newTotalSeconds / (24 * 3600)) + 1) % 29;
        const newCycle = Math.floor(
          (Math.floor(newTotalSeconds / (24 * 3600)) + 1) / 29
        );
        const newHour = Math.floor((newTotalSeconds % (24 * 3600)) / 3600);
        const newMinute = Math.floor((newTotalSeconds % 3600) / 60);
        const newSecond = newTotalSeconds % 60;

        return new PeriodicTime(
          `M-${newCycle}-${String(newMonthDate).padStart(2, "0")}:${String(
            newHour
          ).padStart(2, "0")}:${String(newMinute).padStart(2, "0")}:${String(
            newSecond
          ).padStart(2, "0")}`
        );
      }
    }
  }
}

// new PeriodicTime('D-0-00:00:30').getPreviousInstance(1).toString() // 输出 'D-0-00:00:29'
// new PeriodicTime('D-0-00:00:00').getPreviousInstance(1).toString() // 输出 'D-1-23:59:59'
// new PeriodicTime('D-0-01:00:00').getPreviousInstance(1).toString() // 输出 'D-0-00:59:59'
// new PeriodicTime('W-0-7-00:00:00').getPreviousInstance(1).toString() // 输出 'D-1-6-23:59:59'
// new PeriodicTime('W-0-1-00:00:00').getPreviousInstance(1).toString() // 输出 'D-0-7-23:59:59'
// new PeriodicTime('M-0-28-00:00:00').getPreviousInstance(1).toString() // 输出 'D-0-27-23:59:59'
// new PeriodicTime('W-0-1-00:00:00').getPreviousInstance(1).toString() // 输出 'D-1-28-23:59:59'
