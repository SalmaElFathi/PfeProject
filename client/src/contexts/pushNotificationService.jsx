const publicVapidKey ="BIV58D6JB2lxp2IOANhGaORZ-2s30At83cIGxjmZYfRXy53k7R1sE22j8vQ_Jg6G4znxh0JDebXw7isu6lN3RU4";


  export async function subscribeToNotifications(industry, subIndustry) {
    try {
      const token = localStorage.getItem('accessToken');
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        throw new Error('Permission not granted for Notification');
      }
  
      const registration = await navigator.serviceWorker.register('/worker.js', {
        scope: '/'
      });
  
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
      });
      await fetch('/api/subscribe', {
        method: 'POST',
        body: JSON.stringify({ subscription, industry, subIndustry }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log('User is subscribed:', subscription);
    } catch (error) {
      console.error('Error during subscription process:', error);
    }
  }
  
  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    return new Uint8Array([...rawData].map(char => char.charCodeAt(0)));
  }
  