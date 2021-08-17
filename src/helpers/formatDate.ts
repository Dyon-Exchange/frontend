export const formatDate = (date: Date) => {
  let ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(date);
  let mo = new Intl.DateTimeFormat("en", { month: "short" }).format(date);
  let da = new Intl.DateTimeFormat("en", { day: "numeric" }).format(date);

  return `${da} ${mo} ${ye}`;
};
