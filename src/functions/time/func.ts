import dayjs from "dayjs";

export function convertTimeRelativeFormat(rfc3339Time: string) {
    const now = dayjs();
    const targetTime = dayjs(rfc3339Time);

    if (targetTime.isAfter(now)) {
        return "방금 전";
    }

    const diffInSeconds = now.diff(targetTime, "second");
    const diffInMinutes = now.diff(targetTime, "minute");
    const diffInHours = now.diff(targetTime, "hour");
    const diffInDays = now.diff(targetTime, "day");
    const diffInMonths = now.diff(targetTime, "month");
    const diffInYears = now.diff(targetTime, "year");

    if (diffInMinutes < 1) {
        return `${diffInSeconds}초 전`;
    }
    if (diffInHours < 1) {
        return `${diffInMinutes}분 전`;
    }
    if (diffInDays < 1) {
        return `${diffInHours}시간 전`;
    }
    if (diffInMonths < 1) {
        return `${diffInDays}일 전`;
    }
    if (diffInYears < 1) {
        return `${diffInMonths}달 전`;
    }
    return `${diffInYears}년 전`;
}
