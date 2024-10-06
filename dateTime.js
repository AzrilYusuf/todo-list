const formatDate = (datestring, isHeader) => {
  const date = new Date(datestring);
  const fullMonths = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  if (isHeader) {
    return `${day} ${fullMonths[month]} ${year}`;
  } else {
    const shortMonth = date.toDateString().split(" ")[1];
    return `${day} ${shortMonth} ${year}`;
  }
};

const updateTime = () => {
  const date = new Date();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  const dateString = formatDate(date, true);
  const timeString = `${hours}:${minutes}:${seconds}`;

  document.getElementById("clock").textContent = timeString;
  document.getElementById("date").textContent = dateString;
};

// Call updateTime immediately and set interval to update every second
updateTime();
setInterval(updateTime, 1000);
