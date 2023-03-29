import { REGEX_DAY_PARSE, REGEX_MONTH_PARSE, REGEX_WEEK_PARSE } from "./type";

class CycleTime{
    [$: string]: any;
    constructor(cfg:any){
        // 支持字符串，
        this.$d = this.parse(cfg)
        
    }

    getTime(){
        return 'M'
    }

    parse(str: string) {
        let match;
        if (match = str.match(REGEX_DAY_PARSE)) {
          const { 0: type, 1: cycle, 2: hour, 3: minute, 4: second } = match;
          Object.assign(this, { type, cycle: parseInt(cycle), hour: parseInt(hour), minute: parseInt(minute), second: parseInt(second) });
        } else if (match = str.match(REGEX_WEEK_PARSE)) {
          const { 0: type, 1: cycle, 2: week, 3: hour, 4: minute, 5: second } = match;
          Object.assign(this, { type, cycle: parseInt(cycle), week: parseInt(week), hour: parseInt(hour), minute: parseInt(minute), second: parseInt(second) });
        } else if (match = str.match(REGEX_MONTH_PARSE)) {
          const { 0: type, 1: cycle, 2: month, 3: hour, 4: minute, 5: second } = match;
          Object.assign(this, { type, cycle: parseInt(cycle), month: parseInt(month), hour: parseInt(hour), minute: parseInt(minute), second: parseInt(second) });
        } else {
          throw new Error(`Invalid string format: ${str}`);
        }
      }
}
