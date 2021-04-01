init = (io)=> {//funkcja przyjmuje parametr io dopiero gdy znajdzie się w pliku index.js
    io.on("connection", (socket)=>{//socket to jest nasz klient
        socket.on("join", (nick)=>{//nazwa zdarzenia dowolna ale taka sama jak w pliku logika_projektu
            socket.nick = nick; //przypisujemy do socketa(klienta) nick
            io.emit("status", {
                //wyślemy wiadomość o tym że klient się zalogował do wszystkich innych zalogowanych socketów(klientów)
                //nazwa zdarzenia statusu jest dowolna
                time: Date.now(), //przesyłamy date / Daye.now() zwraca ilość milisekund od 1970 roku
                status: nick + " właśnie dołączył do rozmowy"
            })
        });

        socket.on("disconnect", ()=> {//korzystam z wbudowanego zdarzenia disconnect
            io.emit("status", {
                //wyślemy wiadomość o tym że klient się wylogował do wszystkich innych zalogowanych socketów(klientów)
                //tutaj mamy już dostęp do nick
                time: Date.now(),
                status: socket.nick + " opuścił czat."
            })
        });

        socket.on("message", (msg)=> {//obsługa zdarzenia message z pliku chat
            io.emit("message", {
                //wyślemy wiadomość o tym że klient się wylogował do wszystkich innych zalogowanych socketów(klientów)
                //tutaj mamy już dostęp do nick
                time: Date.now(),
                nick: socket.nick,
                message: msg//wiadomośc którą ktoś wysłał
            })
        });
    })
}

module.exports = init;//export skryptu do pliku index.js
