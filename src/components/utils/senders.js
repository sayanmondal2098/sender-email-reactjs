export const senders = [
  { name: "Betonlineag", email: "contact@betonlinevip.com" },
  { name: "Tiger Email", email: "contact@tigergamingvip.com" },
  { name: "SportBetting", email: "contact@sportsbettingvip.com" }
];

export const nameByEmail = email => {
  for (var i = 0; i < senders.length; i++) {
    if (senders[i].email === email) return senders[i].name;
  }
};
