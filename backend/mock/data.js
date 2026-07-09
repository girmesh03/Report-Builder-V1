/**
 * Seed data definitions for mock injector.
 *
 * Reports reference users and branches by index into their respective arrays.
 * The injector resolves indices to actual ObjectIds at seed time.
 *
 * @module mock/data
 */

export const users = [
  {
    name: 'beza ayalew',
    email: 'beza@gmail.com',
    passwordHash: 'beza12345',
    role: 'area_supervisor',
    phone: '0912345678',
  },
  {
    name: 'mehadir getachew',
    email: 'mehadir@gmail.com',
    passwordHash: 'mehadir12345',
    role: 'area_supervisor',
    phone: '0923456789',
  },
];

export const branches = [
  { name: 'ብስራተ ገብርኤል', code: 'BGT', branch: '' },
  { name: 'ቡልቡላ', code: 'BLB', branch: '' },
  { name: 'መስቀል ፍላወር', code: 'MSF', branch: '' },
  { name: 'ጎላጎል', code: 'GLG', branch: '' },
  { name: 'ጀሞ ሚካኤል', code: 'JMK', branch: '' },
  { name: 'ሳር ቤት', code: 'SRB', branch: '' },
  { name: 'ቤተል', code: 'BTL', branch: '' },
  { name: '4 ኪሎ', code: '4KL', branch: '' },
  { name: 'ሰሚት', code: 'SMT', branch: '' },
  { name: 'ኤርፖርት', code: 'APT', branch: '' },
  { name: 'ሲኤምሲ', code: 'CMC', branch: '' },
  { name: 'ቱሉ ዲምቱ', code: 'TLD', branch: '' },
  { name: 'ወዳጅነት ፓርክ', code: 'WDP', branch: '' },
  { name: 'መድኃኔዓለም', code: 'MDN', branch: '' },
];

const ud = (offset) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d;
};

const amharicReportText1 = `ቀን: 07-07-26
ብራንች: መድኃኔዓለም / ኤርፖርት
ስም: beza ayalew
ስራ የገባሁበት ሰዓት:
ከ02:30 - 07:40 መድኃኔዓለም ብራንች
ከ07:55 - 12:20 ኤርፖርት ብራንች

የተሰሩ ስራዎች:
በመድኃኔዓለምና በኤርፖርት ቅርንጫፎች በቼክሊስቱ መሰረት የዕለት ተዕለት የአሰራር ሂደቶችን፣ የንፅህና ሁኔታዎችን እና የሰራተኞችን ዝግጁነት አረጋግጫለሁ።
በመድኃኔዓለም ብራንች ትናንት ሪፖርት የተደረጉት ሁሉም የጥገና ችግሮች አሁን ላይ ተስተካክለዋል።
በኤርፖርት ቅርንጫፍ የአዲሶቹ ሶፋዎች እግሮች መሰበራቸውን ለቶማስ አሳውቄው፤ እሱም ነገ ቴክኒሻን እንደሚልክ ገልጾልኛል።

መፍትሄ የሚፈሉ ጉዳዮች:
በኤርፖርት ቅርንጫፍ፡ የወንዶች ሎከር ጣሪያ አሁንም እያፈሰሰ ነው፤ ይህ ችግር ከዚህ ቀደም ሪፖርት የተደረገ ሲሆን እልባት አላገኝም። በተጨማሪም በኪችን ውስጥ ያለው የጭስ ማስወጫ ኤግዝስት ፋን መጽዳት ይፈልጋል።

አጠቃላይ አስተያየት:
በሁለቱም ቅርንጫፎች የሥራ እንቅስቃሴው ጥሩ ነበር።

ከስራ የወጣሁበት ሰዓት: 12:20`;

const amharicReportText2 = `ቀን: 05-07-26
ብራንች: ኤርፖርት / መድኃኔዓለም / ቡልቡላ
ስም: mehadir getachew
ስራ የገባሁበት ሰዓት:
ከ01:50 - 04:10 ኤርፖርት ብራንች
ከ04:20 - 07:30 መድኃኔዓለም ብራንች
ከ08:05 - 12:30 ቡልቡላ ብራንች

የተሰሩ ስራዎች:
በኤርፖርትና በመድኃኔዓለም ብራንቾች በቼክሊስቱ መሠረት የዕለት ተዕለት የአሠራር ሂደቶችን፣ የንፅህና ሁኔታዎችን እና የሠራተኞችን ዝግጁነት አረጋግጫለሁ።
በቡልቡላ ብራንች በተዘጋጀው የካሸሮች ሥልጠና ላይ ተሳትፌያለሁ።

መፍትሄ የሚፈሉ ጉዳዮች:
ለሳምቡሳ ዝግጅት የሚያስፈልጉ ግብዓቶች ስቶር ውስጥ የሉም። በመድኃኔዓለም ብራንች የግሪሉ ግማሽ ክፍል አይሠራም፤ ማቲያስ ገና አልጠገነውም።

አጠቃላይ አስተያየት:
በሦስቱም ቅርንጫፎች የሥራ እንቅስቃሴው ጥሩ ነበር።

ከስራ የወጣሁበት ሰዓት: 12:30`;

const singleBranchReportText = `ቀን: 06-07-26
ብራንች: መድኃኔዓለም
ስም: beza ayalew
ስራ የገባሁበት ሰዓት: 02:15

የተሰሩ ስራዎች:
በቼክሊስቱ መሰረት የዕለት ተዕለት የአሰራር ሂደቶችን፣ የንፅህና አጠባበቅ ሁኔታ እና የሰራተኞች ዝግጁነት አረጋግጫለሁ።
የሳምንቱ የእቃ ቆጠራ ተጠናቋል።

መፍትሄ የሚፈሉ ጉዳዮች:
በዋናው መግቢያ በር ላይ የሚቀመጠው ምንጣፍ መግዛት ያስፈልጋል።

አጠቃላይ አስተያየት:
የሥራ እንቅስቃሴው ጥሩ ነበር።

ከስራ የወጣሁበት ሰዓት: 10:30`;

const mehadirReportText1 = `ቀን: 04-07-26
ብራንች: ቤተል / ወዳጅነት ፓርክ
ስም: mehadir getachew
ስራ የገባሁበት ሰዓት:
ከ03:00 - 06:45 ቤተል ብራንች
ከ07:00 - 11:30 ወዳጅነት ፓርክ ብራንች

የተሰሩ ስራዎች:
በሁለቱም ቅርንጫፎች የዕለት ተዕለት ክትትል አድርጌያለሁ። የሰራተኞችን የእረፍት ፕላን አስተካክለዋል።

መፍትሄ የሚፈሉ ጉዳዮች:
በወዳጅነት ፓርክ ብራንች የኤሲ ሲስተም ጥገና ያስፈልገዋል።

አጠቃላይ አስተያየት:
አጠቃላይ ሁኔታው ጥሩ ነው።

ከስራ የወጣሁበት ሰዓት: 11:30`;

export const reports = [
  // ── Beza (userIdx: 0) — 4 reports ──
  {
    userIdx: 0,
    branchIdxs: [13],
    reportDate: ud(-2),
    status: 'draft',
    supervisorName: 'beza ayalew',
    notes: 'ለዛሬ የታቀደ የመድኃኔዓለም ብራንች ጉብኝት። ኦዲዮ ገና አልተቀዳም።',
    audioClips: [],
    transcription: { text: '', confidence: 0, languageCode: '', requestId: '', billedDuration: 0, status: 'pending', errorMessage: '' },
    reviewedTranscription: '',
    generatedReport: { text: '', modelVersion: '', promptVersion: '', finishReason: '', inputTokens: 0, outputTokens: 0, status: 'pending', errorMessage: '' },
    editedReport: '',
    exportHistory: [],
  },
  {
    userIdx: 0,
    branchIdxs: [0, 1],
    reportDate: ud(-3),
    status: 'audio_recorded',
    supervisorName: 'beza ayalew',
    notes: 'የብስራተ ገብርኤል እና የቡልቡላ ብራንቾች ኦዲዮ ተቀርጿል። በሂደት ላይ።',
    audioClips: [
      { filename: 'audio-beza-001.wav', originalName: 'beza_bgt_blb.wav', mimeType: 'audio/wav', size: 2097152, duration: 145, storagePath: '/uploads/audio/audio-beza-001.wav' },
    ],
    transcription: { text: '', confidence: 0, languageCode: '', requestId: '', billedDuration: 0, status: 'pending', errorMessage: '' },
    reviewedTranscription: '',
    generatedReport: { text: '', modelVersion: '', promptVersion: '', finishReason: '', inputTokens: 0, outputTokens: 0, status: 'pending', errorMessage: '' },
    editedReport: '',
    exportHistory: [],
  },
  {
    userIdx: 0,
    branchIdxs: [9, 13],
    reportDate: ud(-4),
    status: 'transcribed',
    supervisorName: 'beza ayalew',
    notes: 'ኦዲዮ ተቀርጾ በአዲስ ኤአይ ተገልብጧል። ግልባጩን መገምገም ያስፈልጋል።',
    audioClips: [
      { filename: 'audio-beza-002.wav', originalName: 'beza_apt_mdn.wav', mimeType: 'audio/wav', size: 3145728, duration: 187, storagePath: '/uploads/audio/audio-beza-002.wav' },
    ],
    transcription: {
      text: 'ዛሬ ወደ ኤርፖርት እና መድኃኔዓለም ብራንቾች ሄጄ ነበር። በሁለቱም ቼክሊስቱን ተከትዬ ሥራዎችን አረጋገጥኩ። በኤርፖርት ብራንች ሶፋ እግሮች ተሰብረዋል። ለቶማስ አሳውቄዋለሁ። የወንዶች ሎከር ጣሪያ አሁንም ያፈስሳል።',
      confidence: 0.91,
      languageCode: 'am',
      requestId: 'stt-req-beza-002',
      billedDuration: 187,
      status: 'completed',
      errorMessage: '',
    },
    reviewedTranscription: '',
    generatedReport: { text: '', modelVersion: '', promptVersion: '', finishReason: '', inputTokens: 0, outputTokens: 0, status: 'pending', errorMessage: '' },
    editedReport: '',
    exportHistory: [],
  },
  {
    userIdx: 0,
    branchIdxs: [9, 13],
    reportDate: ud(-5),
    status: 'finalized',
    supervisorName: 'beza ayalew',
    notes: 'ሪፖርቱ ተዘጋጅቶ በተጠቃሚ ጸድቋል። ወደ ውጭ ተልኳል።',
    audioClips: [
      { filename: 'audio-beza-003.wav', originalName: 'beza_final_apt_mdn.wav', mimeType: 'audio/wav', size: 4194304, duration: 245, storagePath: '/uploads/audio/audio-beza-003.wav' },
    ],
    transcription: {
      text: 'ዛሬ መጀመሪያ ወደ መድኃኔዓለም ብራንች ሄጄ ነበር። ከ02:30 ላይ ገባሁ። በቼክሊስቱ መሰረት ሁሉንም ነገር አረጋገጥኩ። ትናንት የነበሩት የጥገና ችግሮች ተስተካክለው አገኘሁ። ከዛ ወደ ኤርፖርት ብራንች ሄጄ ከ07:55 ጀመርኩ። ሶፋዎች ተሰብረው ነበር። ለቶማስ ነገርኩት። ሎከር ጣሪያ አሁንም ያፈስሳል። ከ12:20 ላይ ከስራ ወጣሁ።',
      confidence: 0.94,
      languageCode: 'am',
      requestId: 'stt-req-beza-003',
      billedDuration: 245,
      status: 'completed',
      errorMessage: '',
    },
    reviewedTranscription: 'ዛሬ መጀመሪያ ወደ መድኃኔዓለም ብራንች ሄጄ ነበር። ሁሉንም ነገር አረጋገጥኩ። የጥገና ችግሮች ተስተካክለዋል። ወደ ኤርፖርት ብራንች ሄጄ ሶፋ እግሮች መሰበራቸውን ለቶማስ አሳውቄዋለሁ። ሎከር ጣሪያ አሁንም ያፈስሳል።',
    generatedReport: {
      text: amharicReportText1,
      modelVersion: 'Addis-፩-አሌፍ',
      promptVersion: 'v1-report-system-prompt',
      finishReason: 'stop',
      inputTokens: 512,
      outputTokens: 1024,
      status: 'completed',
      errorMessage: '',
    },
    editedReport: 'ቀን: 07-07-26\nብራንች: መድኃኔዓለም / ኤርፖርት\nስም: beza ayalew\nስራ የገባሁበት ሰዓት:\nከ02:30 - 07:40 መድኃኔዓለም\nከ07:55 - 12:20 ኤርፖርት\n\nየተሰሩ ስራዎች:\nቼክሊስት ተከናውኗል።\n\nመፍትሄ የሚፈሉ ጉዳዮች:\nሶፋ እግሮች መጠገን፣ ሎከር ጣሪያ መጠገን\n\nከስራ የወጣሁበት ሰዓት: 12:20',
    exportHistory: [
      { format: 'pdf', exportedAt: ud(0), filename: 'report-beza-final-001.pdf' },
    ],
  },

  // ── Mehadir (userIdx: 1) — 6 reports ──
  {
    userIdx: 1,
    branchIdxs: [5],
    reportDate: ud(-2),
    status: 'draft',
    supervisorName: 'mehadir getachew',
    notes: 'ለሳር ቤት ብራንች የታቀደ ጉብኝት። ኦዲዮ ገና አልተቀዳም።',
    audioClips: [],
    transcription: { text: '', confidence: 0, languageCode: '', requestId: '', billedDuration: 0, status: 'pending', errorMessage: '' },
    reviewedTranscription: '',
    generatedReport: { text: '', modelVersion: '', promptVersion: '', finishReason: '', inputTokens: 0, outputTokens: 0, status: 'pending', errorMessage: '' },
    editedReport: '',
    exportHistory: [],
  },
  {
    userIdx: 1,
    branchIdxs: [7, 8],
    reportDate: ud(-3),
    status: 'audio_recorded',
    supervisorName: 'mehadir getachew',
    notes: 'የ4 ኪሎ እና የሰሚት ብራንቾች ኦዲዮ ተቀርጿል።',
    audioClips: [
      { filename: 'audio-mhd-001.wav', originalName: 'mhd_4kl_smt.wav', mimeType: 'audio/wav', size: 1835008, duration: 132, storagePath: '/uploads/audio/audio-mhd-001.wav' },
    ],
    transcription: { text: '', confidence: 0, languageCode: '', requestId: '', billedDuration: 0, status: 'pending', errorMessage: '' },
    reviewedTranscription: '',
    generatedReport: { text: '', modelVersion: '', promptVersion: '', finishReason: '', inputTokens: 0, outputTokens: 0, status: 'pending', errorMessage: '' },
    editedReport: '',
    exportHistory: [],
  },
  {
    userIdx: 1,
    branchIdxs: [2, 3, 4],
    reportDate: ud(-4),
    status: 'transcribed',
    supervisorName: 'mehadir getachew',
    notes: 'የመስቀል ፍላወር፣ ጎላጎል እና ጀሞ ሚካኤል ብራንቾች ግልባጭ ተዘጋጅቷል።',
    audioClips: [
      { filename: 'audio-mhd-002.wav', originalName: 'mhd_msf_glg_jmk.wav', mimeType: 'audio/wav', size: 3670016, duration: 210, storagePath: '/uploads/audio/audio-mhd-002.wav' },
    ],
    transcription: {
      text: 'ዛሬ ሦስት ብራንቾችን ጎበኘሁ። መስቀል ፍላወር፣ ጎላጎል እና ጀሞ ሚካኤል። በሁሉም ቼክሊስቱን አረጋገጥኩ። በጀሞ ሚካኤል የውሃ ቧንቧ ተሰብሮ ነበር። ቴክኒሻን እንዲላክ ዝግጅት አድርጌያለሁ።',
      confidence: 0.88,
      languageCode: 'am',
      requestId: 'stt-req-mhd-002',
      billedDuration: 210,
      status: 'completed',
      errorMessage: '',
    },
    reviewedTranscription: '',
    generatedReport: { text: '', modelVersion: '', promptVersion: '', finishReason: '', inputTokens: 0, outputTokens: 0, status: 'pending', errorMessage: '' },
    editedReport: '',
    exportHistory: [],
  },
  {
    userIdx: 1,
    branchIdxs: [10, 11],
    reportDate: ud(-5),
    status: 'transcription_reviewed',
    supervisorName: 'mehadir getachew',
    notes: 'ግልባጭ ተገምግሞ ተስተካክሏል። ሪፖርት ለማመንጨት ዝግጁ።',
    audioClips: [
      { filename: 'audio-mhd-003.wav', originalName: 'mhd_cmc_tld.wav', mimeType: 'audio/wav', size: 2621440, duration: 165, storagePath: '/uploads/audio/audio-mhd-003.wav' },
    ],
    transcription: {
      text: 'ዛሬ ወደ ሲኤምሲ እና ቱሉ ዲምቱ ብራንቾች ሄጄ ነበር። የዕለት ተዕለት ክትትል አድርጌያለሁ። በሲኤምሲ የማብሰያ ጋዝ እንዲሞላ አዘዝኩ።',
      confidence: 0.9,
      languageCode: 'am',
      requestId: 'stt-req-mhd-003',
      billedDuration: 165,
      status: 'completed',
      errorMessage: '',
    },
    reviewedTranscription: 'ዛሬ ወደ ሲኤምሲ እና ቱሉ ዲምቱ ብራንቾች ሄጄ የዕለት ተዕለት ክትትል አድርጌያለሁ። በሲኤምሲ የማብሰያ ጋዝ እንዲሞላ አዘዝኩ። በቱሉ ዲምቱ የሰራተኞች የእረፍት መርሐ ግብር አስተካከልኩ።',
    generatedReport: { text: '', modelVersion: '', promptVersion: '', finishReason: '', inputTokens: 0, outputTokens: 0, status: 'pending', errorMessage: '' },
    editedReport: '',
    exportHistory: [],
  },
  {
    userIdx: 1,
    branchIdxs: [6, 12],
    reportDate: ud(-6),
    status: 'generated',
    supervisorName: 'mehadir getachew',
    notes: 'ሪፖርቱ በአዲስ ኤአይ ተመንግቷል። መገምገም ያስፈልጋል።',
    audioClips: [
      { filename: 'audio-mhd-004.wav', originalName: 'mhd_btl_wdp.wav', mimeType: 'audio/wav', size: 3145728, duration: 178, storagePath: '/uploads/audio/audio-mhd-004.wav' },
    ],
    transcription: {
      text: 'ዛሬ ቤተል እና ወዳጅነት ፓርክ ብራንቾችን ጎበኘሁ። ክትትልና ክትትል አድርጌያለሁ። የሰራተኞች የእረፍት ፕላን አስተካክለዋል። በወዳጅነት ፓርክ ኤሲ ሲስተም ጥገና ያስፈልገዋል።',
      confidence: 0.89,
      languageCode: 'am',
      requestId: 'stt-req-mhd-004',
      billedDuration: 178,
      status: 'completed',
      errorMessage: '',
    },
    reviewedTranscription: 'ዛሬ ቤተል እና ወዳጅነት ፓርክ ብራንቾችን ጎበኘሁ። ክትትል አድርጌያለሁ። የሰራተኞች የእረፍት ፕላን አስተካከልኩ። በወዳጅነት ፓርክ ኤሲ ሲስተም ጥገና ያስፈልገዋል።',
    generatedReport: {
      text: mehadirReportText1,
      modelVersion: 'Addis-፩-አሌፍ',
      promptVersion: 'v1-report-system-prompt',
      finishReason: 'stop',
      inputTokens: 380,
      outputTokens: 780,
      status: 'completed',
      errorMessage: '',
    },
    editedReport: '',
    exportHistory: [],
  },
  {
    userIdx: 1,
    branchIdxs: [9, 13, 1],
    reportDate: ud(-7),
    status: 'finalized',
    supervisorName: 'mehadir getachew',
    notes: 'ሪፖርቱ ተዘጋጅቶ ወደ ውጭ ተልኳል።',
    audioClips: [
      { filename: 'audio-mhd-005.wav', originalName: 'mhd_apt_mdn_blb.wav', mimeType: 'audio/wav', size: 5242880, duration: 290, storagePath: '/uploads/audio/audio-mhd-005.wav' },
    ],
    transcription: {
      text: 'ዛሬ ሦስት ብራንቾችን ጎበኘሁ። ኤርፖርት፣ መድኃኔዓለም እና ቡልቡላ። በኤርፖርት ከ01:50 እስከ 04:10። በመድኃኔዓለም ከ04:20 እስከ 07:30። በቡልቡላ ከ08:05 እስከ 12:30። በቡልቡላ የካሸሮች ሥልጠና ላይ ተሳትፌያለሁ። ለሳምቡሳ ግብዓቶች ስቶር ውስጥ የሉም።',
      confidence: 0.93,
      languageCode: 'am',
      requestId: 'stt-req-mhd-005',
      billedDuration: 290,
      status: 'completed',
      errorMessage: '',
    },
    reviewedTranscription: 'ዛሬ ኤርፖርት፣ መድኃኔዓለም እና ቡልቡላ ብራንቾችን ጎበኘሁ። በቡልቡላ የካሸሮች ሥልጠና ላይ ተሳትፌያለሁ። ለሳምቡሳ ግብዓቶች አልተሟሉም። በመድኃኔዓለም ግሪል ጥገና ይፈልጋል።',
    generatedReport: {
      text: amharicReportText2,
      modelVersion: 'Addis-፩-አሌፍ',
      promptVersion: 'v1-report-system-prompt',
      finishReason: 'stop',
      inputTokens: 480,
      outputTokens: 960,
      status: 'completed',
      errorMessage: '',
    },
    editedReport: 'ቀን: 05-07-26\nብራንች: ኤርፖርት / መድኃኔዓለም / ቡልቡላ\nስም: mehadir getachew\nስራ የገባሁበት ሰዓት: 01:50\nከስራ የወጣሁበት ሰዓት: 12:30',
    exportHistory: [
      { format: 'pdf', exportedAt: ud(0), filename: 'report-mhd-final-001.pdf' },
    ],
  },

  // ── Beza extra — single-branch finalized report using singleBranchReportText ──
  {
    userIdx: 0,
    branchIdxs: [13],
    reportDate: ud(-8),
    status: 'finalized',
    supervisorName: 'beza ayalew',
    notes: 'የመድኃኔዓለም ብራንች ነጠላ ቅርንጫፍ ሪፖርት። ተዘጋጅቶ ወደ ውጭ ተልኳል።',
    audioClips: [
      { filename: 'audio-beza-004.wav', originalName: 'beza_mdn_solo.wav', mimeType: 'audio/wav', size: 1572864, duration: 98, storagePath: '/uploads/audio/audio-beza-004.wav' },
    ],
    transcription: {
      text: 'ዛሬ ወደ መድኃኔዓለም ብራንች ብቻ ሄጄ ነበር። ከ02:15 ላይ ገባሁ። ቼክሊስቱን አረጋገጥኩ። የሳምንቱ የእቃ ቆጠራ ተጠናቋል። በዋናው መግቢያ ላይ ምንጣፍ መግዛት ያስፈልጋል። ከ10:30 ላይ ከስራ ወጣሁ።',
      confidence: 0.95,
      languageCode: 'am',
      requestId: 'stt-req-beza-004',
      billedDuration: 98,
      status: 'completed',
      errorMessage: '',
    },
    reviewedTranscription: 'ዛሬ ወደ መድኃኔዓለም ብራንች ሄጄ ነበር። ቼክሊስቱን አረጋገጥኩ። የሳምንቱ የእቃ ቆጠራ ተጠናቋል። ምንጣፍ መግዛት ያስፈልጋል።',
    generatedReport: {
      text: singleBranchReportText,
      modelVersion: 'Addis-፩-አሌፍ',
      promptVersion: 'v1-report-system-prompt',
      finishReason: 'stop',
      inputTokens: 310,
      outputTokens: 640,
      status: 'completed',
      errorMessage: '',
    },
    editedReport: '',
    exportHistory: [
      { format: 'pdf', exportedAt: ud(0), filename: 'report-beza-final-002.pdf' },
    ],
  },
];
