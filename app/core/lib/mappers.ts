import { COUNSELING_METHODS, type CounselingMethodKey } from './constants';

/**
 * 상담 방법 키를 한국어 이름으로 변환
 * @param methodKey 상담 방법 키
 * @returns 한국어 상담 방법명
 * @example mapCounselingMethod('chat') // "채팅"
 */
export function mapCounselingMethod(methodKey: CounselingMethodKey): string {
  return COUNSELING_METHODS[methodKey];
}
