//SKRYPT DZIAŁAJĄCY PO STRONIE KLIENTA
(() => {
  const socket = io.connect("http://localhost:7000/");
  let join = false; //zmienna do ustawienia tego aby zanim się zalogujesz nie było widać wiadomości czatu

  const joinForm = $("#join-form"), //odniesienie za pomocą jQuery
    nick = $("#nick"),
    chatForm = $("#chat-form"),
    chatWindow = $("#chat-window"),
    chatMessage = $("#message"),
    //wyszukujemy element po id #chat-status-template i wycinamy sobie go za pomoca metody html(), a potem przekazujemy do kompilacji aby uzyskac z tego text
    //odwołanie do obsługi statusu
    chatStatusTpl = Handlebars.compile($("#chat-status-template").html());
  //odwołanie do obsługi wywyłanych wiadomości
  chatMessageTpl = Handlebars.compile($("#chat-message-template").html());

  joinForm.on("submit", (e) => {
    e.preventDefault();
    const nickName = $.trim(nick.val());

    if (nickName === "") {
      //podano nazwe użytkownika?
      nick.addClass("invalid"); //jeśli nie to dodajemy klase invalid(podświetli pole na czerwono)
    } else {
      nick.removeClass("invalid"); //jeśli tak to usuń klasę invalid i pozwoli nam to wejśc na czat
      console.log(nickName); //wyświetlam wpisany nick
      socket.emit("join", nickName); //nazwa zdarzenia jest tutaj dowolna // wysyłam wiadomosc nazwa nicku
      joinForm.hide(); //ukrywam formularz z wprowadzaniem nicku
      chatForm.show(); //pokazuje formularz czatu

      join = true;
    }
  });

  chatForm.on("submit", (e) => {
    //przycisk wyślij na czacie
    e.preventDefault();
    const message = $.trim(chatMessage.val()); //wiadomość wysyłana na czacie
    //samotny znak dolara oznacza odwołanie nie do documentu
    if (message !== "") {
      socket.emit("message", message);
      console.log(message);
      chatMessage.val("");
    }
  });

  //OBSŁUGA ZDARZENIA STATUS z PLIKU chatExport
  socket.on("status", (data) => {
    if (!join) return; //jeśli nie dołączył to nic nie zwracaj
    //nazwa status jest dowolna ale musi być taka sama ja w pliku chatExport
    //data to będzie obiekt przesłany z serwera z informacją o dołączeniu do czatu
    const html = chatStatusTpl({
      status: data.status,
      time: formatData(data.time), //zamieniamy format czasu na zrozumiały dla człowieka
    });
    chatWindow.append(html); //w konsekwecji otrzymamy na czacie bb dołącza do rozmowy
    console.log(data);
    console.log(html);
    scrollChat(); //automatyczny scrool czatu w dół
  });

  socket.on("message", (msg) => {
    if (!join) return; //jeśli nie dołączył to nic nie zwracaj
    //nasłuchiwanie zdarzenia message
    //nazwa status jest dowolna ale musi być taka sama ja w pliku chatExport
    //data to będzie obiekt przesłany z serwera z informacją o dołączeniu do czatu
    const html = chatMessageTpl({
      time: formatData(msg.time),
      nick: msg.nick,
      message: msg.message,
    });
    console.log(msg);
    chatWindow.append(html);
    scrollChat();
  });

  //FUNKCJA DO AUTOMATYCZNE SCROLLOWANIA CZATU
  scrollChat = () => {
    chatWindow.scrollTop(chatWindow.prop("scrollHeight"));
  };

  formatData = (time) => {
    //zamieniamy format czasu na zrozumiały dla człowieka
    const data = new Date(time);
    const hours = data.getHours();
    const minutes = data.getMinutes();
    const seconds = data.getSeconds();

    return `${hours < 10 ? "0" + hours : hours}:
        ${minutes < 10 ? "0" + minutes : minutes}:
        ${seconds < 10 ? "0" + seconds : seconds}`;
  };
})();
