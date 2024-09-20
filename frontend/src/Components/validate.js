export const validatePassword = (pass, passagain) => {
    if (pass.length < 8) {
      return "Password must be at least 8 characters long.";
    } else if (!/[A-Z]/.test(pass)) {
      return "Password must contain at least one uppercase letter.";
    } else if (!/[a-z]/.test(pass)) {
      return "Password must contain at least one lowercase letter.";
    } else if (!/[0-9]/.test(pass)) {
      return "Password must contain at least one number.";
    } else if (!/[!@#$%^&*]/.test(pass)) {
      return "Password must contain at least one special character.";
    } else if (pass !== passagain) {
      return "Passwords do not match.";
    }
  
    return null; 
  };
  export const validatePassword1 = (pass, passagain) => {
    if (pass.length < 8) {
      return "Password must be at least 8 characters long.";
    } else if (!/[A-Z]/.test(pass)) {
      return "Password must contain at least one uppercase letter.";
    } else if (!/[a-z]/.test(pass)) {
      return "Password must contain at least one lowercase letter.";
    } else if (!/[0-9]/.test(pass)) {
      return "Password must contain at least one number.";
    } else if (!/[!@#$%^&*]/.test(pass)) {
      return "Password must contain at least one special character.";
    } 
  
    return null; 
  };
  export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  