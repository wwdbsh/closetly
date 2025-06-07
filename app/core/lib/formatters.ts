/**
 * 숫자에 콤마를 추가하여 포맷팅
 * @param num 포맷팅할 숫자
 * @returns 콤마가 추가된 문자열
 * @example formatNumberWithCommas(10000) // "10,000"
 */
export function formatNumberWithCommas(num: number | string): string {
  const numStr = typeof num === 'string' ? num : num.toString();
  return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * 통화 형식으로 포맷팅 (원화)
 * @param amount 금액
 * @returns 원화 형식 문자열
 * @example formatCurrency(10000) // "10,000원"
 */
export function formatCurrency(amount: number): string {
  return `${formatNumberWithCommas(amount)}원`;
}

/**
 * 시간당 가격 포맷팅
 * @param pricePerHour 시간당 가격
 * @returns 포맷된 가격 문자열
 * @example formatPricePerHour(50000) // "50,000원/시간"
 */
export function formatPricePerHour(pricePerHour: number): string {
  return `${formatCurrency(pricePerHour)}/1시간`;
}
