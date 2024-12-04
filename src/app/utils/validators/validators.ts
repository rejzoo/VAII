export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    console.log("EMAIL TEST");
    return emailRegex.test(email);
  }
  
  export function validatePassword(password: string): boolean {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;
    console.log("PASSWORD TEST");
    return passwordRegex.test(password);
  }
  
  export function validateName(name: string): boolean {
    const nameRegex = /^[a-zA-Z0-9_]{3,15}$/;
    console.log("NAME TEST");
    return nameRegex.test(name);
  }