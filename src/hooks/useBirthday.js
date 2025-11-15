import { useState, useEffect } from 'react';
import { checkBirthday } from '../utils/checkBirthday';

export function useBirthday(user) {
  const [showBirthdayPopup, setShowBirthdayPopup] = useState(false);
  const [hasBirthdayShown, setHasBirthdayShown] = useState(false);

  useEffect(() => {
    // Only show birthday popup once per session and if user has a birthday
    if (user && user.birthday && !hasBirthdayShown) {
      const isBirthday = checkBirthday(user.birthday);
      if (isBirthday) {
        setShowBirthdayPopup(true);
        setHasBirthdayShown(true);
      }
    }
  }, [user, hasBirthdayShown]);

  return { showBirthdayPopup, setShowBirthdayPopup };
}
