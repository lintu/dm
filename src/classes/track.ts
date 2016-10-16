export class Track {
    public title: string = '';
    public album: string = '';
    public size: number = 0;
    public songId: string= '';
    public songUrl: string = '';
    public thumbUrl: string = '';
    public year: string = '';
    public artist: string = '';
    
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

export class ActiveTrack extends Track{
    public duration: number;
    public durationText: string;
    
    constructor(track?: Track) {
        super(track);
        this.duration = 0;
        this.durationText = "00:00"
    }
}