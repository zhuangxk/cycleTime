import dayjs from "dayjs"
import * as C from "dayjs/esm/constant"
export { SECONDS_A_MINUTE, SECONDS_A_HOUR, SECONDS_A_DAY, SECONDS_A_WEEK } from "dayjs/esm/constant"
export const SECONDS_A_MONTH = C.SECONDS_A_DAY * 28

export enum CycleType {
    pro = 1,
    cur = 0
}

export enum CycleType {
    month = 'M',
    week = "W",
    day = "D",

}

export const REGEX_DAY_PARSE = /^D-([0-1])-([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
export const REGEX_WEEK_PARSE = /^W-([0-1])-([1-7])-([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
export const REGEX_MONTH_PARSE = /^M-([0-1])-([1-9]|[1-2][0-8])-([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;