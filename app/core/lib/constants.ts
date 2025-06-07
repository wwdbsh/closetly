export const COUNSELING_METHODS = {
  chat: '채팅',
  phone: '전화', 
  video: '화상',
} as const;

export type CounselingMethodKey = keyof typeof COUNSELING_METHODS;
export type CounselingMethodValue = typeof COUNSELING_METHODS[CounselingMethodKey];
