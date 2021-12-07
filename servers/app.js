var server =require('http').createServer();
//跨域问题后面处理
var io=require('socket.io')(server,{cors:true});
var playerCount=0;
var visitorCount=0;
var whiteSeleted=false;
var whiteplayer={
    id:'whiteplayer',
    playing:true,
    color:'white',
};
var blackplayer={
    id:'blackplayer',
    playing:true,
    color:'black',
};
var visitor={
    id:'visitor'+(visitorCount+1),
    playing:false,
    color:''
}
var players=[]
var visitors=[]
var spectatorCount=0;
var gameData=0;
server.listen(3000,'192.168.1.22');

io.on('connection',(socket)=>{
    socket.emit('connected','connect successful')
    switch(playerCount){
        case 0:
            playerCount++;
            if (Math.random()>0.5){
                socket.emit('player',whiteplayer);
                whiteSeleted=true;
                players.push(whiteplayer)
                socket.username='whiteplayer'
                console.log('white join')
            }
            else {
                socket.emit('player',blackplayer);
                players.push(blackplayer)
                socket.username='blackplayer'
                console.log('black join')
            }
            break;
        case 1:
            playerCount++;
            if (whiteSeleted){
                socket.emit('player',blackplayer);
                players.push(blackplayer)
                socket.username='blackplayer'
                console.log('Black joined')
            }
            else 
                socket.emit('player',whiteplayer);
                players.push(whiteplayer)
                socket.username='whiteplayer'
                console.log('White joined')
            break;
        default:
            visitors.push(visitor)
            visitorCount++;
            spectatorCount++;
            socket.username='visitor'+visitorCount
            socket.emit('player',visitor)
            console.log('Spectator joined')
            if (gameData!==0){
                socket.emit('Board',gameData)
            }
    }
    socket.on('move',(data)=>{
        gameData=data
        console.log(data)
        socket.broadcast.emit('Board',data)});
    // if (whiteTurn){
    //     socket.on('yourTurn',()=>{
    //         socket.emit('turn','Your turn')
    //     });}
    socket.on('disconnect',()=>{
        console.log(playerCount);
        console.log(socket.username)
        console.log(1000)
        switch(socket.username){
            case 'whiteplayer':
                whiteSeleted=false;
                playerCount--;
                console.log('White player left')
                gameData=0;
                break;
            case 'blackplayer':
                playerCount--;
                console.log('Black player left')
                gameData=0;
                break;
            default:
                spectatorCount--;
                console.log('Visitor'+ socket.username+'left')
        }
    })
})
    


