console.log("Service Worker Loaded...");

this.addEventListener("push", e => {
  const data = e.data.json();
  console.log("Push Received..."+data);
  this.registration.showNotification(data.title, {
    body:data.body ,
    icon: "https://t4.ftcdn.net/jpg/05/13/72/29/360_F_513722905_SgxiGdjQZsdvP4ODmERsQGgW2bUwj1lT.jpg"
  });
});
