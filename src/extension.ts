import * as vscode from 'vscode';

export function registerChatTools(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.lm.registerTool('copilot-watch_getCurrentDate', new GetCurrentDateTool()));
	context.subscriptions.push(vscode.lm.registerTool('copilot-watch_calculateDifference', new CalculateDifferenceTool()));
	context.subscriptions.push(vscode.lm.registerTool('copilot-watch_convertTimezone', new ConvertTimezoneTool()));
	context.subscriptions.push(vscode.lm.registerTool('copilot-watch_addTime', new AddTimeTool()));
	context.subscriptions.push(vscode.lm.registerTool('copilot-watch_subtractTime', new SubtractTimeTool()));
	context.subscriptions.push(vscode.lm.registerTool('copilot-watch_formatDuration', new FormatDurationTool()));
	context.subscriptions.push(vscode.lm.registerTool('copilot-watch_businessDay', new BusinessDayTool()));
	context.subscriptions.push(vscode.lm.registerTool('copilot-watch_dateQuery', new DateQueryTool()));
}

export function registerCommands(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand('copilot-watch.getCurrentDate', (options?: GetCurrentDateOptions) => {
			return getCurrentDateCommand(options);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('copilot-watch.calculateDifference', (options: CalculateDifferenceOptions) => {
			return calculateDifferenceCommand(options);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('copilot-watch.convertTimezone', (options: ConvertTimezoneOptions) => {
			return convertTimezoneCommand(options);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('copilot-watch.addTime', (options: AddTimeOptions) => {
			return addTimeCommand(options);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('copilot-watch.subtractTime', (options: SubtractTimeOptions) => {
			return subtractTimeCommand(options);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('copilot-watch.formatDuration', (options: FormatDurationOptions) => {
			return formatDurationCommand(options);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('copilot-watch.businessDay', (options: BusinessDayOptions) => {
			return businessDayCommand(options);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('copilot-watch.dateQuery', (options: DateQueryOptions) => {
			return dateQueryCommand(options);
		})
	);
}

interface IGetCurrentDateParameters {
	timezone?: string;
	format?: string;
}

interface GetCurrentDateOptions {
	timezone?: string;
	format?: string;
}

interface CalculateDifferenceOptions {
	from: string;
	to: string;
}

interface ICalculateDifferenceParameters {
	from: string;
	to: string;
}

interface ConvertTimezoneOptions {
	date: string;
	fromTimezone?: string;
	toTimezone: string;
}

interface IConvertTimezoneParameters {
	date: string;
	fromTimezone?: string;
	toTimezone: string;
}

interface AddTimeOptions {
	baseTime?: string;
	years?: number;
	months?: number;
	weeks?: number;
	days?: number;
	hours?: number;
	minutes?: number;
	seconds?: number;
	timezone?: string;
}

interface IAddTimeParameters {
	baseTime?: string;
	years?: number;
	months?: number;
	weeks?: number;
	days?: number;
	hours?: number;
	minutes?: number;
	seconds?: number;
	timezone?: string;
}

interface SubtractTimeOptions {
	baseTime?: string;
	years?: number;
	months?: number;
	weeks?: number;
	days?: number;
	hours?: number;
	minutes?: number;
	seconds?: number;
	timezone?: string;
}

interface ISubtractTimeParameters {
	baseTime?: string;
	years?: number;
	months?: number;
	weeks?: number;
	days?: number;
	hours?: number;
	minutes?: number;
	seconds?: number;
	timezone?: string;
}

interface FormatDurationOptions {
	from: string;
	to: string;
	verbosity?: 'compact' | 'standard' | 'verbose';
	maxUnits?: number;
}

interface IFormatDurationParameters {
	from: string;
	to: string;
	verbosity?: 'compact' | 'standard' | 'verbose';
	maxUnits?: number;
}

interface DateQueryOptions {
	baseDate: string;
	queries: Array<{
		type: 'nextWeekday' | 'previousWeekday' | 'startOfPeriod' | 'endOfPeriod';
		weekday?: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
		period?: 'week' | 'month' | 'quarter' | 'year';
		weekStart?: 'monday' | 'sunday';
	}>;
}

interface IDateQueryParameters {
	baseDate: string;
	queries: Array<{
		type: 'nextWeekday' | 'previousWeekday' | 'startOfPeriod' | 'endOfPeriod';
		weekday?: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
		period?: 'week' | 'month' | 'quarter' | 'year';
		weekStart?: 'monday' | 'sunday';
	}>;
}

interface BusinessDayOptions {
	operation: 'isBusinessDay' | 'addBusinessDays' | 'subtractBusinessDays';
	date: string;
	days?: number;
}

interface IBusinessDayParameters {
	operation: 'isBusinessDay' | 'addBusinessDays' | 'subtractBusinessDays';
	date: string;
	days?: number;
}

function formatUTC(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  const y = date.getUTCFullYear();
  const m = pad(date.getUTCMonth() + 1);
  const d = pad(date.getUTCDate());
  const hh = pad(date.getUTCHours());
  const mm = pad(date.getUTCMinutes());
  const ss = pad(date.getUTCSeconds());
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
}

function formatInTimezone(date: Date, timezone?: string, customFormat?: string): string {
	try {
		if (timezone) {
			// Use Intl.DateTimeFormat for timezone conversion
			const formatted = new Intl.DateTimeFormat('en-CA', {
				timeZone: timezone,
				year: 'numeric',
				month: '2-digit',
				day: '2-digit',
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit',
				hour12: false
			}).format(date);
			
			// Convert from "YYYY-MM-DD, HH:MM:SS" to "YYYY-MM-DD HH:MM:SS"
			return formatted.replace(', ', ' ');
		} else {
			// Default to standard ISO format without timezone info
			return date.toISOString().slice(0, 19).replace('T', ' ');
		}
	} catch (error) {
		throw new Error(`Invalid timezone: ${timezone}`);
	}
}

function getUserTimezone(): string {
	try {
		return Intl.DateTimeFormat().resolvedOptions().timeZone;
	} catch (error) {
		return 'UTC'; // Fallback to UTC if detection fails
	}
}

function parseISOString(dateString: string): Date {
	const date = new Date(dateString);
	if (isNaN(date.getTime())) {
		throw new Error(`Invalid date format: ${dateString}`);
	}
	return date;
}

function calculateDateDifference(from: Date, to: Date) {
	const diffMs = to.getTime() - from.getTime();
	return {
		days: Math.floor(diffMs / (1000 * 60 * 60 * 24)),
		hours: Math.floor(diffMs / (1000 * 60 * 60)),
		minutes: Math.floor(diffMs / (1000 * 60)),
		seconds: Math.floor(diffMs / 1000)
	};
}

// Duration formatting functions
function formatDuration(value: number, unit: string, verbosity: string = 'standard', maxUnits: number = 3): string {
	// Convert everything to seconds first
	let totalSeconds: number;
	
	switch (unit) {
		case 'milliseconds':
			totalSeconds = value / 1000;
			break;
		case 'minutes':
			totalSeconds = value * 60;
			break;
		case 'hours':
			totalSeconds = value * 3600;
			break;
		case 'days':
			totalSeconds = value * 86400;
			break;
		case 'seconds':
		default:
			totalSeconds = value;
			break;
	}

	const isNegative = totalSeconds < 0;
	const absSeconds = Math.abs(totalSeconds);

	if (absSeconds === 0) {
		return '0 seconds';
	}

	const years = Math.floor(absSeconds / (365 * 24 * 3600));
	const days = Math.floor((absSeconds % (365 * 24 * 3600)) / (24 * 3600));
	const hours = Math.floor((absSeconds % (24 * 3600)) / 3600);
	const minutes = Math.floor((absSeconds % 3600) / 60);
	const seconds = Math.floor(absSeconds % 60);

	const parts = [];
	
	if (verbosity === 'compact') {
		if (years > 0) { parts.push(`${years}y`); }
		if (days > 0) { parts.push(`${days}d`); }
		if (hours > 0) { parts.push(`${hours}h`); }
		if (minutes > 0) { parts.push(`${minutes}m`); }
		if (seconds > 0) { parts.push(`${seconds}s`); }
	} else if (verbosity === 'verbose') {
		if (years > 0) { parts.push(`${years} ${years === 1 ? 'year' : 'years'}`); }
		if (days > 0) { parts.push(`${days} ${days === 1 ? 'day' : 'days'}`); }
		if (hours > 0) { parts.push(`${hours} ${hours === 1 ? 'hour' : 'hours'}`); }
		if (minutes > 0) { parts.push(`${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`); }
		if (seconds > 0) { parts.push(`${seconds} ${seconds === 1 ? 'second' : 'seconds'}`); }
	} else { // standard
		if (years > 0) { parts.push(`${years} years`); }
		if (days > 0) { parts.push(`${days} days`); }
		if (hours > 0) { parts.push(`${hours} hours`); }
		if (minutes > 0) { parts.push(`${minutes} minutes`); }
		if (seconds > 0) { parts.push(`${seconds} seconds`); }
	}

	// Limit to maxUnits
	const limitedParts = parts.slice(0, maxUnits);
	
	if (limitedParts.length === 0) {
		return verbosity === 'compact' ? '0s' : '0 seconds';
	}

	const result = verbosity === 'verbose' && limitedParts.length > 1 
		? limitedParts.slice(0, -1).join(', ') + ' and ' + limitedParts[limitedParts.length - 1]
		: limitedParts.join(verbosity === 'compact' ? ' ' : ', ');
		
	return isNegative ? `${result} ago` : result;
}

// Business day functions
function parseBusinessDays(businessDaysString: string): number[] {
	const dayMap = {
		'Mon': 1, 'Monday': 1,
		'Tue': 2, 'Tuesday': 2,
		'Wed': 3, 'Wednesday': 3,
		'Thu': 4, 'Thursday': 4,
		'Fri': 5, 'Friday': 5,
		'Sat': 6, 'Saturday': 6,
		'Sun': 0, 'Sunday': 0
	};

	// Handle range format like "Mon-Fri"
	if (businessDaysString.includes('-')) {
		const [start, end] = businessDaysString.split('-');
		const startDay = dayMap[start.trim() as keyof typeof dayMap];
		const endDay = dayMap[end.trim() as keyof typeof dayMap];
		
		const days = [];
		for (let i = startDay; i <= endDay; i++) {
			days.push(i);
		}
		return days;
	}

	// Handle comma-separated format like "Mon,Wed,Fri"
	return businessDaysString.split(',')
		.map(day => dayMap[day.trim() as keyof typeof dayMap])
		.filter(day => day !== undefined);
}

function isBusinessDay(date: Date, businessDays: number[], excludedDates: Set<string>): boolean {
	const dayOfWeek = date.getDay();
	const dateString = date.toISOString().split('T')[0];
	
	return businessDays.includes(dayOfWeek) && !excludedDates.has(dateString);
}

function addBusinessDays(startDate: Date, days: number, businessDays: number[], excludedDates: Set<string>): Date {
	const result = new Date(startDate);
	let daysToAdd = Math.abs(days);
	const direction = days >= 0 ? 1 : -1;

	while (daysToAdd > 0) {
		result.setDate(result.getDate() + direction);
		if (isBusinessDay(result, businessDays, excludedDates)) {
			daysToAdd--;
		}
	}

	return result;
}

// Date query functions
function getNextWeekday(startDate: Date, targetWeekday: string): Date {
	const weekdayMap = {
		'sunday': 0, 'monday': 1, 'tuesday': 2, 'wednesday': 3,
		'thursday': 4, 'friday': 5, 'saturday': 6,
		'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
		'Thursday': 4, 'Friday': 5, 'Saturday': 6
	};
	
	const targetDay = weekdayMap[targetWeekday as keyof typeof weekdayMap];
	if (targetDay === undefined) {
		throw new Error(`Invalid weekday: ${targetWeekday}`);
	}
	
	const currentDay = startDate.getDay();
	
	let daysToAdd = targetDay - currentDay;
	if (daysToAdd <= 0) {
		daysToAdd += 7;
	}
	
	const result = new Date(startDate);
	result.setDate(result.getDate() + daysToAdd);
	return result;
}

function getPreviousWeekday(startDate: Date, targetWeekday: string): Date {
	const weekdayMap = {
		'sunday': 0, 'monday': 1, 'tuesday': 2, 'wednesday': 3,
		'thursday': 4, 'friday': 5, 'saturday': 6,
		'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
		'Thursday': 4, 'Friday': 5, 'Saturday': 6
	};
	
	const targetDay = weekdayMap[targetWeekday as keyof typeof weekdayMap];
	if (targetDay === undefined) {
		throw new Error(`Invalid weekday: ${targetWeekday}`);
	}
	
	const currentDay = startDate.getDay();
	
	let daysToSubtract = currentDay - targetDay;
	if (daysToSubtract <= 0) {
		daysToSubtract += 7;
	}
	
	const result = new Date(startDate);
	result.setDate(result.getDate() - daysToSubtract);
	return result;
}

function getStartOfPeriod(date: Date, period: string, weekStart: string = 'Monday'): Date {
	const result = new Date(date);
	
	switch (period) {
		case 'day':
			result.setHours(0, 0, 0, 0);
			break;
		case 'week':
			const startDay = weekStart === 'Sunday' ? 0 : 1;
			const currentDay = result.getDay();
			let daysToSubtract = (currentDay - startDay + 7) % 7;
			result.setDate(result.getDate() - daysToSubtract);
			result.setHours(0, 0, 0, 0);
			break;
		case 'month':
			result.setDate(1);
			result.setHours(0, 0, 0, 0);
			break;
		case 'quarter':
			const quarterStartMonth = Math.floor(result.getMonth() / 3) * 3;
			result.setMonth(quarterStartMonth, 1);
			result.setHours(0, 0, 0, 0);
			break;
		case 'year':
			result.setMonth(0, 1);
			result.setHours(0, 0, 0, 0);
			break;
	}
	
	return result;
}

function getEndOfPeriod(date: Date, period: string, weekStart: string = 'Monday'): Date {
	const result = new Date(date);
	
	switch (period) {
		case 'day':
			result.setHours(23, 59, 59, 999);
			break;
		case 'week':
			const startOfWeek = getStartOfPeriod(date, 'week', weekStart);
			result.setTime(startOfWeek.getTime());
			result.setDate(result.getDate() + 6);
			result.setHours(23, 59, 59, 999);
			break;
		case 'month':
			result.setMonth(result.getMonth() + 1, 0);
			result.setHours(23, 59, 59, 999);
			break;
		case 'quarter':
			const quarterStartMonth = Math.floor(result.getMonth() / 3) * 3;
			result.setMonth(quarterStartMonth + 3, 0);
			result.setHours(23, 59, 59, 999);
			break;
		case 'year':
			result.setMonth(11, 31);
			result.setHours(23, 59, 59, 999);
			break;
	}
	
	return result;
}

// Command implementations
function formatDurationCommand(options: FormatDurationOptions) {
	try {
		const fromDate = new Date(options.from);
		const toDate = new Date(options.to);
		
		if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
			return { error: 'Invalid date format. Please use ISO 8601 format (e.g., 2025-08-01T00:00:00Z)' };
		}

		const diffMs = Math.abs(toDate.getTime() - fromDate.getTime());
		const formatted = formatDuration(diffMs, 'milliseconds', options.verbosity || 'standard', options.maxUnits || 3);
		
		return { formatted };
	} catch (error) {
		return { error: String(error) };
	}
}

function businessDayCommand(options: BusinessDayOptions) {
	try {
		const date = parseISOString(options.date);
		
		switch (options.operation) {
			case 'isBusinessDay': {
				const isBusinessDay = date.getDay() >= 1 && date.getDay() <= 5;
				return {
					date: options.date,
					isBusinessDay,
					weekday: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()]
				};
			}
			
			case 'addBusinessDays': {
				if (!options.days) {
					return { error: 'Days parameter required for addBusinessDays operation' };
				}
				const result = addBusinessDays(date, options.days, [1, 2, 3, 4, 5], new Set());
				return {
					date: options.date,
					operation: options.operation,
					days: options.days,
					result: result.toISOString()
				};
			}
			
			case 'subtractBusinessDays': {
				if (!options.days) {
					return { error: 'Days parameter required for subtractBusinessDays operation' };
				}
				const result = addBusinessDays(date, -options.days, [1, 2, 3, 4, 5], new Set());
				return {
					date: options.date,
					operation: options.operation,
					days: options.days,
					result: result.toISOString()
				};
			}
			
			default:
				return { error: 'Invalid operation. Use isBusinessDay, addBusinessDays, or subtractBusinessDays' };
		}
	} catch (error) {
		return { error: String(error) };
	}
}

function dateQueryCommand(options: DateQueryOptions) {
	try {
		const baseDate = parseISOString(options.baseDate);
		const results: Date[] = [];

		for (let i = 0; i < options.queries.length; i++) {
			const query = options.queries[i];
			let result: Date;
			
			switch (query.type) {
				case 'nextWeekday':
					if (!query.weekday) { throw new Error('Weekday required for nextWeekday query'); }
					result = getNextWeekday(i === 0 ? baseDate : results[i - 1], query.weekday);
					break;
				case 'previousWeekday':
					if (!query.weekday) { throw new Error('Weekday required for previousWeekday query'); }
					result = getPreviousWeekday(i === 0 ? baseDate : results[i - 1], query.weekday);
					break;
				case 'startOfPeriod':
					if (!query.period) { throw new Error('Period required for startOfPeriod query'); }
					result = getStartOfPeriod(baseDate, query.period, query.weekStart);
					break;
				case 'endOfPeriod':
					if (!query.period) { throw new Error('Period required for endOfPeriod query'); }
					result = getEndOfPeriod(baseDate, query.period, query.weekStart);
					break;
				default:
					throw new Error(`Unsupported query type: ${(query as any).type}`);
			}
			
			results.push(result);
		}

		if (results.length === 1) {
			return { date: results[0].toISOString() };
		} else {
			return { dates: results.map(d => d.toISOString()) };
		}
	} catch (error) {
		return { error: error instanceof Error ? error.message : 'Invalid date query parameters' };
	}
}

// Command implementations
function getCurrentDateCommand(options?: GetCurrentDateOptions) {
	const now = new Date();
	const result: any = {
		iso: now.toISOString(),
		utc: formatUTC(now)
	};

	// If no options provided, also include local timezone
	if (!options || (!options.timezone && !options.format)) {
		const userTimezone = getUserTimezone();
		result.local = formatInTimezone(now, userTimezone);
		result.localTimezone = userTimezone;
	}

	if (options?.timezone) {
		try {
			result.formatted = formatInTimezone(now, options.timezone, options.format);
			result.timezone = options.timezone;
		} catch (error) {
			result.error = `Invalid timezone: ${options.timezone}`;
		}
	} else if (options?.format) {
		try {
			result.formatted = formatInTimezone(now, undefined, options.format);
		} catch (error) {
			result.error = `Invalid format: ${options.format}`;
		}
	}

	return result;
}

function calculateDifferenceCommand(options: CalculateDifferenceOptions) {
	try {
		const fromDate = parseISOString(options.from);
		const toDate = parseISOString(options.to);

		return calculateDateDifference(fromDate, toDate);
	} catch (error) {
		return {
			error: `Invalid date format. Please use ISO format (e.g., 2025-08-09T13:37:01Z)`
		};
	}
}

function convertTimezoneCommand(options: ConvertTimezoneOptions) {
	try {
		const date = parseISOString(options.date);
		// Default fromTimezone to UTC if not specified
		const fromTz = options.fromTimezone || 'UTC';
		const formatted = formatInTimezone(date, options.toTimezone);
		
		return {
			formatted,
			fromTimezone: fromTz,
			toTimezone: options.toTimezone,
			iso: date.toISOString()
		};
	} catch (error) {
		return {
			error: `Invalid date format or timezone. Please use ISO format for date and valid IANA timezone.`
		};
	}
}

function addTimeCommand(options: AddTimeOptions) {
	try {
		// Use provided base time or current time
		const baseDate = options.baseTime ? parseISOString(options.baseTime) : new Date();
		
		// Calculate the new date by adding the specified time units
		const newDate = new Date(baseDate);
		
		if (options.years) { newDate.setFullYear(newDate.getFullYear() + options.years); }
		if (options.months) { newDate.setMonth(newDate.getMonth() + options.months); }
		if (options.weeks) { newDate.setDate(newDate.getDate() + (options.weeks * 7)); }
		if (options.days) { newDate.setDate(newDate.getDate() + options.days); }
		if (options.hours) { newDate.setHours(newDate.getHours() + options.hours); }
		if (options.minutes) { newDate.setMinutes(newDate.getMinutes() + options.minutes); }
		if (options.seconds) { newDate.setSeconds(newDate.getSeconds() + options.seconds); }

		const result: any = {
			iso: newDate.toISOString(),
			utc: formatUTC(newDate),
			baseTime: baseDate.toISOString()
		};

		// Include local timezone info
		const userTimezone = getUserTimezone();
		result.local = formatInTimezone(newDate, userTimezone);
		result.localTimezone = userTimezone;

		// If specific timezone requested, include that too
		if (options.timezone) {
			try {
				result.formatted = formatInTimezone(newDate, options.timezone);
				result.timezone = options.timezone;
			} catch (error) {
				result.error = `Invalid timezone: ${options.timezone}`;
			}
		}

		return result;
	} catch (error) {
		return {
			error: `Invalid base time format. Please use ISO format (e.g., 2025-08-09T13:37:01Z) or omit for current time.`
		};
	}
}

function subtractTimeCommand(options: SubtractTimeOptions) {
	try {
		// Use provided base time or current time
		const baseDate = options.baseTime ? parseISOString(options.baseTime) : new Date();
		
		// Calculate the new date by subtracting the specified time units
		const newDate = new Date(baseDate);
		
		if (options.years) { newDate.setFullYear(newDate.getFullYear() - options.years); }
		if (options.months) { newDate.setMonth(newDate.getMonth() - options.months); }
		if (options.weeks) { newDate.setDate(newDate.getDate() - (options.weeks * 7)); }
		if (options.days) { newDate.setDate(newDate.getDate() - options.days); }
		if (options.hours) { newDate.setHours(newDate.getHours() - options.hours); }
		if (options.minutes) { newDate.setMinutes(newDate.getMinutes() - options.minutes); }
		if (options.seconds) { newDate.setSeconds(newDate.getSeconds() - options.seconds); }

		const result: any = {
			iso: newDate.toISOString(),
			utc: formatUTC(newDate),
			baseTime: baseDate.toISOString()
		};

		// Include local timezone info
		const userTimezone = getUserTimezone();
		result.local = formatInTimezone(newDate, userTimezone);
		result.localTimezone = userTimezone;

		// If specific timezone requested, include that too
		if (options.timezone) {
			try {
				result.formatted = formatInTimezone(newDate, options.timezone);
				result.timezone = options.timezone;
			} catch (error) {
				result.error = `Invalid timezone: ${options.timezone}`;
			}
		}

		return result;
	} catch (error) {
		return {
			error: `Invalid base time format. Please use ISO format (e.g., 2025-08-09T13:37:01Z) or omit for current time.`
		};
	}
}

export class GetCurrentDateTool implements vscode.LanguageModelTool<IGetCurrentDateParameters> {
	async invoke(
		options: vscode.LanguageModelToolInvocationOptions<IGetCurrentDateParameters>,
		_token: vscode.CancellationToken
	) {
		const now = new Date();
		const params = options.input;
		
		const result: any = {
			iso: now.toISOString(),
			utc: formatUTC(now)
		};

		// Always include local timezone info for better context
		const userTimezone = getUserTimezone();
		result.local = formatInTimezone(now, userTimezone);
		result.localTimezone = userTimezone;

		if (params?.timezone) {
			try {
				result.formatted = formatInTimezone(now, params.timezone, params.format);
				result.timezone = params.timezone;
			} catch (error) {
				result.error = `Invalid timezone: ${params.timezone}`;
			}
		} else if (params?.format) {
			try {
				result.formatted = formatInTimezone(now, undefined, params.format);
			} catch (error) {
				result.error = `Invalid format: ${params.format}`;
			}
		}

		let message = `Current date and time:\n- ISO format: ${result.iso}\n- UTC format: ${result.utc}\n- Local time: ${result.local} (${result.localTimezone})`;
		if (result.formatted && params?.timezone) {
			message += `\n- ${params.timezone}: ${result.formatted}`;
		} else if (result.formatted) {
			message += `\n- Formatted: ${result.formatted}`;
		}
		if (result.error) {
			message += `\n- Error: ${result.error}`;
		}

		return new vscode.LanguageModelToolResult([new vscode.LanguageModelTextPart(message)]);
	}

	async prepareInvocation(
		options: vscode.LanguageModelToolInvocationPrepareOptions<IGetCurrentDateParameters>,
		_token: vscode.CancellationToken
	) {
		const params = options.input;
		let title = 'Get current date and time';
		let message = 'Get the current date and time';
		
		if (params?.timezone || params?.format) {
			if (params.timezone) {
				title += ` in ${params.timezone}`;
				message += ` in timezone ${params.timezone}`;
			}
			if (params.format) {
				message += ` with format "${params.format}"`;
			}
		} else {
			message += ' in ISO and UTC formats';
		}

		const confirmationMessages = {
			title,
			message: new vscode.MarkdownString(message + '?'),
		};

		return {
			invocationMessage: title,
			confirmationMessages,
		};
	}
}

export class CalculateDifferenceTool implements vscode.LanguageModelTool<ICalculateDifferenceParameters> {
	async invoke(
		options: vscode.LanguageModelToolInvocationOptions<ICalculateDifferenceParameters>,
		_token: vscode.CancellationToken
	) {
		const params = options.input;
		
		try {
			const fromDate = parseISOString(params.from);
			const toDate = parseISOString(params.to);

			const result = calculateDateDifference(fromDate, toDate);

			const message = `Time difference between ${params.from} and ${params.to}:\n` +
				`- Days: ${result.days}\n` +
				`- Hours: ${result.hours}\n` +
				`- Minutes: ${result.minutes}\n` +
				`- Seconds: ${result.seconds}`;

			return new vscode.LanguageModelToolResult([new vscode.LanguageModelTextPart(message)]);
		} catch (error) {
			const errorMessage = `Error calculating difference: Invalid date format. Please use ISO format (e.g., 2025-08-09T13:37:01Z)`;
			return new vscode.LanguageModelToolResult([new vscode.LanguageModelTextPart(errorMessage)]);
		}
	}

	async prepareInvocation(
		options: vscode.LanguageModelToolInvocationPrepareOptions<ICalculateDifferenceParameters>,
		_token: vscode.CancellationToken
	) {
		const params = options.input;
		const confirmationMessages = {
			title: 'Calculate time difference',
			message: new vscode.MarkdownString(`Calculate the time difference between ${params.from} and ${params.to}?`),
		};

		return {
			invocationMessage: 'Calculating time difference',
			confirmationMessages,
		};
	}
}

export class ConvertTimezoneTool implements vscode.LanguageModelTool<IConvertTimezoneParameters> {
	async invoke(
		options: vscode.LanguageModelToolInvocationOptions<IConvertTimezoneParameters>,
		_token: vscode.CancellationToken
	) {
		const params = options.input;
		
		try {
			const date = parseISOString(params.date);
			// Default fromTimezone to UTC if not specified  
			const fromTz = params.fromTimezone || 'UTC';
			const formatted = formatInTimezone(date, params.toTimezone);
			
			const message = `Converted ${params.date} from ${fromTz} to ${params.toTimezone}:\n` +
				`- Formatted: ${formatted}\n` +
				`- From timezone: ${fromTz}\n` +
				`- To timezone: ${params.toTimezone}\n` +
				`- Original ISO: ${date.toISOString()}`;

			return new vscode.LanguageModelToolResult([new vscode.LanguageModelTextPart(message)]);
		} catch (error) {
			const errorMessage = `Error converting timezone: Invalid date format or timezone. Please use ISO format for date and valid IANA timezone.`;
			return new vscode.LanguageModelToolResult([new vscode.LanguageModelTextPart(errorMessage)]);
		}
	}

	async prepareInvocation(
		options: vscode.LanguageModelToolInvocationPrepareOptions<IConvertTimezoneParameters>,
		_token: vscode.CancellationToken
	) {
		const params = options.input;
		const confirmationMessages = {
			title: 'Convert timezone',
			message: new vscode.MarkdownString(`Convert ${params.date} to timezone ${params.toTimezone}?`),
		};

		return {
			invocationMessage: 'Converting timezone',
			confirmationMessages,
		};
	}
}

export class AddTimeTool implements vscode.LanguageModelTool<IAddTimeParameters> {
	async invoke(
		options: vscode.LanguageModelToolInvocationOptions<IAddTimeParameters>,
		_token: vscode.CancellationToken
	) {
		const params = options.input;
		
		try {
			// Use provided base time or current time
			const baseDate = params.baseTime ? parseISOString(params.baseTime) : new Date();
			
			// Calculate the new date by adding the specified time units
			const newDate = new Date(baseDate);
			
			if (params.years) { newDate.setFullYear(newDate.getFullYear() + params.years); }
			if (params.months) { newDate.setMonth(newDate.getMonth() + params.months); }
			if (params.weeks) { newDate.setDate(newDate.getDate() + (params.weeks * 7)); }
			if (params.days) { newDate.setDate(newDate.getDate() + params.days); }
			if (params.hours) { newDate.setHours(newDate.getHours() + params.hours); }
			if (params.minutes) { newDate.setMinutes(newDate.getMinutes() + params.minutes); }
			if (params.seconds) { newDate.setSeconds(newDate.getSeconds() + params.seconds); }

			// Include local timezone info
			const userTimezone = getUserTimezone();
			const localFormatted = formatInTimezone(newDate, userTimezone);

			// Build duration description
			const durationParts = [];
			if (params.years) { durationParts.push(`${params.years} year${params.years !== 1 ? 's' : ''}`); }
			if (params.months) { durationParts.push(`${params.months} month${params.months !== 1 ? 's' : ''}`); }
			if (params.weeks) { durationParts.push(`${params.weeks} week${params.weeks !== 1 ? 's' : ''}`); }
			if (params.days) { durationParts.push(`${params.days} day${params.days !== 1 ? 's' : ''}`); }
			if (params.hours) { durationParts.push(`${params.hours} hour${params.hours !== 1 ? 's' : ''}`); }
			if (params.minutes) { durationParts.push(`${params.minutes} minute${params.minutes !== 1 ? 's' : ''}`); }
			if (params.seconds) { durationParts.push(`${params.seconds} second${params.seconds !== 1 ? 's' : ''}`); }
			
			const durationText = durationParts.length > 0 ? durationParts.join(', ') : 'no time';
			const baseText = params.baseTime ? params.baseTime : 'now';

			let message = `Adding ${durationText} to ${baseText}:\n` +
				`- Result: ${localFormatted} (${userTimezone})\n` +
				`- ISO format: ${newDate.toISOString()}\n` +
				`- UTC format: ${formatUTC(newDate)}`;

			// If specific timezone requested, include that too
			if (params.timezone) {
				try {
					const tzFormatted = formatInTimezone(newDate, params.timezone);
					message += `\n- ${params.timezone}: ${tzFormatted}`;
				} catch (error) {
					message += `\n- Error: Invalid timezone: ${params.timezone}`;
				}
			}

			return new vscode.LanguageModelToolResult([new vscode.LanguageModelTextPart(message)]);
		} catch (error) {
			const errorMessage = `Error adding time: Invalid base time format. Please use ISO format (e.g., 2025-08-09T13:37:01Z) or omit for current time.`;
			return new vscode.LanguageModelToolResult([new vscode.LanguageModelTextPart(errorMessage)]);
		}
	}

	async prepareInvocation(
		options: vscode.LanguageModelToolInvocationPrepareOptions<IAddTimeParameters>,
		_token: vscode.CancellationToken
	) {
		const params = options.input;
		
		// Build duration description for confirmation
		const durationParts = [];
		if (params.years) { durationParts.push(`${params.years} year${params.years !== 1 ? 's' : ''}`); }
		if (params.months) { durationParts.push(`${params.months} month${params.months !== 1 ? 's' : ''}`); }
		if (params.weeks) { durationParts.push(`${params.weeks} week${params.weeks !== 1 ? 's' : ''}`); }
		if (params.days) { durationParts.push(`${params.days} day${params.days !== 1 ? 's' : ''}`); }
		if (params.hours) { durationParts.push(`${params.hours} hour${params.hours !== 1 ? 's' : ''}`); }
		if (params.minutes) { durationParts.push(`${params.minutes} minute${params.minutes !== 1 ? 's' : ''}`); }
		if (params.seconds) { durationParts.push(`${params.seconds} second${params.seconds !== 1 ? 's' : ''}`); }
		
		const durationText = durationParts.length > 0 ? durationParts.join(', ') : 'no time';
		const baseText = params.baseTime ? params.baseTime : 'current time';

		const confirmationMessages = {
			title: 'Add time duration',
			message: new vscode.MarkdownString(`Add ${durationText} to ${baseText}?`),
		};

		return {
			invocationMessage: `Adding ${durationText}`,
			confirmationMessages,
		};
	}
}

export class SubtractTimeTool implements vscode.LanguageModelTool<ISubtractTimeParameters> {
	async invoke(
		options: vscode.LanguageModelToolInvocationOptions<ISubtractTimeParameters>,
		_token: vscode.CancellationToken
	): Promise<vscode.LanguageModelToolResult> {
		try {
			const result = subtractTimeCommand(options.input);
			if (result.error) {
				return new vscode.LanguageModelToolResult([new vscode.LanguageModelTextPart(`Error: ${result.error}`)]);
			}

			let message = `Time calculation result:\n- Base time: ${result.baseTime}\n- Result: ${result.iso}\n- UTC format: ${result.utc}\n- Local time: ${result.local} (${result.localTimezone})`;
			if (result.formatted && result.timezone) {
				message += `\n- ${result.timezone}: ${result.formatted}`;
			}

			return new vscode.LanguageModelToolResult([new vscode.LanguageModelTextPart(message)]);
		} catch (error) {
			return new vscode.LanguageModelToolResult([new vscode.LanguageModelTextPart('Error: Failed to subtract time')]);
		}
	}

	async prepareInvocation(
		options: vscode.LanguageModelToolInvocationPrepareOptions<ISubtractTimeParameters>,
		_token: vscode.CancellationToken
	): Promise<vscode.PreparedToolInvocation> {
		const params = options.input;
		
		// Build duration description for confirmation
		const durationParts = [];
		if (params.years) { durationParts.push(`${params.years} year${params.years !== 1 ? 's' : ''}`); }
		if (params.months) { durationParts.push(`${params.months} month${params.months !== 1 ? 's' : ''}`); }
		if (params.weeks) { durationParts.push(`${params.weeks} week${params.weeks !== 1 ? 's' : ''}`); }
		if (params.days) { durationParts.push(`${params.days} day${params.days !== 1 ? 's' : ''}`); }
		if (params.hours) { durationParts.push(`${params.hours} hour${params.hours !== 1 ? 's' : ''}`); }
		if (params.minutes) { durationParts.push(`${params.minutes} minute${params.minutes !== 1 ? 's' : ''}`); }
		if (params.seconds) { durationParts.push(`${params.seconds} second${params.seconds !== 1 ? 's' : ''}`); }
		
		const durationText = durationParts.length > 0 ? durationParts.join(', ') : 'no time';
		const baseText = params.baseTime ? params.baseTime : 'current time';

		const confirmationMessages = {
			title: 'Subtract time duration',
			message: new vscode.MarkdownString(`Subtract ${durationText} from ${baseText}?`),
		};

		return {
			invocationMessage: `Subtracting ${durationText}`,
			confirmationMessages,
		};
	}
}

export class FormatDurationTool implements vscode.LanguageModelTool<IFormatDurationParameters> {
	async invoke(
		options: vscode.LanguageModelToolInvocationOptions<IFormatDurationParameters>,
		_token: vscode.CancellationToken
	) {
		try {
			const params = options.input;
			const result = formatDurationCommand(params);
			return new vscode.LanguageModelToolResult([
				new vscode.LanguageModelTextPart(JSON.stringify(result))
			]);
		} catch (error) {
			return new vscode.LanguageModelToolResult([
				new vscode.LanguageModelTextPart(`Error: ${error}`)
			]);
		}
	}
}

export class BusinessDayTool implements vscode.LanguageModelTool<IBusinessDayParameters> {
	async invoke(
		options: vscode.LanguageModelToolInvocationOptions<IBusinessDayParameters>,
		_token: vscode.CancellationToken
	) {
		try {
			const params = options.input;
			const result = businessDayCommand(params);
			return new vscode.LanguageModelToolResult([
				new vscode.LanguageModelTextPart(JSON.stringify(result))
			]);
		} catch (error) {
			return new vscode.LanguageModelToolResult([
				new vscode.LanguageModelTextPart(`Error: ${error}`)
			]);
		}
	}
}

export class DateQueryTool implements vscode.LanguageModelTool<IDateQueryParameters> {
	async invoke(
		options: vscode.LanguageModelToolInvocationOptions<IDateQueryParameters>,
		_token: vscode.CancellationToken
	) {
		try {
			const params = options.input;
			const result = dateQueryCommand(params);
			return new vscode.LanguageModelToolResult([
				new vscode.LanguageModelTextPart(JSON.stringify(result))
			]);
		} catch (error) {
			return new vscode.LanguageModelToolResult([
				new vscode.LanguageModelTextPart(`Error: ${error}`)
			]);
		}
	}
}

export function activate(context: vscode.ExtensionContext) {
	registerChatTools(context);
	registerCommands(context);
}

export function deactivate() {}