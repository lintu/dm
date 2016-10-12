export class Song {
    public title: string = '';
    public album: string = '';
    public size: number = 0;
    public songId: string= '';
    public songUrl: string = '';
    public thumbUrl: string = '';
    public year: string = '';
    public artist: string = '';
    public duration: number = 0;
    
    constructor(songDetails?:any) {
        if(songDetails) {
            this.title = songDetails.title || songDetails.originalName,
            this.artist= songDetails.artist || '',
            this.album =  songDetails.album || '',
            this.songUrl =  songDetails.songUrl,
            this.thumbUrl = songDetails.thumbUrl ,
            this.year=  songDetails.year || '',
            this.songId=  songDetails.songId,
            this.size= songDetails.size
        }
    }
}

export class ActiveSong extends Song{
    public startTime: number;
    public currentTime: number;
    public playListId: string;
    public songHistoryIndex: number;
    public durationText: string;
    constructor() {
        super();
        this.startTime = 0;
        this.currentTime = 0;
        this.playListId = 'default';
        this.songHistoryIndex = -1;
        this.durationText = '';
    }
}