import fs from 'fs'
import path from 'path'
import { format } from 'date-fns'

import { config } from '../config/logger.config'

/**
 * Configuration options for the MultiFileLogger
 * @interface LoggerOptions
 * @property {string} [logsDirectory] - Path to store log files (default: './logs')
 * @property {number} [maxFileSize] - Maximum log file size in bytes (default: 5MB)
 * @property {number} [maxFiles] - Maximum number of log files to keep per type/day (default: 5)
 * @property {boolean} [consoleOutput] - Whether to output logs to console (default: true)
 * @property {string[]} [logTypes] - Array of log types to support (default: ['error', 'info', 'warn', 'debug', 'http'])
 * @property {string[]} [logCategories] -  Array of log category to support (default: ['user', 'mail', 'auth', 'global'])
 */
interface LoggerOptions {
	logsDirectory?: string
	maxFileSize?: number
	maxFiles?: number
	consoleOutput?: boolean
	logTypes?: string[]
	logCategories?: string[]
	useDailyFolders?: boolean
	sourceOfMessage?: string
}

/**
 * MultiFileLogger - Advanced logging system with separate files for each log type
 * @class MultiFileLogger
 */
class MultiFileLogger {
	private options: Required<LoggerOptions>
	private readonly currentDate: string

	/**
	 * Creates an instance of MultiFileLogger
	 * @constructor
	 * @param {LoggerOptions} [options] - Configuration options
	 */
	constructor(options: LoggerOptions = config) {
		this.options = {
			logsDirectory: options.logsDirectory || path.join(process.cwd(), 'logs'),
			maxFileSize: options.maxFileSize || 5 * 1024 * 1024,
			maxFiles: options.maxFiles || 5,
			consoleOutput: options.consoleOutput ?? true,
			logTypes: options.logTypes || ['error', 'info', 'warn', 'debug', 'http'],
			logCategories: options.logCategories || ['global'],
			useDailyFolders: options.useDailyFolders ?? true,
			sourceOfMessage: options.sourceOfMessage || ''
		}
		this.currentDate = format(new Date(), 'yyyy-MM-dd')
		this.ensureLogsDirectoryExists()
	}

	/**
	 * Ensures the logs directory and subdirectories exist
	 */
	private ensureLogsDirectoryExists(): void {
		if (!fs.existsSync(this.options.logsDirectory)) {
			fs.mkdirSync(this.options.logsDirectory, { recursive: true })
		}

		const baseDir = this.options.useDailyFolders
			? path.join(this.options.logsDirectory, this.currentDate)
			: this.options.logsDirectory

		this.options.logCategories.forEach(category => {
			const categoryDir = path.join(baseDir, category)
			if (!fs.existsSync(categoryDir)) {
				fs.mkdirSync(categoryDir, { recursive: true })
			}

			this.options.logTypes.forEach(type => {
				const typeDir = path.join(categoryDir, type)
				if (!fs.existsSync(typeDir)) {
					fs.mkdirSync(typeDir, { recursive: true })
				}
			});
		});
	}

	/**
	 * Gets the appropriate log file path for a given log type
	 * @private
	 * @param {string} type - Log type (error, info, etc.)
	 * @param {string} category - log category (user, mail, auth, global)
	 * @returns {string} Full path to the log file
	 */
	private getLogFilePath(category: string, type: string): string {
		const baseDir = this.options.useDailyFolders
			? path.join(this.options.logsDirectory, this.currentDate)
			: this.options.logsDirectory

		const typeDir = path.join(baseDir, type, category)
		const files = fs.readdirSync(typeDir)
			.filter(f => f.startsWith(this.currentDate))
			.sort();

		if (files.length === 0) {
			return path.join(typeDir, `${this.currentDate}.log`)
		}

		const lastFile = files[files.length - 1]
		const lastFilePath = path.join(typeDir, lastFile)

		if (fs.statSync(lastFilePath).size < this.options.maxFileSize) {
			return lastFilePath
		}

		const counter = files.length < this.options.maxFiles
			? files.length
			: this.handleFileRotation(typeDir, files)

		return path.join(typeDir, `${this.currentDate}_${counter}.log`);
	}

	/**
	 * Handles log file rotation when maxFiles limit is reached
	 * @private
	 * @param {string} typeDir - Directory path for the log type
	 * @param {string[]} files - Array of existing log files
	 * @returns {number} The next available file number
	 */
	private handleFileRotation(typeDir: string, files: string[]): number {
		if (files.length >= this.options.maxFiles) {
			const oldestFile = files[0]
			fs.unlinkSync(path.join(typeDir, oldestFile))
			return this.options.maxFiles - 1
		}
		return files.length
	}

	/**
	 * Core logging method that writes to both console and file
	 * @private
	 * @param {string} category - Log category
	 * @param {string} sourceOfMessage - Source of message
	 * @param {string} type - Log type
	 * @param {string} message - Log message
	 * @param {Record<string, unknown>} [meta] - Additional metadata
	 */
	private writeLog(
		category: string,
		sourceOfMessage: string,
		type: string,
		message: string,
		meta?: Record<string, unknown>
	): void {
		const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss.SSS')

		let logString = `${timestamp}, ${category}, ${message}`
		if (meta && Object.keys(meta).length > 0) {
			logString += ` , ${JSON.stringify(meta)}`
		}
		logString += '\n'

		// Output to console
		const safeConsoleMethod = [
			'error',
			'warn',
			'log',
			'info',
			'debug'
		].includes(type)
			? (type as 'error' | 'warn' | 'log' | 'info' | 'debug')
			: 'log'

		// Writing to file
		try {
			const filePath = this.getLogFilePath(type, category)
			fs.appendFileSync(filePath, logString, 'utf8')

			if(this.options.consoleOutput) {
				console[safeConsoleMethod](
					`${timestamp} [${category.toUpperCase()}/${type.toUpperCase()}] ${message}`
				)
			}
		} catch (error) {
			console.error(`Logger error (${type}):`, error)
		}
	}

	// ====================
	// PUBLIC API METHODS
	// ====================

	/**
	 * Logs an error message
	 * @param {string} category - Log category ['user', 'mail', 'auth', 'global']
	 * @param {string} sourceOfMessage - Source of message
	 * @param {string} message - Error description
	 * @param {Record<string, unknown>} [meta] - Additional error context
	 * @example logger.error('Database connection failed', { error: err.stack })
	 */
	public error(
		category: string,
		sourceOfMessage: string,
		message: string,
		meta?: Record<string, unknown>
	): void {
		this.writeLog(category, sourceOfMessage, 'error', message, meta)
	}

	/**
	 * Logs an informational message
	 * @param {string} category - Log category ['user', 'mail', 'auth', 'global']
	 * @param {string} sourceOfMessage - Source of message
	 * @param {string} message - Information message
	 * @param {Record<string, unknown>} [meta] - Additional context
	 * @example logger.info('global', 'main', 'Server started on port 3000')
	 */
	public info(
		category: string,
		sourceOfMessage: string,
		message: string,
		meta?: Record<string, unknown>
	): void {
		this.writeLog(category, sourceOfMessage, 'info', message, meta)
	}

	/**
	 * Logs a warning message
	 * @param {string} category - Log category ['user', 'mail', 'auth', 'global']
	 * @param {string} sourceOfMessage - Source of message
	 * @param {string} message - Warning description
	 * @param {Record<string, unknown>} [meta] - Additional context
	 * @example logger.warn('global', 'sql/', 'Deprecated API used', { endpoint: '/old' })
	 */
	public warn(
		category: string,
		sourceOfMessage: string,
		message: string,
		meta?: Record<string, unknown>
	): void {
		this.writeLog(category, sourceOfMessage, 'warn', message, meta)
	}

	/**
	 * Logs a debug message (for development only)
	 * @param {string} category - Log category ['user', 'mail', 'auth', 'global']
	 * @param {string} sourceOfMessage - Source of message
	 * @param {string} message - Debug information
	 * @param {Record<string, unknown>} [meta] - Additional debug data
	 * @example logger.debug('global', 'sql/', 'SQL query executed', { query: 'SELECT...' })
	 */
	public debug(
		category: string,
		sourceOfMessage: string,
		message: string,
		meta?: Record<string, unknown>
	): void {
		this.writeLog(category, sourceOfMessage, 'debug', message, meta)
	}

	/**
	 * Logs HTTP-related messages
	 * @param {string} category - Log category ['user', 'mail', 'auth', 'global']
	 * @param {string} sourceOfMessage - Source of message
	 * @param {string} message - HTTP activity description
	 * @param {Record<string, unknown>} [meta] - Request/response details
	 * @example logger.http('user', 'api/user', 'GET /api/users', { status: 200, duration: '150ms' })
	 */
	public http(
		category: string,
		sourceOfMessage: string,
		message: string,
		meta?: Record<string, unknown>
	): void {
		this.writeLog(category, sourceOfMessage, 'http', message, meta)
	}

	/**
	 * Logs to a custom log type (creates new directory if needed)
	 * @param {string} category - Log category ['user', 'mail', 'auth', 'global']
	 * @param {string} sourceOfMessage - Source of message
	 * @param {string} type - Custom log type name
	 * @param {string} message - Log message
	 * @param {Record<string, unknown>} [meta] - Additional metadata
	 * @example logger.custom('user', 'auth', 'security', 'Login attempt', { ip: '192.168.1.1' })
	 */
	public custom(
		category: string,
		sourceOfMessage: string,
		type: string,
		message: string,
		meta?: Record<string, unknown>
	): void {
		if (!this.options.logTypes.includes(type)) {
			this.options.logTypes.push(type)
			const typeDir = path.join(this.options.logsDirectory, type)
			if (!fs.existsSync(typeDir)) {
				fs.mkdirSync(typeDir, { recursive: true })
			}
		}
		this.writeLog(category, sourceOfMessage, type, message, meta)
	}
}

// Export the logger instance and class
export const logger = new MultiFileLogger()

// We export:
// 1. Ready-made logger instance
// 2. The class itself for custom instances
// 3. Types for TypeScript
export { MultiFileLogger, LoggerOptions }
