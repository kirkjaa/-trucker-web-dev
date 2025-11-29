export default function formatPhoneNumber(phoneNumber: string) {
  return phoneNumber.replace(/^\+66(0)?/, "0");
}

export function formatPhoneNumberWithDialCode(
  phoneNumber: string,
  dialCode?: string
): string {
  return `${dialCode || "+66"}${phoneNumber
    .replace(/^\+\d{1,2}/, "")
    .replace(/^0/, "")}`;
}
