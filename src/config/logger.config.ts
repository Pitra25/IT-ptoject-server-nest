import { z } from 'zod';
import path from 'path';

/**
 * Logger configuration validation scheme using Zod.
 * Defines the structure, types and constraints for all parameters.
 */
const LoggerConfigSchema = z.object({
    /**
    * Directory for storing logs.
    * - Automatically normalizes the path (corrects slashes for different OS).
    * - Default: `./logs` (relative to the project root).
    */
    logsDirectory: z
      .string()
      .min(1, 'The path cannot be empty')
      .transform(p => path.normalize(p)), // Normalization of the path for Windows/Linux

    /**
    * Maximum log file size (in bytes).
    * - Must be a positive integer.
    * - By default: `5MB` (5 * 1024 * 1024).
    */
    maxFileSize: z
      .number()
      .int('Must be an integer')
      .positive('Must be greater than 0')
      .default(5 * 1024 * 1024),

    /**
    * Maximum number of log files per day.
    * - Minimum 1 file.
    * - Default: `5`.
    */
    maxFiles: z
      .number()
      .int('Must be an integer')
      .min(1, 'Minimum 1 file')
      .default(5),

    /**
    * Output logs to console (useful for development).
    * - Default: `true`.
    */
    consoleOutput: z
      .boolean()
      .default(true),

    /**
    * Allowed log types.
    * - Standard ones are supported (`error`, `info`, `warn`, `debug`, `http`).
    * - Custom types can be added (non-empty string).
    * - Default: `['error', 'info', 'warn', 'debug', 'http']`.
    */
    logTypes: z
      .array(
          z.union([
            z.literal('error'),
            z.literal('info'),
            z.literal('warn'),
            z.literal('debug'),
            z.literal('http'),
            z.string().min(1, 'Тип лога не может быть пустым') // Custom types
          ])
      )
      .default(['error', 'info', 'warn', 'debug', 'http']),

    /**
    * Log categories (e.g. `auth`, `payment`, `api`).
    * - Minimum 1 category.
    * - Default: `['global']`.
    */
    logCategories: z
      .array(z.string().min(1, 'Category cannot be empty'))
      .default(['global']),

    /**
    * Group logs by date folders (e.g. `logs/2023-12-31/...`).
    * - Default: `true`.
    */
    useDailyFolders: z
      .boolean()
      .default(true),

    /**
    * Source of the journal entry. (e.g. `main` || `user` || `auth` etc.)
    * - Minimum 1 source.
    * - Default: ``.
    */
    sourceOfMessage: z
      .string()
      .default('')
})

/**
 * Logger configuration type, automatically inferred from the Zod schema.
 * Used to annotate types in the main logger class.
 */
export type LoggerConfig = z.infer<typeof LoggerConfigSchema>;

// ========================================
// Default settings (basic config)
// ========================================
const defaultConfig: LoggerConfig = {
    logsDirectory: 'logs',
    maxFileSize: 5 * 1024 * 1024, // 5MB
    maxFiles: 5,
    consoleOutput: true,
    logTypes: ['error', 'info', 'warn', 'debug', 'http'],
    logCategories: ['global'],
    useDailyFolders: true,
    sourceOfMessage: ''
}

// ========================================
// Config for development
// ========================================
const devConfig: Partial<LoggerConfig> = {
    consoleOutput: false,  // Console logs enabled
    logTypes: ['error', 'info', 'warn', 'debug', 'http'],
    logCategories: ['global', 'auth', 'user', 'email', 'post', 'events', 'organization'],
}

// ========================================
// Config for production
// ========================================
const prodConfig: Partial<LoggerConfig> = {
    consoleOutput: false, // Console logs are disabled
    maxFiles: 30,         // Store 30 files instead 5
    logsDirectory: '/var/log/it-project'  // Standard path for Linux
}

// ========================================
// Selecting a config depending on NODE_ENV
// ========================================
const env = process.env.NODE_ENV || 'development'
const envConfig = env === 'production' ? prodConfig : devConfig

// ========================================
// Merge configs (defaults → env → overrides)
// ========================================
const rawConfig = {
  ...defaultConfig, // Basic settings
  ...envConfig,     // Overrides for dev/prod
  ...(process.env.LOGS_DIR ? { logsDirectory: process.env.LOGS_DIR } : {}) // Overriding via env-variable
}

// ========================================
// Validation and export of the final config
// ========================================
export const config = LoggerConfigSchema.parse(rawConfig);