const isSeller = (userId, userPropertyId) => {
  return userId === userPropertyId;
};

const formatDate = (date) => {
  const newDate = new Date(date).toISOString().slice(0, 10);

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return new Date(newDate).toLocaleDateString('es', options);
};

export { isSeller, formatDate };
