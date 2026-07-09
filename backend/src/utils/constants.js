/**
 * Centralized application constants.
 *
 * @module utils/constants
 */

const constants = Object.freeze({
  BODY_PARSER_LIMIT: '10kb',

  PHONE_MAX_LENGTH: 15,

  ROLES: Object.freeze({
    USER: 'user',
    ADMIN: 'admin',
    AREA_SUPERVISOR: 'area_supervisor',
  }),

  AUTH: Object.freeze({
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 50,
    PASSWORD_MIN_LENGTH: 8,
    PASSWORD_MAX_LENGTH: 128,
  }),

  AUTH_RATE_LIMIT: Object.freeze({
    WINDOW_MS: 15 * 60 * 1000,
    MAX: 20,
    MESSAGE: 'Too many requests, please try again later.',
  }),

  GENERAL_RATE_LIMIT: Object.freeze({
    WINDOW_MS: 15 * 60 * 1000,
    MAX: 100,
    MESSAGE: 'Too many requests, please try again later.',
  }),

  PAGINATION: Object.freeze({
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
  }),

  REPORT_STATUS: Object.freeze({
    DRAFT: 'draft',
    AUDIO_RECORDED: 'audio_recorded',
    TRANSCRIBED: 'transcribed',
    TRANSCRIPTION_REVIEWED: 'transcription_reviewed',
    GENERATED: 'generated',
    FINALIZED: 'finalized',
    EXPORTED: 'exported',
  }),

  TASK_STATUS: Object.freeze({
    PENDING: 'pending',
    ON_PROGRESS: 'on_progress',
    COMPLETED: 'completed',
  }),

  BRANCH: Object.freeze({
    CODE_MIN_LENGTH: 2,
    CODE_MAX_LENGTH: 20,
  }),

  BRANCH_NAMES: Object.freeze([
    'ብስራተ ገብርኤል',
    'ቡልቡላ',
    'መስቀል ፍላወር',
    'ጎላጎል',
    'ጀሞ ሚካኤል',
    'ሳር ቤት',
    'ቤተል',
    '4 ኪሎ',
    'ሰሚት',
    'ኤርፖርት',
    'ሲኤምሲ',
    'ቱሉ ዲምቱ',
    'ወዳጅነት ፓርክ',
    'መድኃኔዓለም',
  ]),

});

export default constants;
