import * as moment from 'moment';

export function formatDate(date: moment.Moment): string {
  return date.utcOffset(-3).toISOString(true);
}
