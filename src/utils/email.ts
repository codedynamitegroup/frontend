export const showEmailWithAsterisks = (email: string) => {
  const [name, domain] = email.split("@");
  return `${name.slice(0, -5)}****@${domain}`;
};
