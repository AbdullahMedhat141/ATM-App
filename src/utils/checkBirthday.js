
export function checkBirthday(birthdayString) {
  if (!birthdayString) return false;

  const today = new Date();
  const birthday = new Date(birthdayString);

  return (
    today.getMonth() === birthday.getMonth() &&
    today.getDate() === birthday.getDate()
  );
}
